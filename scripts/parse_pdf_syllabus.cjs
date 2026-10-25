const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extract(pdfPath, outPath) {
  const buf = fs.readFileSync(pdfPath);
  const uint8 = new Uint8Array(buf);
  const parser = new PDFParse(uint8);
  const textResult = await parser.getText();
  const text = typeof textResult === 'string' ? textResult : (textResult.text || JSON.stringify(textResult));
  fs.writeFileSync(outPath, text, 'utf-8');
  console.log(`Extracted ${pdfPath} -> ${outPath} (${text.length} chars)`);
}

async function main() {
  await extract('public/documents/De_Cuong_GKI_Hoa_Hoc_11_THPT_Quang_Tri.pdf', 'scripts/chem_syllabus.txt');
  await extract('public/documents/De_Minh_Hoa_GKI_Hoa_Hoc_11_THPT_Quang_Tri.pdf', 'scripts/chem_mock.txt');
  await extract('public/documents/Ma_Tran_Ban_Dac_Ta_GKI_Sinh_Hoc_11_THPT_Quang_Tri.pdf', 'scripts/bio_syllabus.txt');
  await extract('public/documents/Bo_Cau_Hoi_On_Tap_Lich_Su_11.pdf', 'scripts/hist_syllabus.txt');
  console.log('All extractions complete!');
}

main().catch(console.error);
