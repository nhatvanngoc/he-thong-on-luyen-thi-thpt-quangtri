const fs = require('fs');

const allMcqs = JSON.parse(fs.readFileSync('/tmp/all_mcqs.json', 'utf8')).slice(0, 100);

console.log('Extracting 100 MCQs...');

// Function to clean and parse an MCQ
function parseMcq(q, index) {
  const fullText = q.lines.join(' ');
  const text = fullText.replace(/^Câu\s+\d+[\.:]\s*/, '').trim();

  // Find A., B., C., D.
  let aIdx = text.search(/\bA[\.\)]\s+/);
  let bIdx = text.search(/\bB[\.\)]\s+/);
  let cIdx = text.search(/\bC[\.\)]\s+/);
  let dIdx = text.search(/\bD[\.\)]\s+/);

  // Special cases if regex didn't catch due to typo
  if (aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1) {
    if (q.num === 53) {
      return {
        id: q.num,
        part: 'I',
        topic: 'chem2',
        difficulty: 'ThongHieu',
        question: 'Theo thuyết Brønsted – Lowry chất nào sau đây là chất lưỡng tính?',
        options: {
          A: '$Mg^{2+}$',
          B: '$NH_3$',
          C: '$HCO_3^-$',
          D: '$SO_3^{2-}$',
        },
        correctAnswer: 'C',
        explanation: 'Ion $HCO_3^-$ là chất lưỡng tính theo Brønsted – Lowry vì vừa có khả năng nhường proton $H^+$ (tính acid: $HCO_3^- \\rightleftharpoons H^+ + CO_3^{2-}$), vừa có khả năng nhận proton $H^+$ (tính base: $HCO_3^- + H^+ \\rightleftharpoons H_2CO_3$).',
        corePrinciple: 'Chất lưỡng tính là chất vừa có khả năng cho vừa có khả năng nhận proton $H^+$.',
        trapWarning: 'Không nhầm lẫn với $NH_3$ (chỉ nhận $H^+$ -> base) hay $SO_3^{2-}$ (base).',
        sgkReference: 'Hóa học 11 - Bài 2: Cân bằng trong dung dịch nước',
      };
    }
    if (q.num === 96) {
      return {
        id: q.num,
        part: 'I',
        topic: 'chem3',
        difficulty: 'NhanBiet',
        question: 'Phú dưỡng là hiện tượng dư thừa quá nhiều các nguyên tố dinh dưỡng nào trong các nguồn nước?',
        options: {
          A: 'N, C',
          B: 'N, K',
          C: 'N, P',
          D: 'P, K',
        },
        correctAnswer: 'C',
        explanation: 'Hiện tượng phú dưỡng (eutrophication) là hiện tượng ao, hồ dư thừa quá nhiều các nguyên tố dinh dưỡng **Nitrogen (N)** và **Phosphorus (P)** từ phân bón nông nghiệp chảy tràn và nước thải sinh hoạt.',
        corePrinciple: 'Hai nguyên tố gây hiện tượng phú dưỡng nguồn nước là Nitrogen và Phosphorus.',
        trapWarning: 'Không chọn Carbon (C) hoặc Potassium (K).',
        sgkReference: 'Hóa học 11 - Bài 4: Hiện tượng phú dưỡng',
      };
    }
  }

  let prompt = text.substring(0, aIdx).trim();
  let optA = text.substring(aIdx + 2, bIdx).trim().replace(/^[\.\)]\s*/, '');
  let optB = text.substring(bIdx + 2, cIdx).trim().replace(/^[\.\)]\s*/, '');
  let optC = text.substring(cIdx + 2, dIdx).trim().replace(/^[\.\)]\s*/, '');
  let optD = text.substring(dIdx + 2).trim().replace(/^[\.\)]\s*/, '');

  // Determine topic
  let topic = 'chem1';
  if (q.num >= 26 && q.num <= 60) topic = 'chem2';
  else if (q.num >= 61) topic = 'chem3';

  // Determine difficulty
  let difficulty = 'NhanBiet';
  if ([4, 10, 15, 17, 18, 22, 23, 24, 38, 45, 51, 52, 53, 54, 55, 56, 57, 58, 59, 75, 80, 85, 88, 89, 90, 91, 92].includes(q.num)) {
    difficulty = 'ThongHieu';
  } else if ([19, 20, 21, 25, 49, 50, 60, 93, 94, 95].includes(q.num)) {
    difficulty = 'VanDung';
  }

  return {
    id: q.num,
    part: 'I',
    topic,
    difficulty,
    rawPrompt: prompt,
    rawA: optA,
    rawB: optB,
    rawC: optC,
    rawD: optD,
  };
}

const parsedList = allMcqs.map((q, i) => parseMcq(q, i));
console.log('Successfully structured', parsedList.length, 'MCQs.');
fs.writeFileSync('/tmp/parsed_mcqs.json', JSON.stringify(parsedList, null, 2));
