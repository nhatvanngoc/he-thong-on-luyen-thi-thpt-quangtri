import React, { useState } from 'react';
import { ReactionPuzzleGame } from './ReactionPuzzleGame';
import { ReactionBalancingGame } from './ReactionBalancingGame';
import { soundEffects } from '../../services/soundEffects';
import { Puzzle, Scale } from 'lucide-react';

interface ReactionHubProps {
  onAddXp: (amount: number) => void;
}

export const ReactionHub: React.FC<ReactionHubProps> = ({ onAddXp }) => {
  const [subMode, setSubMode] = useState<'puzzle' | 'balancing'>('puzzle');

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Sub-mode Switcher */}
      <div className="flex items-center justify-center">
        <div className="bg-slate-200/80 dark:bg-slate-800/90 p-1 rounded-2xl flex items-center gap-1 border border-slate-300/60 dark:border-slate-700">
          <button
            onClick={() => {
              soundEffects.playClick();
              setSubMode('puzzle');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subMode === 'puzzle'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>Ghép Ô Phản Ứng (6-8 chất)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setSubMode('balancing');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              subMode === 'balancing'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Điền Hệ Số Cân Bằng</span>
          </button>
        </div>
      </div>

      {/* Render Active Game */}
      {subMode === 'puzzle' ? (
        <ReactionPuzzleGame onAddXp={onAddXp} />
      ) : (
        <ReactionBalancingGame onAddXp={onAddXp} />
      )}
    </div>
  );
};
