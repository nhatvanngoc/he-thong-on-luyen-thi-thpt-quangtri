import React, { useMemo, useState } from 'react';
import { BookOpen, Check, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { HISTORY_ESSAY_QUESTIONS } from '../../data/historyEssayBank';

interface HistoryEssayViewProps {
  mode: 'study' | 'exam';
}

const cardClass = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900';

const shuffle = <T,>(items: T[]) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const makeOptionSets = () => Object.fromEntries(HISTORY_ESSAY_QUESTIONS.map((question) => [
  question.id,
  shuffle([
    ...question.keyPoints.map((text) => ({ text, isCorrect: true })),
    ...question.distractors.map((text) => ({ text, isCorrect: false })),
  ]),
]));

export const HistoryEssayView: React.FC<HistoryEssayViewProps> = ({ mode }) => {
  const [order, setOrder] = useState<number[]>(() => HISTORY_ESSAY_QUESTIONS.map((_, index) => index));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Record<number, string[]>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [optionSets, setOptionSets] = useState(makeOptionSets);
  const [finished, setFinished] = useState(false);
  const current = HISTORY_ESSAY_QUESTIONS[order[index]];

  const score = useMemo(() => HISTORY_ESSAY_QUESTIONS.reduce((sum, question) => {
    if (!submitted[question.id]) return sum;
    const choices = optionSets[question.id] || [];
    const answers = selected[question.id] || [];
    const isCorrect = choices.filter((choice) => choice.isCorrect).every((choice) => answers.includes(choice.text))
      && answers.every((answer) => choices.some((choice) => choice.text === answer && choice.isCorrect));
    return sum + (isCorrect ? 1 : 0);
  }, 0), [optionSets, selected, submitted]);
  const maxScore = HISTORY_ESSAY_QUESTIONS.length;
  const completedCount = Object.values(submitted).filter(Boolean).length;

  const startAgain = () => {
    setOrder(HISTORY_ESSAY_QUESTIONS.map((_, i) => i).sort(() => Math.random() - 0.5));
    setIndex(0);
    setSelected({});
    setSubmitted({});
    setOptionSets(makeOptionSets());
    setFinished(false);
  };

  if (mode === 'study') {
    return (
      <section className="space-y-5">
        <div className={`${cardClass} border-amber-200 bg-amber-50/70 dark:border-amber-900/60 dark:bg-amber-950/20`}>
          <div className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h1 className="text-xl font-bold">Ôn tự luận Lịch sử</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{HISTORY_ESSAY_QUESTIONS.length} câu trọng tâm được tổng hợp từ đề cương giữa kì bạn gửi. Đây là tài liệu ôn tập, không phải dự đoán chắc chắn đề thi.</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {HISTORY_ESSAY_QUESTIONS.map((question, i) => (
            <details key={question.id} className={cardClass} open={i === 0}>
              <summary className="cursor-pointer list-none">
                <span className="mr-2 text-xs font-bold uppercase tracking-wide text-amber-600">Câu {i + 1} · {question.topic}</span>
                <h2 className="mt-2 text-base font-bold">{question.title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{question.prompt}</p>
              </summary>
              <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{question.answer.map((point) => <li key={point} className="flex gap-2"><span className="font-bold text-amber-600">•</span><span>{point}</span></li>)}</ul>
              </div>
            </details>
          ))}
        </div>
      </section>
    );
  }

  if (finished) {
    return (
      <section className={`${cardClass} mx-auto max-w-2xl text-center`}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><Check className="h-7 w-7" /></div>
        <h1 className="mt-4 text-2xl font-extrabold">Hoàn thành bài kiểm tra</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Số câu chọn đúng hoàn toàn: <strong className="text-emerald-600">{score}/{maxScore}</strong>.</p>
        <button onClick={startAgain} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 font-semibold text-white hover:bg-amber-700"><RotateCcw className="h-4 w-4" /> Làm đề khác</button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div className={`${cardClass} flex items-center justify-between gap-3`}>
        <div><p className="text-xs font-bold uppercase tracking-wide text-amber-600">Kiểm tra nhiều đáp án · Lịch sử</p><h1 className="mt-1 text-lg font-bold">Câu {index + 1} / {HISTORY_ESSAY_QUESTIONS.length}</h1></div>
        <div className="text-right text-sm text-slate-500">Đã làm {completedCount}/{maxScore} câu</div>
      </div>
      <article className={cardClass}>
        <p className="text-xs font-semibold text-slate-500">{current.topic}</p>
        <h2 className="mt-2 text-xl font-bold">{current.title}</h2>
        <p className="mt-3 leading-7">{current.prompt}</p>
        <p className="mt-3 text-sm font-medium text-amber-700 dark:text-amber-300">Chọn tất cả phương án đúng. Có thể chọn nhiều đáp án.</p>
        <div className="mt-4 space-y-2">
          {(optionSets[current.id] || []).map((option) => {
            const isSelected = selected[current.id]?.includes(option.text) || false;
            const showResult = submitted[current.id];
            const style = showResult && option.isCorrect
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
              : showResult && isSelected && !option.isCorrect
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30'
                : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70';
            return <label key={option.text} className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${style} ${submitted[current.id] ? 'cursor-default' : 'cursor-pointer'}`}>
              <input type="checkbox" checked={isSelected} disabled={submitted[current.id]} onChange={() => setSelected((previous) => {
                const currentAnswers = previous[current.id] || [];
                return { ...previous, [current.id]: isSelected ? currentAnswers.filter((answer) => answer !== option.text) : [...currentAnswers, option.text] };
              })} className="mt-0.5 accent-amber-600" />
              <span>{option.text}{showResult && option.isCorrect && <strong className="ml-2 text-emerald-700 dark:text-emerald-300">✓ Đúng</strong>}{showResult && isSelected && !option.isCorrect && <strong className="ml-2 text-rose-700 dark:text-rose-300">✗ Chọn sai</strong>}</span>
            </label>;
          })}
        </div>
        {!submitted[current.id] ? <button onClick={() => setSubmitted((previous) => ({ ...previous, [current.id]: true }))} disabled={!selected[current.id]?.length} className="mt-4 rounded-xl bg-amber-600 px-4 py-2.5 font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-40">Nộp đáp án</button> : <p className={`mt-4 font-semibold ${score > 0 && selected[current.id]?.every((answer) => (optionSets[current.id] || []).some((option) => option.text === answer && option.isCorrect)) && selected[current.id]?.length === (optionSets[current.id] || []).filter((option) => option.isCorrect).length ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
          {(() => {
            const options = optionSets[current.id] || [];
            const answers = selected[current.id] || [];
            const correct = options.filter((option) => option.isCorrect);
            const isCorrect = correct.every((option) => answers.includes(option.text)) && answers.every((answer) => options.some((option) => option.text === answer && option.isCorrect));
            return isCorrect ? 'Chính xác!' : 'Chưa chính xác. Các phương án đúng được đánh dấu bên trên.';
          })()}
        </p>}
      </article>
      <div className="flex justify-between gap-3">
        <button onClick={() => setIndex((value) => Math.max(0, value - 1))} disabled={index === 0} className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold disabled:opacity-40 dark:border-slate-700"><ChevronLeft className="h-4 w-4" /> Câu trước</button>
        {index < HISTORY_ESSAY_QUESTIONS.length - 1 ? <button onClick={() => setIndex((value) => value + 1)} disabled={!submitted[current.id]} className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 dark:bg-white dark:text-slate-900">Câu tiếp theo <ChevronRight className="h-4 w-4" /></button> : <button onClick={() => setFinished(true)} disabled={!submitted[current.id]} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Xem kết quả</button>}
      </div>
    </section>
  );
};
