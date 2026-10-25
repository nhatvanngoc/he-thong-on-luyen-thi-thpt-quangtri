const fs = require('fs');

const raw = fs.readFileSync('/tmp/p1to6.txt', 'utf8');
const lines = raw.split('\n');

const questions = [];
let currentQ = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  const match = line.match(/^Câu\s+(\d+)[\.:]\s*(.*)$/);
  if (match) {
    if (currentQ) questions.push(currentQ);
    currentQ = {
      rawNum: parseInt(match[1]),
      fullText: line,
    };
  } else if (currentQ) {
    currentQ.fullText += ' ' + line;
  }
}
if (currentQ) questions.push(currentQ);

console.log('Parsed count:', questions.length);

// Check options splitting
let successCount = 0;
let failList = [];

questions.forEach(q => {
  const text = q.fullText.replace(/^Câu\s+\d+[\.:]\s*/, '').trim();
  
  // Find A., B., C., D.
  const aIdx = text.search(/\bA[\.\)]\s+/);
  const bIdx = text.search(/\bB[\.\)]\s+/);
  const cIdx = text.search(/\bC[\.\)]\s+/);
  const dIdx = text.search(/\bD[\.\)]\s+/);

  if (aIdx !== -1 && bIdx !== -1 && cIdx !== -1 && dIdx !== -1 && aIdx < bIdx && bIdx < cIdx && cIdx < dIdx) {
    const qText = text.substring(0, aIdx).trim();
    const optA = text.substring(aIdx + 2, bIdx).trim().replace(/^[\.\)]\s*/, '');
    const optB = text.substring(bIdx + 2, cIdx).trim().replace(/^[\.\)]\s*/, '');
    const optC = text.substring(cIdx + 2, dIdx).trim().replace(/^[\.\)]\s*/, '');
    const optD = text.substring(dIdx + 2).trim().replace(/^[\.\)]\s*/, '');
    successCount++;
    q.parsed = { qText, optA, optB, optC, optD };
  } else {
    failList.push({ id: q.rawNum, text: text.substring(0, 100) });
  }
});

console.log('Success count:', successCount, 'Fails:', failList.length);
if (failList.length > 0) {
  console.log('Sample fails:', failList.slice(0, 5));
}
