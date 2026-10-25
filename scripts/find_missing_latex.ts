import fs from 'fs';
import path from 'path';

const files = [
  'src/data/physicsQuestionBank.ts',
  'src/data/chemistryQuestionBank.ts',
  'src/data/questionBank.ts'
];

// Patterns to identify:
// 1. Chemistry subscripts like H2O, CO2, H2, N2, O2, NH3, SO2, SO3, NO2, HNO3, H2SO4, Al3+, OH-, H+ outside $
// 2. Physics formulas like x = Acos, v = -omega, a = -omega^2, Wt, Wd, Wđ outside $
const chemSubscripts = /\b(H2O|CO2|H2|N2|O2|NH3|SO2|SO3|NO2|HNO3|H2SO4|Al2O3|Fe2O3|BaSO4|AgCl|Na2SO4|CaCO3|Ca\(OH\)2|Ba\(OH\)2)\b/;
const chemIons = /\b(Al3\+|Fe3\+|Fe2\+|Cu2\+|SO42-|CO32-|NO3-|Cl-|OH-|H\+|NH4\+)\b/;
const physSymbols = /\b(x\s*=\s*A|v_max|a_max|v\s*=\s*-|a\s*=\s*-|rad\/s|cm\/s2|m\/s2|W_t|W_d|W_đ|Wt|Wđ)\b/;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  console.log(`\n=== Scanning ${file} ===`);
  lines.forEach((line, lineNum) => {
    // Strip out already formatted $...$
    const outsideDollar = line.replace(/\$\$[\s\S]*?\$\$/g, '').replace(/\$[^\$]+?\$/g, '');
    
    // Test
    if (chemSubscripts.test(outsideDollar)) {
      const match = outsideDollar.match(chemSubscripts)![0];
      console.log(`[L${lineNum + 1}] Chem Subscript: "${match}" in: ${outsideDollar.trim().slice(0, 80)}`);
    }
    if (chemIons.test(outsideDollar)) {
      const match = outsideDollar.match(chemIons)![0];
      console.log(`[L${lineNum + 1}] Chem Ion: "${match}" in: ${outsideDollar.trim().slice(0, 80)}`);
    }
    if (physSymbols.test(outsideDollar)) {
      const match = outsideDollar.match(physSymbols)![0];
      console.log(`[L${lineNum + 1}] Phys Symbol: "${match}" in: ${outsideDollar.trim().slice(0, 80)}`);
    }
  });
});
