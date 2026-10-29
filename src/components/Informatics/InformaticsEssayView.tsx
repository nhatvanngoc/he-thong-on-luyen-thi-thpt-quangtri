import React from 'react';
import { BookOpen, Monitor } from 'lucide-react';
import { INFORMATICS_ESSAY_QUESTIONS } from '../../data/informaticsEssayBank';

const cardClass = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900';

export const InformaticsEssayView: React.FC = () => (
  <section className="space-y-5">
    <div className={`${cardClass} border-cyan-200 bg-cyan-50/70 dark:border-cyan-900/60 dark:bg-cyan-950/20`}>
      <div className="flex items-start gap-3">
        <Monitor className="mt-1 h-5 w-5 shrink-0 text-cyan-600" />
        <div>
          <h1 className="text-xl font-bold">Tự luận Tin học 11</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{INFORMATICS_ESSAY_QUESTIONS.length} câu trả lời theo ý ngắn. Tự trình bày trước, sau đó mở từng câu để đối chiếu.</p>
        </div>
      </div>
    </div>
    <div className="space-y-4">
      {INFORMATICS_ESSAY_QUESTIONS.map((question, index) => (
        <details key={question.id} className={cardClass}>
          <summary className="cursor-pointer list-none">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Câu {index + 1}</span>
              <span className="text-xs text-slate-500">{question.topic}</span>
            </div>
            <h2 className="mt-2 text-base font-bold leading-6">{question.prompt}</h2>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300"><BookOpen className="h-3.5 w-3.5" /> Bấm để mở gợi ý trả lời</span>
          </summary>
          <ol className="mt-4 space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            {question.solution.map((step, stepIndex) => (
              <li key={`${question.id}-${stepIndex}`} className="flex gap-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <span className="font-bold text-cyan-600">{stepIndex + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </details>
      ))}
    </div>
  </section>
);
