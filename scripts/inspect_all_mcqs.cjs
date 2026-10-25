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
      num: parseInt(match[1]),
      lines: [line],
    };
  } else if (currentQ) {
    currentQ.lines.push(line);
  }
}
if (currentQ) questions.push(currentQ);

console.log('Total extracted MCQs:', questions.length);

fs.writeFileSync('/tmp/all_mcqs.json', JSON.stringify(questions, null, 2));
console.log('Saved to /tmp/all_mcqs.json');
