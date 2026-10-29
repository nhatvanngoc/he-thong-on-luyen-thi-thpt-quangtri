import { MULTIPLE_CHOICE_QUESTIONS, TRUE_FALSE_QUESTIONS, SHORT_ANSWER_QUESTIONS } from '../src/data/questionBank';
import { CHEMISTRY_MCQ_QUESTIONS, CHEMISTRY_TRUE_FALSE_QUESTIONS, CHEMISTRY_SHORT_ANSWER_QUESTIONS } from '../src/data/chemistryQuestionBank';
import { CHEMISTRY_EXTRA_MCQ_QUESTIONS } from '../src/data/chemistryAdditionalQuestions';
import { HISTORY_MCQ_QUESTIONS, HISTORY_TRUE_FALSE_QUESTIONS } from '../src/data/historyQuestionBank';
import { PHYSICS_MCQ_QUESTIONS, PHYSICS_TRUE_FALSE_QUESTIONS, PHYSICS_SHORT_ANSWER_QUESTIONS } from '../src/data/physicsQuestionBank';
import { INFORMATICS_MCQ_QUESTIONS, INFORMATICS_TRUE_FALSE_QUESTIONS } from '../src/data/informaticsQuestionBank';

interface Finding {
  subject: string;
  type: string;
  id: number;
  issue: string;
  detail: string;
}

const findings: Finding[] = [];

function auditSubject(
  subjectName: string,
  mcqList: any[],
  tfList: any[],
  shortList: any[] = []
) {
  console.log(`\n=================== AUDITING ${subjectName.toUpperCase()} ===================`);

  // 1. Audit MCQ
  mcqList.forEach((q) => {
    // Check valid key
    if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
      findings.push({
        subject: subjectName,
        type: 'MCQ',
        id: q.id,
        issue: 'Invalid correctAnswer key',
        detail: `Key is ${q.correctAnswer}`,
      });
    }

    if (!q.options[q.correctAnswer]) {
      findings.push({
        subject: subjectName,
        type: 'MCQ',
        id: q.id,
        issue: 'correctAnswer option text is empty',
        detail: `options[${q.correctAnswer}] does not exist`,
      });
    }

    // Check if explanation explicitly mentions another answer letter
    const exp = q.explanation || '';
    const mentionMatch = exp.match(/(?:Đáp án|Phương án|Chọn|Do đó chọn|Câu trả lời đúng là)\s*([A-D])\b/i);
    if (mentionMatch) {
      const mentionedLetter = mentionMatch[1].toUpperCase();
      if (mentionedLetter !== q.correctAnswer) {
        findings.push({
          subject: subjectName,
          type: 'MCQ',
          id: q.id,
          issue: 'Explanation mentions different option letter',
          detail: `Key is '${q.correctAnswer}' but explanation explicitly says '${mentionedLetter}': "${exp.slice(0, 120)}..."`,
        });
      }
    }
  });

  // 2. Audit True/False
  tfList.forEach((q) => {
    if (!q.statements || q.statements.length !== 4) {
      findings.push({
        subject: subjectName,
        type: 'True/False',
        id: q.id,
        issue: 'Statement count is not 4',
        detail: `Has ${q.statements?.length} statements`,
      });
    }

    q.statements?.forEach((st: any) => {
      const exp = (st.explanation || '').trim();
      // Check if explanation starts with "Đúng" or "Sai" but boolean is opposite
      const lowerExp = exp.toLowerCase();
      if (lowerExp.startsWith('đúng') && st.isCorrect === false) {
        findings.push({
          subject: subjectName,
          type: 'True/False',
          id: q.id,
          issue: `Statement (${st.subId}) marked FALSE but explanation says 'Đúng'`,
          detail: `Statement: "${st.text}". Exp: "${exp}"`,
        });
      }
      if (lowerExp.startsWith('sai') && st.isCorrect === true) {
        findings.push({
          subject: subjectName,
          type: 'True/False',
          id: q.id,
          issue: `Statement (${st.subId}) marked TRUE but explanation says 'Sai'`,
          detail: `Statement: "${st.text}". Exp: "${exp}"`,
        });
      }
    });
  });

  // 3. Audit Short Answer
  shortList.forEach((q) => {
    if (q.detailedItemAnalysis) {
      const trueItems = q.detailedItemAnalysis.filter((item: any) => item.isCorrect);
      const trueCount = trueItems.length;

      // Check if question asks counting items in detailedItemAnalysis (e.g. Biology "bao nhiêu nhận định đúng")
      const isCountQuestion = q.question.toLowerCase().includes('bao nhiêu nhận định đúng') ||
                              q.question.toLowerCase().includes('bao nhiêu phát biểu đúng');
      if (isCountQuestion && Number(q.correctCountOrValue) !== trueCount) {
        findings.push({
          subject: subjectName,
          type: 'Short Answer',
          id: q.id,
          issue: 'correctCountOrValue mismatch with detailedItemAnalysis',
          detail: `correctCountOrValue is ${q.correctCountOrValue} but detailedItemAnalysis has ${trueCount} true items (Items: ${trueItems.map((i: any) => i.index).join(', ')})`,
        });
      }

      // Check individual items
      q.detailedItemAnalysis.forEach((item: any) => {
        const reason = (item.reason || '').toLowerCase().trim();
        if (reason.startsWith('đúng') && item.isCorrect === false) {
          findings.push({
            subject: subjectName,
            type: 'Short Answer',
            id: q.id,
            issue: `Item (${item.index}) marked FALSE but reason says 'Đúng'`,
            detail: `Statement: "${item.statement}". Reason: "${item.reason}"`,
          });
        }
        if (reason.startsWith('sai') && item.isCorrect === true) {
          findings.push({
            subject: subjectName,
            type: 'Short Answer',
            id: q.id,
            issue: `Item (${item.index}) marked TRUE but reason says 'Sai'`,
            detail: `Statement: "${item.statement}". Reason: "${item.reason}"`,
          });
        }
      });
    }
  });
}

auditSubject('Sinh học', MULTIPLE_CHOICE_QUESTIONS, TRUE_FALSE_QUESTIONS, SHORT_ANSWER_QUESTIONS);
auditSubject('Hóa học', [...CHEMISTRY_MCQ_QUESTIONS, ...CHEMISTRY_EXTRA_MCQ_QUESTIONS], CHEMISTRY_TRUE_FALSE_QUESTIONS, CHEMISTRY_SHORT_ANSWER_QUESTIONS);
auditSubject('Lịch sử', HISTORY_MCQ_QUESTIONS, HISTORY_TRUE_FALSE_QUESTIONS, []);
auditSubject('Vật lí', PHYSICS_MCQ_QUESTIONS, PHYSICS_TRUE_FALSE_QUESTIONS, PHYSICS_SHORT_ANSWER_QUESTIONS);
auditSubject('Tin học', INFORMATICS_MCQ_QUESTIONS, INFORMATICS_TRUE_FALSE_QUESTIONS, []);

console.log(`\n=================== TOTAL FINDINGS: ${findings.length} ===================`);
findings.forEach((f, idx) => {
  console.log(`\n#${idx + 1}. [${f.subject} - ${f.type} - Câu ${f.id}]`);
  console.log(`   Vấn đề: ${f.issue}`);
  console.log(`   Chi tiết: ${f.detail}`);
});
