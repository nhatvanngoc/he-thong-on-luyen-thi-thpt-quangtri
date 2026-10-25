import React, { useState, useMemo, useEffect } from 'react';
import {
  CHEMISTRY_REACTION_PUZZLES,
  ReactionPuzzleItem,
  ChemicalCompound,
} from '../../data/chemistryReactions';
import { soundEffects } from '../../services/soundEffects';
import { LatexText } from '../Common/LatexText';
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Award,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReactionPuzzleGameProps {
  onAddXp: (amount: number) => void;
}

export const ReactionPuzzleGame: React.FC<ReactionPuzzleGameProps> = ({ onAddXp }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentPuzzle: ReactionPuzzleItem = CHEMISTRY_REACTION_PUZZLES[currentIndex % CHEMISTRY_REACTION_PUZZLES.length];

  // Number of slots for reactants and products
  const numReactantSlots = currentPuzzle.reactantFormulas.length;
  const numProductSlots = currentPuzzle.productFormulas.length;

  // Selected tiles placed in slots
  // Format: { 'r-0': compound, 'r-1': compound, 'p-0': compound, ... }
  const [placedSlots, setPlacedSlots] = useState<Record<string, ChemicalCompound | null>>({});

  // Shuffle the tile pool once when puzzle changes
  const shuffledPool = useMemo(() => {
    const list = [...currentPuzzle.tilePool];
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }, [currentPuzzle]);

  // Reset inputs when switching puzzles
  useEffect(() => {
    setPlacedSlots({});
    setShowHint(false);
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [currentIndex]);

  // Check which tiles are currently used
  const usedTileKeys = useMemo(() => {
    const used = new Set<string>();
    Object.values(placedSlots).forEach((cmp) => {
      if (cmp) used.add(cmp.formula);
    });
    return used;
  }, [placedSlots]);

  // Handle clicking a tile in the pool to place into the first free slot
  const handleTileClick = (compound: ChemicalCompound) => {
    if (isSubmitted && isCorrect) return;
    if (usedTileKeys.has(compound.formula)) return;

    soundEffects.playClick();

    // Find first empty slot: check reactants first, then products
    for (let i = 0; i < numReactantSlots; i++) {
      const key = `r-${i}`;
      if (!placedSlots[key]) {
        setPlacedSlots((prev) => ({ ...prev, [key]: compound }));
        return;
      }
    }
    for (let i = 0; i < numProductSlots; i++) {
      const key = `p-${i}`;
      if (!placedSlots[key]) {
        setPlacedSlots((prev) => ({ ...prev, [key]: compound }));
        return;
      }
    }
  };

  // Remove a placed tile from a slot back to the pool
  const handleSlotClick = (slotKey: string) => {
    if (isSubmitted && isCorrect) return;
    if (!placedSlots[slotKey]) return;

    soundEffects.playClick();
    setPlacedSlots((prev) => {
      const next = { ...prev };
      delete next[slotKey];
      return next;
    });
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };

  // Check answer
  const handleCheck = () => {
    // Collect placed formulas for reactants
    const placedReactants: string[] = [];
    for (let i = 0; i < numReactantSlots; i++) {
      const c = placedSlots[`r-${i}`];
      if (c) placedReactants.push(c.formula);
    }

    // Collect placed formulas for products
    const placedProducts: string[] = [];
    for (let i = 0; i < numProductSlots; i++) {
      const c = placedSlots[`p-${i}`];
      if (c) placedProducts.push(c.formula);
    }

    if (placedReactants.length !== numReactantSlots || placedProducts.length !== numProductSlots) {
      alert('Vui lòng điền đầy đủ các ô chất tham gia và chất sản phẩm trước khi kiểm tra!');
      return;
    }

    // Compare sets
    const reqReactants = [...currentPuzzle.reactantFormulas].sort();
    const reqProducts = [...currentPuzzle.productFormulas].sort();
    const curReactants = [...placedReactants].sort();
    const curProducts = [...placedProducts].sort();

    const reactantsOk =
      reqReactants.length === curReactants.length &&
      reqReactants.every((val, idx) => val === curReactants[idx]);

    const productsOk =
      reqProducts.length === curProducts.length &&
      reqProducts.every((val, idx) => val === curProducts[idx]);

    const passed = reactantsOk && productsOk;
    setIsSubmitted(true);
    setIsCorrect(passed);

    if (passed) {
      soundEffects.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setScore((prev) => prev + 100 + streak * 25);
      onAddXp(35 + streak * 5);
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      soundEffects.playClick();
      setStreak(0);
    }
  };

  const handleNextPuzzle = () => {
    soundEffects.playClick();
    setCurrentIndex((prev) => prev + 1);
  };

  const handleClear = () => {
    soundEffects.playClick();
    setPlacedSlots({});
    setIsSubmitted(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* HUD Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base flex items-center gap-2">
              <span>Trò Chơi Ghép Ô Phản Ứng Hóa Học</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span className="font-medium text-sky-600 dark:text-sky-400">
                Thử thách {currentIndex + 1} / {CHEMISTRY_REACTION_PUZZLES.length}
              </span>
              <span>•</span>
              <span>Sắp xếp hợp chất chuẩn xác</span>
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

          <div className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 text-xs font-bold font-mono">
            Điểm: {score}
          </div>
        </div>
      </div>

      {/* Main Puzzle Card */}
      <div className="p-5 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
        {/* Title & Instructions */}
        <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-sky-600 dark:text-sky-400">
              Chủ đề: {currentPuzzle.category === 'nitrogen' ? 'Nitrogen & Hợp Chất' : 'Cân Bằng Hóa Học'}
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {currentPuzzle.title}
            </h4>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className="self-start sm:self-auto flex items-center gap-1 text-xs text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 cursor-pointer font-medium px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Ẩn gợi ý' : 'Xem gợi ý'}</span>
          </button>
        </div>

        {showHint && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Gợi ý: </span>
              {currentPuzzle.hint}
            </div>
          </div>
        )}

        {/* Reaction Equation Board (Drop Slots) */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
          <div className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
            KHUNG PHƯƠNG TRÌNH PHẢN ỨNG (Bấm vào ô để gỡ bỏ chất)
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-3">
            {/* Reactant Slots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: numReactantSlots }).map((_, idx) => {
                const key = `r-${idx}`;
                const cmp = placedSlots[key];
                return (
                  <React.Fragment key={key}>
                    {idx > 0 && <span className="font-bold text-lg text-slate-400">+</span>}
                    <button
                      onClick={() => handleSlotClick(key)}
                      className={`min-w-[70px] sm:min-w-[90px] h-14 sm:h-16 px-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        cmp
                          ? isSubmitted
                            ? isCorrect
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm'
                              : 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300'
                            : 'bg-sky-50 dark:bg-sky-950/50 border-sky-400 text-sky-900 dark:text-sky-200 shadow-sm font-bold'
                          : 'bg-white dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:border-sky-400'
                      }`}
                    >
                      {cmp ? (
                        <>
                          <span className="text-sm sm:text-base font-bold font-mono">
                            <LatexText text={`$${cmp.displayLatex}$`} />
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[80px]">
                            {cmp.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Chất đầu {idx + 1}</span>
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Reaction Arrow with condition */}
            <div className="flex flex-col items-center justify-center px-1 sm:px-2">
              {currentPuzzle.condition && (
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 font-mono -mb-1">
                  {currentPuzzle.condition}
                </span>
              )}
              <span className="text-xl sm:text-2xl font-bold text-slate-700 dark:text-slate-300">
                {currentPuzzle.arrow === '<=>' ? '⇌' : '➔'}
              </span>
            </div>

            {/* Product Slots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: numProductSlots }).map((_, idx) => {
                const key = `p-${idx}`;
                const cmp = placedSlots[key];
                return (
                  <React.Fragment key={key}>
                    {idx > 0 && <span className="font-bold text-lg text-slate-400">+</span>}
                    <button
                      onClick={() => handleSlotClick(key)}
                      className={`min-w-[70px] sm:min-w-[90px] h-14 sm:h-16 px-3 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        cmp
                          ? isSubmitted
                            ? isCorrect
                              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm'
                              : 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300'
                            : 'bg-sky-50 dark:bg-sky-950/50 border-sky-400 text-sky-900 dark:text-sky-200 shadow-sm font-bold'
                          : 'bg-white dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-700 text-slate-400 hover:border-sky-400'
                      }`}
                    >
                      {cmp ? (
                        <>
                          <span className="text-sm sm:text-base font-bold font-mono">
                            <LatexText text={`$${cmp.displayLatex}$`} />
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[80px]">
                            {cmp.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Sản phẩm {idx + 1}</span>
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compound Tile Pool (Khay hợp chất) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Khay hợp chất (Chọn ô để tự động đưa vào phương trình):
            </span>
            <button
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Làm lại</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {shuffledPool.map((compound) => {
              const isUsed = usedTileKeys.has(compound.formula);
              return (
                <button
                  key={compound.formula}
                  disabled={isUsed || (isSubmitted && isCorrect)}
                  onClick={() => handleTileClick(compound)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isUsed
                      ? 'opacity-35 bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                >
                  <div className="font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                    <LatexText text={`$${compound.displayLatex}$`} />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                    {compound.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Result Explanation Card */}
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
                  <span>Chính xác tuyệt đối! Đã hoàn thành phản ứng hóa học.</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>Chưa đúng! Vui lòng kiểm tra lại chất tham gia hoặc chất tạo thành.</span>
                </>
              )}
            </div>

            <div className="text-xs sm:text-sm font-mono p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Phương trình hoàn chỉnh:</div>
              <LatexText text={`$$${currentPuzzle.balancedLatex}$$`} />
            </div>

            <div className="text-xs leading-relaxed space-y-1">
              <span className="font-bold">Bản chất hóa học: </span>
              <span>{currentPuzzle.explanation}</span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              soundEffects.playClick();
              setCurrentIndex((prev) => (prev > 0 ? prev - 1 : CHEMISTRY_REACTION_PUZZLES.length - 1));
            }}
            className="px-3 sm:px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Phản ứng trước
          </button>

          <div className="flex items-center gap-2">
            {!isSubmitted || !isCorrect ? (
              <button
                onClick={handleCheck}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Kiểm tra phản ứng</span>
              </button>
            ) : (
              <button
                onClick={handleNextPuzzle}
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
