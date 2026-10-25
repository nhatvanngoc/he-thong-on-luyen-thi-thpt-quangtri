const fs = require('fs');

const raw = fs.readFileSync('/tmp/p6to8.txt', 'utf8');

// Find all "Câu <num>." or "Câu <num>:" in True/False section
const tfMatch = raw.indexOf('II. TRẮC NGHIỆM ĐÚNG SAI');
const tfText = tfMatch !== -1 ? raw.substring(tfMatch) : raw;

const tfQuestions = [];
// Split by "Câu <num>." or "Câu <num>:"
const qBlocks = tfText.split(/(?=Câu\s+\d+[\.:])/g);

qBlocks.forEach(b => {
  const m = b.match(/^Câu\s+(\d+)[\.:]\s*([\s\S]*)/);
  if (!m) return;
  const num = parseInt(m[1]);
  const content = m[2];

  // Try to find a), b), c), d)
  const aIdx = content.search(/\ba\)/);
  const bIdx = content.search(/\bb\)/);
  const cIdx = content.search(/\bc\)/);
  const dIdx = content.search(/\bd\)/);

  if (aIdx !== -1 && bIdx !== -1 && cIdx !== -1 && dIdx !== -1) {
    const context = content.substring(0, aIdx).trim();
    const stA = content.substring(aIdx + 2, bIdx).trim().replace(/^\)\s*/, '');
    const stB = content.substring(bIdx + 2, cIdx).trim().replace(/^\)\s*/, '');
    const stC = content.substring(cIdx + 2, dIdx).trim().replace(/^\)\s*/, '');
    const rest = content.substring(dIdx + 2).trim().replace(/^\)\s*/, '');
    // rest might have end of question or next thing
    const nextQ = rest.search(/(?=Câu\s+\d+[\.:]|PHẦN|III\.)/);
    const stD = nextQ !== -1 ? rest.substring(0, nextQ).trim() : rest;

    tfQuestions.push({ num, context, stA, stB, stC, stD });
  }
});

console.log('Total True/False questions extracted:', tfQuestions.length);
tfQuestions.forEach(q => {
  console.log(`TF Q${q.num}: ${q.context.substring(0, 60)}...`);
  console.log(`   a) ${q.stA.substring(0, 40)}`);
  console.log(`   b) ${q.stB.substring(0, 40)}`);
  console.log(`   c) ${q.stC.substring(0, 40)}`);
  console.log(`   d) ${q.stD.substring(0, 40)}`);
});
