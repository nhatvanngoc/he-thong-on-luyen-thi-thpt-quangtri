const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/tmp/de_cuong.txt', 'utf8'));
data.pages.forEach((p, idx) => {
  const lines = p.text.split('\n');
  lines.forEach(l => {
    const t = l.trim();
    if (t.startsWith('PHẦN') || t.startsWith('CHƯƠNG') || t.startsWith('BÀI') || t.startsWith('Chủ đề') || t.includes('HỌC SINH TRẢ LỜI') || (t.startsWith('Câu') && t.includes(':') && t.length < 50)) {
      console.log(`Page ${idx+1}: ${t}`);
    }
  });
});
