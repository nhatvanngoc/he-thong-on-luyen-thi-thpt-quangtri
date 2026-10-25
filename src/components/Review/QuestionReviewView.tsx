import React, { useState, useMemo } from 'react';
import { QuestionAttemptRecord, SubjectId } from '../../types/biology';
import { LatexText } from '../Common/LatexText';
import {
  CheckCircle2,
  XCircle,
  Filter,
  Trash2,
  Search,
  BookOpen,
  PieChart,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface QuestionReviewViewProps {
  history: QuestionAttemptRecord[];
  onClearHistory?: () => void;
}

export const QuestionReviewView: React.FC<QuestionReviewViewProps> = ({
  history = [],
  onClearHistory,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'wrong' | 'correct'>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | SubjectId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Summary statistics
  const total = history.length;
  const correctCount = useMemo(() => history.filter((h) => h.isCorrect).length, [history]);
  const wrongCount = total - correctCount;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Filtered list
  const filteredList = useMemo(() => {
    return history.filter((item) => {
      // Status filter
      if (statusFilter === 'wrong' && item.isCorrect) return false;
      if (statusFilter === 'correct' && !item.isCorrect) return false;

      // Subject filter
      if (subjectFilter !== 'all' && item.subject !== subjectFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inQuestion = item.questionText.toLowerCase().includes(query);
        const inExpl = item.explanation.toLowerCase().includes(query);
        const inAnswer = item.userAnswer.toLowerCase().includes(query);
        if (!inQuestion && !inExpl && !inAnswer) return false;
      }

      return true;
    });
  }, [history, statusFilter, subjectFilter, searchQuery]);

  const getSubjectBadge = (sub: SubjectId) => {
    switch (sub) {
      case 'chemistry':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
            Hóa Học 11
          </span>
        );
      case 'history':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            Lịch Sử 11
          </span>
        );
      case 'biology':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Sinh Học 11
          </span>
        );
      case 'physics':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/15 text-violet-600 dark:text-violet-400 border border-violet-500/30">
            Vật Lí 11
          </span>
        );
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');
    return `${hours}:${mins}:${secs}`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Overview Analytics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Tổng số câu đã làm</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
            {total}
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Trả lời đúng</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {correctCount}
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-[11px] font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            <span>Trả lời sai</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            {wrongCount}
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <PieChart className="w-3.5 h-3.5" />
            <span>Độ chính xác</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            {accuracy}%
          </div>
        </div>
      </div>

      {/* Control & Filter Row */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Status Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              Tất cả ({total})
            </button>
            <button
              onClick={() => setStatusFilter('wrong')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                statusFilter === 'wrong'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 hover:bg-rose-100'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Chỉ câu sai ({wrongCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('correct')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1 ${
                statusFilter === 'correct'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chỉ câu đúng ({correctCount})</span>
            </button>
          </div>

          {/* Subject Filter & Clear History */}
          <div className="flex items-center gap-2">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value as any)}
              className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">Tất cả môn học</option>
              <option value="physics">Vật lí 11</option>
              <option value="chemistry">Hóa học 11</option>
              <option value="history">Lịch sử 11</option>
              <option value="biology">Sinh học 11</option>
            </select>

            {onClearHistory && total > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Xóa lịch sử làm bài"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nội dung câu hỏi, từ khóa, đáp án..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Questions Review List */}
      {filteredList.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-2">
          <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
            {total === 0 ? 'Chưa có câu hỏi nào được lưu lại' : 'Không tìm thấy câu hỏi phù hợp với bộ lọc'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {total === 0
              ? 'Hãy hoàn thành các câu hỏi trong Đấu Trường. Hệ thống sẽ tự động lưu lại từng câu trả lời cùng phân tích đúng/sai để bạn xem lại tại đây!'
              : 'Hãy thử xóa bớt điều kiện lọc hoặc từ khóa tìm kiếm.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map((record, index) => {
            const isCorrect = record.isCorrect;
            return (
              <div
                key={record.id || `${record.questionId}-${index}`}
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5 bg-white dark:bg-slate-900 shadow-sm ${
                  isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/60'
                    : 'border-rose-200 dark:border-rose-900/60'
                }`}
              >
                {/* Header of Question Card */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                          : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Đúng</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Sai</span>
                        </>
                      )}
                    </span>

                    {getSubjectBadge(record.subject)}

                    <span className="text-slate-400 text-[11px]">
                      Câu {record.questionId} • {record.type.toUpperCase()}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {formatTime(record.timestamp)}
                  </span>
                </div>

                {/* Question Prompt */}
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                  <LatexText text={record.questionText} />
                </div>

                {/* Question Image Attachment */}
                {record.imageUrl && (
                  <div className="my-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-center max-w-md mx-auto">
                    <img
                      src={record.imageUrl}
                      alt={record.imageCaption || 'Hình ảnh câu hỏi'}
                      className="max-h-48 mx-auto rounded-lg object-contain bg-white"
                      loading="lazy"
                    />
                    {record.imageCaption && (
                      <p className="mt-1 text-[11px] italic text-slate-500 dark:text-slate-400">
                        📷 {record.imageCaption}
                      </p>
                    )}
                  </div>
                )}


                {/* Answers Comparison Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {/* User Answer */}
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                      Lựa chọn của bạn:
                    </div>
                    <div className="font-semibold break-words">
                      <LatexText text={record.userAnswer} />
                    </div>
                  </div>

                  {/* Correct Answer */}
                  <div className="p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">
                      Đáp án chính xác:
                    </div>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400 break-words">
                      <LatexText text={record.correctAnswer} />
                    </div>
                  </div>
                </div>

                {/* Detailed Explanation */}
                {record.explanation && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-slate-100">Giải thích chi tiết: </span>
                    <LatexText text={record.explanation} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
