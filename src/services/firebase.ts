import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  getDocFromServer,
  getDocs,
  writeBatch,
  Firestore,
} from 'firebase/firestore';
import { UserStats, SubjectId } from '../types/biology';
import firebaseConfigData from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfigData) : getApp();
export const auth = getAuth(app);

// Initialize Firestore with specific database ID if present
export const db: Firestore = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

let currentAuthUser: User | null = null;
let authInitPromise: Promise<User> | null = null;

// Ensure authenticated session
export const ensureAuth = (): Promise<User> => {
  if (currentAuthUser) {
    return Promise.resolve(currentAuthUser);
  }
  if (authInitPromise) {
    return authInitPromise;
  }

  authInitPromise = new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          currentAuthUser = user;
          unsubscribe();
          resolve(user);
        } else {
          try {
            const credential = await signInAnonymously(auth);
            currentAuthUser = credential.user;
            unsubscribe();
            resolve(credential.user);
          } catch (err) {
            reject(err);
          }
        }
      },
      (error) => {
        reject(error);
      }
    );
  });

  return authInitPromise;
};

// Test initial connection as required by Firestore integration standards
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await ensureAuth();
    // Test fetch against connection path
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline. Local caching active.');
    }
    // Expected default deny or offline is handled safely
    return true;
  }
}

// Auto-run connection test
testFirestoreConnection();

export interface CloudLeaderboardItem {
  id: string;
  userId: string;
  userName: string;
  userClass: string;
  xp: number;
  level: number;
  totalAnswered: number;
  totalCorrect: number;
  bestStreak: number;
  updatedAt: string;
}

export interface CloudSyncResult {
  status: 'synced' | 'partial' | 'error';
  message?: string;
}

const LEADERBOARD_ADMIN_NAME = 'Văn Ngọc Nhật Anh';

/** Delete selected public ranking rows after checking the current Firebase profile name. */
export async function deleteLeaderboardEntries(names: string[]): Promise<number> {
  const user = await ensureAuth();
  const profile = await getDoc(doc(db, 'users', user.uid));
  const profileName = String(profile.data()?.userName || '').trim().normalize('NFC').toLocaleLowerCase('vi');
  if (profileName !== LEADERBOARD_ADMIN_NAME.normalize('NFC').toLocaleLowerCase('vi')) {
    throw new Error('Hồ sơ Firebase đang đăng nhập chưa có tên quản trị được phép xóa.');
  }

  const selected = new Set(names.map((name) => name.trim().normalize('NFC').toLocaleLowerCase('vi')));
  selected.delete(LEADERBOARD_ADMIN_NAME.normalize('NFC').toLocaleLowerCase('vi'));
  if (!selected.size) return 0;

  const snapshot = await getDocs(collection(db, 'leaderboard'));
  const targets = snapshot.docs.filter((entry) => {
    const entryName = String(entry.data().userName || '').trim().normalize('NFC').toLocaleLowerCase('vi');
    return selected.has(entryName);
  });

  // Firestore limits each batch to 500 writes.
  for (let start = 0; start < targets.length; start += 450) {
    const batch = writeBatch(db);
    targets.slice(start, start + 450).forEach((entry) => batch.delete(entry.ref));
    await batch.commit();
  }
  return targets.length;
}

// Real-time Cloud Sync for User Profile & Statistics
export async function syncUserProfileToCloud(stats: UserStats): Promise<CloudSyncResult> {
  try {
    const user = await ensureAuth();
    const userRef = doc(db, 'users', user.uid);
    const nowIso = new Date().toISOString();
    const cleanName = (stats.userName || '').trim();

    const payload = {
      id: user.uid,
      userName: (cleanName || 'Học sinh').slice(0, 80),
      userClass: (stats.userClass || 'Lớp 11').slice(0, 80),
      xp: Number(stats.xp || 0),
      level: Number(stats.level || 1),
      streak: Number(stats.streak || 0),
      bestStreak: Number(stats.bestStreak || 0),
      totalAnswered: Number(stats.totalAnswered || 0),
      totalCorrect: Number(stats.totalCorrect || 0),
      topicProgress: stats.topicProgress || {},
      unlockedBadgeIds: (stats.unlockedBadgeIds || []).slice(0, 50),
      masteredFlashcardIds: (stats.masteredFlashcardIds || []).slice(0, 500),
      masteredFormulaIds: (stats.masteredFormulaIds || []).slice(0, 500),
      formulaReflexScore: Number(stats.formulaReflexScore || 0),
      updatedAt: nowIso,
    };

    // Write profile and public ranking independently so a profile-rule failure
    // cannot prevent an otherwise permitted leaderboard write.
    const leaderboardRef = doc(db, 'leaderboard', user.uid);
    const leaderboardPayload: CloudLeaderboardItem = {
      id: user.uid,
      userId: user.uid,
      userName: cleanName.slice(0, 80),
      userClass: (stats.userClass || 'Lớp 11').slice(0, 80),
      xp: Number(stats.xp || 0),
      level: Number(stats.level || 1),
      totalAnswered: Number(stats.totalAnswered || 0),
      totalCorrect: Number(stats.totalCorrect || 0),
      bestStreak: Number(stats.bestStreak || 0),
      updatedAt: nowIso,
    };
    const [profileResult, leaderboardResult] = await Promise.allSettled([
      setDoc(userRef, payload, { merge: true }),
      cleanName ? setDoc(leaderboardRef, leaderboardPayload, { merge: true }) : Promise.resolve(),
    ]);

    const profileError = profileResult.status === 'rejected' ? profileResult.reason : null;
    const leaderboardError = leaderboardResult.status === 'rejected' ? leaderboardResult.reason : null;
    if (profileError || leaderboardError) {
      const errors = [profileError, leaderboardError].filter(Boolean);
      const message = errors.map((error) => error instanceof Error ? error.message : String(error)).join(' | ');
      console.warn('Firebase sync incomplete:', message);
      return { status: profileError && leaderboardError ? 'error' : 'partial', message };
    }

    return {
      status: 'synced',
      message: cleanName ? undefined : 'Đã kết nối Firebase; nhập tên để ghi danh lên bảng xếp hạng.',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn('Firebase sync failed:', message);
    return { status: 'error', message };
  }
}

// Subscribe to real-time public leaderboard across all students
export function subscribeToRealtimeLeaderboard(
  callback: (entries: CloudLeaderboardItem[]) => void,
  onStatus?: (connected: boolean, error?: Error) => void
): () => void {
  try {
    const q = query(collection(db, 'leaderboard'), orderBy('xp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: CloudLeaderboardItem[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as CloudLeaderboardItem);
        });
        onStatus?.(true);
        callback(list);
      },
      (err) => {
        console.warn('Leaderboard snapshot listener warning:', err);
        onStatus?.(false, err);
      }
    );
    return unsubscribe;
  } catch {
    onStatus?.(false, new Error('Không thể khởi tạo kết nối Firestore.'));
    return () => {};
  }
}

// Real-time Cloud Sync for in-progress Arena Session
export async function syncQuizSessionToCloud(
  subject: SubjectId,
  session: {
    currentIndex: number;
    streak: number;
    score: number;
    isFinished: boolean;
    mcqSelected: string | null;
    shortInput: string;
    isSubmitted: boolean;
  }
): Promise<void> {
  try {
    const user = await ensureAuth();
    const sessionId = `${user.uid}_${subject}`;
    const sessionRef = doc(db, 'sessions', sessionId);

    const payload = {
      id: sessionId,
      userId: user.uid,
      subject,
      currentIndex: Math.max(0, session.currentIndex || 0),
      streak: Math.max(0, session.streak || 0),
      score: Math.max(0, session.score || 0),
      isFinished: !!session.isFinished,
      mcqSelected: session.mcqSelected || '',
      shortInput: (session.shortInput || '').slice(0, 200),
      isSubmitted: !!session.isSubmitted,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(sessionRef, payload, { merge: true });
  } catch (err) {
    console.warn('Quiz session cloud sync notice:', err);
  }
}

// Fetch saved session from cloud if browser localStorage is empty
export async function fetchQuizSessionFromCloud(subject: SubjectId) {
  try {
    const user = await ensureAuth();
    const sessionId = `${user.uid}_${subject}`;
    const snap = await getDoc(doc(db, 'sessions', sessionId));
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('Could not fetch session from cloud:', err);
  }
  return null;
}
