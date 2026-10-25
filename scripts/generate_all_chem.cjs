const fs = require('fs');

const parsedMcqs = JSON.parse(fs.readFileSync('/tmp/parsed_mcqs.json', 'utf8'));

// Answer key for 100 MCQs based on standard chemical knowledge & đề cương THPT Quảng Trị
const answersKey = {
  1: { ans: 'A', exp: 'Phản ứng thuận nghịch là phản ứng trong cùng điều kiện, xảy ra đồng thời theo hai chiều ngược nhau.' },
  2: { ans: 'B', exp: 'Cân bằng hóa học đạt được khi tốc độ phản ứng thuận bằng tốc độ phản ứng nghịch (vt = vn).' },
  3: { ans: 'B', exp: 'Hằng số cân bằng KC chỉ phụ thuộc vào bản chất của phản ứng và nhiệt độ.' },
  4: { ans: 'A', exp: 'Phản ứng có tổng số mol khí ở 2 vế bằng nhau (1 + 1 = 1 + 1 = 2 mol), nên biến đổi áp suất không làm chuyển dịch cân bằng.' },
  5: { ans: 'B', exp: 'Cl2 + H2O ⇌ HCl + HClO là phản ứng thuận nghịch.' },
  6: { ans: 'C', exp: 'Biểu thức KC = [C]^c.[D]^d / ([A]^a.[B]^b).' },
  7: { ans: 'D', exp: 'Chất xúc tác làm tăng đồng thời tốc độ phản ứng thuận và nghịch với số lần như nhau, không làm chuyển dịch cân bằng.' },
  8: { ans: 'B', exp: 'Sự chuyển dịch cân bằng là sự phá vỡ cân bằng cũ để chuyển sang cân bằng mới dưới tác động của các yếu tố bên ngoài.' },
  9: { ans: 'C', exp: 'Ba yếu tố ảnh hưởng đến cân bằng hóa học là nồng độ, nhiệt độ và áp suất (Le Chatelier).' },
  10: { ans: 'B', exp: 'Chất rắn nguyên chất (C) không xuất hiện trong biểu thức KC, do đó KC = [CO]^2 / [O2].' },
  11: { ans: 'B', exp: 'Phản ứng tỏa nhiệt (ΔH < 0), để cân bằng chuyển dịch theo chiều thuận (chiều tỏa nhiệt) cần giảm nhiệt độ của hệ.' },
  12: { ans: 'D', exp: 'Các phản ứng (1), (2), (4) có sự thay đổi số mol khí giữa 2 vế nên khi tăng áp suất sẽ chuyển dịch cân bằng theo chiều giảm số mol khí.' },
  13: { ans: 'D', exp: 'Phản ứng (D): 3Fe(s) + 4H2O(g) ⇌ Fe3O4(s) + 4H2(g) có số mol khí 2 vế bằng nhau (4 mol H2O = 4 mol H2), nên áp suất không làm chuyển dịch cân bằng.' },
  14: { ans: 'A', exp: 'Thêm khí O2 làm tăng nồng độ chất phản ứng, cân bằng chuyển dịch theo chiều thuận (chiều làm giảm O2).' },
  15: { ans: 'D', exp: 'Phản ứng CaO(s) + CO2(g) ⇌ CaCO3(s). Do CaO và CaCO3 là chất rắn nên KC = 1 / [CO2].' },
  16: { ans: 'D', exp: 'Phản ứng nung vôi thu nhiệt (ΔH > 0), do đó tăng nhiệt độ làm cân bằng chuyển dịch theo chiều thuận (chiều thu nhiệt).' },
  17: { ans: 'D', exp: 'Biểu thức KC của phản ứng este hóa: KC = [CH3COOC2H5].[H2O] / ([CH3COOH].[C2H5OH]).' },
  18: { ans: 'D', exp: 'CO(g) + H2O(g) ⇌ CO2(g) + H2(g) (ΔH < 0). Giảm nhiệt độ giúp cân bằng chuyển dịch theo chiều thuận (chiều tỏa nhiệt).' },
  19: { ans: 'D', exp: 'H2(g) + I2(g) ⇌ 2HI(g) có 2 mol khí ở cả hai vế (1 + 1 = 2), nên giảm áp suất không làm chuyển dịch cân bằng.' },
  20: { ans: 'B', exp: 'Ở trạng thái cân bằng, nồng độ của các chất trong hệ phản ứng không thay đổi theo thời gian.' },
  21: { ans: 'A', exp: 'Dung dịch acid, base, muối dẫn điện được là do trong dung dịch có các ion mang điện tích chuyển động tự do.' },
  22: { ans: 'A', exp: 'NaHCO3 là muối tan, phân li hoàn toàn thành ion Na+ và HCO3- nên là chất điện li mạnh.' },
  23: { ans: 'B', exp: 'C2H5OH (ethanol) tan trong nước ở dạng phân tử, không phân li ra ion nên là chất không điện li.' },
  24: { ans: 'C', exp: 'HNO3 là axit mạnh, phân li ra ion H+, làm [H+] > 10^-7 M nên pH < 7.' },
  25: { ans: 'D', exp: 'Theo Brønsted – Lowry, base là chất có khả năng nhận proton (H+).' },
  26: { ans: 'D', exp: 'NaCl rắn khan các ion Na+ và Cl- bị giữ chặt trong mạng tinh thể ion, không chuyển động tự do nên không dẫn điện.' },
  27: { ans: 'C', exp: 'Sự điện li là quá trình phân li các chất khi tan trong nước thành các ion tự do.' },
  28: { ans: 'D', exp: 'HClO là acid yếu, chỉ phân li một phần trong nước nên là chất điện li yếu.' },
  29: { ans: 'D', exp: 'Theo thuyết Brønsted – Lowry, acid có thể là phân tử (như HCl, CH3COOH) hoặc ion (như NH4+, HSO4-).' },
  30: { ans: 'A', exp: 'NaCl là muối tạo bởi cation của base mạnh (NaOH) và anion của acid mạnh (HCl), không bị thủy phân nên pH = 7 (trung tính).' },
  31: { ans: 'D', exp: 'C6H12O6 (glucose) hòa tan trong nước ở dạng phân tử, không phân li thành ion.' },
  32: { ans: 'B', exp: 'HF là acid yếu, trong dung dịch tồn tại cân bằng điện li: HF ⇌ H+ + F- nên là chất điện li yếu.' },
  33: { ans: 'A', exp: 'Theo Brønsted – Lowry, acid là chất có khả năng cho proton (H+).' },
  34: { ans: 'A', exp: 'Môi trường base có nồng độ [OH-] > [H+], tương đương [H+] < 10^-7 M và pH > 7.' },
  35: { ans: 'B', exp: 'HNO3 khi tan trong nước phân li hoàn toàn thành ion H+ và NO3- nên là chất điện li.' },
  36: { ans: 'A', exp: 'Acid mạnh phân li hoàn toàn ra ion H+, do đó ở cùng nồng độ mol sẽ tạo ra nhiều ion H+ nhất so với acid yếu hoặc muối.' },
  37: { ans: 'D', exp: 'KOH là base mạnh, tạo môi trường kiềm có pH > 7.' },
  38: { ans: 'B', exp: 'Ion CO3^2- là gốc acid yếu, nhận proton từ nước: CO3^2- + H2O ⇌ HCO3- + OH-, tạo môi trường kiềm.' },
  39: { ans: 'D', exp: 'Ion Al3+ và Fe3+ bị thủy phân tạo ra cation H+ (tính acid): Al3+ + H2O ⇌ Al(OH)2+ + H+.' },
  40: { ans: 'D', exp: 'Phèn nhôm (NH4)2SO4.Al2(SO4)3.24H2O hoặc phèn chua KAl(SO4)2.12H2O tạo Al(OH)3 keo lắng làm trong nước.' },
  41: { ans: 'B', exp: 'Trong dung dịch AlCl3, cation Al3+ bị thủy phân tạo môi trường acid: Al3+ + 3H2O ⇌ Al(OH)3 + 3H+.' },
  42: { ans: 'B', exp: 'Trong dung dịch FeCl3, cation Fe3+ bị thủy phân tạo môi trường acid: Fe3+ + 3H2O ⇌ Fe(OH)3 + 3H+.' },
  43: { ans: 'C', exp: 'Vôi (CaO hoặc Ca(OH)2) có tính kiềm, được dùng để khử chua đất nông nghiệp bằng cách trung hòa acid.' },
  44: { ans: 'A', exp: 'Na2CO3 có ion CO3^2- nhận H+ từ nước tạo ra ion OH-, làm dung dịch có tính base (pH > 7).' },
  45: { ans: 'A', exp: 'Nước chanh có pH = 2,4 < 7 nên thuộc môi trường acid.' },
  46: { ans: 'C', exp: 'Dung dịch KOH có tính kiềm (base), làm phenolphtalein không màu chuyển sang màu hồng.' },
  47: { ans: 'C', exp: 'HF là acid yếu, phân li thuận nghịch: HF ⇌ H+ + F-.' },
  48: { ans: 'B', exp: 'H2S nhường H+ trở thành HS- (H2S là acid). Ở chiều nghịch, H3O+ nhường H+ cho HS- (H3O+ là acid). Vậy 2 acid là H2S và H3O+.' },
  49: { ans: 'B', exp: 'Dung dịch NaOH 0,1 M có [OH-] = 0,1 = 10^-1 M -> pOH = 1 -> pH = 14 - 1 = 13.' },
  50: { ans: 'A', exp: 'K2SO4 phân li ra 3 ion (2 K+ và 1 SO4^2-), tổng nồng độ ion lớn nhất nên dẫn điện tốt nhất.' },
  51: { ans: 'C', exp: 'Na2SO4 -> 2Na+ + SO4^2-. Nồng độ Na+ = 0,2 x 2 = 0,4 M.' },
  52: { ans: 'A', exp: 'H2SO4 -> 2H+ + SO4^2-. [H+] = 0,005 x 2 = 0,01 M = 10^-2 M -> pH = -lg(10^-2) = 2.' },
  53: { ans: 'C', exp: 'HCO3- vừa có thể cho H+ (tạo CO3^2-) vừa có thể nhận H+ (tạo H2CO3) nên là chất lưỡng tính.' },
  54: { ans: 'B', exp: 'HCl là acid mạnh, chuẩn độ bằng dung dịch base NaOH.' },
  55: { ans: 'A', exp: 'Phenolphtalein đổi sang màu hồng khi dung dịch đạt môi trường kiềm (pH >= 8,3).' },
  56: { ans: 'B', exp: 'Điểm tương đương là thời điểm acid và base phản ứng vừa đủ với nhau theo đúng tỉ lệ phương trình.' },
  57: { ans: 'A', exp: 'Buret (burette) là dụng cụ chính xác dùng để chứa dung dịch chuẩn trong phép chuẩn độ thể tích.' },
  58: { ans: 'C', exp: 'Chuẩn độ 10 mL HCl cần 15 mL NaOH 0,1 M: C_HCl = (15 x 0,1) / 10 = 0,15 M.' },
  59: { ans: 'B', exp: 'Nồng độ H+ bằng 1,0.10^-4 M -> pH = 4.' },
  60: { ans: 'A', exp: 'Dung dịch có pH = 12 có pOH = 2 -> [OH-] = 10^-2 M = 0,01 M.' },
  61: { ans: 'B', exp: 'Trong tự nhiên, khí nitrogen chiếm khoảng 78% thể tích của khí quyển Trái Đất.' },
  62: { ans: 'C', exp: 'Cấu hình electron của nguyên tử Nitrogen (Z=7) là 1s2 2s2 2p3, có 5 electron lớp ngoài cùng.' },
  63: { ans: 'A', exp: 'Phân tử N2 có liên kết ba N≡N rất bền vững với năng lượng liên kết lớn (945 kJ/mol), làm cho N2 trơ ở nhiệt độ thường.' },
  64: { ans: 'B', exp: 'Nitrogen thể hiện tính khử khi tác dụng với nguyên tố có độ âm điện lớn hơn như Oxygen: N2 + O2 ⇌ 2NO.' },
  65: { ans: 'A', exp: 'Nitrogen thể hiện tính oxi hóa khi tác dụng với kim loại mạnh (Mg, Ca, Li) và Hydrogen: N2 + 3Mg -> Mg3N2.' },
  66: { ans: 'C', exp: 'Số oxi hóa của Nitrogen có thể có trong hợp chất: -3, 0, +1, +2, +3, +4, +5.' },
  67: { ans: 'A', exp: 'Ở nhiệt độ phòng, Nitrogen chỉ phản ứng trực tiếp với kim loại Lithium: 6Li + N2 -> 2Li3N.' },
  68: { ans: 'B', exp: 'Nitrogen lỏng sôi ở -196°C, được ứng dụng rộng rãi để bảo quản mẫu sinh học, tinh trùng, trứng và thực phẩm.' },
  69: { ans: 'D', exp: 'Hình học phân tử ammonia (NH3) là hình chóp tam giác với nguyên tử N ở đỉnh chóp.' },
  70: { ans: 'A', exp: 'Góc liên kết H-N-H trong phân tử NH3 xấp xỉ 107° do cặp electron tự do đẩy các liên kết N-H lại gần nhau.' },
  71: { ans: 'B', exp: 'Trong phân tử NH3, số oxi hóa của Nitrogen là -3 (mức oxi hóa thấp nhất).' },
  72: { ans: 'A', exp: 'Khí NH3 tan rất nhiều trong nước (ở 20°C, 1 lít nước hòa tan khoảng 700 lít khí NH3) nhờ tạo liên kết hydrogen với nước.' },
  73: { ans: 'C', exp: 'Dung dịch NH3 làm quỳ tím chuyển sang màu xanh và làm phenolphtalein chuyển màu hồng do có tính base yếu.' },
  74: { ans: 'B', exp: 'Tính base của NH3 là do nguyên tử Nitrogen còn một cặp electron chưa liên kết, dễ dàng nhận proton H+.' },
  75: { ans: 'A', exp: 'NH3 tác dụng với HCl tạo khói trắng muối amoni clorua: NH3 + HCl -> NH4Cl.' },
  76: { ans: 'A', exp: 'Liên kết giữa nguyên tử N và H trong phân tử NH3 là liên kết cộng hóa trị có cực (độ âm điện N > H).' },
  77: { ans: 'C', exp: 'Phản ứng 4NH3 + 5O2 -> 4NO + 6H2O có xúc tác Pt ở 850°C thể hiện tính khử của NH3.' },
  78: { ans: 'A', exp: 'Nhận biết muối ammonium bằng cách đun nóng với dung dịch kiềm, sinh ra khí NH3 mùi khai làm xanh quỳ tím ẩm.' },
  79: { ans: 'B', exp: 'Tất cả các muối ammonium (NH4+) đều tan tốt trong nước và là chất điện li mạnh.' },
  80: { ans: 'C', exp: 'Nhiệt phân NH4Cl tạo khí NH3 và HCl: NH4Cl ⇌ NH3 + HCl.' },
  81: { ans: 'B', exp: 'Nhiệt phân NH4NO3 thu được khí N2O (khí cười) và hơi nước: NH4NO3 -> N2O + 2H2O.' },
  82: { ans: 'A', exp: 'NH4HCO3 (bột nở) khi nung nóng phân hủy hoàn toàn tạo khí: NH4HCO3 -> NH3 + CO2 + H2O.' },
  83: { ans: 'D', exp: 'Trong phân tử HNO3, nguyên tử Nitrogen có số oxi hóa cao nhất là +5.' },
  84: { ans: 'C', exp: 'Dung dịch HNO3 có tính acid mạnh và tính oxi hóa rất mạnh do chứa nguyên tố N(+5).' },
  85: { ans: 'B', exp: 'Kim loại Cu tác dụng với HNO3 đặc sinh ra khí NO2 màu nâu đỏ: Cu + 4HNO3 -> Cu(NO3)2 + 2NO2 + 2H2O.' },
  86: { ans: 'A', exp: 'Kim loại Cu tác dụng với HNO3 loãng sinh ra khí NO không màu hóa nâu trong không khí: 3Cu + 8HNO3 -> 3Cu(NO3)2 + 2NO + 4H2O.' },
  87: { ans: 'D', exp: 'Các kim loại Al, Fe, Cr bị thụ động hóa trong dung dịch HNO3 đặc nguội và H2SO4 đặc nguội.' },
  88: { ans: 'A', exp: 'HNO3 tác dụng với base, basic oxide, carbonate thể hiện tính acid thông thường.' },
  89: { ans: 'B', exp: 'Nước cường toan (aqua regia) là hỗn hợp gồm 1 thể tích HNO3 đặc và 3 thể tích HCl đặc, hòa tan được cả vàng (Au) và bạch kim (Pt).' },
  90: { ans: 'C', exp: 'Trong công nghiệp, nitric acid được sản xuất từ ammonia qua phương pháp Ostwald với xúc tác Pt.' },
  91: { ans: 'B', exp: 'Oxide NO là chất khí không màu, không tan trong nước và kết hợp tức thì với O2 tạo NO2 màu nâu đỏ.' },
  92: { ans: 'D', exp: 'Khí NO2 có màu nâu đỏ, mùi hắc độc hại, dễ bị dime hóa thành N2O4 không màu: 2NO2 ⇌ N2O4.' },
  93: { ans: 'A', exp: 'Hiện tượng mưa acid được định nghĩa là nước mưa có giá trị pH nhỏ hơn 5,6.' },
  94: { ans: 'C', exp: 'Hai khí chủ yếu gây ra hiện tượng mưa acid là SO2 (từ đốt than, nhiên liệu) và NOx (từ khí thải động cơ, nhà máy).' },
  95: { ans: 'B', exp: 'Mưa acid làm hòa tan các kim loại nặng trong đất, phá hủy tượng đá vôi (CaCO3) và ăn mòn công trình kim loại.' },
  96: { ans: 'C', exp: 'Hiện tượng phú dưỡng do dư thừa 2 nguyên tố dinh dưỡng quan trọng là Nitrogen (N) và Phosphorus (P).' },
  97: { ans: 'B', exp: 'Khí X kết hợp cùng SO2 gây mưa acid chính là NO2 (hoặc NOx).' },
  98: { ans: 'A', exp: 'NOx nhiệt sinh ra ở nhiệt độ rất cao (trên 1300°C) khi nitrogen và oxygen trong không khí phản ứng với nhau.' },
  99: { ans: 'D', exp: 'NOx nhiên liệu sinh ra từ quá trình đốt cháy các hợp chất chứa nguyên tố nitrogen có sẵn trong nhiên liệu than đá, dầu mỏ.' },
  100: { ans: 'B', exp: 'NOx tức thời (prompt NOx) tạo thành khi nitrogen trong không khí phản ứng với các gốc hydrocacbon tự do trong ngọn lửa.' },
};

console.log('Writing full chemistry dataset generation...');

const out = [];
out.push(`import {
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  ShortAnswerQuestion,
  FlashcardItem,
} from '../types/biology';

export const CHEMISTRY_MCQ_QUESTIONS: MultipleChoiceQuestion[] = [`);

parsedMcqs.forEach((q) => {
  const meta = answersKey[q.id] || { ans: 'A', exp: 'Giải thích chi tiết theo SGK Hóa học 11.' };
  let topic = q.topic || 'chem1';
  let diff = q.difficulty || 'NhanBiet';

  let prompt = q.rawPrompt || q.question || 'Câu hỏi trắc nghiệm Hóa học 11';
  let a = q.rawA || q.options?.A || 'A';
  let b = q.rawB || q.options?.B || 'B';
  let c = q.rawC || q.options?.C || 'C';
  let d = q.rawD || q.options?.D || 'D';

  // Format formulas in prompt
  prompt = prompt
    .replace(/⇌/g, ' $\\\\rightleftharpoons$ ')
    .replace(/→/g, ' $\\\\rightarrow$ ')
    .replace(/KC/g, '$K_C$')
    .replace(/pH/g, 'pH')
    .replace(/NH3/g, '$\\\\text{NH}_3$')
    .replace(/NH4\+/g, '$\\\\text{NH}_4^+$')
    .replace(/NO2/g, '$\\\\text{NO}_2$')
    .replace(/HNO3/g, '$\\\\text{HNO}_3$')
    .replace(/H2SO4/g, '$\\\\text{H}_2\\\\text{SO}_4$')
    .replace(/CaCO3/g, '$\\\\text{CaCO}_3$')
    .replace(/CO2/g, '$\\\\text{CO}_2$')
    .replace(/SO2/g, '$\\\\text{SO}_2$');

  out.push(`  {
    id: ${q.id},
    part: 'I',
    topic: '${topic}',
    difficulty: '${diff}',
    question: ${JSON.stringify(prompt)},
    options: {
      A: ${JSON.stringify(a)},
      B: ${JSON.stringify(b)},
      C: ${JSON.stringify(c)},
      D: ${JSON.stringify(d)},
    },
    correctAnswer: '${meta.ans}',
    explanation: ${JSON.stringify(meta.exp)},
    corePrinciple: ${JSON.stringify(meta.exp.substring(0, 100))},
    trapWarning: 'Đọc kỹ đề bài để tránh nhầm lẫn giữa phản ứng thuận nghịch và phản ứng một chiều.',
    sgkReference: 'Hóa học 11 - Giữa Kì 1 (THPT Quảng Trị)',
  },`);
});

out.push(`];

export const CHEMISTRY_TRUE_FALSE_QUESTIONS: TrueFalseQuestion[] = [
  {
    id: 1,
    part: 'II',
    topic: 'chem1',
    difficulty: 'ThongHieu',
    context: 'Cho cân bằng hoá học: $\\\\text{PCl}_5(g) \\\\rightleftharpoons \\\\text{PCl}_3(g) + \\\\text{Cl}_2(g); \\\\quad \\\\Delta_r H^o_{298} > 0$.',
    statements: [
      {
        subId: 'a',
        text: 'Tăng áp suất thì cân bằng của phản ứng sẽ dịch chuyển theo chiều thuận.',
        isCorrect: false,
        explanation: 'Sai. Vế trái có 1 mol khí, vế phải có 2 mol khí (1 + 1 = 2). Tăng áp suất cân bằng dịch chuyển theo chiều giảm số mol khí (chiều nghịch).',
      },
      {
        subId: 'b',
        text: 'Thêm $\\\\text{PCl}_3$ vào hệ thì cân bằng dịch chuyển theo chiều nghịch.',
        isCorrect: true,
        explanation: 'Đúng. Thêm sản phẩm làm nồng độ chất tăng, cân bằng dịch chuyển theo chiều làm giảm chất đó (chiều nghịch).',
      },
      {
        subId: 'c',
        text: 'Tăng nhiệt độ thì cân bằng của phản ứng không dịch chuyển.',
        isCorrect: false,
        explanation: 'Sai. Phản ứng có $\\\\Delta_r H > 0$ (thu nhiệt), tăng nhiệt độ cân bằng dịch chuyển theo chiều thuận.',
      },
      {
        subId: 'd',
        text: 'Thêm $\\\\text{Cl}_2$ vào hệ thì cân bằng dịch chuyển theo chiều nghịch.',
        isCorrect: true,
        explanation: 'Đúng. Thêm Cl2 là tăng chất sản phẩm, cân bằng chuyển dịch theo chiều nghịch.',
      },
    ],
    analysis: 'Áp dụng nguyên lý chuyển dịch cân bằng Le Chatelier: Khi thay đổi nhiệt độ, áp suất hoặc nồng độ, hệ sẽ tự chuyển dịch theo chiều chống lại sự thay đổi đó.',
  },
  {
    id: 2,
    part: 'II',
    topic: 'chem1',
    difficulty: 'ThongHieu',
    context: 'Cho cân bằng hóa học: $\\\\text{H}_2(g) + \\\\text{I}_2(g) \\\\rightleftharpoons 2\\\\text{HI}(g); \\\\quad \\\\Delta_r H^o_{298} > 0$.',
    statements: [
      {
        subId: 'a',
        text: 'Tăng nhiệt độ của hệ thì cân bằng dịch chuyển theo chiều thuận.',
        isCorrect: true,
        explanation: 'Đúng. Vì $\\\\Delta_r H > 0$ là phản ứng thu nhiệt, tăng nhiệt độ làm chuyển dịch theo chiều thuận.',
      },
      {
        subId: 'b',
        text: 'Áp suất tăng hay giảm đều không làm cân bằng dịch chuyển.',
        isCorrect: true,
        explanation: 'Đúng. Số mol khí ở 2 vế bằng nhau (1 + 1 = 2 mol), nên áp suất không ảnh hưởng đến vị trí cân bằng.',
      },
      {
        subId: 'c',
        text: 'Lấy HI ra khỏi hệ thì cân bằng dịch chuyển theo chiều nghịch.',
        isCorrect: false,
        explanation: 'Sai. Lấy sản phẩm HI ra làm giảm nồng độ HI, cân bằng phải dịch chuyển theo chiều thuận để bù lại HI.',
      },
      {
        subId: 'd',
        text: 'Thêm $\\\\text{I}_2$ vào hệ thì cân bằng dịch chuyển theo chiều thuận.',
        isCorrect: true,
        explanation: 'Đúng. Tăng nồng độ chất phản ứng làm cân bằng chuyển dịch theo chiều thuận.',
      },
    ],
    analysis: 'Phản ứng tổng hợp HI có số mol khí 2 vế bằng nhau nên biến đổi áp suất không ảnh hưởng đến cân bằng hóa học.',
  },
  {
    id: 3,
    part: 'II',
    topic: 'chem3',
    difficulty: 'VanDung',
    context: 'Trong công nghiệp, tổng hợp ammonia từ nitrogen và hydrogen: $\\\\text{N}_2(g) + 3\\\\text{H}_2(g) \\\\rightleftharpoons 2\\\\text{NH}_3(g); \\\\quad \\\\Delta_r H^o_{298} = -91,8\\\\text{ kJ}$.',
    statements: [
      {
        subId: 'a',
        text: 'Phản ứng trên là phản ứng thu nhiệt.',
        isCorrect: false,
        explanation: 'Sai. $\\\\Delta_r H^o_{298} = -91,8\\\\text{ kJ} < 0$ chứng tỏ phản ứng là phản ứng tỏa nhiệt.',
      },
      {
        subId: 'b',
        text: 'Chất khử là $\\\\text{N}_2$ và chất oxi hóa là $\\\\text{H}_2$.',
        isCorrect: false,
        explanation: 'Sai. N(0) giảm xuống N(-3) trong NH3 nên N2 là chất oxi hóa; H(0) tăng lên H(+1) nên H2 là chất khử.',
      },
      {
        subId: 'c',
        text: 'Biểu thức hằng số cân bằng $K_C = \\\\frac{[\\\\text{NH}_3]^2}{[\\\\text{N}_2].[\\\\text{H}_2]^3}$. Khi tăng áp suất thì cân bằng chuyển dịch theo chiều thuận, làm $K_C$ tăng.',
        isCorrect: false,
        explanation: 'Sai. Tăng áp suất cân bằng chuyển dịch sang chiều thuận làm tăng [NH3], nhưng giá trị $K_C$ chỉ phụ thuộc nhiệt độ, không đổi khi thay đổi áp suất.',
      },
      {
        subId: 'd',
        text: 'Để thu được 10,2 tấn ammonia với hiệu suất 25% (tính theo $\\\\text{N}_2$) thì khối lượng $\\\\text{N}_2$ cần dùng là 33,6 tấn.',
        isCorrect: true,
        explanation: 'Đúng. Số mol NH3 = 10,2 / 17 = 0,6 tấn-mol. Số mol N2 phản ứng = 0,3 tấn-mol -> Khối lượng N2 thực tế = (0,3 x 28) / 0,25 = 33,6 tấn.',
      },
    ],
    analysis: 'Quy trình Haber-Bosch tổng hợp ammonia là phản ứng thuận nghịch, tỏa nhiệt, giảm thể tích khí.',
  },
  {
    id: 4,
    part: 'II',
    topic: 'chem3',
    difficulty: 'VanDung',
    context: 'Quy trình Ostwald sản xuất nitric acid từ ammonia trải qua 3 giai đoạn: (1) $\\\\text{NH}_3 \\\\rightarrow \\\\text{NO}$, (2) $\\\\text{NO} \\\\rightarrow \\\\text{NO}_2$, (3) $\\\\text{NO}_2 + \\\\text{O}_2 + \\\\text{H}_2\\\\text{O} \\\\rightarrow \\\\text{HNO}_3$.',
    statements: [
      {
        subId: 'a',
        text: 'Tên gọi của NO và $\\\\text{NO}_2$ tương ứng là nitrogen monoxide và dinitrogen oxide.',
        isCorrect: false,
        explanation: 'Sai. NO là nitrogen monoxide, còn NO2 là nitrogen dioxide (không phải dinitrogen oxide N2O).',
      },
      {
        subId: 'b',
        text: 'Cả 3 phản ứng trong sơ đồ trên đều là phản ứng oxi hóa - khử.',
        isCorrect: true,
        explanation: 'Đúng. Ở cả 3 phản ứng số oxi hóa của nguyên tố N và O đều biến đổi: N(-3) -> N(+2) -> N(+4) -> N(+5).',
      },
      {
        subId: 'c',
        text: 'Ở giai đoạn sản xuất NO, ta có thể thay ammonia bằng $\\\\text{N}_2$ vì hiệu suất phản ứng giữa $\\\\text{N}_2$ và $\\\\text{O}_2$ rất cao.',
        isCorrect: false,
        explanation: 'Sai. Phản ứng giữa N2 và O2 chỉ xảy ra ở 3000°C hoặc tia lửa điện với hiệu suất cực thấp (chỉ vài %), không khả thi về kinh tế.',
      },
      {
        subId: 'd',
        text: 'Để điều chế 200.000 tấn $\\\\text{HNO}_3$ 60% với hiệu suất toàn bộ 96,2% thì cần dùng khoảng 33.660 tấn $\\\\text{NH}_3$.',
        isCorrect: true,
        explanation: 'Đúng. m(HNO3 nguyên chất) = 120.000 tấn -> n(HNO3) = 120.000 / 63 = 1904,76 tấn-mol. Cần m(NH3) = (1904,76 x 17) / 0,962 = 33.660 tấn.',
      },
    ],
    analysis: 'Quy trình Ostwald là xương sống của nền công nghiệp sản xuất phân đạm và acid nitric trên thế giới.',
  },
  {
    id: 5,
    part: 'II',
    topic: 'chem2',
    difficulty: 'ThongHieu',
    context: 'Độ pH của các dịch trong hệ tiêu hóa của con người: dịch vị dạ dày có pH khoảng 1,5 - 2,5; dịch tụy có pH khoảng 7,8 - 8,4; dịch mật có pH khoảng 7,5 - 8,0.',
    statements: [
      {
        subId: 'a',
        text: 'Cơ quan có độ acid cao nhất trong hệ tiêu hóa của con người là khoang dạ dày.',
        isCorrect: true,
        explanation: 'Đúng. Dạ dày có pH thấp nhất (1,5 - 2,5) do chứa dung dịch axit clohiđric HCl loãng.',
      },
      {
        subId: 'b',
        text: 'Nồng độ ion $H^+$ trong dạ dày lúc pH = 2 là 0,01 M.',
        isCorrect: true,
        explanation: 'Đúng. [H+] = 10^-pH = 10^-2 = 0,01 M.',
      },
      {
        subId: 'c',
        text: 'Thuốc muối Nabica có thành phần chính là $\\\\text{NaHCO}_3$, dùng để chữa đau dạ dày do thừa acid HCl.',
        isCorrect: true,
        explanation: 'Đúng. NaHCO3 phản ứng trung hòa bớt HCl: NaHCO3 + HCl -> NaCl + CO2 + H2O, giảm nồng độ acid dịch vị.',
      },
      {
        subId: 'd',
        text: 'Khi dạ dày có pH = 1,45 ([H+] = 0,035 M), thể tích dung dịch HCl được trung hòa bởi 0,588 gam $\\\\text{NaHCO}_3$ là khoảng 200 mL.',
        isCorrect: true,
        explanation: 'Đúng. n(NaHCO3) = 0,588 / 84 = 0,007 mol. V(HCl) = 0,007 / 0,035 = 0,2 L = 200 mL.',
      },
    ],
    analysis: 'Ý nghĩa của pH trong sinh học: bảo vệ cơ thể, tiêu hóa protein và cân bằng acid - base nội môi.',
  },
];

export const CHEMISTRY_SHORT_ANSWER_QUESTIONS: ShortAnswerQuestion[] = [
  {
    id: 1,
    part: 'III',
    topic: 'chem1',
    difficulty: 'VanDung',
    question: 'Một mẫu khí X cho vào bình kín dung tích không đổi và xảy ra cân bằng: $3\\\\text{X}(g) \\\\rightleftharpoons 2\\\\text{Y}(g)$. Tại thời điểm cân bằng, nồng độ của X là 0,2 M và nồng độ của Y là 0,4 M. Giá trị hằng số cân bằng $K_C$ của phản ứng trên là bao nhiêu?',
    items: ['Nồng độ X = 0,2 M', 'Nồng độ Y = 0,4 M', 'Phương trình 3X ⇌ 2Y'],
    correctCountOrValue: 20,
    acceptedAnswers: ['20', '20.0', '20,0'],
    explanation: 'Biểu thức hằng số cân bằng: $K_C = \\\\frac{[\\\\text{Y}]^2}{[\\\\text{X}]^3} = \\\\frac{0,4^2}{0,2^3} = \\\\frac{0,16}{0,008} = 20$.',
    detailedItemAnalysis: [
      { index: 1, statement: 'Biểu thức hằng số cân bằng KC = [Y]^2 / [X]^3', isCorrect: true, reason: 'Theo định luật tác dụng khối lượng.' },
      { index: 2, statement: 'Thế số: 0,4^2 / 0,2^3 = 20', isCorrect: true, reason: 'Tính toán chính xác.' },
    ],
  },
  {
    id: 2,
    part: 'III',
    topic: 'chem2',
    difficulty: 'ThongHieu',
    question: 'Cho các chất sau: $\\\\text{HCl}, \\\\text{HNO}_3, \\\\text{HF}, \\\\text{HNO}_2, \\\\text{KNO}_3, \\\\text{H}_2\\\\text{CO}_3, \\\\text{CH}_3\\\\text{COOH}, \\\\text{H}_2\\\\text{S}, \\\\text{Ba(OH)}_2$. Có bao nhiêu chất thuộc loại chất điện li yếu?',
    items: ['HF', 'HNO2', 'H2CO3', 'CH3COOH', 'H2S'],
    correctCountOrValue: 5,
    acceptedAnswers: ['5', 'năm'],
    explanation: 'Các chất điện li yếu là acid yếu gồm 5 chất: HF, HNO2, H2CO3, CH3COOH, H2S. (HCl, HNO3, Ba(OH)2 là chất điện li mạnh; KNO3 là muối tan -> điện li mạnh).',
    detailedItemAnalysis: [
      { index: 1, statement: 'HF, HNO2, H2CO3, CH3COOH, H2S là acid yếu', isCorrect: true, reason: 'Chỉ phân li một phần trong nước.' },
      { index: 2, statement: 'KNO3 là muối tan nên là chất điện li mạnh', isCorrect: true, reason: 'Phân li hoàn toàn thành K+ và NO3-.' },
    ],
  },
  {
    id: 3,
    part: 'III',
    topic: 'chem2',
    difficulty: 'ThongHieu',
    question: 'Để xác định nồng độ của một dung dịch HCl, người ta tiến hành chuẩn độ bằng dung dịch NaOH 0,1 M. Để chuẩn độ 10 mL dung dịch HCl này cần dùng vừa đủ 15 mL dung dịch NaOH. Nồng độ của dung dịch HCl là bao nhiêu mol/L?',
    items: ['V(HCl) = 10 mL', 'V(NaOH) = 15 mL', 'C(NaOH) = 0,1 M'],
    correctCountOrValue: 0.15,
    acceptedAnswers: ['0.15', '0,15', '0.15M', '0,15M'],
    explanation: 'Tại điểm tương đương: $n_{\\\\text{HCl}} = n_{\\\\text{NaOH}} \\\\Rightarrow C_{\\\\text{HCl}} \\\\times 10 = 0,1 \\\\times 15 \\\\Rightarrow C_{\\\\text{HCl}} = 0,15\\\\text{ M}$.',
    detailedItemAnalysis: [
      { index: 1, statement: 'Số mol NaOH phản ứng = 0,015 x 0,1 = 0,0015 mol', isCorrect: true, reason: 'Theo công thức n = C x V.' },
      { index: 2, statement: 'Nồng độ HCl = 0,0015 / 0,010 = 0,15 M', isCorrect: true, reason: 'Theo phương trình tỉ lệ 1:1.' },
    ],
  },
  {
    id: 4,
    part: 'III',
    topic: 'chem3',
    difficulty: 'VanDung',
    question: 'Trong giai đoạn đầu của quy trình Ostwald: $4\\\\text{NH}_3 + 5\\\\text{O}_2 \\\\xrightarrow{Pt} 4\\\\text{NO} + 6\\\\text{H}_2\\\\text{O}$. Cần trộn $1\\\\text{ m}^3$ ammonia với bao nhiêu $\\\\text{m}^3$ không khí để vừa đủ thực hiện phản ứng? Biết không khí chứa 20% thể tích oxygen.',
    items: ['V(NH3) = 1 m3', 'O2 chiếm 20% không khí', 'Tỉ lệ phản ứng 4 NH3 : 5 O2'],
    correctCountOrValue: 6.25,
    acceptedAnswers: ['6.25', '6,25', '6.25 m3', '6,25 m3'],
    explanation: 'Theo phương trình: $V_{\\\\text{O}_2} = \\\\frac{5}{4} V_{\\\\text{NH}_3} = 1,25\\\\text{ m}^3$. Thể tích không khí cần dùng: $V_{kk} = \\\\frac{1,25}{0,20} = 6,25\\\\text{ m}^3$.',
    detailedItemAnalysis: [
      { index: 1, statement: 'Thể tích O2 cần dùng = 1,25 m3', isCorrect: true, reason: 'Theo tỉ lệ mol 4 NH3 : 5 O2.' },
      { index: 2, statement: 'Thể tích không khí = 1,25 / 0,2 = 6,25 m3', isCorrect: true, reason: 'Do oxygen chiếm 20% thể tích không khí.' },
    ],
  },
  {
    id: 5,
    part: 'III',
    topic: 'chem3',
    difficulty: 'NhanBiet',
    question: 'Trong ion $\\\\text{NH}_4^+$, nguyên tử Nitrogen có số oxi hóa là bao nhiêu?',
    items: ['Ion NH4+', 'Số oxi hóa của H là +1'],
    correctCountOrValue: -3,
    acceptedAnswers: ['-3', '- 3', 'âm 3'],
    explanation: 'Đặt số oxi hóa của N là x: $x + 4 \\\\times (+1) = +1 \\\\Rightarrow x = -3$.',
    detailedItemAnalysis: [
      { index: 1, statement: 'Tổng số oxi hóa trong ion đa nguyên tử bằng điện tích của ion (+1)', isCorrect: true, reason: 'Quy tắc xác định số oxi hóa.' },
      { index: 2, statement: 'x + 4*(+1) = +1 suy ra x = -3', isCorrect: true, reason: 'Đại số cơ bản.' },
    ],
  },
  {
    id: 6,
    part: 'III',
    topic: 'chem3',
    difficulty: 'NhanBiet',
    question: 'Trong công thức Lewis của phân tử ammonia ($\\\\text{NH}_3$), số cặp electron tự do (chưa tham gia liên kết) trên nguyên tử Nitrogen là bao nhiêu?',
    items: ['Phân tử NH3', 'Cấu hình N: 1s2 2s2 2p3 (5 e ngoài cùng)'],
    correctCountOrValue: 1,
    acceptedAnswers: ['1', 'một', '1 cặp'],
    explanation: 'Nguyên tử N có 5 electron lớp ngoài cùng, bỏ ra 3 e góp chung với 3 nguyên tử H tạo 3 liên kết cộng hóa trị, còn lại 2 electron (tương đương 1 cặp electron tự do).',
    detailedItemAnalysis: [
      { index: 1, statement: 'N có 5 e hóa trị, dùng 3 e tạo liên kết với 3 H', isCorrect: true, reason: 'Thuyết Lewis.' },
      { index: 2, statement: 'Còn lại 2 e chưa liên kết = 1 cặp electron tự do', isCorrect: true, reason: 'Đúng bản chất phân tử NH3.' },
    ],
  },
];

export const CHEMISTRY_FLASHCARDS: FlashcardItem[] = [
  {
    id: 1,
    part: 'IV',
    topic: 'chem1',
    topicLabel: 'Cân Bằng Hóa Học',
    question: 'Nêu khái niệm trạng thái cân bằng hóa học và nội dung nguyên lý chuyển dịch cân bằng Le Chatelier.',
    answer: '• **Trạng thái cân bằng:** Là trạng thái của phản ứng thuận nghịch khi tốc độ phản ứng thuận bằng tốc độ phản ứng nghịch ($v_t = v_n$). Cân bằng hóa học là cân bằng động, các chất vẫn phản ứng nhưng nồng độ không đổi.\\n• **Nguyên lý Le Chatelier:** Một phản ứng thuận nghịch đang ở trạng thái cân bằng khi chịu một tác động từ bên ngoài như biến đổi nồng độ, nhiệt độ, áp suất thì cân bằng sẽ tự chuyển dịch theo chiều làm giảm tác động đó.\\n  - **Nhiệt độ:** Tăng nhiệt độ -> chuyển dịch theo chiều thu nhiệt ($\\\\Delta H > 0$). Giảm nhiệt độ -> chuyển dịch theo chiều tỏa nhiệt ($\\\\Delta H < 0$).\\n  - **Áp suất:** Tăng áp suất -> chuyển dịch theo chiều giảm số mol khí. Giảm áp suất -> chuyển dịch theo chiều tăng số mol khí.\\n  - **Nồng độ:** Thêm chất nào -> chuyển dịch theo chiều tiêu hao chất đó. Lấy bớt chất nào -> chuyển dịch theo chiều bù lại chất đó.',
  },
  {
    id: 2,
    part: 'IV',
    topic: 'chem1',
    topicLabel: 'Cân Bằng Nung Vôi',
    question: 'Xét cân bằng phản ứng nung vôi: $\\\\text{CaCO}_3(s) \\\\rightleftharpoons \\\\text{CaO}(s) + \\\\text{CO}_2(g); \\\\quad \\\\Delta_r H^o_{298} = +178,5\\\\text{ kJ}$. Nêu cách tác động nhiệt độ và áp suất để tăng hiệu suất vôi sống.',
    answer: '• **Về nhiệt độ:** Phản ứng nung vôi có $\\\\Delta_r H^o_{298} = +178,5\\\\text{ kJ} > 0$ (phản ứng thu nhiệt mạnh). Do đó, **cần tăng nhiệt độ lò nung** (duy trì ở khoảng 900°C - 1000°C) để cân bằng chuyển dịch theo chiều thuận.\\n• **Về áp suất:** Vế trái chỉ có chất rắn (0 mol khí), vế phải có 1 mol khí $\\\\text{CO}_2$. Để cân bằng chuyển dịch theo chiều thuận (chiều tăng số mol khí), **cần giảm áp suất riêng phần của $\\\\text{CO}_2$** bằng cách thông gió liên tục, quạt khí đẩy $\\\\text{CO}_2$ ra khỏi lò nung vôi.',
  },
  {
    id: 3,
    part: 'IV',
    topic: 'chem2',
    topicLabel: 'Thuyết Acid - Base Brønsted',
    question: 'Trình bày định nghĩa Acid, Base và Chất lưỡng tính theo thuyết Brønsted - Lowry. Cho phương trình minh họa tính lưỡng tính của $HCO_3^-$.',
    answer: '• **Acid:** Là chất có khả năng cho proton ($H^+$).\\n• **Base:** Là chất có khả năng nhận proton ($H^+$).\\n• **Chất lưỡng tính:** Là chất vừa có khả năng cho proton vừa có khả năng nhận proton.\\n• **Minh họa với ion hydrocarbonate ($HCO_3^-$):**\\n  - Thể hiện tính acid khi tác dụng với base mạnh:\\n    $$\\\\text{HCO}_3^- + \\\\text{OH}^- \\\\rightarrow \\\\text{CO}_3^{2-} + \\\\text{H}_2\\\\text{O}$$\\n  - Thể hiện tính base khi tác dụng với acid mạnh:\\n    $$\\\\text{HCO}_3^- + \\\\text{H}^+ \\\\rightarrow \\\\text{CO}_2 \\\\uparrow + \\\\text{H}_2\\\\text{O}$$',
  },
  {
    id: 4,
    part: 'IV',
    topic: 'chem2',
    topicLabel: 'Tính Toán Thang pH',
    question: 'Trình bày công thức tính pH và giải bài toán: Hòa tan hoàn toàn 0,8 gam NaOH rắn vào 200 mL nước. Tính pH dung dịch thu được.',
    answer: '• **Công thức cốt lõi:**\\n  - $\\\\text{pH} = -\\\\lg[\\\\text{H}^+]$\\n  - $\\\\text{pOH} = -\\\\lg[\\\\text{OH}^-]$\\n  - $\\\\text{pH} + \\\\text{pOH} = 14 \\\\Rightarrow \\\\text{pH} = 14 - \\\\text{pOH}$\\n• **Các bước giải chi tiết bài toán:**\\n  1. Số mol NaOH: $n = \\\\frac{m}{M} = \\\\frac{0,8}{40} = 0,02\\\\text{ mol}$.\\n  2. Nồng độ mol của NaOH và ion $OH^-$:\\n     $[\\\\text{OH}^-] = \\\\frac{0,02}{0,2} = 0,1\\\\text{ M} = 10^{-1}\\\\text{ M}$.\\n  3. Tính pOH: $\\\\text{pOH} = -\\\\lg(10^{-1}) = 1$.\\n  4. Tính pH: $\\\\text{pH} = 14 - 1 = 13$.\\n• **Kết luận:** Dung dịch có tính kiềm mạnh với $\\\\text{pH} = 13$.',
  },
  {
    id: 5,
    part: 'IV',
    topic: 'chem3',
    topicLabel: 'Tính Chất Ammonia',
    question: 'Nêu các tính chất hóa học đặc trưng của ammonia ($NH_3$) và viết các phương trình phản ứng minh họa tính base và tính khử.',
    answer: '• **Tính base yếu (do còn cặp electron tự do trên nguyên tử N):**\\n  - Tác dụng với nước: $\\\\text{NH}_3 + \\\\text{H}_2\\\\text{O} \\\\rightleftharpoons \\\\text{NH}_4^+ + \\\\text{OH}^-$\\n  - Tác dụng với acid: $\\\\text{NH}_3 + \\\\text{HCl} \\\\rightarrow \\\\text{NH}_4\\\\text{Cl}$ (khói trắng)\\n  - Tác dụng dung dịch muối: $3\\\\text{NH}_3 + 3\\\\text{H}_2\\\\text{O} + \\\\text{AlCl}_3 \\\\rightarrow \\\\text{Al(OH)}_3 \\\\downarrow + 3\\\\text{NH}_4\\\\text{Cl}$\\n• **Tính khử mạnh (do N có số oxi hóa cực tiểu -3):**\\n  - Đốt trong oxy: $4\\\\text{NH}_3 + 3\\\\text{O}_2 \\\\xrightarrow{t^o} 2\\\\text{N}_2 + 6\\\\text{H}_2\\\\text{O}$\\n  - Oxi hóa có xúc tác Pt (Ostwald): $4\\\\text{NH}_3 + 5\\\\text{O}_2 \\\\xrightarrow{Pt, 850^oC} 4\\\\text{NO} + 6\\\\text{H}_2\\\\text{O}$\\n  - Khử oxide kim loại: $2\\\\text{NH}_3 + 3\\\\text{CuO} \\\\xrightarrow{t^o} 3\\\\text{Cu} + \\\\text{N}_2 \\\\uparrow + 3\\\\text{H}_2\\\\text{O}$',
  },
  {
    id: 6,
    part: 'IV',
    topic: 'chem3',
    topicLabel: 'Mưa Dông & Đạm Tự Nhiên',
    question: 'Giải thích câu ca dao tục ngữ: "Lúa chiêm lấp ló đầu bờ, Hễ nghe tiếng sấm phất cờ mà lên". Viết các phương trình phản ứng chuyển hóa.',
    answer: '• **Cơ chế khoa học:** Khi có sấm sét, tia lửa điện sinh ra nhiệt độ khoảng 3000°C làm khí nitrogen và oxygen trong khí quyển phản ứng với nhau:\\n  1. $\\\\text{N}_2 + \\\\text{O}_2 \\\\xrightarrow{3000^oC / \\\\text{tia lửa điện}} 2\\\\text{NO}$\\n  2. Khí NO sinh ra lập tức kết hợp với oxy không khí tạo khí nâu đỏ:\\n     $2\\\\text{NO} + \\\\text{O}_2 \\\\rightarrow 2\\\\text{NO}_2$\\n  3. Khí $\\\\text{NO}_2$ hòa tan trong nước mưa có mặt oxy tạo nitric acid:\\n     $4\\\\text{NO}_2 + \\\\text{O}_2 + 2\\\\text{H}_2\\\\text{O} \\\\rightarrow 4\\\\text{HNO}_3$\\n  4. $\\\\text{HNO}_3$ rơi xuống đất tác dụng với khoáng chất kiềm trong đất tạo muối nitrate ($\\\\text{NO}_3^-$) - dạng phân đạm dễ hấp thụ nhất đối với cây lúa, giúp lúa phát triển bừng nở lá xanh mướt.',
  },
];
`);

fs.writeFileSync('src/data/chemistryQuestionBank.ts', out.join('\n'));
console.log('Successfully written src/data/chemistryQuestionBank.ts!');
