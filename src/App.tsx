import React, { useState, useEffect } from 'react';
import {
  MULTIPLE_CHOICE_QUESTIONS,
  TRUE_FALSE_QUESTIONS,
  SHORT_ANSWER_QUESTIONS,
  ESSAY_FLASHCARDS,
} from './data/questionBank';
import {
  HISTORY_MCQ_QUESTIONS,
  HISTORY_TRUE_FALSE_QUESTIONS,
  HISTORY_ESSAY_FLASHCARDS,
} from './data/historyQuestionBank';
import {
  CHEMISTRY_MCQ_QUESTIONS,
  CHEMISTRY_TRUE_FALSE_QUESTIONS,
  CHEMISTRY_SHORT_ANSWER_QUESTIONS,
  CHEMISTRY_FLASHCARDS,
} from './data/chemistryQuestionBank';
import {
  PHYSICS_MCQ_QUESTIONS,
  PHYSICS_TRUE_FALSE_QUESTIONS,
  PHYSICS_SHORT_ANSWER_QUESTIONS,
  PHYSICS_FLASHCARDS,
} from './data/physicsQuestionBank';
import { UserStats, QuestionTopic, SubjectId, QuestionAttemptRecord } from './types/biology';
import { ArenaQuiz } from './components/Arena/ArenaQuiz';
import { FlashcardDeck } from './components/Flashcards/FlashcardDeck';
import { ReactionHub } from './components/Chemistry/ReactionHub';
import { LeaderboardAndBadges } from './components/Ecosystem/LeaderboardAndBadges';
import { NameEntryModal } from './components/Onboarding/NameEntryModal';
import { ExamDocumentsView } from './components/Documents/ExamDocumentsView';
import { FormulaHandbookView } from './components/Formulas/FormulaHandbookView';
import { soundEffects } from './services/soundEffects';
import { syncUserProfileToCloud } from './services/firebase';
import { Sun, Moon, Volume2, VolumeX, Swords, Layers, Trophy, Puzzle, FileText, Cloud, Sparkles, Atom } from 'lucide-react';

const STORAGE_KEY = 'bioquest_11_user_stats_v3';
const THEME_STORAGE_KEY = 'eduquest_theme_mode';

const INITIAL_STATS: UserStats = {
  userName: '',
  userClass: 'Lớp 11 - THPT Quảng Trị',
  userAvatar: '',
  xp: 120,
  level: 1,
  streak: 0,
  bestStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  topicProgress: {
    topic1: { answered: 0, correct: 0 },
    topic2: { answered: 0, correct: 0 },
    topic3: { answered: 0, correct: 0 },
    history1: { answered: 0, correct: 0 },
    history2: { answered: 0, correct: 0 },
    chem1: { answered: 0, correct: 0 },
    chem2: { answered: 0, correct: 0 },
    chem3: { answered: 0, correct: 0 },
    phys1: { answered: 0, correct: 0 },
    phys2: { answered: 0, correct: 0 },
    phys3: { answered: 0, correct: 0 },
  },
  completedExams: 0,
  highestExamScore: 0,
  unlockedBadgeIds: [],
  masteredFlashcardIds: [],
  treeStage: 0,
  attemptHistory: [],
};

export default function App() {
  const [subject, setSubject] = useState<SubjectId>(() => {
    try {
      const saved = localStorage.getItem('eduquest_selected_subject');
      if (saved === 'history' || saved === 'biology' || saved === 'chemistry' || saved === 'physics') return saved;
    } catch {}
    return 'physics';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {}
    return 'dark';
  });

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_STATS;
  });

  // Core tabs: arena, reactions (chemistry), flashcards, ecosystem, documents
  const [activeTab, setActiveTab] = useState<'arena' | 'reactions' | 'flashcards' | 'ecosystem' | 'documents' | 'formulas'>('arena');

  const [nameModalOpen, setNameModalOpen] = useState(() => !stats.userName);
  const [isMuted, setIsMuted] = useState(false);

  // Sync theme to document element
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('eduquest_selected_subject', subject);
    } catch {}
    if (activeTab === 'reactions' && subject !== 'chemistry') {
      setActiveTab('arena');
    }
  }, [subject, activeTab]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
    // Real-time Cloud Synchronization (Firebase)
    syncUserProfileToCloud(stats);

    // Real-time Server SSE Synchronization across all students
    const cleanName = (stats.userName || '').trim();
    if (cleanName) {
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          score: stats.xp,
          level: stats.level,
        }),
      }).catch(() => {});

      // Cross-tab live broadcast
      try {
        const bc = new BroadcastChannel('bioquest_leaderboard_live');
        bc.postMessage({
          type: 'LEADERBOARD_UPDATED',
          name: cleanName,
          score: stats.xp,
          level: stats.level,
          updatedAt: new Date().toISOString(),
        });
        bc.close();
      } catch {}
    }
  }, [stats]);

  const toggleTheme = () => {
    soundEffects.playClick();
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSaveName = (name: string) => {
    setStats((prev) => ({
      ...prev,
      userName: name,
    }));
    setNameModalOpen(false);
  };

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
  };

  const handleAddXp = (amount: number) => {
    setStats((prev) => {
      const nextXp = prev.xp + amount;
      const nextLevel = Math.floor(nextXp / 250) + 1;
      return {
        ...prev,
        xp: nextXp,
        level: nextLevel,
      };
    });
  };

  const handleRecordAnswer = (
    isCorrect: boolean,
    topic: QuestionTopic,
    attemptDetails?: Omit<QuestionAttemptRecord, 'id' | 'timestamp'>
  ) => {
    setStats((prev) => {
      const currentStreak = isCorrect ? prev.streak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, currentStreak);
      const prevTopic = prev.topicProgress[topic] || { answered: 0, correct: 0 };
      const updatedTopic = {
        answered: prevTopic.answered + 1,
        correct: prevTopic.correct + (isCorrect ? 1 : 0),
      };

      const newRecord: QuestionAttemptRecord | null = attemptDetails
        ? {
            ...attemptDetails,
            id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            timestamp: Date.now(),
          }
        : null;

      const history = prev.attemptHistory || [];
      const updatedHistory = newRecord ? [newRecord, ...history].slice(0, 300) : history;

      return {
        ...prev,
        streak: currentStreak,
        bestStreak,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        topicProgress: {
          ...prev.topicProgress,
          [topic]: updatedTopic,
        },
        attemptHistory: updatedHistory,
      };
    });
  };

  const handleToggleMasteredFlashcard = (id: number) => {
    setStats((prev) => {
      const exists = prev.masteredFlashcardIds.includes(id);
      const updated = exists
        ? prev.masteredFlashcardIds.filter((item) => item !== id)
        : [...prev.masteredFlashcardIds, id];

      return {
        ...prev,
        masteredFlashcardIds: updated,
      };
    });
  };

  const handleExamComplete = (score: number) => {
    setStats((prev) => ({
      ...prev,
      completedExams: prev.completedExams + 1,
      highestExamScore: Math.max(prev.highestExamScore, score),
    }));
  };

  const activeMcqList =
    subject === 'physics'
      ? PHYSICS_MCQ_QUESTIONS
      : subject === 'chemistry'
      ? CHEMISTRY_MCQ_QUESTIONS
      : subject === 'history'
      ? HISTORY_MCQ_QUESTIONS
      : MULTIPLE_CHOICE_QUESTIONS;

  const activeTfList =
    subject === 'physics'
      ? PHYSICS_TRUE_FALSE_QUESTIONS
      : subject === 'chemistry'
      ? CHEMISTRY_TRUE_FALSE_QUESTIONS
      : subject === 'history'
      ? HISTORY_TRUE_FALSE_QUESTIONS
      : TRUE_FALSE_QUESTIONS;

  const activeShortList =
    subject === 'physics'
      ? PHYSICS_SHORT_ANSWER_QUESTIONS
      : subject === 'chemistry'
      ? CHEMISTRY_SHORT_ANSWER_QUESTIONS
      : subject === 'history'
      ? []
      : SHORT_ANSWER_QUESTIONS;

  const activeCards =
    subject === 'physics'
      ? PHYSICS_FLASHCARDS
      : subject === 'chemistry'
      ? CHEMISTRY_FLASHCARDS
      : subject === 'history'
      ? HISTORY_ESSAY_FLASHCARDS
      : ESSAY_FLASHCARDS;

  const totalQuestionsCount = activeMcqList.length + activeTfList.length + activeShortList.length;

  const tabsConfig = [
    {
      id: 'arena',
      shortLabel: 'Đấu Trường',
      fullLabel: `Đấu Trường (${totalQuestionsCount})`,
      icon: <Swords className="w-4 h-4" />,
    },
    ...(subject === 'chemistry'
      ? [
          {
            id: 'reactions',
            shortLabel: 'Luyện Phản Ứng',
            fullLabel: 'Luyện Phản Ứng (Ghép & Cân Bằng)',
            icon: <Puzzle className="w-4 h-4" />,
          },
        ]
      : []),
    {
      id: 'flashcards',
      shortLabel: 'Flashcards',
      fullLabel: `Flashcards (${activeCards.length})`,
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'ecosystem',
      shortLabel: 'Xếp Hạng',
      fullLabel: 'Bảng Xếp Hạng',
      icon: <Trophy className="w-4 h-4" />,
    },
    {
      id: 'formulas',
      shortLabel: 'Công Thức',
      fullLabel: 'Sổ Tay & Phản Xạ Công Thức',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'documents',
      shortLabel: 'Tài Liệu Gốc',
      fullLabel: 'Tài Liệu & Đề Cương (6)',
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200`}>
      {/* Header Optimized for Mobile & Desktop */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 sticky top-0 z-40 backdrop-blur-md transition-colors duration-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          {/* Brand & Subject Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div
              className="cursor-pointer flex items-center"
              onClick={() => setActiveTab('arena')}
            >
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                {subject === 'physics' ? 'PhysQuest' : subject === 'chemistry' ? 'ChemQuest' : subject === 'history' ? 'HistQuest' : 'BioQuest'}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-1 hidden md:inline font-medium">THPT Quảng Trị</span>
            </div>

            {/* Subject Selector Switcher - Compact on mobile */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setSubject('physics');
                }}
                className={`px-2 py-1 rounded-md transition-all font-semibold cursor-pointer text-xs ${
                  subject === 'physics'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Lí
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setSubject('chemistry');
                }}
                className={`px-2 py-1 rounded-md transition-all font-semibold cursor-pointer text-xs ${
                  subject === 'chemistry'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Hóa
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setSubject('biology');
                }}
                className={`px-2 py-1 rounded-md transition-all font-semibold cursor-pointer text-xs ${
                  subject === 'biology'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Sinh
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setSubject('history');
                }}
                className={`px-2 py-1 rounded-md transition-all font-semibold cursor-pointer text-xs ${
                  subject === 'history'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Sử
              </button>
            </div>
          </div>

          {/* Right Controls: Theme, User, XP, Mute */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            {/* Real-time Cloud Sync Badge */}
            <div
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium text-xs"
              title="Đồng bộ đám mây thời gian thực với Firebase Firestore"
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-500" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px]">Cloud Sync</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline font-medium">Sáng</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden md:inline font-medium">Tối</span>
                </>
              )}
            </button>

            {/* User Name Badge (Auto-truncated for mobile) */}
            <button
              onClick={() => setNameModalOpen(true)}
              className="max-w-[70px] sm:max-w-[110px] md:max-w-none truncate text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-medium cursor-pointer"
            >
              {stats.userName || 'Tên'}
            </button>

            {/* XP Badge */}
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-[11px] sm:text-xs shrink-0">
              {stats.xp} XP
            </span>

            {/* Mute Sound Button */}
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Desktop Top Tabs (Visible on tablet & desktop sm:flex) */}
        <div className="hidden sm:flex max-w-5xl mx-auto px-4 items-center gap-1.5 py-1.5 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          {tabsConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer font-medium ${
                activeTab === tab.id
                  ? 'bg-slate-200 text-emerald-700 dark:bg-slate-800 dark:text-emerald-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.fullLabel}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content with bottom padding so bottom nav doesn't overlap on mobile */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 pb-24 sm:pb-8">
        <div className={activeTab === 'arena' ? 'block' : 'hidden'}>
          <ArenaQuiz
            mode="arena"
            subject={subject}
            mcqList={activeMcqList}
            tfList={activeTfList}
            shortList={activeShortList}
            onAddXp={handleAddXp}
            onRecordAnswer={handleRecordAnswer}
            onExamComplete={handleExamComplete}
          />
        </div>

        {activeTab === 'reactions' && subject === 'chemistry' && (
          <ReactionHub onAddXp={handleAddXp} />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardDeck
            cards={activeCards}
            masteredIds={stats.masteredFlashcardIds}
            onToggleMastered={handleToggleMasteredFlashcard}
            onAddXp={handleAddXp}
          />
        )}

        {activeTab === 'ecosystem' && (
          <LeaderboardAndBadges
            stats={stats}
            onOpenNameModal={() => setNameModalOpen(true)}
            onClearHistory={() => setStats((prev) => ({ ...prev, attemptHistory: [] }))}
          />
        )}

        {activeTab === 'formulas' && (
          <FormulaHandbookView
            initialSubject={subject}
            userStats={stats}
            setUserStats={setStats}
          />
        )}

        {activeTab === 'documents' && (
          <ExamDocumentsView currentSubject={subject} />
        )}
      </main>

      {/* Watermark mờ ở góc dưới theo yêu cầu */}
      <div className="fixed bottom-14 sm:bottom-3 right-3 sm:right-5 z-30 pointer-events-none select-none text-[11px] sm:text-xs font-mono font-medium text-slate-400/40 dark:text-slate-500/35 italic tracking-wide">
        flop quá thì ghi Nhật Anh vào
      </div>

      {/* Dedicated Mobile Bottom Navigation Bar (Thumb Zone UX) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-around shadow-lg pb-[calc(0.4rem+env(safe-area-inset-bottom))]">
        {tabsConfig.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEffects.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'scale-110 transition-transform' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{tab.shortLabel}</span>
            </button>
          );
        })}
      </nav>

      {/* Name Entry Modal */}
      <NameEntryModal
        isOpen={nameModalOpen}
        initialName={stats.userName}
        onSave={handleSaveName}
        canDismiss={!!stats.userName}
        onClose={() => setNameModalOpen(false)}
      />
    </div>
  );
}
