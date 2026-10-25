import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FlashcardItem } from '../../types/biology';
import { soundEffects } from '../../services/soundEffects';
import {
  RotateCw,
  CheckCircle,
  Sparkles,
  BookOpen,
  Search,
  Shuffle,
  Volume2,
  List,
  X,
  BookmarkCheck,
  RotateCcw,
  Layers,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LatexText } from '../Common/LatexText';

interface FlashcardDeckProps {
  cards: FlashcardItem[];
  masteredIds: number[];
  onToggleMastered: (id: number) => void;
  onAddXp: (amount: number) => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  masteredIds,
  onToggleMastered,
  onAddXp,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'unmastered' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [showListModal, setShowListModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Filtered cards list (without "Lọc:" dropdown - purely status & search)
  const filteredCards = useMemo(() => {
    let list = cards.map((card, originalIdx) => ({ card, originalIdx }));

    // Apply mastery filter
    if (filterMode === 'mastered') {
      list = list.filter((item) => masteredIds.includes(item.card.id));
    } else if (filterMode === 'unmastered') {
      list = list.filter((item) => !masteredIds.includes(item.card.id));
    }

    // Apply search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          (item.card.question && item.card.question.toLowerCase().includes(q)) ||
          (item.card.answer && item.card.answer.toLowerCase().includes(q)) ||
          (item.card.title && item.card.title.toLowerCase().includes(q)) ||
          (item.card.prompt && item.card.prompt.toLowerCase().includes(q))
      );
    }

    // Apply shuffle if active
    if (isShuffled && shuffledIndices.length === list.length) {
      return shuffledIndices.map((idx) => list[idx]).filter(Boolean);
    }

    return list;
  }, [cards, filterMode, searchQuery, isShuffled, shuffledIndices, masteredIds]);

  // Adjust index if out of bounds
  useEffect(() => {
    if (currentIndex >= filteredCards.length && filteredCards.length > 0) {
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [filteredCards.length, currentIndex]);

  const currentItem = filteredCards[currentIndex];
  const currentCard = currentItem?.card;
  const isMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  const handleFlip = useCallback(() => {
    soundEffects.playFlip();
    setIsFlipped((prev) => !prev);
  }, []);

  const handleNext = useCallback(() => {
    if (filteredCards.length <= 1) return;
    soundEffects.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  }, [filteredCards.length]);

  const handlePrev = useCallback(() => {
    if (filteredCards.length <= 1) return;
    soundEffects.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  }, [filteredCards.length]);

  // Toggle shuffle state
  const handleToggleShuffle = () => {
    soundEffects.playClick();
    if (!isShuffled) {
      const len = filteredCards.length;
      const arr = Array.from({ length: len }, (_, i) => i);
      for (let i = len - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setShuffledIndices(arr);
      setIsShuffled(true);
      setCurrentIndex(0);
      setIsFlipped(false);
    } else {
      setIsShuffled(false);
      setShuffledIndices([]);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Minimum swipe threshold 45px
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev]);

  // Handle Mark Mastered
  const handleMarkMastered = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;

    soundEffects.playCorrect();
    onToggleMastered(currentCard.id);

    if (!isMastered) {
      onAddXp(50);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  // Text-to-speech for reading flashcards
  const handleSpeak = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Card Content Extraction
  const cardQuestion = useMemo(() => {
    if (!currentCard) return '';
    return currentCard.question || currentCard.prompt || currentCard.title || 'Câu hỏi';
  }, [currentCard]);

  const cardAnswer = useMemo(() => {
    if (!currentCard) return '';
    if (currentCard.answer) return currentCard.answer;
    if (currentCard.summaryKeyPoints && currentCard.summaryKeyPoints.length > 0) {
      return currentCard.summaryKeyPoints.join('\n• ');
    }
    return '';
  }, [currentCard]);

  // Mastered counts
  const totalCardsCount = cards.length;
  const totalMasteredCount = cards.filter((c) => masteredIds.includes(c.id)).length;
  const masteryPercentage = totalCardsCount > 0 ? Math.round((totalMasteredCount / totalCardsCount) * 100) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 select-none">
      {/* Top Banner & Progress Header */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <BookOpen className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Flashcards Ôn Tập Sách Giáo Khoa ({totalCardsCount} Thẻ)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Mặt trước: Câu hỏi trọng tâm. Mặt sau: Đáp án cốt lõi chuẩn barem. Nhấn thẻ hoặc phím <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] border border-slate-300 dark:border-slate-700">Space</kbd> để lật.
            </p>
          </div>

          {/* Mastery Progress Bar */}
          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Đã thuộc: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{totalMasteredCount}</span> / {totalCardsCount} thẻ
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                {masteryPercentage}%
              </span>
            </div>
            <div className="w-full sm:w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Toolbar: Status Tabs & Quick Actions (Clean, No "Lọc:" Dropdown) */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => {
                soundEffects.playClick();
                setFilterMode('all');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Tất cả ({totalCardsCount})
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setFilterMode('unmastered');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterMode === 'unmastered'
                  ? 'bg-amber-100 dark:bg-amber-600/30 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Chưa thuộc ({totalCardsCount - totalMasteredCount})
            </button>
            <button
              onClick={() => {
                soundEffects.playClick();
                setFilterMode('mastered');
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                filterMode === 'mastered'
                  ? 'bg-emerald-100 dark:bg-emerald-600/30 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Đã thuộc ({totalMasteredCount})
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Shuffle Button */}
            <button
              onClick={handleToggleShuffle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer font-medium ${
                isShuffled
                  ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title="Xáo trộn thứ tự các thẻ để rèn luyện trí nhớ ngẫu nhiên"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>{isShuffled ? 'Đang xáo' : 'Xáo trộn'}</span>
            </button>

            {/* Quick List Overview Modal Trigger */}
            <button
              onClick={() => setShowListModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer font-medium"
              title="Xem toàn bộ danh sách các câu hỏi & đáp án"
            >
              <List className="w-3.5 h-3.5" />
              <span>Danh sách</span>
            </button>
          </div>
        </div>

        {/* Live Search Input - 16px font on mobile to prevent iOS zoom */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            placeholder="Tìm kiếm từ khóa câu hỏi hoặc đáp án..."
            className="w-full pl-8 pr-8 py-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Flashcard Container */}
      {filteredCards.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl">
          <Lightbulb className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-60" />
          <p className="text-slate-800 dark:text-slate-300 font-semibold mb-1">Không tìm thấy thẻ nào phù hợp</p>
          <p className="text-xs text-slate-500 mb-4">
            Thử thay đổi trạng thái hoặc xóa từ khóa tìm kiếm để tiếp tục ôn tập.
          </p>
          <button
            onClick={() => {
              setFilterMode('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Hiển thị tất cả thẻ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 3D Flipping Card with Mobile Touch Swipe & Tap to Flip */}
          <div className="relative min-h-[450px] sm:min-h-[490px] md:min-h-[530px] perspective-1000">
            <div
              onClick={handleFlip}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className={`relative w-full min-h-[450px] sm:min-h-[490px] md:min-h-[530px] rounded-3xl transition-transform duration-500 transform-style-3d cursor-pointer shadow-xl select-none ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD (QUESTION) */}
              <div
                className={`absolute inset-0 w-full h-full p-4 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 backface-hidden flex flex-col justify-between shadow-lg ${
                  isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div>
                  {/* Front Card Top Header */}
                  <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                        Thẻ {currentIndex + 1} / {filteredCards.length}
                      </span>
                      <span className="px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {currentCard?.topicLabel || (currentCard?.topic === 'history1' ? 'CĐ 1: CM Tư Sản & CNTB' : 'CĐ 2: CNXH & Liên Xô')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {isMastered && (
                        <span className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 sm:px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-600/60">
                          <CheckCircle className="w-3.5 h-3.5" /> Đã Thuộc
                        </span>
                      )}
                      <button
                        onClick={(e) => handleSpeak(cardQuestion, e)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSpeaking
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title="Nghe đọc câu hỏi"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Front Card Center: Question */}
                  <div className="my-auto py-4 sm:py-8 flex flex-col items-center justify-center text-center">
                    <span className="text-xs uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mb-2 sm:mb-3 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" /> CÂU HỎI TRỌNG TÂM #{currentCard?.id}
                    </span>
                    <h3 className="text-base sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-relaxed max-w-2xl px-2">
                      <LatexText text={cardQuestion} />
                    </h3>
                  </div>
                </div>

                {/* Front Card Bottom Hint - Mobile friendly */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[11px] sm:text-xs">
                    <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                    <span className="sm:hidden">Chạm để lật • Vuốt để chuyển</span>
                    <span className="hidden sm:inline">Nhấn để lật xem đáp án</span>
                  </span>
                  <span className="hidden sm:inline font-mono text-[11px]">
                    Phím tắt: [Space] Lật • [←] [→] Chuyển thẻ
                  </span>
                </div>
              </div>

              {/* BACK OF CARD (DETAILED EXPLANATION & ANSWER) */}
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute inset-0 w-full h-full p-4 sm:p-8 rounded-3xl border-2 border-emerald-400/80 dark:border-emerald-500/50 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 rotate-y-180 backface-hidden flex flex-col justify-between overflow-y-auto shadow-2xl ${
                  !isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                <div>
                  {/* Back Card Top Header */}
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-emerald-200/80 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-emerald-600 text-white dark:bg-emerald-500/25 dark:text-emerald-300 border border-emerald-600 dark:border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                        <BookmarkCheck className="w-4 h-4 text-white dark:text-emerald-400" />
                        ĐÁP ÁN & GIẢI THÍCH CHI TIẾT #{currentCard?.id}
                      </span>
                      <span className="px-3 py-1 rounded-xl text-xs sm:text-sm font-semibold bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                        {currentCard?.topicLabel || (currentCard?.topic === 'history1' ? 'CĐ 1: CM Tư Sản & CNTB' : currentCard?.topic === 'history2' ? 'CĐ 2: CNXH & Liên Xô' : currentCard?.topic)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleSpeak(cardAnswer, e)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer shadow-sm ${
                          isSpeaking
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title="Nghe đọc đáp án chi tiết"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Back Card Answer Content - Large, Ultra-Readable Font Size with LaTeX */}
                  <div className="p-6 sm:p-7 md:p-8 rounded-2xl bg-white/95 dark:bg-slate-950/90 border border-emerald-200/90 dark:border-emerald-500/30 my-3 shadow-md">
                    <LatexText
                      text={cardAnswer}
                      as="div"
                      className="text-base sm:text-xl md:text-2xl text-slate-900 dark:text-emerald-50 font-medium sm:font-semibold leading-relaxed sm:leading-loose whitespace-pre-line tracking-wide"
                    />

                    {/* Image Diagram if present */}
                    {currentCard?.imageUrl && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900 p-2 sm:p-3 shadow-sm text-center max-w-lg mx-auto">
                        <img
                          src={currentCard.imageUrl}
                          alt={currentCard.imageCaption || 'Sơ đồ hình ảnh minh họa'}
                          className="max-h-60 mx-auto rounded-lg object-contain bg-white"
                          loading="lazy"
                        />
                        {currentCard.imageCaption && (
                          <p className="mt-2 text-xs italic text-slate-600 dark:text-slate-400 font-medium">
                            📷 {currentCard.imageCaption}
                          </p>
                        )}
                      </div>
                    )}
                  </div>


                  {/* Optional Keypoints or Essay Subquestions if present - Also Enlarged */}
                  {currentCard?.subQuestions && currentCard.subQuestions.length > 0 && (
                    <div className="mt-4 space-y-2.5">
                      <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Chi tiết các luận điểm phân tích cốt lõi:</span>
                      </div>
                      <div className="space-y-2">
                        {currentCard.subQuestions.map((sq, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm sm:text-base md:text-lg text-slate-800 dark:text-slate-100 leading-relaxed shadow-sm"
                          >
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 mr-2 text-base sm:text-lg">
                              {sq.label}:
                            </span>
                            <span className="font-medium"><LatexText text={sq.fullAnswer} /></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Back Card Action Footer */}
                <div className="mt-5 pt-4 border-t border-emerald-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleFlip}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Lật lại câu hỏi</span>
                  </button>

                  <button
                    onClick={handleMarkMastered}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md ${
                      isMastered
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 hover:bg-emerald-600/25'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isMastered ? '✓ Đã thuộc thẻ này' : 'Đánh dấu đã thuộc (+50 XP)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation Deck Controls - Mobile Thumb Friendly */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <button
              onClick={handlePrev}
              disabled={filteredCards.length <= 1}
              className="flex items-center justify-center gap-1.5 h-11 sm:h-auto px-3 sm:px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95 touch-manipulation"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Thẻ trước</span>
            </button>

            {/* Quick Card Stepper */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span className="text-slate-900 dark:text-white font-bold">{currentIndex + 1}</span>/{filteredCards.length}
              </span>
              <button
                onClick={handleFlip}
                className="h-11 sm:h-auto px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 touch-manipulation shadow-sm"
              >
                <RotateCw className="w-4 h-4" />
                <span>{isFlipped ? 'Câu hỏi' : 'Đáp án'}</span>
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={filteredCards.length <= 1}
              className="flex items-center justify-center gap-1.5 h-11 sm:h-auto px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md active:scale-95 touch-manipulation"
            >
              <span className="hidden sm:inline">Thẻ tiếp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Overview Modal / Drawer */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Danh Sách Toàn Bộ {cards.length} Thẻ Flashcard
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Nhấn vào bất kỳ câu nào để chuyển nhanh đến thẻ đó
                </p>
              </div>
              <button
                onClick={() => setShowListModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Card List */}
            <div className="p-4 overflow-y-auto space-y-2 divide-y divide-slate-100 dark:divide-slate-800/60">
              {cards.map((card) => {
                const mastered = masteredIds.includes(card.id);
                return (
                  <div
                    key={card.id}
                    onClick={() => {
                      const foundIdx = filteredCards.findIndex((fc) => fc.card.id === card.id);
                      if (foundIdx !== -1) {
                        setCurrentIndex(foundIdx);
                      } else {
                        // Reset filters to show it
                        setFilterMode('all');
                        setSearchQuery('');
                        const resetIdx = cards.findIndex((c) => c.id === card.id);
                        setCurrentIndex(resetIdx >= 0 ? resetIdx : 0);
                      }
                      setIsFlipped(false);
                      setShowListModal(false);
                      soundEffects.playClick();
                    }}
                    className="pt-2.5 pb-2.5 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="shrink-0 w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                        {card.id}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                          {card.question || card.prompt || card.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {card.answer || (card.summaryKeyPoints ? card.summaryKeyPoints[0] : '')}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {mastered ? (
                        <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-600/40 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Thuộc
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Chưa thuộc</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
