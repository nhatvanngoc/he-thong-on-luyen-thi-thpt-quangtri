import katex from 'katex';
import { 
  MULTIPLE_CHOICE_QUESTIONS as BIO_MCQ, 
  TRUE_FALSE_QUESTIONS as BIO_TF, 
  SHORT_ANSWER_QUESTIONS as BIO_SHORT,
  ESSAY_FLASHCARDS as BIO_FLASH 
} from '../src/data/questionBank';
import { 
  CHEMISTRY_MCQ_QUESTIONS as CHEM_MCQ, 
  CHEMISTRY_TRUE_FALSE_QUESTIONS as CHEM_TF, 
  CHEMISTRY_SHORT_ANSWER_QUESTIONS as CHEM_SHORT,
  CHEMISTRY_FLASHCARDS as CHEM_FLASH
} from '../src/data/chemistryQuestionBank';
import { 
  PHYSICS_MCQ_QUESTIONS as PHYS_MCQ, 
  PHYSICS_TRUE_FALSE_QUESTIONS as PHYS_TF, 
  PHYSICS_SHORT_ANSWER_QUESTIONS as PHYS_SHORT,
  PHYSICS_FLASHCARDS as PHYS_FLASH
} from '../src/data/physicsQuestionBank';
import { 
  HISTORY_MCQ_QUESTIONS as HIST_MCQ, 
  HISTORY_TRUE_FALSE_QUESTIONS as HIST_TF 
} from '../src/data/historyQuestionBank';

interface LatexIssue {
  subject: string;
  type: string;
  id: string | number;
  field: string;
  latex: string;
  error: string;
}

const issues: LatexIssue[] = [];

function checkText(subject: string, type: string, id: string | number, field: string, text: string | undefined) {
  if (!text) return;
  
  // Find all $...$ and $$...$$
  const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    const isBlock = raw.startsWith('$$');
    let math = isBlock ? raw.slice(2, -2).trim() : raw.slice(1, -1).trim();

    // Normalization identical to LatexText.tsx
    math = math.replace(/\\+([a-zA-Z]+)/g, (_, p1) => '\\' + p1);
    math = math.replace(/∆H/g, '\\Delta H');
    math = math.replace(/∆/g, '\\Delta ');

    try {
      katex.renderToString(math, {
        displayMode: isBlock,
        throwOnError: true,
        strict: false
      });
    } catch (err: any) {
      issues.push({
        subject,
        type,
        id,
        field,
        latex: raw,
        error: err.message
      });
    }
  }

  // Also check for unclosed single dollars (odd count of $)
  const dollarCount = (text.match(/\$/g) || []).length;
  if (dollarCount % 2 !== 0) {
    issues.push({
      subject,
      type,
      id,
      field,
      latex: text,
      error: `Odd number of dollar signs (${dollarCount}): unclosed LaTeX delimiter!`
    });
  }
}

function scanQuestionList(subject: string, type: string, list: any[]) {
  if (!list) return;
  for (const q of list) {
    checkText(subject, type, q.id, 'question', q.question);
    checkText(subject, type, q.id, 'explanation', q.explanation);
    checkText(subject, type, q.id, 'corePrinciple', q.corePrinciple);
    checkText(subject, type, q.id, 'trapWarning', q.trapWarning);
    
    if (q.options) {
      Object.entries(q.options).forEach(([k, v]) => {
        checkText(subject, type, q.id, `options.${k}`, v as string);
      });
    }
    if (q.statements) {
      q.statements.forEach((s: any, idx: number) => {
        checkText(subject, type, q.id, `statements[${idx}].text`, s.text);
        checkText(subject, type, q.id, `statements[${idx}].explanation`, s.explanation);
      });
    }
    if (q.subQuestions) {
      q.subQuestions.forEach((sq: any, idx: number) => {
        checkText(subject, type, q.id, `subQuestions[${idx}].question`, sq.question);
        checkText(subject, type, q.id, `subQuestions[${idx}].explanation`, sq.explanation);
      });
    }
  }
}

function scanFlashcards(subject: string, list: any[]) {
  if (!list) return;
  for (const fc of list) {
    checkText(subject, 'Flashcard', fc.id, 'front/title', fc.front || fc.title);
    checkText(subject, 'Flashcard', fc.id, 'back/content', fc.back || fc.content || fc.summary);
    if (fc.details) checkText(subject, 'Flashcard', fc.id, 'details', fc.details);
    if (fc.keyTakeaway) checkText(subject, 'Flashcard', fc.id, 'keyTakeaway', fc.keyTakeaway);
  }
}

scanQuestionList('Biology', 'MCQ', BIO_MCQ);
scanQuestionList('Biology', 'TF', BIO_TF);
scanQuestionList('Biology', 'Short', BIO_SHORT);
scanFlashcards('Biology', BIO_FLASH);

scanQuestionList('Chemistry', 'MCQ', CHEM_MCQ);
scanQuestionList('Chemistry', 'TF', CHEM_TF);
scanQuestionList('Chemistry', 'Short', CHEM_SHORT);
scanFlashcards('Chemistry', CHEM_FLASH);

scanQuestionList('Physics', 'MCQ', PHYS_MCQ);
scanQuestionList('Physics', 'TF', PHYS_TF);
scanQuestionList('Physics', 'Short', PHYS_SHORT);
scanFlashcards('Physics', PHYS_FLASH);

scanQuestionList('History', 'MCQ', HIST_MCQ);
scanQuestionList('History', 'TF', HIST_TF);

console.log(`\n========================================`);
console.log(`AUDIT FINISHED. TOTAL LATEX ISSUES: ${issues.length}`);
console.log(`========================================\n`);

issues.forEach((issue, idx) => {
  console.log(`[#${idx + 1}] Subject: ${issue.subject} | Type: ${issue.type} | ID: ${issue.id} | Field: ${issue.field}`);
  console.log(`    LaTeX: ${issue.latex}`);
  console.log(`    Error: ${issue.error}`);
  console.log('---');
});
