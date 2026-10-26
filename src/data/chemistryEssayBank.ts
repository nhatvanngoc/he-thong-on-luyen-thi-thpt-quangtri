export interface ChemistryEssayQuestion {
  id: number;
  source: 'Đề cương' | 'Đề minh họa';
  topic: string;
  prompt: string;
  solution: string[];
}

// Worked solutions transcribed and calculated from the chemistry outline and sample exam.
export const CHEMISTRY_ESSAY_QUESTIONS: ChemistryEssayQuestion[] = [
  {
    id: 1, source: 'Đề cương', topic: 'Nitrogen, ammonia và nitric acid',
    prompt: 'Viết phương trình chứng minh: (a) $\\mathrm{N_2}$ vừa có tính oxi hóa vừa có tính khử; (b) $\\mathrm{NH_3}$ có tính base; (c) $\\mathrm{NH_3}$ có tính khử; (d) $\\mathrm{HNO_3}$ có tính acid và tính oxi hóa mạnh; (e) muối ammonium tác dụng với kiềm, bị nhiệt phân; (g) $\\mathrm{HNO_3}$ hình thành trong nước mưa khi có sấm sét.',
    solution: [
      '(a) Tính oxi hóa: $$\\mathrm{N_2+3H_2\\rightleftharpoons2NH_3}$$ Tính khử: $$\\mathrm{N_2+O_2\\xrightarrow{t^\\circ}2NO}$$',
      '(b) $$\\mathrm{NH_3+H_2O\\rightleftharpoons NH_4^++OH^-}$$',
      '(c) $$\\mathrm{2NH_3+3CuO\\xrightarrow{t^\\circ}N_2+3Cu+3H_2O}$$',
      '(d) Tính acid: $$\\mathrm{HNO_3+NaOH\\rightarrow NaNO_3+H_2O}$$ Tính oxi hóa: $$\\mathrm{Cu+4HNO_3(\\text{conc.})\\rightarrow Cu(NO_3)_2+2NO_2+2H_2O}$$',
      '(e) Với kiềm: $$\\mathrm{NH_4Cl+NaOH\\rightarrow NH_3\\uparrow+NaCl+H_2O}$$ Nhiệt phân: $$\\mathrm{NH_4HCO_3\\xrightarrow{t^\\circ}NH_3\\uparrow+CO_2\\uparrow+H_2O}$$',
      '(g) $$\\mathrm{N_2+O_2\\xrightarrow{\\text{lightning}}2NO;\\quad 2NO+O_2\\rightarrow2NO_2;\\quad 4NO_2+O_2+2H_2O\\rightarrow4HNO_3}$$',
    ],
  },
  {
    id: 2, source: 'Đề cương', topic: 'Cân bằng hóa học',
    prompt: 'Xét các cân bằng: (1) $\\mathrm{2NH_3(g)\\rightleftharpoons N_2(g)+3H_2(g)}$, $\\Delta H>0$; (2) $\\mathrm{2SO_2(g)+O_2(g)\\rightleftharpoons2SO_3(g)}$, $\\Delta H<0$; (3) $\\mathrm{CaCO_3(s)\\rightleftharpoons CaO(s)+CO_2(g)}$, $\\Delta H>0$; (4) $\\mathrm{H_2(g)+I_2(g)\\rightleftharpoons2HI(g)}$, $\\Delta H<0$. Nêu chiều chuyển dịch khi tăng nhiệt độ và khi giảm áp suất.',
    solution: [
      '(1) Tăng nhiệt độ: chiều thuận. Giảm áp suất: chiều nghịch ($2$ mol khí $\\rightleftharpoons4$ mol khí).',
      '(2) Tăng nhiệt độ: chiều nghịch. Giảm áp suất: chiều nghịch ($3$ mol khí $\\rightleftharpoons2$ mol khí).',
      '(3) Tăng nhiệt độ: chiều thuận. Giảm áp suất: chiều thuận (không có khí $\\rightleftharpoons1$ mol khí).',
      '(4) Tăng nhiệt độ: chiều nghịch. Giảm áp suất: không chuyển dịch (hai vế đều có $2$ mol khí).',
    ],
  },
  {
    id: 3, source: 'Đề cương', topic: 'Cân bằng hóa học',
    prompt: 'Ở $430^\\circ\\mathrm{C}$, $\\mathrm{H_2(g)+I_2(g)\\rightleftharpoons2HI(g)}$ có $K_C=53{,}96$. Bình $10\\,\\mathrm{L}$ ban đầu chứa $4{,}0\\,\\mathrm{g}$ $\\mathrm{H_2}$ và $406{,}4\\,\\mathrm{g}$ $\\mathrm{I_2}$. Tính nồng độ $\\mathrm{HI}$ ở cân bằng.',
    solution: [
      '$n(\\mathrm{H_2})=4/2=2\\,\\mathrm{mol}$; $n(\\mathrm{I_2})=406{,}4/254=1{,}6\\,\\mathrm{mol}$. Trong $10\\,\\mathrm{L}$: $[\\mathrm{H_2}]_0=0{,}20\\,\\mathrm{M}$; $[\\mathrm{I_2}]_0=0{,}16\\,\\mathrm{M}$.',
      'Đặt $x$ là nồng độ $\\mathrm{H_2}$ và $\\mathrm{I_2}$ đã phản ứng. Khi cân bằng: $[\\mathrm{H_2}]=0{,}20-x$; $[\\mathrm{I_2}]=0{,}16-x$; $[\\mathrm{HI}]=2x$.',
      '$K_C=\\dfrac{(2x)^2}{(0{,}20-x)(0{,}16-x)}=53{,}96$. Nghiệm phù hợp với $x\\le0{,}16$ là $x\\approx0{,}1375\\,\\mathrm{M}$.',
      'Vậy $[\\mathrm{HI}]_{cb}=2x\\approx0{,}275\\,\\mathrm{M}$.',
    ],
  },
  {
    id: 4, source: 'Đề cương', topic: 'Bài toán pH',
    prompt: 'Tính $\\mathrm{pH}$: (a) Hòa tan $247{,}9\\,\\mathrm{mL}$ khí $\\mathrm{HCl}$ ở điều kiện chuẩn thành $200\\,\\mathrm{mL}$ dung dịch; (b) pha $500\\,\\mathrm{mL}$ $\\mathrm{HCl}$ $0{,}2\\,\\mathrm{M}$ với $500\\,\\mathrm{mL}$ nước.',
    solution: [
      '(a) Lấy $V_m=24{,}79\\,\\mathrm{L\\,mol^{-1}}$ theo điều kiện chuẩn dùng trong đề: $n(\\mathrm{HCl})=0{,}2479/24{,}79=0{,}0100\\,\\mathrm{mol}$. $[\\mathrm{H^+}]=0{,}0100/0{,}200=0{,}0500\\,\\mathrm{M}$.',
      '$\\mathrm{pH}=-\\log(0{,}0500)\\approx1{,}30$.',
      '(b) $n(\\mathrm{HCl})=0{,}500\\times0{,}2=0{,}100\\,\\mathrm{mol}$; thể tích sau pha là $1{,}000\\,\\mathrm{L}$ nên $[\\mathrm{H^+}]=0{,}100\\,\\mathrm{M}$.',
      '$\\mathrm{pH}=-\\log(0{,}100)=1{,}00$.',
    ],
  },
  {
    id: 5, source: 'Đề cương', topic: 'Bài toán pH',
    prompt: 'Dung dịch $\\mathrm{Ba(OH)_2}$ ở $25^\\circ\\mathrm{C}$ có $\\mathrm{pH}=10{,}66$. Tính khối lượng $\\mathrm{Ba(OH)_2}$ cần để pha $125\\,\\mathrm{mL}$ dung dịch này.',
    solution: [
      '$\\mathrm{pOH}=14-10{,}66=3{,}34\\Rightarrow[\\mathrm{OH^-}]=10^{-3{,}34}\\approx4{,}57\\times10^{-4}\\,\\mathrm{M}$.',
      '$\\mathrm{Ba(OH)_2\\rightarrow Ba^{2+}+2OH^-}$, nên $C_{\\mathrm{Ba(OH)_2}}=[\\mathrm{OH^-}]/2\\approx2{,}28\\times10^{-4}\\,\\mathrm{M}$.',
      '$n=CV\\approx2{,}28\\times10^{-4}\\times0{,}125=2{,}86\\times10^{-5}\\,\\mathrm{mol}$.',
      '$m=nM\\approx2{,}86\\times10^{-5}\\times171{,}34=0{,}00490\\,\\mathrm{g}\\approx4{,}90\\,\\mathrm{mg}$.',
    ],
  },
  {
    id: 6, source: 'Đề cương', topic: 'Bài toán pH và trung hòa',
    prompt: 'Trộn $300\\,\\mathrm{mL}$ $\\mathrm{H_2SO_4}$ $0{,}025\\,\\mathrm{M}$ với $200\\,\\mathrm{mL}$ $\\mathrm{Ba(OH)_2}$ nồng độ $a\\,\\mathrm{M}$, thu được $500\\,\\mathrm{mL}$ dung dịch có $\\mathrm{pH}=12$. Viết phản ứng và tính $a$.',
    solution: [
      'Phản ứng: $$\\mathrm{H_2SO_4+Ba(OH)_2\\rightarrow BaSO_4\\downarrow+2H_2O}$$',
      '$n(\\mathrm{H_2SO_4})=0{,}300\\times0{,}025=0{,}0075\\,\\mathrm{mol}$ ⇒ cần $0{,}015\\,\\mathrm{mol}$ $\\mathrm{OH^-}$ để trung hòa.',
      '$\\mathrm{pH}=12⇒\\mathrm{pOH}=2$, $[\\mathrm{OH^-}]$ dư $=10^{-2}\\,\\mathrm{M}$. Trong $0{,}500\\,\\mathrm{L}$ có $0{,}0050\\,\\mathrm{mol}$ $\\mathrm{OH^-}$ dư.',
      'Tổng $n(\\mathrm{OH^-})$ từ $\\mathrm{Ba(OH)_2}=0{,}015+0{,}005=0{,}020\\,\\mathrm{mol}$ ⇒ $n[\\mathrm{Ba(OH)_2}]=0{,}010\\,\\mathrm{mol}$.',
      '$a=0{,}010/0{,}200=0{,}050\\,\\mathrm{M}$.',
    ],
  },
  {
    id: 7, source: 'Đề cương', topic: 'Cân bằng và hiệu suất tổng hợp ammonia',
    prompt: '$\\mathrm{N_2+3H_2\\rightleftharpoons2NH_3}$. Ban đầu $[\\mathrm{N_2}]=1{,}0\\,\\mathrm{M}$, $[\\mathrm{H_2}]=1{,}2\\,\\mathrm{M}$; khi cân bằng $[\\mathrm{NH_3}]=0{,}20\\,\\mathrm{M}$. Tính hiệu suất tổng hợp $\\mathrm{NH_3}$.',
    solution: [
      'Theo tỉ lệ phương trình, tạo $0{,}20\\,\\mathrm{M}$ $\\mathrm{NH_3}$ cần tiêu thụ $0{,}10\\,\\mathrm{M}$ $\\mathrm{N_2}$ và $0{,}30\\,\\mathrm{M}$ $\\mathrm{H_2}$.',
      '$\\mathrm{H_2}$ là chất giới hạn: nếu phản ứng hoàn toàn, $[\\mathrm{NH_3}]_{max}=2\\times(1{,}2/3)=0{,}80\\,\\mathrm{M}$.',
      '$H=0{,}20/0{,}80\\times100\\%=25\\%$.',
    ],
  },
  {
    id: 8, source: 'Đề cương', topic: 'Cân bằng và hiệu suất tổng hợp ammonia',
    prompt: 'Hỗn hợp $\\mathrm{N_2:H_2}$ có tỉ lệ mol $1:4$. Sau phản ứng tổng hợp $\\mathrm{NH_3}$, hỗn hợp khí có tỉ khối so với $\\mathrm{H_2}$ bằng $4$. Tính hiệu suất phản ứng.',
    solution: [
      'Chọn ban đầu $1\\,\\mathrm{mol}$ $\\mathrm{N_2}$ và $4\\,\\mathrm{mol}$ $\\mathrm{H_2}$: tổng khối lượng $=28+8=36\\,\\mathrm{g}$, tổng số mol $=5\\,\\mathrm{mol}$.',
      '$M(Y)=4M(\\mathrm{H_2})=8\\,\\mathrm{g\\,mol^{-1}}$ ⇒ tổng số mol sau phản ứng $=36/8=4{,}5\\,\\mathrm{mol}$.',
      '$\\mathrm{N_2+3H_2\\rightarrow2NH_3}$ làm tổng số mol giảm $2$ mol cho mỗi mol $\\mathrm{N_2}$ phản ứng. Mức phản ứng $x=(5-4{,}5)/2=0{,}25\\,\\mathrm{mol}$.',
      '$\\mathrm{N_2}$ là chất giới hạn; mức tối đa $x=1\\,\\mathrm{mol}$. Hiệu suất $=0{,}25/1\\times100\\%=25\\%$.',
    ],
  },
  {
    id: 9, source: 'Đề cương', topic: 'Bài toán pH thực tế',
    prompt: 'Dùng $\\mathrm{CaO}$ nâng $\\mathrm{pH}$ của $1{,}5\\,\\mathrm{m^3}$ nước thải từ $3$ lên $7$. Tính khối lượng $\\mathrm{CaO}$ tối thiểu; bỏ qua sự thủy phân các muối.',
    solution: [
      'Giả sử pH ban đầu do acid mạnh: $[\\mathrm{H^+}]=10^{-3}\\,\\mathrm{mol\\,L^{-1}}$; $V=1{,}5\\,\\mathrm{m^3}=1500\\,\\mathrm{L}$.',
      '$n(\\mathrm{H^+})=10^{-3}\\times1500=1{,}50\\,\\mathrm{mol}$. $\\mathrm{CaO+H_2O\\rightarrow Ca(OH)_2}$; mỗi mol $\\mathrm{CaO}$ cung cấp $2$ mol $\\mathrm{OH^-}$.',
      '$n(\\mathrm{CaO})=1{,}50/2=0{,}75\\,\\mathrm{mol}$ ⇒ $m=0{,}75\\times56{,}08\\approx42{,}1\\,\\mathrm{g}$.',
      'Đáp số: $m(\\mathrm{CaO})\\approx42\\,\\mathrm{g}$.',
    ],
  },
  {
    id: 10, source: 'Đề cương', topic: 'Quy trình Ostwald',
    prompt: 'Từ $340\\,\\mathrm{kg}$ $\\mathrm{NH_3}$, tính khối lượng dung dịch $\\mathrm{HNO_3}$ $60\\%$ thu được nếu hiệu suất toàn quá trình Ostwald là $90\\%$.',
    solution: [
      'Theo sơ đồ Ostwald, tỉ lệ tổng quát $\\mathrm{NH_3:HNO_3}=1:1$. $n(\\mathrm{NH_3})=340/17=20\\,\\mathrm{kmol}$.',
      '$n(\\mathrm{HNO_3})$ thực tế $=20\\times90\\%=18\\,\\mathrm{kmol}$ ⇒ $m(\\mathrm{HNO_3})=18\\times63=1134\\,\\mathrm{kg}$.',
      'Dung dịch $60\\%$ có khối lượng $1134/0{,}60=1890\\,\\mathrm{kg}$.',
    ],
  },
  {
    id: 11, source: 'Đề cương', topic: 'Bài toán acid–base và vỏ trứng',
    prompt: 'Hòa tan $1{,}0\\,\\mathrm{g}$ vỏ trứng trong $50\\,\\mathrm{mL}$ $\\mathrm{HCl}$ $0{,}4\\,\\mathrm{M}$. Lấy $10\\,\\mathrm{mL}$ dung dịch sau phản ứng, chuẩn độ vừa hết bằng $5{,}6\\,\\mathrm{mL}$ $\\mathrm{NaOH}$ $0{,}1\\,\\mathrm{M}$. Tính phần trăm $\\mathrm{CaCO_3}$ trong vỏ trứng.',
    solution: [
      '$\\mathrm{CaCO_3+2HCl\\rightarrow CaCl_2+CO_2+H_2O}$. Ban đầu $n(\\mathrm{HCl})=0{,}050\\times0{,}4=0{,}020\\,\\mathrm{mol}$.',
      '$\\mathrm{HCl}$ dư trong $10\\,\\mathrm{mL}$ mẫu $=0{,}0056\\times0{,}1=0{,}00056\\,\\mathrm{mol}$; trong $50\\,\\mathrm{mL}$ là $5$ lần: $0{,}00280\\,\\mathrm{mol}$.',
      '$\\mathrm{HCl}$ đã phản ứng $=0{,}0200-0{,}00280=0{,}0172\\,\\mathrm{mol}$ ⇒ $n(\\mathrm{CaCO_3})=0{,}0172/2=0{,}00860\\,\\mathrm{mol}$.',
      '$m(\\mathrm{CaCO_3})\\approx0{,}00860\\times100{,}09=0{,}861\\,\\mathrm{g}$ ⇒ hàm lượng $\\mathrm{CaCO_3}\\approx86{,}1\\%$. Nếu đề hỏi riêng phần trăm nguyên tố $\\mathrm{Ca}$ thì khoảng $34{,}5\\%$.',
    ],
  },
  {
    id: 12, source: 'Đề cương', topic: 'Trung hòa acid dạ dày',
    prompt: '$200\\,\\mathrm{mL}$ dung dịch $\\mathrm{HCl}$ có $\\mathrm{pH}=1{,}5$. Tính khối lượng tối thiểu $\\mathrm{Mg(OH)_2}$ để trung hòa hết lượng acid.',
    solution: [
      '$[\\mathrm{H^+}]=10^{-1{,}5}\\approx0{,}03162\\,\\mathrm{M}$ ⇒ $n(\\mathrm{H^+})=0{,}03162\\times0{,}200=0{,}00632\\,\\mathrm{mol}$.',
      '$\\mathrm{Mg(OH)_2+2HCl\\rightarrow MgCl_2+2H_2O}$ ⇒ $n[\\mathrm{Mg(OH)_2}]=0{,}00632/2=0{,}00316\\,\\mathrm{mol}$.',
      '$m\\approx0{,}00316\\times58{,}32=0{,}184\\,\\mathrm{g}\\approx184\\,\\mathrm{mg}$.',
    ],
  },
  {
    id: 13, source: 'Đề cương', topic: 'Sản xuất phân ammophos',
    prompt: 'Ammophos gồm $\\mathrm{NH_4H_2PO_4}$ và $\\mathrm{(NH_4)_2HPO_4}$ theo tỉ lệ mol $1:1$. Từ $5{,}88$ tấn $\\mathrm{H_3PO_4}$, tính thể tích $\\mathrm{NH_3}$ ở điều kiện chuẩn và khối lượng ammophos.',
    solution: [
      '$n(\\mathrm{H_3PO_4})=5880/98=60\\,\\mathrm{kmol}$. Với mỗi mol acid tạo hai muối theo tỉ lệ $1:1$, cần trung bình $(1+2)/2=1{,}5$ mol $\\mathrm{NH_3}$.',
      '$n(\\mathrm{NH_3})=60\\times1{,}5=90\\,\\mathrm{kmol}$. Dùng $V_m=24{,}79\\,\\mathrm{m^3\\,kmol^{-1}}$ theo điều kiện chuẩn của đề: $V\\approx2231\\,\\mathrm{m^3}$.',
      '$M(\\mathrm{NH_4H_2PO_4})=115$; $M(\\mathrm{(NH_4)_2HPO_4})=132\\,\\mathrm{kg\\,kmol^{-1}}$. Mỗi $2$ mol acid tạo tổng $247$ kg hai muối.',
      '$m(\\text{ammophos})=60\\times247=14820\\,\\mathrm{kg}=14{,}82$ tấn.',
    ],
  },
  {
    id: 14, source: 'Đề cương', topic: 'Chuẩn độ ammonia',
    prompt: 'Pha loãng $10\\,\\mathrm{mL}$ $\\mathrm{NH_3}$ ban đầu thành $100\\,\\mathrm{mL}$. Lấy $20\\,\\mathrm{mL}$ dung dịch đã pha loãng, chuẩn độ vừa hết bằng $17{,}4\\,\\mathrm{mL}$ $\\mathrm{HCl}$ $0{,}1\\,\\mathrm{M}$. Tính nồng độ $\\mathrm{NH_3}$ ban đầu.',
    solution: [
      '$\\mathrm{NH_3+HCl\\rightarrow NH_4Cl}$ (tỉ lệ mol $1:1$). $n(\\mathrm{HCl})=0{,}0174\\times0{,}1=0{,}00174\\,\\mathrm{mol}$.',
      '$20\\,\\mathrm{mL}$ dung dịch pha loãng chứa lượng $\\mathrm{NH_3}$ trong $2\\,\\mathrm{mL}$ dung dịch ban đầu (do pha $10\\,\\mathrm{mL}$ thành $100\\,\\mathrm{mL}$).',
      '$C_0(\\mathrm{NH_3})=0{,}00174/0{,}002=0{,}87\\,\\mathrm{mol\\,L^{-1}}$.',
    ],
  },
  {
    id: 15, source: 'Đề cương', topic: 'Nitrogen trong nước mưa',
    prompt: 'Nước mưa có $62\\,\\mathrm{mg\\,L^{-1}}$ $\\mathrm{NO_3^-}$. Mưa $5\\,\\mathrm{m^3}$ mỗi giờ trong $2{,}5$ giờ. Tính khối lượng nguyên tố nitrogen đưa xuống ruộng.',
    solution: [
      '$V_{\\text{rainwater}}=5\\times2{,}5=12{,}5\\,\\mathrm{m^3}=12500\\,\\mathrm{L}$.',
      '$m(\\mathrm{NO_3^-})=62\\times12500=775000\\,\\mathrm{mg}=775\\,\\mathrm{g}$.',
      'Phần khối lượng $\\mathrm{N}$ trong $\\mathrm{NO_3^-}$ là $14/62$ ⇒ $m(\\mathrm{N})=775\\times14/62=175\\,\\mathrm{g}$.',
    ],
  },
  {
    id: 16, source: 'Đề cương', topic: 'Xử lý phosphate trong nước thải',
    prompt: 'Nước thải chứa $16\\,\\mathrm{mg\\,L^{-1}}$ ion phosphate, lưu lượng $25000\\,\\mathrm{m^3\\,day^{-1}}$. Tính lượng $\\mathrm{FeCl_3}$ cần dùng mỗi ngày nếu tỉ lệ mol $\\mathrm{Fe:P}=1{,}25:1$.',
    solution: [
      'Giả sử $16\\,\\mathrm{mg\\,L^{-1}}$ tính theo khối lượng ion $\\mathrm{PO_4^{3-}}$. Lưu lượng $=25\\,000\\,000\\,\\mathrm{L\\,day^{-1}}$ ⇒ $m(\\mathrm{PO_4^{3-}})=400\\,\\mathrm{kg\\,day^{-1}}$.',
      '$n(\\mathrm{P})=n(\\mathrm{PO_4^{3-}})=400000/94{,}97\\approx4{,}21\\,\\mathrm{kmol\\,day^{-1}}$.',
      '$n(\\mathrm{FeCl_3})=1{,}25\\times4{,}21\\approx5{,}26\\,\\mathrm{kmol\\,day^{-1}}$.',
      '$m(\\mathrm{FeCl_3})=5{,}26\\times162{,}2\\approx854\\,\\mathrm{kg\\,day^{-1}}$. Nếu đề tính phosphate theo khối lượng $\\mathrm{P}$ thì cần đổi cơ sở tính.',
    ],
  },
  {
    id: 17, source: 'Đề minh họa', topic: 'Cân bằng hóa học và pH',
    prompt: 'Với cân bằng $\\mathrm{CaCO_3(s)\\rightleftharpoons CaO(s)+CO_2(g)}$, $\\Delta H=+178{,}5\\,\\mathrm{kJ}$, cần thay đổi nhiệt độ và áp suất thế nào để dịch chuyển theo chiều thuận? Tính $\\mathrm{pH}$ khi hòa tan $0{,}8\\,\\mathrm{g}$ $\\mathrm{NaOH}$ vào $200\\,\\mathrm{mL}$ nước.',
    solution: [
      'Phản ứng thuận thu nhiệt nên tăng nhiệt độ để dịch chuyển thuận.',
      'Vế thuận tạo thêm khí $\\mathrm{CO_2}$ nên giảm áp suất để cân bằng dịch chuyển thuận.',
      '$n(\\mathrm{NaOH})=0{,}8/40=0{,}020\\,\\mathrm{mol}$; $[\\mathrm{OH^-}]=0{,}020/0{,}200=0{,}10\\,\\mathrm{M}$.',
      '$\\mathrm{pOH}=1⇒\\mathrm{pH}=14-1=13$.',
    ],
  },
  {
    id: 18, source: 'Đề minh họa', topic: 'Phản ứng của muối ammonium',
    prompt: 'Hoàn thành và cân bằng: (1) nhiệt phân $\\mathrm{NH_4NO_3}$; (2) $\\mathrm{(NH_4)_2SO_4+NaOH}$; (3) $\\mathrm{(NH_4)_2CO_3+CaCl_2}$; (4) $\\mathrm{NH_4HCO_3+HCl}$.',
    solution: [
      '(1) $$\\mathrm{NH_4NO_3\\xrightarrow{t^\\circ}N_2O\\uparrow+2H_2O}$$',
      '(2) $$\\mathrm{(NH_4)_2SO_4+2NaOH\\rightarrow Na_2SO_4+2NH_3\\uparrow+2H_2O}$$',
      '(3) $$\\mathrm{(NH_4)_2CO_3+CaCl_2\\rightarrow CaCO_3\\downarrow+2NH_4Cl}$$',
      '(4) $$\\mathrm{NH_4HCO_3+HCl\\rightarrow NH_4Cl+CO_2\\uparrow+H_2O}$$',
    ],
  },
  {
    id: 19, source: 'Đề minh họa', topic: 'Nitrogen trong nước mưa',
    prompt: 'Nước mưa có $62\\,\\mathrm{mg\\,L^{-1}}$ $\\mathrm{NO_3^-}$. Mưa $5\\,\\mathrm{m^3}$ mỗi giờ trong $2{,}5$ giờ. Tính khối lượng nitrogen nhận được trên thửa ruộng.',
    solution: [
      '$V_{\\text{rainwater}}=5\\times2{,}5=12{,}5\\,\\mathrm{m^3}=12500\\,\\mathrm{L}$.',
      '$m(\\mathrm{NO_3^-})=62\\times12500=775000\\,\\mathrm{mg}=775\\,\\mathrm{g}$.',
      '$m(\\mathrm{N})=775\\times14/62=175\\,\\mathrm{g}$.',
    ],
  },
];
