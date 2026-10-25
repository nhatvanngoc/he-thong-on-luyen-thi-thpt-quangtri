const fs = require('fs');
const data = JSON.parse(fs.readFileSync('/tmp/de_cuong.txt', 'utf8'));

console.log('=== PAGE 6 ===');
console.log(data.pages[5].text.substring(0, 1500));

console.log('=== PAGE 7 ===');
console.log(data.pages[6].text.substring(0, 1500));

console.log('=== PAGE 8 ===');
console.log(data.pages[7].text.substring(0, 1500));

console.log('=== PAGE 9 ===');
console.log(data.pages[8].text.substring(0, 1500));

console.log('=== PAGE 10 ===');
console.log(data.pages[9].text.substring(0, 1500));
