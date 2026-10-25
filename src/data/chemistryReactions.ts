export interface ChemicalCompound {
  formula: string; // e.g., 'NH3', 'O2', 'NO', 'H2O'
  displayLatex: string; // e.g., '\\text{NH}_3'
  name: string; // e.g., 'Ammonia'
}

export interface ReactionPuzzleItem {
  id: number;
  title: string;
  category: 'equilibrium' | 'nitrogen' | 'acid_base';
  arrow: '->' | '<=>';
  condition?: string; // e.g. "Pt, 850°C", "t°, p, xt", "t°"
  // Reactants and Products required in slots
  reactantFormulas: string[]; // e.g. ['NH3', 'O2']
  productFormulas: string[];  // e.g. ['NO', 'H2O']
  // Pool of tiles given to the user (contains all reactants, all products + 3-4 distractors)
  tilePool: ChemicalCompound[];
  balancedLatex: string;
  explanation: string;
  hint: string;
}

export interface BalancingReactionItem {
  id: number;
  title: string;
  category: 'nitrogen' | 'equilibrium' | 'acid_base';
  condition?: string;
  arrow: '->' | '<=>';
  reactants: Array<{
    formula: string;
    displayLatex: string;
    targetCoef: number;
    atoms: Record<string, number>; // e.g. { N: 1, H: 3 }
  }>;
  products: Array<{
    formula: string;
    displayLatex: string;
    targetCoef: number;
    atoms: Record<string, number>; // e.g. { N: 1, O: 1 }
  }>;
  balancedLatex: string;
  balancingMethod: string; // Electron transfer method or element conservation
  hint: string;
}

export const CHEMISTRY_REACTION_PUZZLES: ReactionPuzzleItem[] = [
  {
    id: 1,
    title: 'Quy trình Ostwald - Giai đoạn 1: Oxi hóa ammonia có xúc tác Pt',
    category: 'nitrogen',
    arrow: '->',
    condition: 'Pt, 850°C',
    reactantFormulas: ['NH3', 'O2'],
    productFormulas: ['NO', 'H2O'],
    tilePool: [
      { formula: 'NH3', displayLatex: '\\text{NH}_3', name: 'Ammonia' },
      { formula: 'O2', displayLatex: '\\text{O}_2', name: 'Oxygen' },
      { formula: 'NO', displayLatex: '\\text{NO}', name: 'Nitrogen monoxide' },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', name: 'Nước' },
      { formula: 'N2', displayLatex: '\\text{N}_2', name: 'Khí Nitrogen' },
      { formula: 'NO2', displayLatex: '\\text{NO}_2', name: 'Nitrogen dioxide' },
      { formula: 'HNO3', displayLatex: '\\text{HNO}_3', name: 'Nitric acid' },
    ],
    balancedLatex: '4\\text{NH}_3 + 5\\text{O}_2 \\xrightarrow{Pt, 850^oC} 4\\text{NO} + 6\\text{H}_2\\text{O}',
    explanation: 'Dưới tác dụng của xúc tác lưới bạch kim (Pt) ở nhiệt độ 850°C, NH3 bị oxi hóa bởi oxy tạo ra khí NO không màu và hơi nước. Khác với khi không có xúc tác (đốt cháy thường tạo ra N2).',
    hint: 'Chất tham gia là khí amoniac và khí oxy; sản phẩm sinh ra là oxit nitơ hóa trị II và hơi nước.',
  },
  {
    id: 2,
    title: 'Phản ứng tổng hợp Ammonia trong công nghiệp (Quy trình Haber-Bosch)',
    category: 'nitrogen',
    arrow: '<=>',
    condition: '450°C, 200 atm, Fe',
    reactantFormulas: ['N2', 'H2'],
    productFormulas: ['NH3'],
    tilePool: [
      { formula: 'N2', displayLatex: '\\text{N}_2', name: 'Nitrogen' },
      { formula: 'H2', displayLatex: '\\text{H}_2', name: 'Hydrogen' },
      { formula: 'NH3', displayLatex: '\\text{NH}_3', name: 'Ammonia' },
      { formula: 'NH4Cl', displayLatex: '\\text{NH}_4\\text{Cl}', name: 'Amoni clorua' },
      { formula: 'O2', displayLatex: '\\text{O}_2', name: 'Oxygen' },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', name: 'Nước' },
    ],
    balancedLatex: '\\text{N}_2 + 3\\text{H}_2 \\xrightleftharpoons{t^o, p, xt} 2\\text{NH}_3 \\quad (\\Delta_r H^o_{298} = -91,8\\text{ kJ})',
    explanation: 'Phản ứng giữa khí N2 và H2 là phản ứng thuận nghịch, tỏa nhiệt (ΔH < 0), giảm số mol khí (4 mol khí thành 2 mol khí). Do đó tăng áp suất và hạ nhiệt độ thích hợp sẽ làm tăng hiệu suất tạo NH3.',
    hint: 'Hai đơn chất khí phổ biến kết hợp tạo thành khí có mùi khai đặc trưng.',
  },
  {
    id: 3,
    title: 'Phản ứng tạo khói trắng nhận biết khí Ammonia',
    category: 'nitrogen',
    arrow: '->',
    reactantFormulas: ['NH3', 'HCl'],
    productFormulas: ['NH4Cl'],
    tilePool: [
      { formula: 'NH3', displayLatex: '\\text{NH}_3', name: 'Ammonia' },
      { formula: 'HCl', displayLatex: '\\text{HCl}', name: 'Hydrogen chloride' },
      { formula: 'NH4Cl', displayLatex: '\\text{NH}_4\\text{Cl}', name: 'Amoni clorua' },
      { formula: 'NaCl', displayLatex: '\\text{NaCl}', name: 'Natri clorua' },
      { formula: 'Cl2', displayLatex: '\\text{Cl}_2', name: 'Khí Clo' },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', name: 'Nước' },
    ],
    balancedLatex: '\\text{NH}_3\\text{ (k)} + \\text{HCl}\\text{ (k)} \\rightarrow \\text{NH}_4\\text{Cl}\\text{ (r, khói trắng)}',
    explanation: 'Khi đưa hai đũa thủy tinh nhúng vào dung dịch NH3 đậm đặc và HCl đậm đặc lại gần nhau, hai khí bay hơi gặp nhau tạo thành các hạt tinh thể NH4Cl li ti lơ lửng như làn khói trắng.',
    hint: 'Khí có tính bazơ kết hợp với khí có tính axit tạo thành muối amoni dạng khói trắng.',
  },
  {
    id: 4,
    title: 'Nhận biết ion Ammonium bằng dung dịch kiềm',
    category: 'nitrogen',
    arrow: '->',
    condition: 't°',
    reactantFormulas: ['(NH4)2SO4', 'NaOH'],
    productFormulas: ['Na2SO4', 'NH3', 'H2O'],
    tilePool: [
      { formula: '(NH4)2SO4', displayLatex: '(\\text{NH}_4)_2\\text{SO}_4', name: 'Amoni sunfat' },
      { formula: 'NaOH', displayLatex: '\\text{NaOH}', name: 'Natri hiđroxit' },
      { formula: 'Na2SO4', displayLatex: '\\text{Na}_2\\text{SO}_4', name: 'Natri sunfat' },
      { formula: 'NH3', displayLatex: '\\text{NH}_3', name: 'Khí Ammonia' },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', name: 'Nước' },
      { formula: 'NaCl', displayLatex: '\\text{NaCl}', name: 'Natri clorua' },
      { formula: 'H2SO4', displayLatex: '\\text{H}_2\\text{SO}_4', name: 'Axit sunfuric' },
    ],
    balancedLatex: '(\\text{NH}_4)_2\\text{SO}_4 + 2\\text{NaOH} \\xrightarrow{t^o} \\text{Na}_2\\text{SO}_4 + 2\\text{NH}_3 \\uparrow + 2\\text{H}_2\\text{O}',
    explanation: 'Muối ammonium tác dụng với dung dịch kiềm khi đun nóng giải phóng khí NH3 có mùi khai đặc trưng, làm xanh giấy quỳ tím ẩm: NH4+ + OH- -> NH3 + H2O.',
    hint: 'Muối amoni sunfat tác dụng với kiềm mạnh tạo muối mới, nước và giải phóng khí mùi khai.',
  },
  {
    id: 5,
    title: 'Phản ứng khử oxide kim loại bằng khí Ammonia',
    category: 'nitrogen',
    arrow: '->',
    condition: 't°',
    reactantFormulas: ['NH3', 'CuO'],
    productFormulas: ['Cu', 'N2', 'H2O'],
    tilePool: [
      { formula: 'NH3', displayLatex: '\\text{NH}_3', name: 'Ammonia' },
      { formula: 'CuO', displayLatex: '\\text{CuO}', name: 'Đồng(II) oxide (đen)' },
      { formula: 'Cu', displayLatex: '\\text{Cu}', name: 'Đồng kim loại (đỏ)' },
      { formula: 'N2', displayLatex: '\\text{N}_2', name: 'Khí Nitrogen' },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', name: 'Nước' },
      { formula: 'Cu(OH)2', displayLatex: '\\text{Cu(OH)}_2', name: 'Đồng(II) hidroxit' },
      { formula: 'NO', displayLatex: '\\text{NO}', name: 'Nitric oxit' },
    ],
    balancedLatex: '2\\text{NH}_3 + 3\\text{CuO} \\xrightarrow{t^o} 3\\text{Cu} + \\text{N}_2 \\uparrow + 3\\text{H}_2\\text{O}',
    explanation: 'NH3 có tính khử mạnh (do N có số oxi hóa -3). Khi dẫn qua bột CuO nung nóng, bột màu đen chuyển dần sang màu đỏ của đồng kim loại và thoát ra khí N2.',
    hint: 'Bột CuO màu đen bị khử về Cu kim loại màu đỏ gạch, kèm khí N2 và hơi nước.',
  },
  {
    id: 6,
    title: 'Phản ứng hóa nâu ngoài không khí của Nitrogen monoxide',
    category: 'nitrogen',
    arrow: '->',
    reactantFormulas: ['NO', 'O2'],
    productFormulas: ['NO2'],
    tilePool: [
      { formula: 'NO', displayLatex: '\\text{NO}', name: 'Nitrogen monoxide (không màu)' },
      { formula: 'O2', displayLatex: '\\text{O}_2', name: 'Oxygen' },
      { formula: 'NO2', displayLatex: '\\text{NO}_2', name: 'Nitrogen dioxide (nâu đỏ)' },
      { formula: 'N2O', displayLatex: '\\text{N}_2\\text{O}', name: 'Khí gây cười' },
      { formula: 'N2O4', displayLatex: '\\text{N}_2\\text{O}_4', name: 'Dinitrogen tetroxide' },
      { formula: 'HNO3', displayLatex: '\\text{HNO}_3', name: 'Nitric acid' },
    ],
    balancedLatex: '2\\text{NO}\\text{ (không màu)} + \\text{O}_2 \\rightarrow 2\\text{NO}_2\\text{ (màu nâu đỏ)}',
    explanation: 'Khí NO không màu rất dễ kết hợp với oxygen trong không khí ngay ở nhiệt độ thường tạo thành khí NO2 có màu nâu đỏ đặc trưng độc hại.',
    hint: 'Khí không màu kết hợp với oxi không khí tạo thành khí màu nâu đỏ.',
  },
  {
    id: 7,
    title: 'Hòa tan khí NO2 trong nước có mặt Oxygen (Giai đoạn 3 Ostwald)',
    category: 'nitrogen',
    arrow: '->',
    reactantFormulas: ['NO2', 'O2', 'H2O'],
    productFormulas: ['HNO3'],
    tilePool: [
      { formula: 'NO2', displayLatex: '\\text{NO}_2', name: 'Khí NO2' },
      { formula: 'O2', displayLatex: '\\text{O}_2', name: 'Oxygen' },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', name: 'Nước' },
      { formula: 'HNO3', displayLatex: '\\text{HNO}_3', name: 'Nitric acid' },
      { formula: 'NH3', displayLatex: '\\text{NH}_3', name: 'Ammonia' },
      { formula: 'HNO2', displayLatex: '\\text{HNO}_2', name: 'Nitrous acid' },
      { formula: 'H2SO4', displayLatex: '\\text{H}_2\\text{SO}_4', name: 'Axit sunfuric' },
    ],
    balancedLatex: '4\\text{NO}_2 + \\text{O}_2 + 2\\text{H}_2\\text{O} \\rightarrow 4\\text{HNO}_3',
    explanation: 'Hỗn hợp khí NO2 và không khí được sục vào tháp hấp thụ có dòng nước tưới từ trên xuống để tạo thành dung dịch nitric acid HNO3 nồng độ khoảng 60 - 68%.',
    hint: 'Ba chất tham gia gồm khí nâu đỏ, oxi và nước để tạo thành axit nitric.',
  },
  {
    id: 8,
    title: 'Kim loại Đồng tác dụng với Nitric acid đặc nóng',
    category: 'nitrogen',
    arrow: '->',
    condition: 't°',
    reactantFormulas: ['Cu', 'HNO3'],
    productFormulas: ['Cu(NO3)2', 'NO2', 'H2O'],
    tilePool: [
      { formula: 'Cu', displayLatex: '\\text{Cu}', name: 'Đồng kim loại' },
      { formula: 'HNO3', displayLatex: '\\text{HNO}_3\\text{ (đặc)}', name: 'Axit nitric đặc' },
      { formula: 'Cu(NO3)2', displayLatex: '\\text{Cu(NO}_3)_2', name: 'Đồng(II) nitrat' },
      { formula: 'NO2', displayLatex: '\\text{NO}_2\\text{ (nâu đỏ)}', name: 'Khí nâu đỏ' },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', name: 'Nước' },
      { formula: 'NO', displayLatex: '\\text{NO}', name: 'Khí NO' },
      { formula: 'H2', displayLatex: '\\text{H}_2', name: 'Khí Hydro' },
    ],
    balancedLatex: '\\text{Cu} + 4\\text{HNO}_3\\text{ (đặc)} \\xrightarrow{t^o} \\text{Cu(NO}_3)_2 + 2\\text{NO}_2 \\uparrow + 2\\text{H}_2\\text{O}',
    explanation: 'HNO3 đặc oxi hóa kim loại Cu lên mức oxi hóa cao nhất (+2) và giải phóng khí NO2 màu nâu đỏ. HNO3 không giải phóng khí H2 như các axit thông thường.',
    hint: 'Sản phẩm khí của HNO3 đặc luôn là khí NO2 màu nâu đỏ.',
  },
  {
    id: 9,
    title: 'Nhiệt phân muối Ammonium nitrate',
    category: 'nitrogen',
    arrow: '->',
    condition: 't°',
    reactantFormulas: ['NH4NO3'],
    productFormulas: ['N2O', 'H2O'],
    tilePool: [
      { formula: 'NH4NO3', displayLatex: '\\text{NH}_4\\text{NO}_3', name: 'Amoni nitrat' },
      { formula: 'N2O', displayLatex: '\\text{N}_2\\text{O}', name: 'Dinitrogen monoxide' },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', name: 'Nước' },
      { formula: 'NH3', displayLatex: '\\text{NH}_3', name: 'Ammonia' },
      { formula: 'HNO3', displayLatex: '\\text{HNO}_3', name: 'Nitric acid' },
      { formula: 'NO2', displayLatex: '\\text{NO}_2', name: 'Nitrogen dioxide' },
    ],
    balancedLatex: '\\text{NH}_4\\text{NO}_3 \\xrightarrow{t^o} \\text{N}_2\\text{O} \\uparrow + 2\\text{H}_2\\text{O}',
    explanation: 'Khi đun nóng nhẹ muối NH4NO3 khan, muối bị nhiệt phân nội phân tử sinh ra khí cười N2O và hơi nước (chú ý: nếu nung mạnh có thể gây nổ nguy hiểm).',
    hint: 'Một muối amoni duy nhất phân hủy thành khí N2O và hơi nước.',
  },
  {
    id: 10,
    title: 'Phản ứng tạo mưa acid từ khí Sulfur dioxide',
    category: 'acid_base',
    arrow: '->',
    condition: 'xt',
    reactantFormulas: ['SO2', 'O2', 'H2O'],
    productFormulas: ['H2SO4'],
    tilePool: [
      { formula: 'SO2', displayLatex: '\\text{SO}_2', name: 'Sulfur dioxide' },
      { formula: 'O2', displayLatex: '\\text{O}_2', name: 'Oxygen' },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', name: 'Nước' },
      { formula: 'H2SO4', displayLatex: '\\text{H}_2\\text{SO}_4', name: 'Axit sunfuric' },
      { formula: 'SO3', displayLatex: '\\text{SO}_3', name: 'Sulfur trioxide' },
      { formula: 'H2S', displayLatex: '\\text{H}_2\\text{S}', name: 'Hidro sunfua' },
      { formula: 'CO2', displayLatex: '\\text{CO}_2', name: 'Cacbon đioxit' },
    ],
    balancedLatex: '2\\text{SO}_2 + \\text{O}_2 + 2\\text{H}_2\\text{O} \\xrightarrow{xt} 2\\text{H}_2\\text{SO}_4',
    explanation: 'Khí SO2 sinh ra từ đốt than đá, dầu mỏ bị oxi hóa bởi oxy hòa tan với xúc tác vết ion kim loại trong nước mưa tạo thành dung dịch axit sunfuric H2SO4 làm pH nước mưa giảm dưới 5,6.',
    hint: 'Khí SO2 kết hợp với oxi và nước mưa tạo thành axit mạnh H2SO4.',
  },
];

export const CHEMISTRY_BALANCING_REACTIONS: BalancingReactionItem[] = [
  {
    id: 1,
    title: 'Oxi hóa ammonia bằng oxy có xúc tác Pt ở 850°C',
    category: 'nitrogen',
    condition: 'Pt, 850°C',
    arrow: '->',
    reactants: [
      { formula: 'NH3', displayLatex: '\\text{NH}_3', targetCoef: 4, atoms: { N: 1, H: 3 } },
      { formula: 'O2', displayLatex: '\\text{O}_2', targetCoef: 5, atoms: { O: 2 } },
    ],
    products: [
      { formula: 'NO', displayLatex: '\\text{NO}', targetCoef: 4, atoms: { N: 1, O: 1 } },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', targetCoef: 6, atoms: { H: 2, O: 1 } },
    ],
    balancedLatex: '4\\text{NH}_3 + 5\\text{O}_2 \\xrightarrow{Pt, 850^oC} 4\\text{NO} + 6\\text{H}_2\\text{O}',
    balancingMethod: 'Phương pháp thăng bằng electron: Quá trình nhường e: N(-3) -> N(+2) + 5e (nhân 4). Quá trình nhận e: O2(0) + 4e -> 2O(-2) (nhân 5). Tổng: 4NH3 + 5O2 -> 4NO + 6H2O.',
    hint: 'Hệ số của NH3 và NO bằng nhau (4), hệ số của H2O là 6 để cân bằng 12 nguyên tử H.',
  },
  {
    id: 2,
    title: 'Đốt cháy khí ammonia trong oxy không có xúc tác',
    category: 'nitrogen',
    condition: 't°',
    arrow: '->',
    reactants: [
      { formula: 'NH3', displayLatex: '\\text{NH}_3', targetCoef: 4, atoms: { N: 1, H: 3 } },
      { formula: 'O2', displayLatex: '\\text{O}_2', targetCoef: 3, atoms: { O: 2 } },
    ],
    products: [
      { formula: 'N2', displayLatex: '\\text{N}_2', targetCoef: 2, atoms: { N: 2 } },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', targetCoef: 6, atoms: { H: 2, O: 1 } },
    ],
    balancedLatex: '4\\text{NH}_3 + 3\\text{O}_2 \\xrightarrow{t^o} 2\\text{N}_2 + 6\\text{H}_2\\text{O}',
    balancingMethod: 'Quá trình nhường e: 2N(-3) -> N2(0) + 6e (nhân 2). Quá trình nhận e: O2(0) + 4e -> 2O(-2) (nhân 3). Hệ số: 4, 3 -> 2, 6.',
    hint: 'Sản phẩm tạo khí N2 và nước, cần 3 phân tử O2 để cung cấp 6 nguyên tử O cho nước.',
  },
  {
    id: 3,
    title: 'Tổng hợp ammonia theo quy trình Haber-Bosch',
    category: 'nitrogen',
    condition: 't°, p, xt',
    arrow: '<=>',
    reactants: [
      { formula: 'N2', displayLatex: '\\text{N}_2', targetCoef: 1, atoms: { N: 2 } },
      { formula: 'H2', displayLatex: '\\text{H}_2', targetCoef: 3, atoms: { H: 2 } },
    ],
    products: [
      { formula: 'NH3', displayLatex: '\\text{NH}_3', targetCoef: 2, atoms: { N: 1, H: 3 } },
    ],
    balancedLatex: '\\text{N}_2 + 3\\text{H}_2 \\rightleftharpoons 2\\text{NH}_3',
    balancingMethod: 'Bảo toàn nguyên tố N: 1 phân tử N2 có 2 nguyên tử N -> tạo 2 phân tử NH3. Bảo toàn nguyên tố H: 2 phân tử NH3 có 6 nguyên tử H -> cần 3 phân tử H2.',
    hint: 'Tỉ lệ mol kinh điển giữa N2 và H2 là 1 : 3 tạo ra 2 NH3.',
  },
  {
    id: 4,
    title: 'Khử Đồng(II) oxide bằng khí Ammonia ở nhiệt độ cao',
    category: 'nitrogen',
    condition: 't°',
    arrow: '->',
    reactants: [
      { formula: 'NH3', displayLatex: '\\text{NH}_3', targetCoef: 2, atoms: { N: 1, H: 3 } },
      { formula: 'CuO', displayLatex: '\\text{CuO}', targetCoef: 3, atoms: { Cu: 1, O: 1 } },
    ],
    products: [
      { formula: 'Cu', displayLatex: '\\text{Cu}', targetCoef: 3, atoms: { Cu: 1 } },
      { formula: 'N2', displayLatex: '\\text{N}_2', targetCoef: 1, atoms: { N: 2 } },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', targetCoef: 3, atoms: { H: 2, O: 1 } },
    ],
    balancedLatex: '2\\text{NH}_3 + 3\\text{CuO} \\xrightarrow{t^o} 3\\text{Cu} + \\text{N}_2 + 3\\text{H}_2\\text{O}',
    balancingMethod: '2N(-3) -> N2(0) + 6e (nhân 1). Cu(+2) + 2e -> Cu(0) (nhân 3). Tổng hệ số: 2, 3, 3, 1, 3.',
    hint: '3 phân tử CuO nhường 3 nguyên tử O để tạo 3 phân tử nước.',
  },
  {
    id: 5,
    title: 'Hòa tan khí NO2 vào nước khi có mặt Oxygen',
    category: 'nitrogen',
    arrow: '->',
    reactants: [
      { formula: 'NO2', displayLatex: '\\text{NO}_2', targetCoef: 4, atoms: { N: 1, O: 2 } },
      { formula: 'O2', displayLatex: '\\text{O}_2', targetCoef: 1, atoms: { O: 2 } },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', targetCoef: 2, atoms: { H: 2, O: 1 } },
    ],
    products: [
      { formula: 'HNO3', displayLatex: '\\text{HNO}_3', targetCoef: 4, atoms: { H: 1, N: 1, O: 3 } },
    ],
    balancedLatex: '4\\text{NO}_2 + \\text{O}_2 + 2\\text{H}_2\\text{O} \\rightarrow 4\\text{HNO}_3',
    balancingMethod: 'N(+4) -> N(+5) + 1e (nhân 4). O2(0) + 4e -> 2O(-2) (nhân 1). Cân bằng N: 4 NO2 tạo 4 HNO3; cân bằng H: 2 H2O.',
    hint: 'Hệ số của NO2 và HNO3 đều là 4; O2 chỉ cần 1 phân tử.',
  },
  {
    id: 6,
    title: 'Đồng tác dụng với dung dịch Nitric acid đặc',
    category: 'nitrogen',
    condition: 't°',
    arrow: '->',
    reactants: [
      { formula: 'Cu', displayLatex: '\\text{Cu}', targetCoef: 1, atoms: { Cu: 1 } },
      { formula: 'HNO3', displayLatex: '\\text{HNO}_3', targetCoef: 4, atoms: { H: 1, N: 1, O: 3 } },
    ],
    products: [
      { formula: 'Cu(NO3)2', displayLatex: '\\text{Cu(NO}_3)_2', targetCoef: 1, atoms: { Cu: 1, N: 2, O: 6 } },
      { formula: 'NO2', displayLatex: '\\text{NO}_2', targetCoef: 2, atoms: { N: 1, O: 2 } },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', targetCoef: 2, atoms: { H: 2, O: 1 } },
    ],
    balancedLatex: '\\text{Cu} + 4\\text{HNO}_3 \\xrightarrow{t^o} \\text{Cu(NO}_3)_2 + 2\\text{NO}_2 + 2\\text{H}_2\\text{O}',
    balancingMethod: 'Cu(0) -> Cu(+2) + 2e (nhân 1). N(+5) + 1e -> N(+4) trong NO2 (nhân 2). Tổng HNO3 = 2 (tạo muối) + 2 (tạo khí NO2) = 4.',
    hint: 'Tổng hệ số của HNO3 là 4 (2 gốc NO3 trong muối + 2 trong khí NO2).',
  },
  {
    id: 7,
    title: 'Đồng tác dụng với dung dịch Nitric acid loãng',
    category: 'nitrogen',
    arrow: '->',
    reactants: [
      { formula: 'Cu', displayLatex: '\\text{Cu}', targetCoef: 3, atoms: { Cu: 1 } },
      { formula: 'HNO3', displayLatex: '\\text{HNO}_3', targetCoef: 8, atoms: { H: 1, N: 1, O: 3 } },
    ],
    products: [
      { formula: 'Cu(NO3)2', displayLatex: '\\text{Cu(NO}_3)_2', targetCoef: 3, atoms: { Cu: 1, N: 2, O: 6 } },
      { formula: 'NO', displayLatex: '\\text{NO}', targetCoef: 2, atoms: { N: 1, O: 1 } },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', targetCoef: 4, atoms: { H: 2, O: 1 } },
    ],
    balancedLatex: '3\\text{Cu} + 8\\text{HNO}_3 \\rightarrow 3\\text{Cu(NO}_3)_2 + 2\\text{NO} + 4\\text{H}_2\\text{O}',
    balancingMethod: 'Quy tắc nhẩm kinh điển: "Ba đồng, tám acid, hai khí không màu (NO), bốn nước". Cu(0) nhường 2e (nhân 3) = 6e; N(+5) nhận 3e (nhân 2) = 6e.',
    hint: 'Nhớ câu thơ kinh điển: Ba đồng, tám acid, ba muối, hai NO, bốn nước.',
  },
  {
    id: 8,
    title: 'Sắt tác dụng với dung dịch Nitric acid loãng dư',
    category: 'nitrogen',
    arrow: '->',
    reactants: [
      { formula: 'Fe', displayLatex: '\\text{Fe}', targetCoef: 1, atoms: { Fe: 1 } },
      { formula: 'HNO3', displayLatex: '\\text{HNO}_3', targetCoef: 4, atoms: { H: 1, N: 1, O: 3 } },
    ],
    products: [
      { formula: 'Fe(NO3)3', displayLatex: '\\text{Fe(NO}_3)_3', targetCoef: 1, atoms: { Fe: 1, N: 3, O: 9 } },
      { formula: 'NO', displayLatex: '\\text{NO}', targetCoef: 1, atoms: { N: 1, O: 1 } },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', targetCoef: 2, atoms: { H: 2, O: 1 } },
    ],
    balancedLatex: '\\text{Fe} + 4\\text{HNO}_3 \\rightarrow \\text{Fe(NO}_3)_3 + \\text{NO} + 2\\text{H}_2\\text{O}',
    balancingMethod: 'Fe(0) -> Fe(+3) + 3e (nhân 1). N(+5) + 3e -> N(+2) (nhân 1). Tổng HNO3 = 3 (muối Fe(NO3)3) + 1 (khí NO) = 4 HNO3.',
    hint: 'Fe bị oxi hóa lên số oxi hóa cực đại +3, hệ số của HNO3 là 4.',
  },
  {
    id: 9,
    title: 'Nhiệt phân muối Ammonium nitrate sinh khí cười',
    category: 'nitrogen',
    condition: 't°',
    arrow: '->',
    reactants: [
      { formula: 'NH4NO3', displayLatex: '\\text{NH}_4\\text{NO}_3', targetCoef: 1, atoms: { N: 2, H: 4, O: 3 } },
    ],
    products: [
      { formula: 'N2O', displayLatex: '\\text{N}_2\\text{O}', targetCoef: 1, atoms: { N: 2, O: 1 } },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', targetCoef: 2, atoms: { H: 2, O: 1 } },
    ],
    balancedLatex: '\\text{NH}_4\\text{NO}_3 \\xrightarrow{t^o} \\text{N}_2\\text{O} + 2\\text{H}_2\\text{O}',
    balancingMethod: '1 phân tử NH4NO3 có 4 H -> tạo 2 phân tử H2O. Oxi còn lại: 3 - 2 = 1 O trong N2O. Hệ số: 1 -> 1 + 2.',
    hint: 'Hệ số cân bằng rất đơn giản: 1 phân tử muối phân hủy tạo 1 N2O và 2 H2O.',
  },
  {
    id: 10,
    title: 'Muối Ammonium sulfate phản ứng với dung dịch kiềm',
    category: 'nitrogen',
    condition: 't°',
    arrow: '->',
    reactants: [
      { formula: '(NH4)2SO4', displayLatex: '(\\text{NH}_4)_2\\text{SO}_4', targetCoef: 1, atoms: { N: 2, H: 8, S: 1, O: 4 } },
      { formula: 'NaOH', displayLatex: '\\text{NaOH}', targetCoef: 2, atoms: { Na: 1, O: 1, H: 1 } },
    ],
    products: [
      { formula: 'Na2SO4', displayLatex: '\\text{Na}_2\\text{SO}_4', targetCoef: 1, atoms: { Na: 2, S: 1, O: 4 } },
      { formula: 'NH3', displayLatex: '\\text{NH}_3', targetCoef: 2, atoms: { N: 1, H: 3 } },
      { formula: 'H2O', displayLatex: '\\text{H}_2\\text{O}', targetCoef: 2, atoms: { H: 2, O: 1 } },
    ],
    balancedLatex: '(\\text{NH}_4)_2\\text{SO}_4 + 2\\text{NaOH} \\xrightarrow{t^o} \\text{Na}_2\\text{SO}_4 + 2\\text{NH}_3 + 2\\text{H}_2\\text{O}',
    balancingMethod: 'Trong phân tử (NH4)2SO4 có 2 gốc NH4+ -> cần 2 phân tử NaOH để phản ứng -> giải phóng 2 NH3 và 2 H2O.',
    hint: 'Vì có 2 nhóm NH4+ nên cần 2 NaOH, tạo 2 NH3 và 2 H2O.',
  },
];
