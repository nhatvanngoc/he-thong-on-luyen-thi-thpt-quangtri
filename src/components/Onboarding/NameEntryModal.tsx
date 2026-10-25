import React, { useState } from 'react';
import { soundEffects } from '../../services/soundEffects';

interface NameEntryModalProps {
  isOpen: boolean;
  initialName?: string;
  onSave: (name: string) => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const NameEntryModal: React.FC<NameEntryModalProps> = ({
  isOpen,
  initialName = '',
  onSave,
  onClose,
  canDismiss = false,
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Vui lòng nhập họ và tên của bạn');
      soundEffects.playIncorrect();
      return;
    }

    soundEffects.playClick();
    onSave(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="space-y-1 text-center">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Nhập Họ Và Tên
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Để lưu điểm và theo dõi tiến độ học tập
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Họ và tên..."
              className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-base sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
            />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 sm:py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md active:scale-[0.98]"
          >
            Bắt Đầu Ôn Tập
          </button>

          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-1 text-center text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Hủy
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
