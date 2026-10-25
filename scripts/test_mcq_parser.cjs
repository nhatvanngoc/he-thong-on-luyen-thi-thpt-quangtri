const fs = require('fs');

const raw = fs.readFileSync('/tmp/p1to6.txt', 'utf8');

// Questions start with "Câu <number>." or "Câu <number>:"
// Options are A. ... B. ... C. ... D. ...
const lines = raw.split('\n');
console.log('Total lines:', lines.length);

const questions = [];
let currentQ = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  const match = line.match(/^Câu\s+(\d+)[\.:]\s*(.*)$/);
  if (match) {
    if (currentQ) {
      questions.push(currentQ);
    }
    currentQ = {
      rawNum: parseInt(match[1]),
      prompt: match[2],
      fullLines: [line],
    };
  } else if (currentQ) {
    currentQ.fullLines.push(line);
  }
}
if (currentQ) questions.push(currentQ);

console.log('Total extracted questions:', questions.length);
questions.slice(0, 5).forEach(q => {
  console.log(`Q${q.rawNum}: ${q.prompt}`);
  console.log('Raw text:', q.fullLines.join(' '));
});
