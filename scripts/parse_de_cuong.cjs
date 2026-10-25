const fs = require('fs');

const deCuongRaw = JSON.parse(fs.readFileSync('/tmp/de_cuong.txt', 'utf8'));
const minhHoaRaw = JSON.parse(fs.readFileSync('/tmp/minh_hoa.txt', 'utf8'));

console.log('De cuong pages:', deCuongRaw.pages.length);
console.log('Minh hoa pages:', minhHoaRaw.pages.length);

// Let's inspect the text of de_cuong pages 1-6 line by line
const p1to6 = deCuongRaw.pages.slice(0, 6).map(p => p.text).join('\n');
fs.writeFileSync('/tmp/p1to6.txt', p1to6);

const p6to8 = deCuongRaw.pages.slice(5, 8).map(p => p.text).join('\n');
fs.writeFileSync('/tmp/p6to8.txt', p6to8);

const p8to11 = deCuongRaw.pages.slice(7).map(p => p.text).join('\n');
fs.writeFileSync('/tmp/p8to11.txt', p8to11);

console.log('Saved section dumps to /tmp/p1to6.txt, /tmp/p6to8.txt, /tmp/p8to11.txt');
