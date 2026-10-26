import React from 'react';
import { Beaker, BookOpen } from 'lucide-react';
import { CHEMISTRY_ESSAY_QUESTIONS } from '../../data/chemistryEssayBank';
import { LatexText } from '../Common/LatexText';

const cardClass = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900';

export const ChemistryEssayView: React.FC = () => (
  <section className="space-y-5">
    <div className={`${cardClass} border-sky-200 bg-sky-50/70 dark:border-sky-900/60 dark:bg-sky-950/20`}>
      <div className="flex items-start gap-3">
        <Beaker className="mt-1 h-5 w-5 shrink-0 text-sky-600" />
        <div>
          <h1 className="text-xl font-bold">Tự luận Hóa học 11</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {CHEMISTRY_ESSAY_QUESTIONS.length} lời giải theo từng bước, tổng hợp từ đề cương và đề minh họa. Mở từng câu để tự làm trước rồi đối chiếu.
          </p>
        </div>
      </div>
    </div>
    <div className="space-y-4">
      {CHEMISTRY_ESSAY_QUESTIONS.map((question, index) => (
        <details key={question.id} className={cardClass}>
          <summary className="cursor-pointer list-none">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">Câu {index + 1}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-800">{question.source}</span>
              <span className="text-xs text-slate-500">{question.topic}</span>
            </div>
            <h2 className="mt-2 text-base font-bold leading-6"><LatexText text={question.prompt} /></h2>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-sky-700 dark:text-sky-300"><BookOpen className="h-3.5 w-3.5" /> Bấm để mở lời giải</span>
          </summary>
          <ol className="mt-4 space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            {question.solution.map((step, stepIndex) => (
              <li key={`${question.id}-${stepIndex}`} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <span className="font-bold text-sky-600">{stepIndex + 1}.</span>
                <LatexText text={step} className="min-w-0 flex-1" />
              </li>
            ))}
          </ol>
        </details>
      ))}
    </div>
  </section>
);
