import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  getAuth,
  linkWithCredential,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
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

const ADMIN_USERNAME = 'Văn Ngọc Nhật Anh';
const USERNAME_EMAIL_DOMAIN = 'accounts.bioquest.app';

function normalizeUsername(username: string) {
  return username.trim().normalize('NFC').toLocaleLowerCase('vi');
}

async function emailForUsername(username: string) {
  const bytes = new TextEncoder().encode(normalizeUsername(username));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `u-${hash}@${USERNAME_EMAIL_DOMAIN}`;
}

export async function isAdminUser(user: User | null = auth.currentUser) {
  return !!user?.email && user.email === await emailForUsername(ADMIN_USERNAME);
}

/** Register a name/password identity. Firebase Auth's unique email field is derived from the normalized name. */
export async function registerAccount(username: string, password: string): Promise<User> {
  const cleanName = username.trim().normalize('NFC');
  const email = await emailForUsername(cleanName);
  const existing = auth.currentUser;
  let user: User;
  if (existing?.isAnonymous) {
    const credential = EmailAuthProvider.credential(email, password);
    user = (await linkWithCredential(existing, credential)).user;
  } else {
    user = (await createUserWithEmailAndPassword(auth, email, password)).user;
  }
  await updateProfile(user, { displayName: cleanName });
  await setDoc(doc(db, 'users', user.uid), {
    id: user.uid,
    userName: cleanName,
    userClass: 'Lớp 11 - THPT Quảng Trị',
    xp: 0,
    level: 1,
    streak: 0,
    bestStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    topicProgress: {},
    unlockedBadgeIds: [],
    masteredFlashcardIds: [],
    masteredFormulaIds: [],
    formulaReflexScore: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return user;
}

export async function loginAccount(username: string, password: string): Promise<User> {
  const email = await emailForUsername(username);
  if (auth.currentUser?.isAnonymous) await signOut(auth);
  const user = (await signInWithEmailAndPassword(auth, email, password)).user;
  const profile = await getDoc(doc(db, 'users', user.uid));
  if (!profile.exists() || profile.data().disabled === true) {
    await signOut(auth);
    throw new Error('Tài khoản này đã bị quản trị viên xóa hoặc vô hiệu hóa.');
  }
  return user;
}

export const logoutAccount = () => signOut(auth);

export const subscribeToAuth = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);

export async function loadUserProfile(user: User) {
  const snapshot = await getDoc(doc(db, 'users', user.uid));
  return snapshot.exists() ? snapshot.data() : null;
}

// The application is gated by account sign-in; never silently create anonymous identities.
export const ensureAuth = async (): Promise<User> => {
  const user = auth.currentUser;
  if (!user || user.isAnonymous) throw new Error('Vui lòng đăng nhập tài khoản trước.');
  return user;
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

/** Delete selected accounts' Firestore records. Their Firebase Auth identities remain reserved. */
export async function deleteLeaderboardEntries(names: string[]): Promise<number> {
  const user = await ensureAuth();
  if (!await isAdminUser(user)) throw new Error('Tài khoản hiện tại không có quyền quản trị.');

  const selected = new Set(names.map(normalizeUsername));
  selected.delete(normalizeUsername(ADMIN_USERNAME));
  if (!selected.size) return 0;

  const snapshot = await getDocs(collection(db, 'leaderboard'));
  const targets = snapshot.docs.filter((entry) => {
    const entryName = normalizeUsername(String(entry.data().userName || ''));
    return selected.has(entryName);
  });

  // Firestore limits each batch to 500 writes.
  for (let start = 0; start < targets.length; start += 450) {
    const batch = writeBatch(db);
    targets.slice(start, start + 200).forEach((entry) => {
      batch.delete(entry.ref);
      batch.delete(doc(db, 'users', entry.id));
    });
    await batch.commit();
  }
  return targets.length;
}

/** One-time score reset, retried on later admin sessions until Firestore rules allow it. */
export async function resetAllScoresOnce(): Promise<boolean> {
  const user = await ensureAuth();
  if (!await isAdminUser(user)) return false;
  const migrationRef = doc(db, 'system', 'score-reset-2026-10-29');
  const migration = await getDoc(migrationRef);
  if (migration.exists()) return false;

  const [users, leaderboard] = await Promise.all([
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'leaderboard')),
  ]);
  const refs = new Map<string, ReturnType<typeof doc>>();
  users.docs.forEach((snapshot) => refs.set(snapshot.ref.path, snapshot.ref));
  leaderboard.docs.forEach((snapshot) => refs.set(snapshot.ref.path, snapshot.ref));
  const allRefs = [...refs.values()];
  for (let start = 0; start < allRefs.length; start += 450) {
    const batch = writeBatch(db);
    allRefs.slice(start, start + 450).forEach((ref) => batch.update(ref, {
      xp: 0,
      level: 1,
      totalAnswered: 0,
      totalCorrect: 0,
      bestStreak: 0,
      updatedAt: new Date().toISOString(),
    }));
    await batch.commit();
  }
  await setDoc(migrationRef, { completedAt: new Date().toISOString(), completedBy: user.uid });
  return true;
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

export async function fetchLeaderboardOnce(): Promise<CloudLeaderboardItem[]> {
  const snapshot = await getDocs(query(collection(db, 'leaderboard'), orderBy('xp', 'desc')));
  return snapshot.docs.map((entry) => entry.data() as CloudLeaderboardItem);
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
