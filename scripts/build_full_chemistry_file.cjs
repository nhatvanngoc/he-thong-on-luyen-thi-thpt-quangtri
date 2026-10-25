const fs = require('fs');

const parsedMcqs = JSON.parse(fs.readFileSync('/tmp/parsed_mcqs.json', 'utf8'));

console.log('Generating complete chemistryQuestionBank.ts with all 100 MCQs + 14 True/False + 18 Short Answer + Flashcards...');

// Let's write the generator script
