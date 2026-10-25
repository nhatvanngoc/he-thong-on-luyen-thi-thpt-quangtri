import { PHYSICS_MCQ_QUESTIONS, PHYSICS_TRUE_FALSE_QUESTIONS, PHYSICS_SHORT_ANSWER_QUESTIONS, PHYSICS_FLASHCARDS } from '../src/data/physicsQuestionBank';
import { CHEMISTRY_MCQ_QUESTIONS, CHEMISTRY_TRUE_FALSE_QUESTIONS, CHEMISTRY_SHORT_ANSWER_QUESTIONS, CHEMISTRY_FLASHCARDS } from '../src/data/chemistryQuestionBank';

const patterns = [
  { name: 'rad/s without math', regex: /(?<!\$[^$]*)\b(rad\/s|m\/s\^2|cm\/s\^2|m\/s2|cm\/s2)\b(?![^$]*\$)/ },
  { name: 'cos/sin function without math', regex: /(?<!\$[^$]*)\b(cos|sin)\s*\([^)]+\)(?![^$]*\$)/ },
  { name: 'omega without math', regex: /(?<!\$[^$]*)\b(omega|alpha|beta)\b(?![^$]*\$)/ },
  { name: 'pi without math', regex: /(?<!\$[^$]*)\b(\d*\s*pi)\b(?![^$]*\$)/i },
  { name: 'unwrapped formula', regex: /(?<!\$[^$]*)\b(x\s*=\s*A|v\s*=\s*-\s*\w+|W_t\s*=|W_d\s*=|W_đ\s*=)(?![^$]*\$)/ }
];

function checkString(sub: string, id: any, field: string, text: string | undefined) {
  if (!text) return;
  // Exclude strings that already contain $
  patterns.forEach(p => {
    // Only search in parts outside of $...$
    const cleanText = text.replace(/\$\$[\s\S]*?\$\$/g, '').replace(/\$[^\$]+?\$/g, '');
    if (p.regex.test(cleanText)) {
      console.log(`[${sub} #${id}] ${field}: matched "${p.name}"`);
      console.log(`   Sample: ${cleanText.slice(0, 100)}...`);
    }
  });
}

function scanAll(sub: string, list: any[]) {
  list.forEach(q => {
    checkString(sub, q.id, 'question', q.question || q.front);
    checkString(sub, q.id, 'explanation', q.explanation || q.back);
    if (q.options) {
      Object.entries(q.options).forEach(([k, v]) => checkString(sub, q.id, `options.${k}`, v as string));
    }
    if (q.statements) {
      q.statements.forEach((s: any, idx: number) => checkString(sub, q.id, `statements[${idx}]`, s.text));
    }
  });
}

console.log('--- Scanning Physics ---');
scanAll('Phys MCQ', PHYSICS_MCQ_QUESTIONS);
scanAll('Phys TF', PHYSICS_TRUE_FALSE_QUESTIONS);
scanAll('Phys Short', PHYSICS_SHORT_ANSWER_QUESTIONS);
scanAll('Phys Flash', PHYSICS_FLASHCARDS);

console.log('\n--- Scanning Chemistry ---');
scanAll('Chem MCQ', CHEMISTRY_MCQ_QUESTIONS);
scanAll('Chem TF', CHEMISTRY_TRUE_FALSE_QUESTIONS);
scanAll('Chem Short', CHEMISTRY_SHORT_ANSWER_QUESTIONS);
scanAll('Chem Flash', CHEMISTRY_FLASHCARDS);
