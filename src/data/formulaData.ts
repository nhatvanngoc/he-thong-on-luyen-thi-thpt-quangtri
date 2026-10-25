export type FormulaSubject = 'physics' | 'chemistry';

export interface UnitDetail {
  symbol: string;
  meaning: string;
  unit: string;
}

export interface DerivedFormula {
  label: string;
  latex: string;
  reflexTip: string;
}

export interface FormulaPracticeQuestion {
  id: string;
  type: 'mcq' | 'tf' | 'short' | 'essay';
  question: string;
  options?: { A: string; B: string; C: string; D: string }; // For MCQ
  correctAnswer?: 'A' | 'B' | 'C' | 'D'; // For MCQ
  statements?: {
    subId: 'a' | 'b' | 'c' | 'd';
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[]; // For TF
  acceptedAnswers?: string[]; // For Short Answer
  essayAnswer?: string; // For Essay
  explanation: string;
  source: string;
}

export interface FormulaItem {
  id: string;
  subject: FormulaSubject;
  topic: string;
  name: string;
  latex: string;
  description: string;
  units: UnitDetail[];
  derivedFormulas: DerivedFormula[];
  flashcardPrompt: string;
  flashcardAnswer: string;
  pitfalls: string[];
  practiceQuestions: FormulaPracticeQuestion[];
}

export const FORMULA_DATABASE: FormulaItem[] = [
  // =========================================================================
  // VẬT LÍ 11 - DAO ĐỘNG ĐIỀU HÒA & NĂNG LƯỢNG (BÁM SÁT 100% ĐỀ CƯƠNG QUẢNG TRỊ)
  // =========================================================================
  {
    id: 'phys_x_eq',
    subject: 'physics',
    topic: 'Dao động điều hòa',
    name: 'Phương trình li độ dao động điều hòa',
    latex: 'x = A \\cos(\\omega t + \\varphi)',
    description: 'Biểu diễn sự phụ thuộc của li độ (vị trí so với VTCB) theo thời gian t dưới dạng hàm cos.',
    units: [
      { symbol: 'x', meaning: 'Li độ dao động tại thời điểm t', unit: 'cm hoặc m' },
      { symbol: 'A', meaning: 'Biên độ dao động (độ lệch cực đại, luôn A > 0)', unit: 'cm hoặc m' },
      { symbol: '\\omega', meaning: 'Tần số góc của dao động', unit: 'rad/s' },
      { symbol: '\\varphi', meaning: 'Pha ban đầu tại thời điểm t = 0', unit: 'rad' },
      { symbol: '(\\omega t + \\varphi)', meaning: 'Pha dao động tại thời điểm t', unit: 'rad' },
    ],
    derivedFormulas: [
      {
        label: 'Tọa độ tại các vị trí đặc biệt',
        latex: 'x = 0 \\text{ (VTCB)}; \\quad x = \\pm A \\text{ (Vị trí biên)}',
        reflexTip: 'Vật đi qua VTCB thì x = 0; vật ở biên dương x = +A, biên âm x = -A.',
      },
      {
        label: 'Quãng đường đi trong 1 chu kì & nửa chu kì',
        latex: 'S_{1T} = 4A; \\quad S_{T/2} = 2A',
        reflexTip: 'Trong đúng 1 chu kì T vật luôn đi được 4A; trong T/2 luôn đi được 2A dù xuất phát từ bất kì vị trí nào.',
      },
      {
        label: 'Chiều dài quỹ đạo chuyển động',
        latex: 'L = 2A \\iff A = \\frac{L}{2}',
        reflexTip: 'Đề bài cho đoạn thẳng chuyển động dài 10 cm -> Biên độ A = 5 cm.',
      },
    ],
    flashcardPrompt: 'Cho biết ý nghĩa của A và chiều dài quỹ đạo dao động L liên hệ thế nào với A?',
    flashcardAnswer: 'A là biên độ dao động (A > 0, độ dời cực đại từ VTCB). Chiều dài quỹ đạo là L = 2A.',
    pitfalls: [
      'Biên độ A luôn là hằng số dương (A > 0), không bao giờ có giá trị âm.',
      'Nếu phương trình có dạng $x = -A\\cos(\\omega t)$ phải cộng/trừ $\\pi$ để đưa về dạng chuẩn biên độ dương: $x = A\\cos(\\omega t + \\pi)$.',
      'Đề bài cho dao động trên đoạn thẳng $12\\text{ cm}$ nghĩa là chiều dài quỹ đạo $L = 12\\text{ cm} \\Rightarrow A = 6\\text{ cm}$.',
    ],
    practiceQuestions: [
      {
        id: 'phys_x_mcq_1',
        type: 'mcq',
        question: 'Một chất điểm dao động điều hòa theo phương trình $x = 6\\cos(4\\pi t + \\frac{\\pi}{3})\\text{ (cm)}$. Biên độ và pha ban đầu của dao động lần lượt là',
        options: {
          A: '$6\\text{ cm}$ và $\\frac{\\pi}{3}\\text{ rad}$',
          B: '$6\\text{ cm}$ và $4\\pi\\text{ rad}$',
          C: '$12\\text{ cm}$ và $\\frac{\\pi}{3}\\text{ rad}$',
          D: '$6\\text{ cm}$ và $-\\frac{\\pi}{3}\\text{ rad}$',
        },
        correctAnswer: 'A',
        explanation: 'Đối chiếu phương trình $x = A\\cos(\\omega t + \\varphi)$, ta có biên độ $A = 6\\text{ cm}$ và pha ban đầu $\\varphi = \\frac{\\pi}{3}\\text{ rad}$.',
        source: 'Trích Đề cương Vật Lí 11 THPT Quảng Trị',
      },
      {
        id: 'phys_x_tf_1',
        type: 'tf',
        question: 'Một vật dao động điều hoà có đồ thị li độ - thời gian như hình sin với phương trình $x = 5\\cos(2\\pi t - \\frac{\\pi}{6})\\text{ (cm)}$. Xét tính đúng/sai của các phát biểu sau:',
        statements: [
          { subId: 'a', text: 'Chiều dài quỹ đạo chuyển động của vật là $10\\text{ cm}$.', isCorrect: true, explanation: 'Đúng. Chiều dài quỹ đạo $L = 2A = 2 \\times 5 = 10\\text{ cm}$.' },
          { subId: 'b', text: 'Tại thời điểm ban đầu $t = 0$, pha dao động là $-\\frac{\\pi}{6}\\text{ rad}$.', isCorrect: true, explanation: 'Đúng. Tại $t = 0$, pha dao động chính là pha ban đầu $\\varphi = -\\frac{\\pi}{6}\\text{ rad}$.' },
          { subId: 'c', text: 'Trong một chu kì dao động, vật đi được quãng đường là $15\\text{ cm}$.', isCorrect: false, explanation: 'Sai. Quãng đường trong một chu kì là $S = 4A = 4 \\times 5 = 20\\text{ cm}$.' },
          { subId: 'd', text: 'Tại vị trí biên âm, li độ của vật là $x = -5\\text{ cm}$.', isCorrect: true, explanation: 'Đúng. Tại biên âm li độ đạt giá trị cực tiểu $x = -A = -5\\text{ cm}$.' },
        ],
        explanation: 'Nhớ các tính chất cơ bản: $L = 2A$, $S_{1T} = 4A$, pha tại thời điểm $t = 0$ là $\\varphi$.',
        source: 'Đề kiểm tra định kì Vật Lí 11',
      },
      {
        id: 'phys_x_short_1',
        type: 'short',
        question: 'Một chất điểm dao động điều hoà trên quỹ đạo thẳng dài $16\\text{ cm}$. Trong khoảng thời gian đúng bằng 2 chu kì dao động, quãng đường chất điểm đã đi được là bao nhiêu cm?',
        acceptedAnswers: ['64', '64 cm'],
        explanation: 'Chiều dài quỹ đạo $L = 2A = 16\\text{ cm} \\implies A = 8\\text{ cm}$. Trong 1 chu kì vật đi được quãng đường $S_{1T} = 4A$. Vậy trong 2 chu kì quãng đường đi được là $S = 2 \\times 4A = 8A = 8 \\times 8 = 64\\text{ cm}$.',
        source: 'Bài tập vận dụng Đề cương Quảng Trị',
      },
    ],
  },
  {
    id: 'phys_v_eq',
    subject: 'physics',
    topic: 'Dao động điều hòa',
    name: 'Phương trình vận tốc dao động điều hòa',
    latex: 'v = x\' = -\\omega A \\sin(\\omega t + \\varphi) = \\omega A \\cos\\left(\\omega t + \\varphi + \\frac{\\pi}{2}\\right)',
    description: 'Vận tốc là đạo hàm bậc nhất của li độ theo thời gian. Vận tốc sớm pha pi/2 so với li độ.',
    units: [
      { symbol: 'v', meaning: 'Vận tốc tức thời của vật', unit: 'cm/s hoặc m/s' },
      { symbol: 'v_{\\max}', meaning: 'Tốc độ cực đại (độ lớn cực đại tại VTCB)', unit: 'cm/s hoặc m/s' },
      { symbol: '\\omega A', meaning: 'Giá trị vận tốc cực đại khi qua VTCB theo chiều dương', unit: 'cm/s hoặc m/s' },
    ],
    derivedFormulas: [
      {
        label: 'Vận tốc cực đại và cực tiểu',
        latex: 'v_{\\max} = \\omega A \\text{ (VTCB theo chiều +)}; \\quad v_{\\min} = -\\omega A \\text{ (VTCB theo chiều -)}',
        reflexTip: 'Vận tốc có độ lớn cực đại tại VTCB (|v| = \\omega A), tại hai biên vận tốc bằng 0 (v = 0).',
      },
      {
        label: 'Quan hệ pha giữa vận tốc và li độ',
        latex: '\\varphi_v - \\varphi_x = \\frac{\\pi}{2} \\text{ (v sớm pha } \\frac{\\pi}{2} \\text{ so với } x)',
        reflexTip: 'Khi x = 0 thì |v| đạt max. Khi x = +/- A thì v = 0.',
      },
    ],
    flashcardPrompt: 'Vận tốc biến thiên thế nào so với li độ? Độ lớn vận tốc đạt giá trị cực đại và cực tiểu ở đâu?',
    flashcardAnswer: 'v sớm pha π/2 so với x. |v| đạt cực đại tại vị trí cân bằng (|v_max| = ωA) và bằng 0 tại 2 biên (x = ±A).',
    pitfalls: [
      'Phân biệt "vận tốc" (có dấu +/- đại diện cho chiều) và "tốc độ" (độ lớn |v|, luôn không âm).',
      'Vận tốc cực tiểu là $v_{\\min} = -\\omega A$ (khi qua VTCB theo chiều âm), trong khi tốc độ cực tiểu là $0$ (tại hai biên).',
    ],
    practiceQuestions: [
      {
        id: 'phys_v_mcq_1',
        type: 'mcq',
        question: 'Vận tốc của một vật dao động điều hoà có phương trình $v = 20\\pi \\cos(2\\pi t + \\frac{\\pi}{2})\\text{ (cm/s)}$. Biên độ dao động của vật là',
        options: {
          A: '$5\\text{ cm}$',
          B: '$10\\text{ cm}$',
          C: '$20\\text{ cm}$',
          D: '$40\\text{ cm}$',
        },
        correctAnswer: 'B',
        explanation: 'Ta có $v_{\\max} = \\omega A = 20\\pi\\text{ cm/s}$. Vì $\\omega = 2\\pi\\text{ rad/s} \\implies A = \\frac{v_{\\max}}{\\omega} = \\frac{20\\pi}{2\\pi} = 10\\text{ cm}$.',
        source: 'Trích Đề cương Vật Lí 11 THPT Quảng Trị',
      },
      {
        id: 'phys_v_short_1',
        type: 'short',
        question: 'Một vật dao động điều hoà với tần số góc $\\omega = 5\\text{ rad/s}$ và biên độ $A = 4\\text{ cm}$. Tốc độ cực đại của vật khi đi qua vị trí cân bằng bằng bao nhiêu cm/s?',
        acceptedAnswers: ['20', '20 cm/s'],
        explanation: 'Tốc độ cực đại $v_{\\max} = \\omega A = 5 \\times 4 = 20\\text{ cm/s}$.',
        source: 'Bài tập vận dụng Đề cương Quảng Trị',
      },
    ],
  },
  {
    id: 'phys_a_eq',
    subject: 'physics',
    topic: 'Dao động điều hòa',
    name: 'Phương trình gia tốc dao động điều hòa',
    latex: 'a = v\' = -\\omega^2 x = \\omega^2 A \\cos(\\omega t + \\varphi + \\pi)',
    description: 'Gia tốc là đạo hàm bậc nhất của vận tốc (bậc hai của li độ). Gia tốc luôn ngược pha với li độ và sớm pha pi/2 so với vận tốc.',
    units: [
      { symbol: 'a', meaning: 'Gia tốc tức thời', unit: 'cm/s² hoặc m/s²' },
      { symbol: 'a_{\\max}', meaning: 'Gia tốc cực đại: a_max = \\omega^2 A (tại biên âm x = -A)', unit: 'cm/s² hoặc m/s²' },
      { symbol: '|a|_{\\max}', meaning: 'Độ lớn gia tốc cực đại (ở cả 2 biên)', unit: 'cm/s² hoặc m/s²' },
    ],
    derivedFormulas: [
      {
        label: 'Độ lớn gia tốc theo li độ',
        latex: '|a| = \\omega^2 |x|',
        reflexTip: 'Ở biên |x| = A -> |a| max = \\omega^2 A. Ở VTCB x = 0 -> a = 0.',
      },
      {
        label: 'Hướng của vectơ gia tốc',
        latex: '\\vec{a} \\text{ luôn hướng về vị trí cân bằng}',
        reflexTip: 'Vectơ gia tốc và vectơ lực kéo về luôn cùng hướng về VTCB.',
      },
    ],
    flashcardPrompt: 'Biểu thức liên hệ giữa gia tốc a và li độ x là gì? Vectơ gia tốc luôn hướng về đâu?',
    flashcardAnswer: 'a = -ω²x. Vectơ gia tốc luôn hướng về vị trí cân bằng và có độ lớn tỉ lệ với độ lớn li độ.',
    pitfalls: [
      'Gia tốc ngược pha với li độ ($a = -\\omega^2 x$). Không được quên dấu trừ!',
      'Gia tốc đạt giá trị đại số cực đại $a_{\\max} = +\\omega^2 A$ tại biên âm ($x = -A$), còn tại biên dương gia tốc đạt cực tiểu $a_{\\min} = -\\omega^2 A$.',
    ],
    practiceQuestions: [
      {
        id: 'phys_a_mcq_1',
        type: 'mcq',
        question: 'Một chất điểm dao động điều hoà với tần số góc $\\omega = 2\\text{ rad/s}$. Khi chất điểm có li độ $x = -3\\text{ cm}$ thì gia tốc của nó là',
        options: {
          A: '$12\\text{ cm/s}^2$',
          B: '$-12\\text{ cm/s}^2$',
          C: '$6\\text{ cm/s}^2$',
          D: '$-6\\text{ cm/s}^2$',
        },
        correctAnswer: 'A',
        explanation: 'Áp dụng công thức $a = -\\omega^2 x = -(2^2) \\times (-3) = -4 \\times (-3) = +12\\text{ cm/s}^2$.',
        source: 'Câu 21 Đề cương Vật Lí 11 THPT Quảng Trị',
      },
    ],
  },
  {
    id: 'phys_omega_T_f',
    subject: 'physics',
    topic: 'Dao động điều hòa',
    name: 'Mối liên hệ giữa Chu kì (T), Tần số (f) và Tần số góc (ω)',
    latex: 'T = \\frac{2\\pi}{\\omega} = \\frac{1}{f} = \\frac{\\Delta t}{N}; \\quad f = \\frac{1}{T} = \\frac{\\omega}{2\\pi} = \\frac{N}{\\Delta t}; \\quad \\omega = 2\\pi f = \\frac{2\\pi}{T}',
    description: 'Quan hệ cốt lõi giữa các đại lượng đặc trưng thời gian của dao động điều hòa.',
    units: [
      { symbol: 'T', meaning: 'Chu kì dao động (thời gian thực hiện 1 dao động toàn phần)', unit: 'giây (s)' },
      { symbol: 'f', meaning: 'Tần số dao động (số dao động thực hiện trong 1 giây)', unit: 'héc (Hz) hay s⁻¹' },
      { symbol: '\\omega', meaning: 'Tần số góc', unit: 'rad/s' },
      { symbol: 'N', meaning: 'Số dao động toàn phần thực hiện được', unit: 'dao động' },
      { symbol: '\\Delta t', meaning: 'Khoảng thời gian thực hiện N dao động', unit: 'giây (s)' },
    ],
    derivedFormulas: [
      {
        label: 'Tần số góc từ số dao động N',
        latex: '\\omega = 2\\pi \\frac{N}{\\Delta t}',
        reflexTip: 'Vật thực hiện 20 dao động trong 10s -> f = 2 Hz, \\omega = 4\\pi rad/s, T = 0.5s.',
      },
    ],
    flashcardPrompt: 'Nêu công thức liên hệ giữa chu kì T, tần số f và tần số góc ω?',
    flashcardAnswer: 'T = 2π/ω = 1/f = Δt/N ; f = 1/T = ω/(2π) ; ω = 2πf = 2π/T.',
    pitfalls: [
      'Đơn vị của f là Hz (hoặc 1/s), còn T là s, ω là rad/s. Tránh nhầm lẫn giữa T và f khi bấm máy tính.',
    ],
    practiceQuestions: [
      {
        id: 'phys_om_mcq_1',
        type: 'mcq',
        question: 'Một con lắc thực hiện được 50 dao động toàn phần trong thời gian $25\\text{ s}$. Tần số và chu kì của dao động này lần lượt là',
        options: {
          A: '$2\\text{ Hz}$ và $0{,}5\\text{ s}$',
          B: '$0{,}5\\text{ Hz}$ và $2\\text{ s}$',
          C: '$50\\text{ Hz}$ và $25\\text{ s}$',
          D: '$2\\text{ Hz}$ và $2\\text{ s}$',
        },
        correctAnswer: 'A',
        explanation: 'Ta có $f = \\frac{N}{\\Delta t} = \\frac{50}{25} = 2\\text{ Hz}$. Chu kì $T = \\frac{1}{f} = \\frac{1}{2} = 0{,}5\\text{ s}$.',
        source: 'Đề cương Vật Lí 11 THPT Quảng Trị',
      },
    ],
  },
  {
    id: 'phys_doc_lap_xv',
    subject: 'physics',
    topic: 'Hệ thức độc lập thời gian',
    name: 'Hệ thức độc lập thời gian giữa Li độ (x) và Vận tốc (v)',
    latex: 'x^2 + \\frac{v^2}{\\omega^2} = A^2 \\iff \\left(\\frac{x}{A}\\right)^2 + \\left(\\frac{v}{v_{\\max}}\\right)^2 = 1',
    description: 'Do li độ x và vận tốc v vuông pha nhau (lệch pha pi/2) nên tổng bình phương các tỉ số tức thời bằng 1.',
    units: [
      { symbol: 'A', meaning: 'Biên độ: A = \\sqrt{x^2 + v^2/\\omega^2}', unit: 'cm hoặc m' },
      { symbol: '|v|', meaning: 'Tốc độ tại li độ x: |v| = \\omega\\sqrt{A^2 - x^2}', unit: 'cm/s hoặc m/s' },
      { symbol: '|x|', meaning: 'Độ lớn li độ khi có vận tốc v: |x| = \\sqrt{A^2 - v^2/\\omega^2}', unit: 'cm hoặc m' },
    ],
    derivedFormulas: [
      {
        label: 'Tính biên độ A khi biết (x1, v1) và (x2, v2)',
        latex: '\\omega = \\sqrt{\\frac{v_1^2 - v_2^2}{x_2^2 - x_1^2}}; \\quad A = \\sqrt{x_1^2 + \\frac{v_1^2}{\\omega^2}}',
        reflexTip: 'Công thức giải nhanh khi đề bài cho 2 cặp số liệu li độ và vận tốc tại 2 thời điểm khác nhau.',
      },
      {
        label: 'Tốc độ khi qua trung điểm li độ (x = ± A/2)',
        latex: '|v| = \\frac{v_{\\max}\\sqrt{3}}{2} = \\frac{\\omega A\\sqrt{3}}{2}',
        reflexTip: 'Khi x = +/- A/2 thì |v| = v_max * căn(3) / 2.',
      },
      {
        label: 'Tốc độ khi qua vị trí x = ± A√2 / 2',
        latex: '|v| = \\frac{v_{\\max}\\sqrt{2}}{2} = \\frac{v_{\\max}}{\\sqrt{2}}',
        reflexTip: 'Đây là vị trí động năng bằng thế năng (Wđ = Wt).',
      },
    ],
    flashcardPrompt: 'Viết hệ thức độc lập thời gian giữa li độ x và vận tốc v? Từ đó suy ra công thức tính tốc độ |v| tại li độ x?',
    flashcardAnswer: 'x² + v²/ω² = A² <=> (x/A)² + (v/v_max)² = 1. Suy ra: |v| = ω√(A² - x²).',
    pitfalls: [
      'Đảm bảo đồng nhất đơn vị giữa x (cm) và v (cm/s). Nếu v là m/s thì phải đổi về cm/s hoặc đổi x sang m.',
    ],
    practiceQuestions: [
      {
        id: 'phys_xv_mcq_1',
        type: 'mcq',
        question: 'Một chất điểm dao động điều hòa với biên độ $A = 5\\text{ cm}$ và tần số góc $\\omega = 10\\text{ rad/s}$. Khi chất điểm có li độ $x = 3\\text{ cm}$, tốc độ của chất điểm là',
        options: {
          A: '$40\\text{ cm/s}$',
          B: '$30\\text{ cm/s}$',
          C: '$50\\text{ cm/s}$',
          D: '$20\\text{ cm/s}$',
        },
        correctAnswer: 'A',
        explanation: 'Áp dụng hệ thức độc lập: $|v| = \\omega \\sqrt{A^2 - x^2} = 10 \\sqrt{5^2 - 3^2} = 10 \\times 4 = 40\\text{ cm/s}$.',
        source: 'Đề thi chọn HSG & Đề cương Quảng Trị',
      },
      {
        id: 'phys_xv_short_1',
        type: 'short',
        question: 'Một con lắc dao động điều hoà với chu kì $T = 0{,}2\\pi\\text{ s}$. Tại thời điểm vật có li độ $x = 6\\text{ cm}$ thì vận tốc của vật là $80\\text{ cm/s}$. Biên độ dao động của con lắc bằng bao nhiêu cm?',
        acceptedAnswers: ['10', '10 cm'],
        explanation: 'Ta có $\\omega = \\frac{2\\pi}{T} = \\frac{2\\pi}{0{,}2\\pi} = 10\\text{ rad/s}$. Biên độ $A = \\sqrt{x^2 + \\frac{v^2}{\\omega^2}} = \\sqrt{6^2 + \\frac{80^2}{10^2}} = \\sqrt{36 + 64} = 10\\text{ cm}$.',
        source: 'Đề ôn tập Vật Lí 11',
      },
    ],
  },
  {
    id: 'phys_con_lac_lo_xo',
    subject: 'physics',
    topic: 'Con lắc lò xo',
    name: 'Tần số góc, Chu kì & Tần số của Con lắc lò xo',
    latex: '\\omega = \\sqrt{\\frac{k}{m}}; \\quad T = 2\\pi \\sqrt{\\frac{m}{k}}; \\quad f = \\frac{1}{2\\pi} \\sqrt{\\frac{k}{m}}',
    description: 'Đặc trưng dao động riêng của hệ con lắc lò xo gồm lò xo có độ cứng k và vật nặng có khối lượng m.',
    units: [
      { symbol: 'k', meaning: 'Độ cứng của lò xo', unit: 'N/m' },
      { symbol: 'm', meaning: 'Khối lượng vật nặng', unit: 'kg (bắt buộc đổi từ gam sang kg: 100g = 0.1kg)' },
      { symbol: 'F_{kv}', meaning: 'Lực kéo về: F = -kx (độ lớn cực đại F_max = kA tại biên)', unit: 'N' },
    ],
    derivedFormulas: [
      {
        label: 'Độ biến dạng ở VTCB của lò xo treo thẳng đứng',
        latex: '\\Delta l_0 = \\frac{mg}{k} \\implies \\omega = \\sqrt{\\frac{g}{\\Delta l_0}}; \\quad T = 2\\pi \\sqrt{\\frac{\\Delta l_0}{g}}',
        reflexTip: 'Khi lò xo treo thẳng đứng, độ dãn ở VTCB liên hệ trực tiếp với chu kì T tương tự con lắc đơn.',
      },
      {
        label: 'Cắt ghép lò xo',
        latex: 'k_1 l_1 = k_2 l_2 = k_0 l_0 = \\text{const}',
        reflexTip: 'Lò xo càng ngắn độ cứng càng tăng: cắt đôi lò xo thì độ cứng tăng gấp đôi (k = 2k0).',
      },
    ],
    flashcardPrompt: 'Công thức tính chu kì T và tần số góc ω của con lắc lò xo là gì? Khối lượng m phải có đơn vị gì?',
    flashcardAnswer: 'ω = √(k/m), T = 2π√(m/k). Khối lượng m bắt buộc phải có đơn vị là kilôgam (kg).',
    pitfalls: [
      'Khối lượng m đề bài hay cho là gam (g), BẮT BUỘC phải đổi về kg ($m = m_g / 1000$) trước khi tính toán.',
      'Chu kì của con lắc lò xo KHÔNG phụ thuộc vào gia tốc trọng trường g (trừ khi lò xo thẳng đứng sử dụng qua $\\Delta l_0$).',
    ],
    practiceQuestions: [
      {
        id: 'phys_clx_mcq_1',
        type: 'mcq',
        question: 'Một con lắc lò xo có độ cứng $k = 100\\text{ N/m}$, gắn vật nặng khối lượng $m = 400\\text{ g}$. Lấy $\\pi^2 \\approx 10$. Chu kì dao động của con lắc là',
        options: {
          A: '$0{,}4\\text{ s}$',
          B: '$0{,}2\\text{ s}$',
          C: '$2\\text{ s}$',
          D: '$4\\text{ s}$',
        },
        correctAnswer: 'A',
        explanation: 'Đổi $m = 400\\text{ g} = 0{,}4\\text{ kg}$. Chu kì $T = 2\\pi \\sqrt{\\frac{m}{k}} = 2\\pi \\sqrt{\\frac{0{,}4}{100}} = 2\\pi \\times \\frac{\\sqrt{4}}{10\\sqrt{10}} = \\frac{2\\pi \\times 2}{10\\pi} = 0{,}4\\text{ s}$.',
        source: 'Câu 26 Đề cương Vật Lí 11 THPT Quảng Trị',
      },
    ],
  },
  {
    id: 'phys_con_lac_don',
    subject: 'physics',
    topic: 'Con lắc đơn',
    name: 'Tần số góc & Chu kì của Con lắc đơn',
    latex: '\\omega = \\sqrt{\\frac{g}{l}}; \\quad T = 2\\pi \\sqrt{\\frac{l}{g}}; \\quad f = \\frac{1}{2\\pi} \\sqrt{\\frac{g}{l}}',
    description: 'Áp dụng cho con lắc đơn chiều dài l dao động điều hòa tại nơi có gia tốc trọng trường g với góc lệch nhỏ (alpha_0 <= 10 độ hay 0.17 rad).',
    units: [
      { symbol: 'l', meaning: 'Chiều dài dây treo', unit: 'm (phải đổi từ cm sang m: 100cm = 1m)' },
      { symbol: 'g', meaning: 'Gia tốc trọng trường', unit: 'm/s² (thường lấy g = 9.8 hoặc g = pi^2 = 10)' },
      { symbol: 's', meaning: 'Li độ cong (li độ dài): s = l * \\alpha', unit: 'm' },
    ],
    derivedFormulas: [
      {
        label: 'Quan hệ tỉ lệ với chiều dài dây',
        latex: '\\frac{T_1}{T_2} = \\sqrt{\\frac{l_1}{l_2}} \\iff T \\sim \\sqrt{l}',
        reflexTip: 'Chiều dài tăng 4 lần thì chu kì T tăng 2 lần. Chiều dài giảm 9 lần thì chu kì giảm 3 lần.',
      },
      {
        label: 'Chu kì khi thay đổi chiều dài l = l1 ± l2',
        latex: 'T^2 = T_1^2 \\pm T_2^2 \\implies T = \\sqrt{T_1^2 \\pm T_2^2}',
        reflexTip: 'Con lắc có l = l1 + l2 có chu kì T = sqrt(T1^2 + T2^2).',
      },
    ],
    flashcardPrompt: 'Viết công thức tính chu kì T của con lắc đơn? Chu kì con lắc đơn có phụ thuộc vào khối lượng vật nặng không?',
    flashcardAnswer: 'T = 2π√(l/g). Chu kì con lắc đơn KHÔNG phụ thuộc vào khối lượng vật nặng m.',
    pitfalls: [
      'Chu kì con lắc đơn KHÔNG phụ thuộc vào khối lượng m. Tăng hay giảm m thì T vẫn giữ nguyên!',
      'Chiều dài l phải đổi ra mét (m).',
    ],
    practiceQuestions: [
      {
        id: 'phys_cld_mcq_1',
        type: 'mcq',
        question: 'Tại cùng một vị trí địa lí, nếu chiều dài của con lắc đơn tăng lên 4 lần thì chu kì dao động điều hòa của nó sẽ',
        options: {
          A: 'tăng lên 2 lần.',
          B: 'giảm đi 2 lần.',
          C: 'tăng lên 4 lần.',
          D: 'không đổi.',
        },
        correctAnswer: 'A',
        explanation: 'Ta có $T = 2\\pi \\sqrt{\\frac{l}{g}} \\sim \\sqrt{l}$. Khi $l$ tăng 4 lần thì $T$ tăng $\\sqrt{4} = 2$ lần.',
        source: 'Câu 27 Đề cương Vật Lí 11 THPT Quảng Trị',
      },
    ],
  },
  {
    id: 'phys_nang_luong_w',
    subject: 'physics',
    topic: 'Năng lượng dao động',
    name: 'Động năng, Thế năng & Bảo toàn Cơ năng',
    latex: 'W = W_đ + W_t = \\frac{1}{2}mv^2 + \\frac{1}{2}kx^2 = \\frac{1}{2}kA^2 = \\frac{1}{2}m\\omega^2 A^2 = \\text{hằng số}',
    description: 'Trong quá trình dao động điều hòa bỏ qua ma sát, có sự chuyển hóa qua lại giữa động năng và thế năng nhưng tổng cơ năng luôn được bảo toàn.',
    units: [
      { symbol: 'W', meaning: 'Cơ năng của dao động', unit: 'Jun (J)' },
      { symbol: 'W_đ', meaning: 'Động năng: W_đ = 1/2 m v²', unit: 'Jun (J)' },
      { symbol: 'W_t', meaning: 'Thế năng: W_t = 1/2 k x² = 1/2 m \\omega² x²', unit: 'Jun (J)' },
    ],
    derivedFormulas: [
      {
        label: 'Vị trí khi Động năng bằng n lần Thế năng (Wđ = n Wt)',
        latex: 'W_đ = n W_t \\implies x = \\pm \\frac{A}{\\sqrt{n+1}}; \\quad v = \\pm \\frac{v_{\\max}\\sqrt{n}}{\\sqrt{n+1}}',
        reflexTip: '• Wđ = Wt (n=1) -> x = ± A√2 / 2.\n• Wđ = 3Wt (n=3) -> x = ± A / 2.\n• Wt = 3Wđ (n=1/3) -> x = ± A√3 / 2.',
      },
      {
        label: 'Chu kì & tần số biến thiên của năng lượng',
        latex: 'T\' = \\frac{T}{2}; \\quad f\' = 2f; \\quad \\omega\' = 2\\omega',
        reflexTip: 'Động năng và thế năng biến thiên tuần hoàn với chu kì bằng MỘT NỬA chu kì dao động, tần số GẤP ĐÔI.',
      },
      {
        label: 'Động năng theo li độ',
        latex: 'W_đ = W - W_t = \\frac{1}{2}k(A^2 - x^2)',
        reflexTip: 'Tại VTCB x = 0 -> Wđ = W max = cơ năng. Tại biên x = +/- A -> Wđ = 0, Wt = W max.',
      },
    ],
    flashcardPrompt: 'Cơ năng của con lắc lò xo được tính theo công thức nào? Khi Wđ = 3Wt thì li độ x bằng bao nhiêu?',
    flashcardAnswer: 'W = 1/2 kA² = 1/2 mω²A². Khi Wđ = 3Wt (n=3) thì x = ± A/√(3+1) = ± A/2.',
    pitfalls: [
      'Cơ năng tỉ lệ với BÌNH PHƯƠNG biên độ ($W \\sim A^2$), không phải tỉ lệ bậc nhất với A!',
      'Cơ năng là ĐẠI LƯỢNG BẢO TOÀN (hằng số không đổi theo thời gian), KHÔNG biến thiên điều hòa hay tuần hoàn.',
      'Chỉ có động năng và thế năng biến thiên tuần hoàn với chu kì $T\' = T/2$ và tần số $f\' = 2f$.',
    ],
    practiceQuestions: [
      {
        id: 'phys_w_mcq_1',
        type: 'mcq',
        question: 'Một con lắc lò xo có độ cứng $k = 100\\text{ N/m}$ dao động điều hòa với biên độ $A = 0{,}05\\text{ m}$. Cơ năng của con lắc bằng',
        options: {
          A: '$0{,}125\\text{ J}$',
          B: '$0{,}25\\text{ J}$',
          C: '$2{,}5\\text{ J}$',
          D: '$5\\text{ J}$',
        },
        correctAnswer: 'A',
        explanation: 'Cơ năng của con lắc: $W = \\frac{1}{2}kA^2 = \\frac{1}{2} \\times 100 \\times (0{,}05)^2 = 50 \\times 0{,}0025 = 0{,}125\\text{ J}$.',
        source: 'Câu 30 Đề cương Vật Lí 11 THPT Quảng Trị',
      },
      {
        id: 'phys_w_short_1',
        type: 'short',
        question: 'Một vật dao động điều hoà với biên độ $A = 8\\text{ cm}$. Tại vị trí động năng bằng 3 lần thế năng, độ lớn li độ của vật bằng bao nhiêu cm?',
        acceptedAnswers: ['4', '4 cm'],
        explanation: 'Khi $W_đ = 3W_t \\implies x = \\pm \\frac{A}{\\sqrt{3+1}} = \\pm \\frac{A}{2} = \\pm \\frac{8}{2} = \\pm 4\\text{ cm}$. Độ lớn li độ là $4\\text{ cm}$.',
        source: 'Bài tập vận dụng Đề cương Quảng Trị',
      },
      {
        id: 'phys_w_tf_1',
        type: 'tf',
        question: 'Cho một con lắc lò xo dao động điều hòa không ma sát. Xét tính đúng/sai của các phát biểu sau về năng lượng:',
        statements: [
          { subId: 'a', text: 'Cơ năng của con lắc biến thiên tuần hoàn theo thời gian với chu kì T.', isCorrect: false, explanation: 'Sai. Cơ năng là đại lượng bảo toàn, không đổi theo thời gian.' },
          { subId: 'b', text: 'Động năng của vật đạt giá trị cực đại khi vật đi qua vị trí cân bằng.', isCorrect: true, explanation: 'Đúng. Tại VTCB tốc độ đạt cực đại nên động năng cực đại bằng cơ năng.' },
          { subId: 'c', text: 'Thế năng của con lắc biến thiên tuần hoàn với tần số f\' = 2f (với f là tần số dao động).', isCorrect: true, explanation: 'Đúng. Động năng và thế năng biến thiên với tần số gấp đôi tần số dao động.' },
          { subId: 'd', text: 'Đồ thị của thế năng theo li độ x là một đường cong parabol có bề lõm hướng lên.', isCorrect: true, explanation: 'Đúng. Phương trình Wt = 1/2 k x^2 là hàm bậc 2 với hệ số k/2 > 0 nên có bề lõm hướng lên đỉnh tại gốc tọa độ.' },
        ],
        explanation: 'Nhớ kĩ: Cơ năng bảo toàn, Wđ và Wt biến thiên tuần hoàn với T\' = T/2, f\' = 2f.',
        source: 'Đề cương Vật Lí 11 THPT Quảng Trị',
      },
    ],
  },
  {
    id: 'phys_cong_huong',
    subject: 'physics',
    topic: 'Cộng hưởng & Dao động cưỡng bức',
    name: 'Điều kiện Hiện tượng Cộng hưởng Cơ học',
    latex: 'f_{\\text{cưỡng bức}} \\approx f_0 \\iff \\omega_{\\text{cưỡng bức}} \\approx \\omega_0',
    description: 'Hiện tượng biên độ dao động cưỡng bức tăng đến giá trị cực đại khi tần số của ngoại lực cưỡng bức bằng tần số dao động riêng của hệ.',
    units: [
      { symbol: 'f_{\\text{cưỡng bức}}', meaning: 'Tần số của ngoại lực biến thiên tuần hoàn', unit: 'Hz' },
      { symbol: 'f_0', meaning: 'Tần số riêng của hệ dao động', unit: 'Hz' },
      { symbol: 'A_{\\max}', meaning: 'Biên độ cực đại đạt được khi cộng hưởng', unit: 'cm hoặc m' },
    ],
    derivedFormulas: [
      {
        label: 'Biên độ dao động cưỡng bức phụ thuộc yếu tố nào?',
        latex: 'A = f\\left(F_0, |f - f_0|, \\mu\\right)',
        reflexTip: 'Biên độ A càng lớn khi: 1) Biên độ ngoại lực F0 càng lớn; 2) |f - f0| càng nhỏ (càng gần cộng hưởng); 3) Lực cản môi trường càng nhỏ (đỉnh cộng hưởng càng nhọn).',
      },
    ],
    flashcardPrompt: 'Hiện tượng cộng hưởng cơ xảy ra khi nào? Biên độ dao động phụ thuộc vào yếu tố nào?',
    flashcardAnswer: 'Xảy ra khi f_cưỡng bức = f_0 (tần số ngoại lực bằng tần số riêng). Biên độ phụ thuộc vào: biên độ lực F_0, độ chênh lệch |f - f_0|, và lực cản của môi trường.',
    pitfalls: [
      'Tần số dao động cưỡng bức luôn BẰNG tần số của ngoại lực cưỡng bức, KHÔNG bằng tần số riêng f0 (trừ khi đang cộng hưởng).',
    ],
    practiceQuestions: [
      {
        id: 'phys_ch_mcq_1',
        type: 'mcq',
        question: 'Hiện tượng cộng hưởng cơ xảy ra khi',
        options: {
          A: 'tần số của lực cưỡng bức bằng tần số dao động riêng của hệ.',
          B: 'lực ma sát của môi trường rất lớn.',
          C: 'chu kì của lực cưỡng bức lớn hơn chu kì dao động riêng của hệ.',
          D: 'biên độ của lực cưỡng bức bằng biên độ dao động riêng của hệ.',
        },
        correctAnswer: 'A',
        explanation: 'Cộng hưởng xảy ra khi tần số của lực cưỡng bức bằng tần số dao động riêng của hệ ($f = f_0$).',
        source: 'Câu 40 Đề cương Vật Lí 11 THPT Quảng Trị',
      },
    ],
  },

  // =========================================================================
  // HÓA HỌC 11 - CÂN BẰNG HÓA HỌC, DUNG DỊCH NƯỚC, pH, CHUẨN ĐỘ & NITROGEN
  // =========================================================================
  {
    id: 'chem_kc_tong_quat',
    subject: 'chemistry',
    topic: 'Cân bằng hóa học',
    name: 'Biểu thức Hằng số Cân bằng Nồng độ (KC)',
    latex: 'a\\text{A} + b\\text{B} \\rightleftharpoons c\\text{C} + d\\text{D} \\implies K_C = \\frac{[\\text{C}]^c [\\text{D}]^d}{[\\text{A}]^a [\\text{B}]^b}',
    description: 'Hằng số cân bằng KC là tỉ số giữa tích nồng độ các chất sản phẩm và tích nồng độ các chất phản ứng ở trạng thái cân bằng, mỗi nồng độ được nâng lên lũy thừa bằng hệ số tỉ lượng tương ứng.',
    units: [
      { symbol: '[\\text{X}]', meaning: 'Nồng độ mol của chất X tại TRẠNG THÁI CÂN BẰNG (không phải ban đầu)', unit: 'M (mol/L)' },
      { symbol: 'a, b, c, d', meaning: 'Hệ số tỉ lượng trong phương trình hóa học đã cân bằng', unit: 'số nguyên' },
      { symbol: 'K_C', meaning: 'Hằng số cân bằng (chỉ phụ thuộc nhiệt độ và bản chất phản ứng)', unit: 'không thứ nguyên' },
    ],
    derivedFormulas: [
      {
        label: 'Quy tắc bỏ qua chất rắn (solid)',
        latex: '\\text{Chất rắn (s) có nồng độ coi như hằng số, KHÔNG ghi vào biểu thức } K_C',
        reflexTip: 'Ví dụ: C(s) + CO2(g) ⇌ 2CO(g) -> KC = [CO]² / [CO2]. Chất C(s) bị loại bỏ khỏi biểu thức!',
      },
      {
        label: 'Quan hệ khi nhân hệ số phản ứng',
        latex: '\\text{Nhân hệ số với } n \\implies K\'_C = (K_C)^n',
        reflexTip: 'Gấp đôi hệ số phản ứng thì KC mới bằng KC ban đầu bình phương.',
      },
      {
        label: 'Hằng số cân bằng phản ứng nghịch',
        latex: 'K_{C,\\text{nghịch}} = \\frac{1}{K_{C,\\text{thuận}}}',
        reflexTip: 'Đảo ngược chiều phản ứng thì hằng số cân bằng nghịch đảo.',
      },
    ],
    flashcardPrompt: 'Viết biểu thức KC của phản ứng aA + bB ⇌ cC + dD? Chất nào không xuất hiện trong biểu thức KC? KC phụ thuộc yếu tố nào?',
    flashcardAnswer: 'KC = ([C]^c · [D]^d) / ([A]^a · [B]^b). Chất rắn (s) KHÔNG ghi vào KC. KC CHỈ phụ thuộc vào nhiệt độ và bản chất phản ứng (không phụ thuộc nồng độ, áp suất, chất xúc tác).',
    pitfalls: [
      'Chất rắn (s) tuyệt đối không xuất hiện trong biểu thức $K_C$. Ví dụ phản ứng $\\text{CaCO}_3(s) \\rightleftharpoons \\text{CaO}(s) + \\text{CO}_2(g)$ thì $K_C = [\\text{CO}_2]$.',
      'Chỉ lấy nồng độ TẠI THỜI ĐIỂM CÂN BẰNG, không được lấy nồng độ ban đầu đưa vào tính $K_C$.',
      '$K_C$ KHÔNG bị thay đổi bởi nồng độ các chất, áp suất hay chất xúc tác. CHỈ có nhiệt độ làm thay đổi $K_C$.',
    ],
    practiceQuestions: [
      {
        id: 'chem_kc_mcq_1',
        type: 'mcq',
        question: 'Biểu thức tính hằng số cân bằng $K_C$ của phản ứng: $\\text{CaO}(s) + \\text{CO}_2(g) \\rightleftharpoons \\text{CaCO}_3(s)$ là',
        options: {
          A: '$K_C = \\frac{1}{[\\text{CO}_2]}$',
          B: '$K_C = [\\text{CO}_2]$',
          C: '$K_C = \\frac{[\\text{CaCO}_3]}{[\\text{CaO}] \\cdot [\\text{CO}_2]}$',
          D: '$K_C = \\frac{[\\text{CaO}] \\cdot [\\text{CO}_2]}{[\\text{CaCO}_3]}$',
        },
        correctAnswer: 'A',
        explanation: 'Do $\\text{CaCO}_3$ và $\\text{CaO}$ là chất rắn nên không xuất hiện trong biểu thức $K_C$. Vế phải là 1 (không có chất khí), vế trái có $[\\text{CO}_2]$. Vậy $K_C = \\frac{1}{[\\text{CO}_2]}$.',
        source: 'Câu 15 Đề cương Hóa học 11 THPT Quảng Trị',
      },
      {
        id: 'chem_kc_short_1',
        type: 'short',
        question: 'Cho phản ứng: $\\text{H}_2(g) + \\text{I}_2(g) \\rightleftharpoons 2\\text{HI}(g)$. Tại nhiệt độ $430^\\circ\\text{C}$, nồng độ cân bằng của các chất là $[\\text{H}_2] = 0{,}1\\text{ M}$, $[\\text{I}_2] = 0{,}1\\text{ M}$ và $[\\text{HI}] = 0{,}8\\text{ M}$. Giá trị hằng số cân bằng $K_C$ bằng bao nhiêu?',
        acceptedAnswers: ['64'],
        explanation: 'Biểu thức hằng số cân bằng: $K_C = \\frac{[\\text{HI}]^2}{[\\text{H}_2] \\cdot [\\text{I}_2]} = \\frac{(0{,}8)^2}{0{,}1 \\times 0{,}1} = \\frac{0{,}64}{0{,}01} = 64$.',
        source: 'Đề kiểm tra Hóa học 11',
      },
    ],
  },
  {
    id: 'chem_ph_poh',
    subject: 'chemistry',
    topic: 'Cân bằng trong dung dịch nước',
    name: 'Công thức tính pH, pOH & Tích số ion của nước',
    latex: '\\text{pH} = -\\log[\\text{H}^+]; \\quad [\\text{H}^+] = 10^{-\\text{pH}}; \\quad K_w = [\\text{H}^+][\\text{OH}^-] = 10^{-14} \\implies \\text{pH} + \\text{pOH} = 14',
    description: 'Thang đo định lượng tính acid, base của dung dịch nước ở 25 độ C.',
    units: [
      { symbol: '[\\text{H}^+]', meaning: 'Nồng độ ion H+ (hoặc H3O+)', unit: 'M (mol/L)' },
      { symbol: '[\\text{OH}^-]', meaning: 'Nồng độ ion hydroxide OH-', unit: 'M (mol/L)' },
      { symbol: '\\text{pH}', meaning: 'Chỉ số pH: < 7 là acid, = 7 là trung tính, > 7 là base', unit: 'không đơn vị (0 đến 14)' },
    ],
    derivedFormulas: [
      {
        label: 'Tính nhanh pH của dung dịch Base',
        latex: '\\text{pOH} = -\\log[\\text{OH}^-] \\implies \\text{pH} = 14 - \\text{pOH} = 14 + \\log[\\text{OH}^-]',
        reflexTip: 'Có [OH-] = 10^-3 M -> pOH = 3 -> pH = 14 - 3 = 11.',
      },
      {
        label: 'Quy tắc pha loãng dung dịch',
        latex: '\\text{Pha loãng acid } 10^n \\text{ lần } \\implies \\text{pH tăng } n \\text{ đơn vị (nhưng luôn } < 7\\text{)}',
        reflexTip: 'Dung dịch HCl pH = 2 pha loãng 100 lần (10^2) -> pH mới = 2 + 2 = 4.',
      },
      {
        label: 'Pha loãng dung dịch Base',
        latex: '\\text{Pha loãng base } 10^n \\text{ lần } \\implies \\text{pH giảm } n \\text{ đơn vị (nhưng luôn } > 7\\text{)}',
        reflexTip: 'Dung dịch NaOH pH = 12 pha loãng 1000 lần (10^3) -> pH mới = 12 - 3 = 9.',
      },
    ],
    flashcardPrompt: 'Nêu công thức liên hệ giữa pH, pOH và [H+], [OH-]? Pha loãng acid 100 lần thì pH thay đổi thế nào?',
    flashcardAnswer: 'pH = -log[H+], pOH = -log[OH-], pH + pOH = 14. Pha loãng dung dịch acid 100 lần (10²) thì pH tăng thêm 2 đơn vị (nhưng không bao giờ vượt quá 7).',
    pitfalls: [
      'Khi pha loãng acid vô hạn thì pH tiến dần về 7 chứ KHÔNG BAO GIỜ lớn hơn 7 (không thể biến acid thành base được).',
      'Base có 2 nhóm OH (như $\\text{Ba(OH)}_2$) thì $[\\text{OH}^-] = 2 \\times C_M$. Quên nhân 2 là sai ngay kết quả pH!',
      'Acid có 2 nấc mạnh (như $\\text{H}_2\\text{SO}_4$) thì $[\\text{H}^+] = 2 \\times C_M$.',
    ],
    practiceQuestions: [
      {
        id: 'chem_ph_mcq_1',
        type: 'mcq',
        question: 'Dung dịch $\\text{Ba(OH)}_2$ nồng độ $0{,}005\\text{ M}$ có giá trị pH bằng',
        options: {
          A: '$12$',
          B: '$11$',
          C: '$2$',
          D: '$13$',
        },
        correctAnswer: 'A',
        explanation: 'Ta có $[\\text{OH}^-] = 2 \\times [\\text{Ba(OH)}_2] = 2 \\times 0{,}005 = 0{,}01\\text{ M} = 10^{-2}\\text{ M}$. Suy ra $\\text{pOH} = 2 \\implies \\text{pH} = 14 - \\text{pOH} = 14 - 2 = 12$.',
        source: 'Đề thi THPT Quảng Trị',
      },
      {
        id: 'chem_ph_short_1',
        type: 'short',
        question: 'Cần pha loãng dung dịch $\\text{HCl}$ có $\\text{pH} = 1$ bao nhiêu lần bằng nước cất để thu được dung dịch có $\\text{pH} = 3$?',
        acceptedAnswers: ['100', '100 lần'],
        explanation: 'Độ biến thiên pH là $\\Delta \\text{pH} = 3 - 1 = 2$. Do đó số lần pha loãng là $10^{\\Delta \\text{pH}} = 10^2 = 100$ lần.',
        source: 'Đề cương Hóa học 11',
      },
      {
        id: 'chem_ph_tf_1',
        type: 'tf',
        question: 'Xét tính đúng/sai của các nhận định sau về pH và môi trường dung dịch ở $25^\\circ\\text{C}$:',
        statements: [
          { subId: 'a', text: 'Dung dịch có $[\text{H}^+] = 10^{-9}\text{ M}$ có môi trường base.', isCorrect: true, explanation: 'Đúng. pH = 9 > 7 nên môi trường base.' },
          { subId: 'b', text: 'Nước mưa bình thường có pH khoảng 5,6 do có khí CO2 hòa tan tạo acid yếu H2CO3.', isCorrect: true, explanation: 'Đúng. Khí CO2 tan trong nước mưa tạo acid carbonic làm pH tự nhiên khoảng 5,6.' },
          { subId: 'c', text: 'Mưa acid là hiện tượng nước mưa có độ pH < 5,6 do chứa axit HNO3 và H2SO4.', isCorrect: true, explanation: 'Đúng. Khi pH < 5,6 thì được định nghĩa là mưa acid.' },
          { subId: 'd', text: 'Pha loãng dung dịch HCl pH = 6 thêm 1000 lần sẽ thu được dung dịch có pH = 9.', isCorrect: false, explanation: 'Sai. Pha loãng dung dịch acid vô hạn thì pH chỉ tiệm cận 7 từ dưới lên, không bao giờ vượt quá 7.' },
        ],
        explanation: 'Nhớ các ngưỡng pH chuẩn và hiện tượng mưa acid.',
        source: 'Sách giáo khoa Hóa học 11 Chân trời sáng tạo',
      },
    ],
  },
  {
    id: 'chem_chuan_do_tron',
    subject: 'chemistry',
    topic: 'Chuẩn độ & Trộn acid - base',
    name: 'Phản ứng Trung hòa & Trộn Dung dịch Acid - Base',
    latex: '\\text{H}^+ + \\text{OH}^- \\rightarrow \\text{H}_2\\text{O}; \\quad \\text{Tại điểm tương đương: } n_{\\text{H}^+} = n_{\\text{OH}^-} \\iff C_a V_a z_a = C_b V_b z_b',
    description: 'Quy tắc tính toán phản ứng trung hòa khi chuẩn độ dung dịch hoặc tính pH của dung dịch sau khi trộn lẫn.',
    units: [
      { symbol: 'z_a', meaning: 'Số proton H+ mà 1 phân tử acid có thể phân li (HCl có z=1, H2SO4 có z=2)', unit: 'hệ số' },
      { symbol: 'z_b', meaning: 'Số nhóm OH- mà 1 phân tử base có thể nhận/phân li (NaOH có z=1, Ba(OH)2 có z=2)', unit: 'hệ số' },
      { symbol: 'V_{\\text{tổng}}', meaning: 'Thể tích dung dịch sau khi trộn: V = V1 + V2', unit: 'L' },
    ],
    derivedFormulas: [
      {
        label: 'Trộn dung dịch khi H+ dư (n H+ > n OH-)',
        latex: '[\\text{H}^+]_{\\text{dư}} = \\frac{n_{\\text{H}^+} - n_{\\text{OH}^-}}{V_1 + V_2} \\implies \\text{pH} = -\\log[\\text{H}^+]_{\\text{dư}}',
        reflexTip: 'Tính số mol H+ và OH-, lấy số lớn trừ số bé, chia tổng thể tích ra nồng độ ion dư.',
      },
      {
        label: 'Trộn dung dịch khi OH- dư (n OH- > n H+)',
        latex: '[\\text{OH}^-]_{\\text{dư}} = \\frac{n_{\\text{OH}^-} - n_{\\text{H}^+}}{V_1 + V_2} \\implies \\text{pH} = 14 - (-\\log[\\text{OH}^-]_{\\text{dư}})',
        reflexTip: 'Tính nồng độ OH- dư, suy ra pOH, rồi lấy 14 - pOH ra pH.',
      },
    ],
    flashcardPrompt: 'Tại điểm tương đương trong phép chuẩn độ acid - base, điều kiện số mol ion là gì? Công thức tính pH khi H+ dư sau khi trộn?',
    flashcardAnswer: 'Tại điểm tương đương: n(H+) = n(OH-). Khi H+ dư: [H+] = (n_H+ - n_OH-) / (V1 + V2), pH = -log[H+].',
    pitfalls: [
      'Khi tính nồng độ ion dư, BẮT BUỘC phải chia cho tổng thể tích dung dịch sau khi trộn ($V = V_1 + V_2$). Rất nhiều học sinh quên cộng thể tích!',
    ],
    practiceQuestions: [
      {
        id: 'chem_tron_short_1',
        type: 'short',
        question: 'Trộn $100\\text{ mL}$ dung dịch $\\text{HCl } 0{,}15\\text{ M}$ với $100\\text{ mL}$ dung dịch $\\text{NaOH } 0{,}05\\text{ M}$. Giá trị pH của dung dịch thu được sau khi trộn là bao nhiêu?',
        acceptedAnswers: ['1{,}3', '1.3', '1'],
        explanation: '$n_{\\text{H}^+} = 0{,}1 \\times 0{,}15 = 0{,}015\\text{ mol}$. $n_{\\text{OH}^-} = 0{,}1 \\times 0{,}05 = 0{,}005\\text{ mol}$. Ion $\\text{H}^+$ dư: $n_{\\text{H}^+\\text{ dư}} = 0{,}015 - 0{,}005 = 0{,}01\\text{ mol}$. Thể tích sau trộn $V = 0{,}1 + 0{,}1 = 0{,}2\\text{ L}$. Suy ra $[\\text{H}^+] = \\frac{0{,}01}{0{,}2} = 0{,}05\\text{ M} = 5 \\times 10^{-2}\\text{ M}$. $\\text{pH} = -\\log(0{,}05) \\approx 1{,}3$.',
        source: 'Bài tập chuẩn độ Đề cương THPT Quảng Trị',
      },
    ],
  },
  {
    id: 'chem_bao_toan_e_hno3',
    subject: 'chemistry',
    topic: 'Nitrogen & Axit Nitric (HNO3)',
    name: 'Định luật Bảo toàn Electron & Công thức Giải nhanh HNO3',
    latex: '\\sum n_e\\text{ nhường} = \\sum n_e\\text{ nhận}; \\quad n_{\\text{HNO}_3\\text{ phản ứng}} = 4 n_{\\text{NO}} + 2 n_{\\text{NO}_2} + 10 n_{\\text{N}_2\\text{O}} + 12 n_{\\text{N}_2} + 10 n_{\\text{NH}_4\\text{NO}_3}',
    description: 'Bộ công thức tính nhanh siêu tốc cho các bài toán kim loại tác dụng với dung dịch HNO3 tạo các sản phẩm khử của nitrogen.',
    units: [
      { symbol: 'n_{\\text{NO}}', meaning: 'Khí không màu hóa nâu ngoài không khí (N+2, nhận 3e)', unit: 'mol' },
      { symbol: 'n_{\\text{NO}_2}', meaning: 'Khí màu nâu đỏ (N+4, nhận 1e)', unit: 'mol' },
      { symbol: 'n_{\\text{N}_2\\text{O}}', meaning: 'Khí cười gây cười (N+1, nhận 8e)', unit: 'mol' },
      { symbol: 'n_{\\text{N}_2}', meaning: 'Khí trơ không màu nhẹ hơn không khí (N0, nhận 10e)', unit: 'mol' },
      { symbol: 'n_{\\text{NH}_4\\text{NO}_3}', meaning: 'Muối ammonium trong dung dịch (N-3, nhận 8e)', unit: 'mol' },
    ],
    derivedFormulas: [
      {
        label: 'Khối lượng muối nitrate kim loại tạo thành',
        latex: 'm_{\\text{muối nitrate}} = m_{\\text{kim loại}} + 62 \\times \\sum n_e\\text{ trao đổi}',
        reflexTip: 'Với phản ứng không tạo NH4NO3: m_muối = m_KL + 62 * (3*nNO + nNO2 + 8*nN2O + 10*nN2).',
      },
      {
        label: 'Phản ứng tạo đạm tự nhiên khi có sấm sét',
        latex: '\\text{N}_2 + \\text{O}_2 \\xrightarrow{3000^\\circ\\text{C}} 2\\text{NO} \\xrightarrow{+\\text{O}_2} 2\\text{NO}_2 \\xrightarrow{+\\text{O}_2, +\\text{H}_2\\text{O}} 4\\text{HNO}_3 \\rightarrow \\text{NO}_3^-',
        reflexTip: '"Lúa chiêm lấp ló đầu bờ - Hễ nghe tiếng sấm phất cờ mà lên" chính là chuỗi phản ứng cung cấp đạm nitrate.',
      },
    ],
    flashcardPrompt: 'Công thức giải nhanh số mol HNO3 phản ứng khi sinh ra NO và NO2 là gì? Khối lượng muối nitrate tính theo số mol e nhường thế nào?',
    flashcardAnswer: 'n(HNO3) = 4*n(NO) + 2*n(NO2). Khối lượng muối nitrate = m(kim loại) + 62 * n_e.',
    pitfalls: [
      'Hệ số của NO trong công thức HNO3 là 4 (chứ không phải 3, vì 3 mol tạo NO và 1 mol tạo gốc nitrate).',
      'Hệ số của NO2 trong công thức HNO3 là 2 (chứ không phải 1).',
      'Khi kim loại có tính khử mạnh (như Mg, Al, Zn) tác dụng với HNO3 loãng, đề bài không nói "sản phẩm khử duy nhất" thì thường CÓ TẠO MUỐI NH4NO3!',
    ],
    practiceQuestions: [
      {
        id: 'chem_hno3_mcq_1',
        type: 'mcq',
        question: 'Cho $6{,}4\\text{ gam Cu}$ tác dụng hoàn toàn với dung dịch $\\text{HNO}_3$ đặc, nóng dư, sinh ra $V$ lít khí $\\text{NO}_2$ (sản phẩm khử duy nhất ở đkc, $24{,}79\\text{ L/mol}$). Giá trị của $V$ là',
        options: {
          A: '$4{,}958\\text{ lít}$',
          B: '$2{,}479\\text{ lít}$',
          C: '$9{,}916\\text{ lít}$',
          D: '$1{,}239\\text{ lít}$',
        },
        correctAnswer: 'A',
        explanation: '$n_{\\text{Cu}} = \\frac{6{,}4}{64} = 0{,}1\\text{ mol}$. Bảo toàn electron: $2 n_{\\text{Cu}} = 1 n_{\\text{NO}_2} \\implies n_{\\text{NO}_2} = 0{,}2\\text{ mol}$. Thể tích ở đkc: $V = 0{,}2 \\times 24{,}79 = 4{,}958\\text{ lít}$.',
        source: 'Đề kiểm tra Hóa học 11 THPT Quảng Trị',
      },
      {
        id: 'chem_hno3_short_1',
        type: 'short',
        question: 'Hòa tan hoàn toàn $1{,}2\\text{ gam Mg}$ vào lượng dư dung dịch $\\text{HNO}_3$ loãng thu được dung dịch chứa muối và $0{,}04\\text{ mol NO}$ (sản phẩm khử duy nhất). Số mol $\\text{HNO}_3$ đã tham gia phản ứng là bao nhiêu mol?',
        acceptedAnswers: ['0{,}16', '0.16'],
        explanation: 'Theo công thức giải nhanh: $n_{\\text{HNO}_3} = 4 n_{\\text{NO}} = 4 \\times 0{,}04 = 0{,}16\\text{ mol}$.',
        source: 'Công thức giải nhanh Hóa học 11',
      },
      {
        id: 'chem_hno3_essay_1',
        type: 'essay',
        question: 'Giải thích cơ sở hóa học của câu ca dao: "Lúa chiêm lấp ló đầu bờ - Hễ nghe tiếng sấm phất cờ mà lên". Viết các phương trình phản ứng minh họa.',
        essayAnswer: `• Cơ sở khoa học:
1. Khi có mưa dông kèm theo sấm sét, tia lửa điện tạo nhiệt độ rất cao (khoảng 3000°C) phá vỡ liên kết ba bền vững trong phân tử N2, làm N2 kết hợp với O2 trong không khí:
   N2 + O2 --(3000°C / tia lửa điện)--> 2NO
2. Khí NO sinh ra lập tức kết hợp với oxy trong không khí tạo nitrogen dioxide màu nâu:
   2NO + O2 ----> 2NO2
3. Khí NO2 cùng oxy hòa tan trong nước mưa tạo thành nitric acid loãng:
   4NO2 + O2 + 2H2O ----> 4HNO3
4. Axit HNO3 rơi xuống đất phản ứng với khoáng kiềm trong đất tạo ra ion nitrate (NO3-), là dạng phân đạm dinh dưỡng dễ hấp thu nhất đối với cây lúa, giúp cây lớn nhanh như thổi ("phất cờ mà lên").`,
        explanation: 'Hiện tượng tạo đạm tự nhiên từ không khí nhờ sấm sét mang lại hàng triệu tấn phân đạm mỗi năm cho cây trồng.',
        source: 'Câu hỏi tự luận Đề cương Hóa học 11 THPT Quảng Trị',
      },
    ],
  },
];
