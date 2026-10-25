const fs = require('fs');

const allMcqs = JSON.parse(fs.readFileSync('/tmp/all_mcqs.json', 'utf8'));

// Clean up questions 1 to 100
console.log('Total MCQs in file:', allMcqs.length);
// Print sample from 20 to 30, 40 to 50, 60 to 70, 80 to 90
[25, 50, 75, 95].forEach(idx => {
  if (allMcqs[idx]) console.log(`Q${allMcqs[idx].num}:`, allMcqs[idx].lines.join(' '));
});
