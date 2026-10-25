import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Zap,
  Target,
  Search,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Trophy,
  Flame,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Atom,
  Activity,
  Lightbulb,
  Cloud,
  Check,
  X,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LatexText } from '../Common/LatexText';
import { FORMULA_DATABASE, FormulaItem, FormulaSubject, FormulaPracticeQuestion } from '../../data/formulaData';
import { UserStats, SubjectId } from '../../types/biology';
import { soundEffects } from '../../services/soundEffects';
import { syncUserProfileToCloud } from '../../services/firebase';

interface FormulaHandbookViewProps {
  initialSubject?: SubjectId;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

type ViewMode = 'handbook' | 'reflex' | 'practice';

export const FormulaHandbookView: React.FC<FormulaHandbookViewProps> = ({
  initialSubject = 'physics',
  userStats,
  setUserStats,
}) => {
  // Current active subject inside formulas tab (defaults to active subject or physics/chemistry)
  const [selectedSubject, setSelectedSubject] = useState<FormulaSubject>(
    initialSubject === 'chemistry' ? 'chemistry' : 'physics'
  );
  const [viewMode, setViewMode] = useState<ViewMode>('handbook');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFormulaId, setExpandedFormulaId] = useState<string | null>(null);
  const [expandedPracticeId, setExpandedPracticeId] = useState<string | null>(null);

  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, any>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, boolean>>({});

  // Reflex flashcard state
  const [reflexIndex, setReflexIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [reflexStreak, setReflexStreak] = useState<number>(0);
  const [syncStatus, setSyncStatus] = useState<string>('Đã đồng bộ');

  const masteredIds = useMemo(() => {
    return new Set(userStats.masteredFormulaIds || []);
  }, [userStats.masteredFormulaIds]);

  // Filter formulas by subject, topic, and search query
  const subjectFormulas = useMemo(() => {
    return FORMULA_DATABASE.filter((f) => f.subject === selectedSubject);
  }, [selectedSubject]);

  const topics = useMemo(() => {
    const set = new Set<string>();
    subjectFormulas.forEach((f) => set.add(f.topic));
    return Array.from(set);
  }, [subjectFormulas]);

  const filteredFormulas = useMemo(() => {
    return subjectFormulas.filter((f) => {
      const matchTopic = selectedTopic === 'all' || f.topic === selectedTopic;
      const matchSearch =
        searchQuery.trim() === '' ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.latex.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.derivedFormulas.some((d) => d.label.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTopic && matchSearch;
    });
  }, [subjectFormulas, selectedTopic, searchQuery]);

  // Formulas for Reflex Mode
  const reflexFormulas = useMemo(() => {
    if (selectedTopic === 'all') return subjectFormulas;
    return subjectFormulas.filter((f) => f.topic === selectedTopic);
  }, [subjectFormulas, selectedTopic]);

  const currentReflexFormula = reflexFormulas[reflexIndex % Math.max(1, reflexFormulas.length)];

  // All practice questions for current subject & filter
  const allPracticeQuestions = useMemo(() => {
    const list: { formula: FormulaItem; question: FormulaPracticeQuestion }[] = [];
    filteredFormulas.forEach((formula) => {
      formula.practiceQuestions.forEach((q) => {
        list.push({ formula, question: q });
      });
    });
    return list;
  }, [filteredFormulas]);

  // Toggle master status and sync to Firebase
  const toggleMaster = async (formulaId: string) => {
    soundEffects.playClick();
    const isNowMastered = !masteredIds.has(formulaId);
    let newMasteredList: string[];

    if (isNowMastered) {
      newMasteredList = [...Array.from(masteredIds), formulaId];
      soundEffects.playCorrect();
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.8 },
      });
    } else {
      newMasteredList = Array.from(masteredIds).filter((id) => id !== formulaId);
    }

    const updatedStats: UserStats = {
      ...userStats,
      masteredFormulaIds: newMasteredList,
      xp: isNowMastered ? userStats.xp + 15 : userStats.xp,
    };

    setUserStats(updatedStats);

    // Sync to Cloud Firestore
    setSyncStatus('Đang lưu...');
    try {
      await syncUserProfileToCloud(updatedStats);
      setSyncStatus('Đã đồng bộ');
    } catch {
      setSyncStatus('Đã lưu offline');
    }
  };

  // Reflex Flashcard actions
  const handleReflexKnown = async () => {
    soundEffects.playCorrect();
    const newStreak = reflexStreak + 1;
    setReflexStreak(newStreak);

    if (newStreak % 5 === 0) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    if (currentReflexFormula && !masteredIds.has(currentReflexFormula.id)) {
      await toggleMaster(currentReflexFormula.id);
    }

    setIsFlipped(false);
    setReflexIndex((prev) => (prev + 1) % reflexFormulas.length);
  };

  const handleReflexNext = () => {
    soundEffects.playClick();
    setReflexStreak(0);
    setIsFlipped(false);
    setReflexIndex((prev) => (prev + 1) % reflexFormulas.length);
  };

  // Handle practice question answers
  const handleSelectMcq = (qId: string, option: 'A' | 'B' | 'C' | 'D') => {
    if (submittedQuestions[qId]) return;
    soundEffects.playClick();
    setPracticeAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleSelectTf = (qId: string, subId: string, val: boolean) => {
    if (submittedQuestions[qId]) return;
    soundEffects.playClick();
    setPracticeAnswers((prev) => ({
      ...prev,
      [`${qId}_${subId}`]: val,
    }));
  };

  const handleShortChange = (qId: string, text: string) => {
    if (submittedQuestions[qId]) return;
    setPracticeAnswers((prev) => ({ ...prev, [qId]: text }));
  };

  const submitQuestion = (q: FormulaPracticeQuestion) => {
    soundEffects.playSubmit();
    setSubmittedQuestions((prev) => ({ ...prev, [q.id]: true }));

    // Check correctness
    let isCorrect = false;
    if (q.type === 'mcq') {
      isCorrect = practiceAnswers[q.id] === q.correctAnswer;
    } else if (q.type === 'tf') {
      isCorrect = (q.statements || []).every(
        (s) => practiceAnswers[`${q.id}_${s.subId}`] === s.isCorrect
      );
    } else if (q.type === 'short') {
      const userAns = (practiceAnswers[q.id] || '').trim().toLowerCase();
      isCorrect = (q.acceptedAnswers || []).some((ans) =>
        userAns.includes(ans.toLowerCase())
      );
    } else {
      isCorrect = true; // Essay self-checked
    }

    if (isCorrect) {
      soundEffects.playCorrect();
      confetti({ particleCount: 30, spread: 50 });
      setUserStats((prev) => {
        const next = {
          ...prev,
          xp: prev.xp + 20,
          totalCorrect: prev.totalCorrect + 1,
          totalAnswered: prev.totalAnswered + 1,
        };
        syncUserProfileToCloud(next);
        return next;
      });
    } else {
      soundEffects.playWrong();
      setUserStats((prev) => {
        const next = {
          ...prev,
          totalAnswered: prev.totalAnswered + 1,
        };
        syncUserProfileToCloud(next);
        return next;
      });
    }
  };

  const masteredCount = subjectFormulas.filter((f) => masteredIds.has(f.id)).length;
  const masteryPercentage = subjectFormulas.length > 0
    ? Math.round((masteredCount / subjectFormulas.length) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-2xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Hệ Thống Phản Xạ & Sổ Tay Công Thức
              </span>
              <span className="bg-emerald-950/40 text-emerald-100 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <Cloud className="w-3 h-3 text-cyan-300" />
                Firebase Cloud: {syncStatus}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Công Thức & Bài Tập Vận Dụng THPT
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
              Tổng hợp 100% công thức cốt lõi, hệ thức độc lập, liên hệ phản xạ nhanh và bài tập vận dụng (Trắc nghiệm, Đúng/Sai, Trả lời ngắn, Tự luận) bám sát đề cương ôn tập THPT Quảng Trị.
            </p>
          </div>

          {/* Subject Switcher Pill */}
          <div className="flex items-center bg-black/25 p-1 rounded-xl self-start sm:self-auto backdrop-blur-md border border-white/15">
            <button
              onClick={() => {
                soundEffects.playClick();
                setSelectedSubject('physics');
                setSelectedTopic('all');
                setReflexIndex(0);
                setIsFlipped(false);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedSubject === 'physics'
                  ? 'bg-white text-emerald-900 shadow-md scale-102'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>Vật Lí 11 ({FORMULA_DATABASE.filter((f) => f.subject === 'physics').length})</span>
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setSelectedSubject('chemistry');
                setSelectedTopic('all');
                setReflexIndex(0);
                setIsFlipped(false);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedSubject === 'chemistry'
                  ? 'bg-white text-emerald-900 shadow-md scale-102'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5 text-amber-500" />
              <span>Hóa Học 11 ({FORMULA_DATABASE.filter((f) => f.subject === 'chemistry').length})</span>
            </button>
          </div>
        </div>

        {/* Progress Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/15">
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <div className="text-[11px] text-emerald-200">Đã thuộc lòng</div>
            <div className="text-base sm:text-lg font-black text-white">
              {masteredCount} / {subjectFormulas.length} <span className="text-xs font-normal text-emerald-200">({masteryPercentage}%)</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <div className="text-[11px] text-emerald-200">Chuỗi phản xạ đúng</div>
            <div className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-300" />
              {reflexStreak} lần
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <div className="text-[11px] text-emerald-200">Bài tập vận dụng</div>
            <div className="text-base sm:text-lg font-black text-white">
              {allPracticeQuestions.length} câu hỏi
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <div className="text-[11px] text-emerald-200">Điểm kinh nghiệm</div>
            <div className="text-base sm:text-lg font-black text-white flex items-center gap-1">
              <Trophy className="w-4 h-4 text-amber-300" />
              {userStats.xp} XP
            </div>
          </div>
        </div>
      </div>

      {/* Main View Mode Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => {
              soundEffects.playClick();
              setViewMode('handbook');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'handbook'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sổ Tay Công Thức ({filteredFormulas.length})</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setViewMode('reflex');
              setIsFlipped(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'reflex'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Tập Phản Xạ Nhanh</span>
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setViewMode('practice');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'practice'
                ? 'bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Luyện Vận Dụng ({allPracticeQuestions.length})</span>
          </button>
        </div>

        {/* Search input for Handbook & Practice */}
        {viewMode !== 'reflex' && (
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm công thức, ký hiệu (x, v, a, pH, Kc...)"
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* Topics Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => {
            soundEffects.playClick();
            setSelectedTopic('all');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
            selectedTopic === 'all'
              ? 'bg-emerald-600 text-white font-bold shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          Tất cả chuyên đề
        </button>
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => {
              soundEffects.playClick();
              setSelectedTopic(t);
              setReflexIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedTopic === t
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. SỔ TAY CÔNG THỨC TOÀN DIỆN (HANDBOOK MODE) */}
      {/* ========================================================================= */}
      {viewMode === 'handbook' && (
        <div className="space-y-4">
          {filteredFormulas.map((item) => {
            const isMastered = masteredIds.has(item.id);
            const isExpanded = expandedFormulaId === item.id;
            const hasPractice = item.practiceQuestions.length > 0;

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
                  isMastered
                    ? 'border-emerald-300 dark:border-emerald-800/60 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header Card */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.topic}
                      </span>
                      {isMastered && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Đã thuộc lòng
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-start">
                    <button
                      onClick={() => toggleMaster(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isMastered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600'
                      }`}
                    >
                      {isMastered ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Đã thuộc</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 text-slate-400" />
                          <span>Đánh dấu thuộc</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        setExpandedFormulaId(isExpanded ? null : item.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Primary LaTeX formula box */}
                <div className="mx-4 sm:mx-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-center text-center">
                  <div className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white overflow-x-auto max-w-full py-1">
                    <LatexText text={`$$${item.latex}$$`} />
                  </div>
                </div>

                {/* Units & Symbols Quick Grid */}
                <div className="p-4 sm:p-5 pt-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Đại lượng & Đơn vị chuẩn (SI):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {item.units.map((u, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between gap-2"
                      >
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          <LatexText text={`$${u.symbol}$`} />
                        </span>
                        <span className="text-slate-600 dark:text-slate-300 text-[11px] text-right flex-1 truncate">
                          {u.meaning}
                        </span>
                        <span className="bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-700 dark:text-slate-200 font-mono">
                          {u.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expanded Section: Derived Formulas, Pitfalls & Practice Questions */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 space-y-4">
                    {/* Derived Formulas / Reflex Tips */}
                    {item.derivedFormulas.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                          <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                          Hệ thức liên hệ & Phản xạ nhanh khi làm bài thi:
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {item.derivedFormulas.map((df, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-1.5"
                            >
                              <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                                {df.label}
                              </div>
                              <div className="text-sm font-semibold text-slate-900 dark:text-white py-0.5">
                                <LatexText text={`$${df.latex}$`} />
                              </div>
                              <div className="text-[11px] text-slate-600 dark:text-slate-300 italic">
                                💡 {df.reflexTip}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Common Pitfalls / Trap Warnings */}
                    {item.pitfalls.length > 0 && (
                      <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-1">
                        <div className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          Bẫy đề thi hay gặp (Tránh mất điểm oan):
                        </div>
                        <ul className="list-disc list-inside text-xs text-rose-900 dark:text-rose-200 space-y-1 pl-1">
                          {item.pitfalls.map((pf, pfi) => (
                            <li key={pfi}>
                              <LatexText text={pf} as="span" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Practice Questions Accordion for this Formula */}
                    {hasPractice && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                            <Target className="w-4 h-4" />
                            Bài tập vận dụng thực chiến ({item.practiceQuestions.length} câu):
                          </span>
                        </div>

                        <div className="space-y-3">
                          {item.practiceQuestions.map((q, qIndex) => (
                            <PracticeQuestionCard
                              key={q.id}
                              q={q}
                              index={qIndex + 1}
                              practiceAnswers={practiceAnswers}
                              submittedQuestions={submittedQuestions}
                              onSelectMcq={handleSelectMcq}
                              onSelectTf={handleSelectTf}
                              onShortChange={handleShortChange}
                              onSubmit={submitQuestion}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ĐẤU TRƯỜNG PHẢN XẠ NHANH (REFLEX TRAINER FLASHCARDS) */}
      {/* ========================================================================= */}
      {viewMode === 'reflex' && currentReflexFormula && (
        <div className="max-w-2xl mx-auto space-y-5 animate-fadeIn">
          {/* Card Meta & Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              Công thức #{reflexIndex + 1} / {reflexFormulas.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-500" /> Chuỗi {reflexStreak}
              </span>
              <button
                onClick={handleReflexNext}
                className="hover:text-slate-800 dark:hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Đổi câu
              </button>
            </div>
          </div>

          {/* 3D Reflex Flip Card */}
          <div
            onClick={() => {
              soundEffects.playClick();
              setIsFlipped(!isFlipped);
            }}
            className="w-full min-h-[300px] sm:min-h-[340px] bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all hover:border-emerald-400 dark:hover:border-emerald-600 relative overflow-hidden group select-none"
          >
            <div className="absolute top-3 right-3 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium">
              Chạm để lật thẻ ↻
            </div>

            {!isFlipped ? (
              /* Mặt trước: Tình huống / Đặt vấn đề phản xạ */
              <div className="my-auto space-y-4 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full inline-block">
                  {currentReflexFormula.topic}
                </span>
                <h4 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white max-w-lg mx-auto leading-relaxed">
                  <LatexText text={currentReflexFormula.flashcardPrompt} />
                </h4>
                <p className="text-xs text-slate-400">
                  Hãy nhẩm nhanh công thức trong đầu, sau đó chạm vào thẻ để đối chiếu đáp án!
                </p>
              </div>
            ) : (
              /* Mặt sau: Công thức gốc + Hệ thức liên hệ siêu tốc */
              <div className="my-auto space-y-4 text-center animate-fadeIn">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full inline-block">
                  {currentReflexFormula.name}
                </span>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto">
                  <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white py-1">
                    <LatexText text={`$$${currentReflexFormula.latex}$$`} />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 max-w-lg mx-auto text-left">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Phản xạ then chốt:
                  </div>
                  <LatexText text={currentReflexFormula.flashcardAnswer} />
                </div>
              </div>
            )}

            <div className="text-center text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              {isFlipped ? 'Đã nhớ chuẩn chưa? Chọn đánh giá bên dưới 👇' : 'Chạm vào thẻ để xem đáp án phản xạ'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleReflexNext}
              className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Chưa thuộc / Ôn lại
            </button>
            <button
              onClick={handleReflexKnown}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Thuộc lòng rồi! (+15 XP)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LUYỆN TẬP VẬN DỤNG THỰC CHIẾN (PRACTICE ARENA MODE) */}
      {/* ========================================================================= */}
      {viewMode === 'practice' && (
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-white">
                Tổng cộng {allPracticeQuestions.length} câu hỏi vận dụng
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                (Bao gồm Trắc nghiệm, Đúng/Sai, Trả lời ngắn, Tự luận)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {allPracticeQuestions.map(({ formula, question }, idx) => (
              <div
                key={question.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400">
                      {question.type.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Ứng dụng công thức: <span className="text-emerald-600 dark:text-emerald-400">{formula.name}</span>
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{question.source}</span>
                </div>

                <PracticeQuestionCard
                  q={question}
                  index={idx + 1}
                  practiceAnswers={practiceAnswers}
                  submittedQuestions={submittedQuestions}
                  onSelectMcq={handleSelectMcq}
                  onSelectTf={handleSelectTf}
                  onShortChange={handleShortChange}
                  onSubmit={submitQuestion}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component rendering individual practice questions
interface PracticeQuestionCardProps {
  q: FormulaPracticeQuestion;
  index: number;
  practiceAnswers: Record<string, any>;
  submittedQuestions: Record<string, boolean>;
  onSelectMcq: (qId: string, opt: 'A' | 'B' | 'C' | 'D') => void;
  onSelectTf: (qId: string, subId: string, val: boolean) => void;
  onShortChange: (qId: string, val: string) => void;
  onSubmit: (q: FormulaPracticeQuestion) => void;
}

const PracticeQuestionCard: React.FC<PracticeQuestionCardProps> = ({
  q,
  index,
  practiceAnswers,
  submittedQuestions,
  onSelectMcq,
  onSelectTf,
  onShortChange,
  onSubmit,
}) => {
  const isSubmitted = !!submittedQuestions[q.id];
  const [showEssayAnswer, setShowEssayAnswer] = useState(false);

  return (
    <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
      {/* Question prompt */}
      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
        <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-1.5">
          Câu {index}:
        </span>
        <LatexText text={q.question} as="span" />
      </div>

      {/* 1. MCQ OPTIONS */}
      {q.type === 'mcq' && q.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
            const isSelected = practiceAnswers[q.id] === optKey;
            const isCorrect = q.correctAnswer === optKey;

            let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300';
            if (isSubmitted) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-100 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-300 font-bold';
              }
            } else if (isSelected) {
              btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold';
            }

            return (
              <button
                key={optKey}
                onClick={() => onSelectMcq(q.id, optKey)}
                disabled={isSubmitted}
                className={`p-2.5 rounded-xl border text-xs text-left transition-all flex items-start gap-2 cursor-pointer ${btnStyle}`}
              >
                <span className="font-bold">{optKey}.</span>
                <span className="flex-1">
                  <LatexText text={q.options![optKey]} as="span" />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. TRUE / FALSE STATEMENTS */}
      {q.type === 'tf' && q.statements && (
        <div className="space-y-2 pt-1">
          {q.statements.map((st) => {
            const userChoice = practiceAnswers[`${q.id}_${st.subId}`];
            const isStCorrect = isSubmitted && userChoice === st.isCorrect;
            const isStWrong = isSubmitted && userChoice !== undefined && userChoice !== st.isCorrect;

            return (
              <div
                key={st.subId}
                className={`p-2.5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isSubmitted
                    ? isStCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300'
                      : isStWrong
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex-1 flex items-start gap-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {st.subId})
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">
                    <LatexText text={st.text} as="span" />
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onSelectTf(q.id, st.subId, true)}
                    disabled={isSubmitted}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      userChoice === true
                        ? isSubmitted
                          ? st.isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                          : 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Đúng
                  </button>
                  <button
                    onClick={() => onSelectTf(q.id, st.subId, false)}
                    disabled={isSubmitted}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      userChoice === false
                        ? isSubmitted
                          ? !st.isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                          : 'bg-rose-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Sai
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. SHORT ANSWER INPUT */}
      {q.type === 'short' && (
        <div className="flex items-center gap-2 pt-1 max-w-sm">
          <input
            type="text"
            value={practiceAnswers[q.id] || ''}
            onChange={(e) => onShortChange(q.id, e.target.value)}
            disabled={isSubmitted}
            placeholder="Nhập kết quả số hoặc đơn vị..."
            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-900 dark:text-white"
          />
        </div>
      )}

      {/* 4. ESSAY REVEAL ANSWER */}
      {q.type === 'essay' && (
        <div className="pt-1">
          <button
            onClick={() => setShowEssayAnswer(!showEssayAnswer)}
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            {showEssayAnswer ? 'Ẩn đáp án tự luận' : 'Xem hướng dẫn giải tự luận & phương trình'}
          </button>
          {showEssayAnswer && q.essayAnswer && (
            <div className="mt-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-cyan-200 dark:border-cyan-900/60 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              <LatexText text={q.essayAnswer} />
            </div>
          )}
        </div>
      )}

      {/* Submit button for non-essay questions */}
      {q.type !== 'essay' && !isSubmitted && (
        <div className="pt-1">
          <button
            onClick={() => onSubmit(q)}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
          >
            Kiểm tra đáp án
          </button>
        </div>
      )}

      {/* Explanation after submission */}
      {isSubmitted && q.explanation && (
        <div className="mt-2 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
          <div className="font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Giải thích chi tiết:
          </div>
          <div>
            <LatexText text={q.explanation} />
          </div>
        </div>
      )}
    </div>
  );
};
