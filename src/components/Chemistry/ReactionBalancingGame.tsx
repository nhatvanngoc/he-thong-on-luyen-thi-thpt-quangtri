import React, { useState, useMemo, useEffect } from 'react';
import {
  CHEMISTRY_BALANCING_REACTIONS,
  BalancingReactionItem,
} from '../../data/chemistryReactions';
import { soundEffects } from '../../services/soundEffects';
import { LatexText } from '../Common/LatexText';
import {
  Scale,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Plus,
  Minus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReactionBalancingGameProps {
  onAddXp: (amount: number) => void;
}

export const ReactionBalancingGame: React.FC<ReactionBalancingGameProps> = ({ onAddXp }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentItem: BalancingReactionItem =
    CHEMISTRY_BALANCING_REACTIONS[currentIndex % CHEMISTRY_BALANCING_REACTIONS.length];

  // Coefficients keyed by formula: e.g. { 'NH3': 1, 'O2': 1, 'NO': 1, 'H2O': 1 }
  const [coefficients, setCoefficients] = useState<Record<string, number>>({});

  // Initialize all coefficients to 1 or empty
  useEffect(() => {
    const init: Record<string, number> = {};
    currentItem.reactants.forEach((r) => (init[r.formula] = 1));
    currentItem.products.forEach((p) => (init[p.formula] = 1));
    setCoefficients(init);
    setShowHint(false);
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [currentIndex]);

  const handleUpdateCoef = (formula: string, delta: number) => {
    if (isSubmitted && isCorrect) return;
    soundEffects.playClick();
    setCoefficients((prev) => {
      const current = prev[formula] || 1;
      const next = Math.max(1, Math.min(99, current + delta));
      return { ...prev, [formula]: next };
    });
    if (isSubmitted) setIsSubmitted(false);
  };

  const handleInputChange = (formula: string, value: string) => {
    if (isSubmitted && isCorrect) return;
    const num = parseInt(value, 10);
    const valid = isNaN(num) ? 1 : Math.max(1, Math.min(99, num));
    setCoefficients((prev) => ({ ...prev, [formula]: valid }));
    if (isSubmitted) setIsSubmitted(false);
  };

  // Atom balance calculation
  const atomComparison = useMemo(() => {
    const leftAtoms: Record<string, number> = {};
    const rightAtoms: Record<string, number> = {};

    currentItem.reactants.forEach((r) => {
      const coef = coefficients[r.formula] || 1;
      Object.entries(r.atoms).forEach(([el, count]) => {
        leftAtoms[el] = (leftAtoms[el] || 0) + count * coef;
      });
    });

    currentItem.products.forEach((p) => {
      const coef = coefficients[p.formula] || 1;
      Object.entries(p.atoms).forEach(([el, count]) => {
        rightAtoms[el] = (rightAtoms[el] || 0) + count * coef;
      });
    });

    const allElements = Array.from(
      new Set([...Object.keys(leftAtoms), ...Object.keys(rightAtoms)])
    );

    return allElements.map((el) => {
      const left = leftAtoms[el] || 0;
      const right = rightAtoms[el] || 0;
      return {
        element: el,
        left,
        right,
        balanced: left === right && left > 0,
      };
    });
  }, [currentItem, coefficients]);

  const allAtomsBalanced = useMemo(() => {
    return atomComparison.every((item) => item.balanced);
  }, [atomComparison]);

  const handleCheck = () => {
    let matchesTarget = true;
    currentItem.reactants.forEach((r) => {
      if ((coefficients[r.formula] || 1) !== r.targetCoef) matchesTarget = false;
    });
    currentItem.products.forEach((p) => {
      if ((coefficients[p.formula] || 1) !== p.targetCoef) matchesTarget = false;
    });

    // If all atoms are balanced and it's a multiple of simplest integer ratio or matches target
    const passed = matchesTarget || allAtomsBalanced;

    setIsSubmitted(true);
    setIsCorrect(passed);

    if (passed) {
      soundEffects.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((prev) => prev + 120 + streak * 30);
      onAddXp(40 + streak * 5);
      confetti({
        particleCount: 80,
        spread: 65,
        origin: { y: 0.6 },
      });
    } else {
      soundEffects.playClick();
      setStreak(0);
    }
  };

  const handleReset = () => {
    soundEffects.playClick();
    const init: Record<string, number> = {};
    currentItem.reactants.forEach((r) => (init[r.formula] = 1));
    currentItem.products.forEach((p) => (init[p.formula] = 1));
    setCoefficients(init);
    setIsSubmitted(false);
  };

  const handleNext = () => {
    soundEffects.playClick();
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* HUD Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
              <span>Thử Thách Cân Bằng Phản Ứng Hóa Học</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Câu {currentIndex + 1} / {CHEMISTRY_BALANCING_REACTIONS.length}
              </span>
              <span>•</span>
              <span>Điền hệ số tỉ lượng tối giản</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {streak > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Chuỗi x{streak}</span>
            </div>
          )}

          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold font-mono">
            Điểm: {score}
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-5 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
        {/* Title */}
        <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
              Chủ đề: {currentItem.category === 'nitrogen' ? 'Nitrogen & Hợp Chất' : 'Cân Bằng Hóa Học'}
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {currentItem.title}
            </h4>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className="self-start sm:self-auto flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 cursor-pointer font-medium px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Ẩn hướng dẫn' : 'Gợi ý cân bằng'}</span>
          </button>
        </div>

        {showHint && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Mẹo cân bằng: </span>
              {currentItem.hint}
            </div>
          </div>
        )}

        {/* Interactive Balancing Formula Row */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <div className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            NHẬP HOẶC NHẤN +/- ĐỂ ĐIỀU CHỈNH HỆ SỐ CỦA TỪNG CHẤT
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 py-2">
            {/* Reactants */}
            {currentItem.reactants.map((r, idx) => (
              <React.Fragment key={r.formula}>
                {idx > 0 && <span className="font-bold text-xl text-slate-400 self-center">+</span>}
                <div className="flex flex-col items-center gap-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  {/* Stepper Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateCoef(r.formula, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={coefficients[r.formula] || 1}
                      onChange={(e) => handleInputChange(r.formula, e.target.value)}
                      className="w-10 h-7 text-center font-mono font-bold text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => handleUpdateCoef(r.formula, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {/* Compound Formula */}
                  <div className="font-mono font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 mt-0.5">
                    <LatexText text={`$${r.displayLatex}$`} />
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* Arrow & Condition */}
            <div className="flex flex-col items-center justify-center px-1 self-center">
              {currentItem.condition && (
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 font-mono -mb-1">
                  {currentItem.condition}
                </span>
              )}
              <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                {currentItem.arrow === '<=>' ? '⇌' : '➔'}
              </span>
            </div>

            {/* Products */}
            {currentItem.products.map((p, idx) => (
              <React.Fragment key={p.formula}>
                {idx > 0 && <span className="font-bold text-xl text-slate-400 self-center">+</span>}
                <div className="flex flex-col items-center gap-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  {/* Stepper Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateCoef(p.formula, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={coefficients[p.formula] || 1}
                      onChange={(e) => handleInputChange(p.formula, e.target.value)}
                      className="w-10 h-7 text-center font-mono font-bold text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => handleUpdateCoef(p.formula, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  {/* Compound Formula */}
                  <div className="font-mono font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 mt-0.5">
                    <LatexText text={`$${p.displayLatex}$`} />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Live Atom Balancing Monitor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <span>Bảng kiểm tra bảo toàn nguyên tố (Trực quan thời gian thực):</span>
            <span
              className={`font-semibold ${
                allAtomsBalanced
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {allAtomsBalanced ? '✓ Tất cả nguyên tố đã cân bằng' : 'Chưa cân bằng hoàn toàn'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {atomComparison.map((item) => (
              <div
                key={item.element}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-colors ${
                  item.balanced
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-900 border flex items-center justify-center text-xs">
                    {item.element}
                  </span>
                  <span>Vế T : Vế P</span>
                </div>
                <div className="font-bold text-sm">
                  {item.left} : {item.right} {item.balanced ? '✓' : '≠'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback & Method Card */}
        {isSubmitted && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-all ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-100'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Xuất sắc! Các hệ số đã thỏa mãn định luật bảo toàn khối lượng và electron.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>Hệ số chưa đúng hoặc chưa tối giản! Hãy kiểm tra lại bảng bảo toàn nguyên tố.</span>
                </>
              )}
            </div>

            <div className="text-xs sm:text-sm font-mono p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Phương trình đã cân bằng:</div>
              <LatexText text={`$$${currentItem.balancedLatex}$$`} />
            </div>

            <div className="text-xs leading-relaxed space-y-1">
              <span className="font-bold">Phương pháp cân bằng: </span>
              <span>{currentItem.balancingMethod}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleReset}
            className="px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại (1)</span>
          </button>

          <div className="flex items-center gap-2">
            {!isSubmitted || !isCorrect ? (
              <button
                onClick={handleCheck}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Kiểm tra cân bằng</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Phản ứng tiếp theo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
