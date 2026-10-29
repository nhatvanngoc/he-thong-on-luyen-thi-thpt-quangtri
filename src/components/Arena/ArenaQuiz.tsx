import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  ShortAnswerQuestion,
  QuestionTopic,
  QuestionAttemptRecord,
  SubjectId,
} from '../../types/biology';
import { soundEffects } from '../../services/soundEffects';
import {
  Zap,
  CheckCircle2,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  X,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LatexText } from '../Common/LatexText';
import { syncQuizSessionToCloud, fetchQuizSessionFromCloud } from '../../services/firebase';

interface ArenaQuizProps {
  mode?: 'arena';
  subject?: SubjectId;
  mcqList: MultipleChoiceQuestion[];
  tfList: TrueFalseQuestion[];
  shortList?: ShortAnswerQuestion[];
  onAddXp: (amount: number) => void;
  onRecordAnswer: (
    isCorrect: boolean,
    topic: QuestionTopic,
    attemptDetails?: Omit<QuestionAttemptRecord, 'id' | 'timestamp'>
  ) => void;
  onExamComplete?: (score: number) => void;
}

interface ArenaSessionState {
  currentIndex: number;
  streak: number;
  score: number;
  isFinished: boolean;
  mcqSelected: 'A' | 'B' | 'C' | 'D' | null;
  tfAnswers: Record<string, boolean | null>;
  shortInput: string;
  isSubmitted: boolean;
}

export const ArenaQuiz: React.FC<ArenaQuizProps> = ({
  subject = 'history',
  mcqList,
  tfList,
  shortList = [],
  onAddXp,
  onRecordAnswer,
  onExamComplete,
}) => {
  // Helper to load session from localStorage for the active subject
  const loadSavedSession = useCallback((): ArenaSessionState => {
    try {
      const raw = localStorage.getItem(`eduquest_arena_session_${subject}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          currentIndex: typeof parsed.currentIndex === 'number' ? Math.max(0, parsed.currentIndex) : 0,
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          score: typeof parsed.score === 'number' ? parsed.score : 0,
          isFinished: !!parsed.isFinished,
          mcqSelected: parsed.mcqSelected || null,
          tfAnswers: parsed.tfAnswers || {},
          shortInput: parsed.shortInput || '',
          isSubmitted: !!parsed.isSubmitted,
        };
      }
    } catch {
      // ignore
    }
    return {
      currentIndex: 0,
      streak: 0,
      score: 0,
      isFinished: false,
      mcqSelected: null,
      tfAnswers: {},
      shortInput: '',
      isSubmitted: false,
    };
  }, [subject]);

  const initialSession = useMemo<ArenaSessionState>(() => loadSavedSession(), [loadSavedSession]);

  // Question tracking
  const [currentIndex, setCurrentIndex] = useState<number>(initialSession.currentIndex);
  const [streak, setStreak] = useState<number>(initialSession.streak);
  const [score, setScore] = useState<number>(initialSession.score);
  const [isFinished, setIsFinished] = useState<boolean>(initialSession.isFinished);

  // User input states
  const [mcqSelected, setMcqSelected] = useState<'A' | 'B' | 'C' | 'D' | null>(initialSession.mcqSelected);
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean | null>>(initialSession.tfAnswers);
  const [shortInput, setShortInput] = useState<string>(initialSession.shortInput);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(initialSession.isSubmitted);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Synchronize state when switching subjects
  useEffect(() => {
    const saved = loadSavedSession();
    setCurrentIndex(saved.currentIndex);
    setStreak(saved.streak);
    setScore(saved.score);
    setIsFinished(saved.isFinished);
    setMcqSelected(saved.mcqSelected);
    setTfAnswers(saved.tfAnswers);
    setShortInput(saved.shortInput);
    setIsSubmitted(saved.isSubmitted);
    setShowResetConfirm(false);
  }, [subject, loadSavedSession]);

  // Automatically persist progress to localStorage and Firestore Cloud in real time
  useEffect(() => {
    try {
      const sessionData = {
        currentIndex,
        streak,
        score,
        isFinished,
        mcqSelected,
        tfAnswers,
        shortInput,
        isSubmitted,
      };
      localStorage.setItem(`eduquest_arena_session_${subject}`, JSON.stringify(sessionData));
      // Real-time Cloud Sync
      syncQuizSessionToCloud(subject, {
        currentIndex,
        streak,
        score,
        isFinished,
        mcqSelected,
        shortInput,
        isSubmitted,
      });
    } catch {
      // ignore
    }
  }, [subject, currentIndex, streak, score, isFinished, mcqSelected, tfAnswers, shortInput, isSubmitted]);

  // If local session was reset or empty, attempt restoring from Cloud Firestore
  useEffect(() => {
    let isMounted = true;
    const restoreCloudSession = async () => {
      if (currentIndex === 0 && !isSubmitted) {
        const cloud = await fetchQuizSessionFromCloud(subject);
        if (isMounted && cloud && typeof cloud.currentIndex === 'number' && cloud.currentIndex > 0) {
          setCurrentIndex(cloud.currentIndex);
          setStreak(cloud.streak || 0);
          setScore(cloud.score || 0);
          setIsFinished(!!cloud.isFinished);
          setMcqSelected(cloud.mcqSelected || null);
          setShortInput(cloud.shortInput || '');
          setIsSubmitted(!!cloud.isSubmitted);
        }
      }
    };
    restoreCloudSession();
    return () => {
      isMounted = false;
    };
  }, [subject]);

  // All questions in basic arena pool (MCQ first, then True/False, then Short Answer)
  const allQuestions = useMemo(() => {
    const pool: Array<
      | { type: 'mcq'; data: MultipleChoiceQuestion }
      | { type: 'tf'; data: TrueFalseQuestion }
      | { type: 'short'; data: ShortAnswerQuestion }
    > = [];

    mcqList.forEach((q) => pool.push({ type: 'mcq', data: q }));
    tfList.forEach((q) => pool.push({ type: 'tf', data: q }));
    shortList.forEach((q) => pool.push({ type: 'short', data: q }));

    return pool.length > 0 ? pool : mcqList.map((q) => ({ type: 'mcq' as const, data: q }));
  }, [mcqList, tfList, shortList]);

  const currentItem = allQuestions[currentIndex % allQuestions.length];

  const resetInputs = () => {
    setMcqSelected(null);
    setTfAnswers({});
    setShortInput('');
    setIsSubmitted(false);
  };

  const handleFinish = () => {
    setIsFinished(true);
    soundEffects.playLevelUp();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
    });
    if (onExamComplete) {
      onExamComplete(score);
    }
  };

  const handleMcqSelect = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    soundEffects.playClick();
    setMcqSelected(opt);
  };

  const handleTfChoice = (subId: string, choice: boolean) => {
    if (isSubmitted) return;
    soundEffects.playClick();
    setTfAnswers((prev) => ({ ...prev, [subId]: choice }));
  };

  const handleCheckAnswer = () => {
    if (!currentItem || isSubmitted) return;
    setIsSubmitted(true);

    let isCorrect = false;
    let earnedXp = 0;

    if (currentItem.type === 'mcq') {
      isCorrect = mcqSelected === currentItem.data.correctAnswer;
      earnedXp = isCorrect ? 25 + streak * 5 : 5;
      const chosenText = mcqSelected ? `${mcqSelected}. ${currentItem.data.options[mcqSelected]}` : 'Chưa chọn';
      const rightText = `${currentItem.data.correctAnswer}. ${currentItem.data.options[currentItem.data.correctAnswer]}`;
      onRecordAnswer(isCorrect, currentItem.data.topic, {
        questionId: currentItem.data.id,
        subject,
        type: 'mcq',
        topic: currentItem.data.topic,
        questionText: currentItem.data.question,
        imageUrl: currentItem.data.imageUrl,
        imageCaption: currentItem.data.imageCaption,
        userAnswer: chosenText,
        correctAnswer: rightText,
        isCorrect,
        explanation: currentItem.data.explanation,
      });
    } else if (currentItem.type === 'tf') {
      const statements = currentItem.data.statements;
      let correctSubs = 0;
      statements.forEach((st) => {
        if (tfAnswers[st.subId] === st.isCorrect) correctSubs++;
      });
      isCorrect = correctSubs === 4;
      earnedXp = correctSubs * 10;
      const userSummary = statements
        .map((st) => {
          const val = tfAnswers[st.subId];
          return `${st.subId.toUpperCase()}: ${val === true ? 'Đúng' : val === false ? 'Sai' : 'Chưa chọn'}`;
        })
        .join(' | ');
      const rightSummary = statements
        .map((st) => `${st.subId.toUpperCase()}: ${st.isCorrect ? 'Đúng' : 'Sai'}`)
        .join(' | ');
      onRecordAnswer(isCorrect, currentItem.data.topic, {
        questionId: currentItem.data.id,
        subject,
        type: 'tf',
        topic: currentItem.data.topic,
        questionText: currentItem.data.context,
        imageUrl: currentItem.data.imageUrl,
        imageCaption: currentItem.data.imageCaption,
        userAnswer: userSummary,
        correctAnswer: rightSummary,
        isCorrect,
        explanation: currentItem.data.analysis || statements.map((s) => `(${s.subId}) ${s.explanation}`).join('\n'),
      });
    } else if (currentItem.type === 'short') {
      const trimmed = shortInput.trim().toLowerCase();
      isCorrect =
        currentItem.data.acceptedAnswers.includes(trimmed) ||
        trimmed === String(currentItem.data.correctCountOrValue);
      earnedXp = isCorrect ? 40 + streak * 5 : 5;
      onRecordAnswer(isCorrect, currentItem.data.topic, {
        questionId: currentItem.data.id,
        subject,
        type: 'short',
        topic: currentItem.data.topic,
        questionText: currentItem.data.question,
        imageUrl: currentItem.data.imageUrl,
        imageCaption: currentItem.data.imageCaption,
        userAnswer: shortInput.trim() || 'Chưa điền',
        correctAnswer: currentItem.data.acceptedAnswers[0] || String(currentItem.data.correctCountOrValue),
        isCorrect,
        explanation: currentItem.data.explanation,
      });
    }

    if (isCorrect) {
      soundEffects.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((prev) => prev + 100 + streak * 20);
      onAddXp(earnedXp);

      if (nextStreak >= 3 && nextStreak % 3 === 0) {
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
      }
    } else {
      soundEffects.playIncorrect();
      setStreak(0);
      if (currentItem.type === 'tf') {
        // partial score for true/false
        const statements = currentItem.data.statements;
        let correctSubs = 0;
        statements.forEach((st) => {
          if (tfAnswers[st.subId] === st.isCorrect) correctSubs++;
        });
        setScore((prev) => prev + correctSubs * 25);
        if (earnedXp > 0) onAddXp(earnedXp);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      soundEffects.playClick();
      setCurrentIndex((prev) => prev - 1);
      resetInputs();
    }
  };

  const handleNextQuestion = () => {
    soundEffects.playClick();
    if (currentIndex + 1 >= allQuestions.length) {
      handleFinish();
    } else {
      setCurrentIndex((prev) => prev + 1);
      resetInputs();
    }
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem(`eduquest_arena_session_${subject}`);
    } catch {}
    setCurrentIndex(0);
    setIsFinished(false);
    setScore(0);
    setStreak(0);
    resetInputs();
    setShowResetConfirm(false);
  };

  if (isFinished) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Award className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Hoàn Thành Đấu Trường {subject === 'chemistry' ? 'Hóa Học 11' : subject === 'history' ? 'Lịch Sử 11' : subject === 'informatics' ? 'Tin Học 11' : 'Sinh Học 11'}!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Bạn đã xuất sắc chinh phục toàn bộ {allQuestions.length} câu hỏi kiến thức trọng tâm.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Tổng Điểm</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{score}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Chuỗi Đúng Tối Đa</div>
            <div className="text-xl font-bold text-amber-500 dark:text-amber-400 mt-0.5">{streak}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Kinh Nghiệm</div>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">+{score > 0 ? Math.floor(score / 5) : 100} XP</div>
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Bắt Đầu Vòng Mới
          </button>
        </div>
      </div>
    );
  }

  const getTopicLabel = (topic: string) => {
    switch (topic) {
      case 'phys1':
        return 'Lí: Dao động điều hòa';
      case 'phys2':
        return 'Lí: Năng lượng dao động';
      case 'phys3':
        return 'Lí: Tắt dần & cộng hưởng';
      case 'info1':
        return 'Tin: Hệ điều hành & phần cứng';
      case 'info2':
        return 'Tin: Phần mềm & dịch vụ số';
      case 'info3':
        return 'Tin: Thiết bị & dữ liệu số';
      case 'info4':
        return 'Tin: Internet & an toàn số';
      case 'history1':
        return 'CĐ 1: CM Tư Sản & CNTB';
      case 'history2':
        return 'CĐ 2: CNXH & Liên Xô';
      case 'chem1':
        return 'Hóa: Cân bằng hóa học';
      case 'chem2':
        return 'Hóa: Cân bằng dd nước';
      case 'chem3':
        return 'Hóa: Nitrogen & Hợp chất';
      case 'topic1':
        return '1.1 Khái quát';
      case 'topic2':
        return '1.2 Nước & Khoáng';
      case 'topic3':
        return '1.3 Quang hợp';
      default:
        return topic;
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'NhanBiet':
        return 'Nhận biết';
      case 'ThongHieu':
        return 'Thông hiểu';
      case 'VanDung':
        return 'Vận dụng';
      default:
        return diff;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* HUD Header Bar: Simple & Basic (No countdown, No lives) */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mode Title & Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
              <span>{subject === 'physics' ? 'Đấu Trường Vật Lí 11' : subject === 'chemistry' ? 'Đấu Trường Hóa Học 11' : subject === 'history' ? 'Đấu Trường Lịch Sử 11' : subject === 'informatics' ? 'Đấu Trường Tin Học 11' : 'Đấu Trường Sinh Học 11'}</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Câu {currentIndex + 1} / {allQuestions.length}
              </span>
              <span>•</span>
              <span className="capitalize">{getTopicLabel(currentItem.data.topic)}</span>
            </div>
          </div>
        </div>

        {/* Right: Score & Streak Combo + Reset Option */}
        <div className="flex items-center gap-2">
          {streak > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Chuỗi x{streak}</span>
            </div>
          )}

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono">
            Điểm: {score}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowResetConfirm((prev) => !prev);
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
              title="Làm lại từ câu 1 môn này"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {showResetConfirm && (
              <div className="absolute right-0 top-full mt-2 w-56 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 text-xs space-y-2.5 animate-fade-in">
                <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  Bạn có muốn làm lại từ câu 1 môn này?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      handleRestart();
                    }}
                    className="flex-1 py-1.5 px-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors cursor-pointer text-center"
                  >
                    Làm lại
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-center"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-5 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-5">
        {/* Question Type & Difficulty Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              {currentItem.type === 'mcq' && `Trắc Nghiệm 4 Lựa Chọn (Câu ${currentItem.data.id})`}
              {currentItem.type === 'tf' && `Trắc Nghiệm Đúng / Sai (Câu ${currentItem.data.id})`}
              {currentItem.type === 'short' && `Trả Lời Ngắn (Câu ${currentItem.data.id})`}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              Mức độ: {getDifficultyLabel(currentItem.data.difficulty)}
            </span>
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400">
            {currentIndex + 1} trên tổng số {allQuestions.length} câu
          </span>
        </div>

        {/* Question Prompt / Context */}
        <div className="space-y-3">
          <div className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
            {currentItem.type === 'mcq' && <LatexText text={currentItem.data.question} />}
            {currentItem.type === 'tf' && <LatexText text={currentItem.data.context} />}
            {currentItem.type === 'short' && <LatexText text={currentItem.data.question} />}
          </div>

          {/* Question Image Attachment */}
          {currentItem.data.imageUrl && (
            <div className="my-3 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-2 sm:p-3 shadow-sm text-center">
              <img
                src={currentItem.data.imageUrl}
                alt={currentItem.data.imageCaption || 'Hình ảnh minh họa'}
                className="max-h-64 sm:max-h-80 mx-auto rounded-xl object-contain shadow-sm bg-white"
                loading="lazy"
              />
              {currentItem.data.imageCaption && (
                <p className="mt-2 text-xs italic text-slate-600 dark:text-slate-400 font-medium">
                  📷 {currentItem.data.imageCaption}
                </p>
              )}
            </div>
          )}


          {/* Sub Items for Short Answer */}
          {currentItem.type === 'short' && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              {currentItem.data.items.map((item, iIdx) => (
                <div key={iIdx} className="leading-relaxed">
                  <LatexText text={item} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* INPUT INTERFACES */}

        {/* 1. MCQ OPTIONS ABCD */}
        {currentItem.type === 'mcq' && (
          <div className="grid grid-cols-1 gap-2.5">
            {(['A', 'B', 'C', 'D'] as const).map((opt) => {
              const isChosen = mcqSelected === opt;
              const isCorrectOpt = currentItem.data.correctAnswer === opt;

              let btnStyle =
                'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/70 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';

              if (isChosen && !isSubmitted) {
                btnStyle =
                  'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-white font-medium ring-2 ring-emerald-500/50';
              } else if (isSubmitted) {
                if (isCorrectOpt) {
                  btnStyle =
                    'bg-emerald-100/80 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-semibold ring-2 ring-emerald-500';
                } else if (isChosen && !isCorrectOpt) {
                  btnStyle =
                    'bg-rose-100/80 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-100';
                } else {
                  btnStyle =
                    'bg-slate-100/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleMcqSelect(opt)}
                  disabled={isSubmitted}
                  className={`p-3.5 sm:p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${btnStyle}`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isChosen
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {opt}
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed pt-0.5">
                    <LatexText text={currentItem.data.options[opt]} />
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. TRUE / FALSE 4 SUB-STATEMENTS (a, b, c, d) */}
        {currentItem.type === 'tf' && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Chọn Đúng hoặc Sai cho mỗi ý kiến dưới đây:
            </div>
            {currentItem.data.statements.map((st) => {
              const userChoice = tfAnswers[st.subId];
              const isCorrectSub = userChoice === st.isCorrect;

              return (
                <div
                  key={st.subId}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSubmitted
                      ? isCorrectSub
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500/40'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-500/40'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                      Ý {st.subId})
                    </span>
                    <div className="leading-relaxed">
                      <LatexText text={st.text} />
                    </div>
                  </div>

                  {/* 2-column full-width grid on mobile for easy thumb tapping */}
                  <div className="grid grid-cols-2 gap-2 w-full sm:w-auto shrink-0 mt-1 sm:mt-0">
                    <button
                      onClick={() => handleTfChoice(st.subId, true)}
                      disabled={isSubmitted}
                      className={`h-11 sm:h-auto px-4 py-2 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 touch-manipulation ${
                        userChoice === true
                          ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      <Check className="w-4 h-4" /> Đúng
                    </button>
                    <button
                      onClick={() => handleTfChoice(st.subId, false)}
                      disabled={isSubmitted}
                      className={`h-11 sm:h-auto px-4 py-2 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 touch-manipulation ${
                        userChoice === false
                          ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                      }`}
                    >
                      <X className="w-4 h-4" /> Sai
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. SHORT ANSWER INPUT */}
        {currentItem.type === 'short' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                Nhập số lượng nhận định đúng hoặc kết quả:
              </span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={shortInput}
                onChange={(e) => setShortInput(e.target.value)}
                disabled={isSubmitted}
                placeholder="Ví dụ: 3"
                className="w-full sm:w-28 h-12 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-center text-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Explanation & Feedback Box when Submitted */}
        {isSubmitted && (
          <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 dark:bg-slate-800/90 border border-emerald-200 dark:border-slate-700 space-y-2.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Giải Thích & Barem Chuẩn:</span>
            </div>

            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {currentItem.type === 'mcq' && <LatexText text={currentItem.data.explanation} />}
              {currentItem.type === 'tf' && <LatexText text={currentItem.data.analysis} />}
              {currentItem.type === 'short' && <LatexText text={currentItem.data.explanation} />}
            </div>

            {currentItem.type === 'mcq' && (
              <div className="pt-2 border-t border-emerald-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Nguồn tham chiếu SGK: {currentItem.data.sgkReference}</span>
              </div>
            )}

            {currentItem.type === 'short' && (
              <div className="space-y-1.5 pt-2 border-t border-emerald-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                {currentItem.data.detailedItemAnalysis.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span
                      className={`font-semibold shrink-0 ${
                        item.isCorrect
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      ({item.index}) {item.isCorrect ? 'ĐÚNG:' : 'SAI:'}
                    </span>
                    <span><LatexText text={item.reason} /></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions - Full width & Thumb-zone optimized on Mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left order-2 sm:order-1 flex items-center gap-2.5">
            {currentIndex > 0 && (
              <button
                onClick={handlePrevQuestion}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Câu Trước</span>
              </button>
            )}
            <span>
              {!isSubmitted ? 'Hãy chọn phương án rồi nhấn Kiểm Tra' : 'Đã đối chiếu đáp án thành công'}
            </span>
          </div>

          <div className="w-full sm:w-auto order-1 sm:order-2 flex items-center gap-2">
            {!isSubmitted ? (
              <button
                onClick={handleCheckAnswer}
                disabled={
                  (currentItem.type === 'mcq' && !mcqSelected) ||
                  (currentItem.type === 'tf' && Object.keys(tfAnswers).length < 4) ||
                  (currentItem.type === 'short' && !shortInput.trim())
                }
                className="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold text-sm sm:text-xs rounded-xl transition-all cursor-pointer shadow-md active:scale-[0.98] touch-manipulation flex items-center justify-center gap-2"
              >
                Kiểm Tra Đáp Án
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-6 py-3.5 sm:py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-[0.98] touch-manipulation"
              >
                <span>{currentIndex + 1 >= allQuestions.length ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
