import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Flame,
  Cloud,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LatexText } from '../Common/LatexText';
import {
  PHYSICS_FORMULA_QUESTIONS,
  CHEMISTRY_FORMULA_QUESTIONS,
  FormulaQuizQuestion,
} from '../../data/formulaQuizData';
import { UserStats, SubjectId } from '../../types/biology';
import { soundEffects } from '../../services/soundEffects';
import { syncUserProfileToCloud } from '../../services/firebase';

interface FormulaQuizViewProps {
  currentSubject: SubjectId;
  userStats: UserStats;
  setUserStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

export const FormulaQuizView: React.FC<FormulaQuizViewProps> = ({
  currentSubject,
  userStats,
  setUserStats,
}) => {
  // Purely lock to the active subject (Tách biệt hoàn toàn Lý và Hóa)
  const isChemistry = currentSubject === 'chemistry';
  const subjectName = isChemistry ? 'Hóa Học 11' : 'Vật Lí 11';

  const fullQuestionList = useMemo(() => {
    return isChemistry ? CHEMISTRY_FORMULA_QUESTIONS : PHYSICS_FORMULA_QUESTIONS;
  }, [isChemistry]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<number[]>([]);
  const [isReviewingMistakes, setIsReviewingMistakes] = useState<boolean>(false);
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Reset when currentSubject changes
  useEffect(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsTestFinished(false);
    setIsReviewingMistakes(false);
    setWrongQuestionIds([]);
    setScore(0);
    setStreak(0);
  }, [currentSubject]);

  // Active question list (all or only mistakes)
  const activeQuestions = useMemo(() => {
    if (isReviewingMistakes) {
      const wrongSet = new Set(wrongQuestionIds);
      const filtered = fullQuestionList.filter((q) => wrongSet.has(q.id));
      return filtered.length > 0 ? filtered : fullQuestionList;
    }
    return fullQuestionList;
  }, [fullQuestionList, isReviewingMistakes, wrongQuestionIds]);

  const currentQ: FormulaQuizQuestion | undefined = activeQuestions[currentIndex];

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    soundEffects.playClick();
    setSelectedOption(opt);
  };

  const handleSubmitAnswer = () => {
    if (!currentQ || !selectedOption || isSubmitted) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      soundEffects.playCorrect();
      setScore((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);

      if (newStreak % 5 === 0) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      }

      // If currently reviewing mistakes and answered correctly, remove from wrong list
      if (isReviewingMistakes) {
        setWrongQuestionIds((prev) => prev.filter((id) => id !== currentQ.id));
      }

      // Sync to Firebase
      setUserStats((prev) => {
        const next: UserStats = {
          ...prev,
          xp: prev.xp + 15,
          totalCorrect: prev.totalCorrect + 1,
          totalAnswered: prev.totalAnswered + 1,
          bestStreak: Math.max(prev.bestStreak, newStreak),
        };
        syncUserProfileToCloud(next);
        return next;
      });
    } else {
      soundEffects.playWrong();
      setStreak(0);
      setWrongQuestionIds((prev) => {
        if (!prev.includes(currentQ.id)) {
          return [...prev, currentQ.id];
        }
        return prev;
      });

      setUserStats((prev) => {
        const next: UserStats = {
          ...prev,
          totalAnswered: prev.totalAnswered + 1,
        };
        syncUserProfileToCloud(next);
        return next;
      });
    }
  };

  const handleNextQuestion = () => {
    soundEffects.playClick();
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsTestFinished(true);
      confetti({ particleCount: 50, spread: 70 });
    }
  };

  const handleRestart = (reviewOnlyMistakes: boolean) => {
    soundEffects.playClick();
    setIsReviewingMistakes(reviewOnlyMistakes);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsTestFinished(false);
    if (!reviewOnlyMistakes) {
      setWrongQuestionIds([]);
      setScore(0);
      setStreak(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fadeIn pb-12">
      {/* 1. Header Đơn Giản - Tách Biệt Theo Môn */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Kiểm Tra Công Thức {subjectName}
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Cloud className="w-3 h-3" /> Sync Firebase
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Luyện trắc nghiệm phản xạ công thức – Làm sai sửa ngay để nhớ lâu.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            {fullQuestionList.length} câu hỏi
          </span>
        </div>
      </div>

      {/* 2. Màn Hình Kết Thúc / Tổng Kết Điểm */}
      {isTestFinished ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-center space-y-5 shadow-sm">
          <div className="w-14 h-14 bg-amber-100 dark:bg-amber-950/60 rounded-full flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
            <Trophy className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Hoàn Thành Bài Kiểm Tra Công Thức {subjectName}!
            </h2>
          </div>

          {/* Bảng điểm đơn giản */}
          <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Đúng</div>
              <div className="text-lg font-black text-emerald-800 dark:text-emerald-300">
                {score}
              </div>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800">
              <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Sai</div>
              <div className="text-lg font-black text-rose-800 dark:text-rose-300">
                {wrongQuestionIds.length}
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="text-[11px] text-blue-700 dark:text-blue-400 font-medium">Tỉ lệ đúng</div>
              <div className="text-lg font-black text-blue-800 dark:text-blue-300">
                {activeQuestions.length > 0 ? Math.round((score / activeQuestions.length) * 100) : 0}%
              </div>
            </div>
          </div>

          {/* Các nút hành động */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            {wrongQuestionIds.length > 0 && (
              <button
                onClick={() => handleRestart(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Luyện Lại {wrongQuestionIds.length} Câu Làm Sai
              </button>
            )}
            <button
              onClick={() => handleRestart(false)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              Làm Lại Tất Cả Câu
            </button>
          </div>
        </div>
      ) : currentQ ? (
        /* 3. Khung Câu Hỏi Trắc Nghiệm Đơn Giản */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-sm">
          {/* Status Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">
                Câu {currentIndex + 1} / {activeQuestions.length}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300">
                {currentQ.topic}
              </span>
              {isReviewingMistakes && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                  Sửa câu sai
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                Chuỗi: {streak}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                Điểm: {score}
              </span>
            </div>
          </div>

          {/* Nội dung câu hỏi */}
          <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white py-1 leading-relaxed">
            <LatexText text={currentQ.question} />
          </div>

          {/* 4 Phương Án A, B, C, D */}
          <div className="grid grid-cols-1 gap-2.5 pt-1">
            {(['A', 'B', 'C', 'D'] as const).map((opt) => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = currentQ.correctAnswer === opt;

              let cardStyle =
                'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-400';

              if (isSubmitted) {
                if (isCorrectAnswer) {
                  cardStyle =
                    'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrectAnswer) {
                  cardStyle =
                    'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 font-bold ring-1 ring-rose-500';
                } else {
                  cardStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
                }
              } else if (isSelected) {
                cardStyle =
                  'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-semibold ring-1 ring-emerald-500';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isSubmitted}
                  className={`p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {opt}
                  </span>
                  <div className="flex-1 pt-0.5">
                    <LatexText text={currentQ.options[opt]} as="span" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Nút bấm kiểm tra / Tiếp theo */}
          {!isSubmitted ? (
            <div className="pt-2">
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  selectedOption
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                Kiểm Tra Đáp Án
              </button>
            </div>
          ) : (
            <div className="pt-2">
              <button
                onClick={handleNextQuestion}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Câu Tiếp Theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 4. Khối SỬA SAI & KHẮC SÂU CÔNG THỨC (Không có cảnh báo rườm rà) */}
          {isSubmitted && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fadeIn">
              {/* Thông báo Đúng / Sai */}
              <div
                className={`p-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-bold ${
                  selectedOption === currentQ.correctAnswer
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                {selectedOption === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Chính xác! (+15 XP)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      Chưa đúng! Đáp án đúng là{' '}
                      <strong className="underline font-black">{currentQ.correctAnswer}</strong>.
                    </span>
                  </>
                )}
              </div>

              {/* Hộp Công Thức & Hướng Dẫn Giải Gọn Gàng */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Công thức cốt lõi:</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center text-sm font-bold text-slate-900 dark:text-white">
                  <LatexText text={`$$${currentQ.formulaUsed}$$`} />
                </div>

                {currentQ.derivedFormulas && (
                  <div className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      ⚡ Hệ thức liên hệ:{' '}
                    </span>
                    <LatexText text={`$${currentQ.derivedFormulas}$`} as="span" />
                  </div>
                )}

                {/* Hướng dẫn giải */}
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    💡 Hướng dẫn giải:{' '}
                  </span>
                  <LatexText text={currentQ.explanation} as="span" />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
