const fs = require('fs');

const raw = fs.readFileSync('/tmp/p8to11.txt', 'utf8');

// Find all "Câu <num>:" in Short Answer section
const qBlocks = raw.split(/(?=Câu\s+\d+[\.:])/g);
console.log('Total blocks in p8to11:', qBlocks.length);

qBlocks.forEach(b => {
  const m = b.match(/^Câu\s+(\d+)[\.:]\s*([\s\S]*)/);
  if (!m) return;
  const num = parseInt(m[1]);
  const text = m[2].trim().replace(/\s+/g, ' ');
  console.log(`Q${num}: ${text.substring(0, 100)}...`);
});
