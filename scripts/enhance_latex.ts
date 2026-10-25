import fs from 'fs';

let content = fs.readFileSync('src/data/physicsQuestionBank.ts', 'utf-8');

// Specific replacements in physicsQuestionBank.ts
const replacements: [string, string][] = [
  // Question 2
  ['x = Acos(ωt + φ)', '$x = A\\cos(\\omega t + \\varphi)$'],
  ['x là li độ (độ lệch khỏi VTCB tại thời điểm t); A là biên độ (độ lệch cực đại).', '$x$ là li độ (độ lệch khỏi VTCB tại thời điểm $t$); $A$ là biên độ (độ lệch cực đại).'],
  ['A > 0', '$A > 0$'],
  ['|x|_max', '$|x|_{\\max}$'],

  // Question 5 & 6
  ['f = 2πT.', '$f = 2\\pi T.$'],
  ['f = T / (2π).', '$f = \\frac{T}{2\\pi}.$'],
  ['f = 1/T.', '$f = \\frac{1}{T}.$'],
  ['f = T.', '$f = T.$'],
  ['f = 1/T hay T = 1/f.', '$f = \\frac{1}{T}$ hay $T = \\frac{1}{f}.$'],
  ['ω = 2π / T.', '$\\omega = \\frac{2\\pi}{T}.$'],
  ['ω = 2πT.', '$\\omega = 2\\pi T.$'],
  ['ω = T / (2π).', '$\\omega = \\frac{T}{2\\pi}.$'],
  ['ω = 1/T.', '$\\omega = \\frac{1}{T}.$'],
  ['công thức ω = 2π / T (đơn vị rad/s).', 'công thức $\\omega = \\frac{2\\pi}{T}$ (đơn vị $\\text{rad/s}$).'],
  ['ω = 2π / T = 2πf.', '$\\omega = \\frac{2\\pi}{T} = 2\\pi f.$'],

  // Question 7
  ['x₀ = A.cosφ và v₀ = -ωA.sinφ', '$x_0 = A\\cos\\varphi$ và $v_0 = -\\omega A\\sin\\varphi$'],

  // Question 8
  ['độ lệch pha Δφ = 0.', 'độ lệch pha $\\Delta\\varphi = 0$.'],
  ['lệch pha nhau π/2.', 'lệch pha nhau $\\frac{\\pi}{2}$.'],
  ['Δφ = 2kπ (với k = 0 thì Δφ = 0)', '$\\Delta\\varphi = 2k\\pi$ (với $k = 0$ thì $\\Delta\\varphi = 0$)'],
  ['Δφ = 2kπ (k ∈ ℤ): cùng pha; Δφ = (2k+1)π: ngược pha; Δφ = (2k+1)π/2: vuông pha.', '$\\Delta\\varphi = 2k\\pi$ ($k \\in \\mathbb{Z}$): cùng pha; $\\Delta\\varphi = (2k+1)\\pi$: ngược pha; $\\Delta\\varphi = (2k+1)\\frac{\\pi}{2}$: vuông pha.'],
  ['Δφ = 0 là cùng pha, Δφ = π là ngược pha.', '$\\Delta\\varphi = 0$ là cùng pha, $\\Delta\\varphi = \\pi$ là ngược pha.'],

  // Question 9
  ['v = ωAcos(ωt + φ).', '$v = \\omega A\\cos(\\omega t + \\varphi).$'],
  ['v = -ωAsin(ωt + φ).', '$v = -\\omega A\\sin(\\omega t + \\varphi).$'],
  ['v = -ω²Acos(ωt + φ).', '$v = -\\omega^2 A\\cos(\\omega t + \\varphi).$'],
  ['v = ωAsin(ωt + φ).', '$v = \\omega A\\sin(\\omega t + \\varphi).$'],
  ["v = x' = [A.cos(ωt + φ)]' = -ωA.sin(ωt + φ) = ωA.cos(ωt + φ + π/2).", "$v = x' = [A\\cos(\\omega t + \\varphi)]' = -\\omega A\\sin(\\omega t + \\varphi) = \\omega A\\cos(\\omega t + \\varphi + \\frac{\\pi}{2}).$"],
  ["v = x' = -ωA.sin(ωt + φ).", "$v = x' = -\\omega A\\sin(\\omega t + \\varphi).$"],
  ['v = -ωAsin(ωt + φ).', '$v = -\\omega A\\sin(\\omega t + \\varphi).$'],

  // Question 10
  ['vị trí có li độ x = A/2.', 'vị trí có li độ $x = \\frac{A}{2}$.'],
  ['|v|_max = ωA.', '$|v|_{\\max} = \\omega A$.'],
  ['|v| cực đại (|v|_max = ωA). Tại biên (x = ±A): v = 0.', '$|v|$ cực đại ($|v|_{\\max} = \\omega A$). Tại biên ($x = \\pm A$): $v = 0$.'],
  ['(v_max = +ωA khi qua VTCB theo chiều dương) và "độ lớn vận tốc cực đại" (|v|_max = ωA khi qua VTCB theo cả 2 chiều).', '($v_{\\max} = +\\omega A$ khi qua VTCB theo chiều dương) và "độ lớn vận tốc cực đại" ($|v|_{\\max} = \\omega A$ khi qua VTCB theo cả hai chiều).'],

  // Question 11
  ['a = ω²x.', '$a = \\omega^2 x.$'],
  ['a = -ωx.', '$a = -\\omega x.$'],
  ['a = ωx².', '$a = \\omega x^2.$'],
  ['a = -ω²x.', '$a = -\\omega^2 x.$'],
  ["a = x'' = v' = -ω²A.cos(ωt + φ) = -ω²x.", "$a = x'' = v' = -\\omega^2 A\\cos(\\omega t + \\varphi) = -\\omega^2 x.$"],
  ['a = -ω²x, gia tốc luôn', '$a = -\\omega^2 x$, gia tốc luôn'],
  ['(a = -ω²x, không phải +ω²x).', '($a = -\\omega^2 x$, không phải $+\\omega^2 x$).'],

  // Question 12
  ['Từ hệ thức a = -ω²x, khi vật ở vị trí cân bằng (x = 0) thì gia tốc của vật bằng 0 (a = 0).', 'Từ hệ thức $a = -\\omega^2 x$, khi vật ở vị trí cân bằng ($x = 0$) thì gia tốc của vật bằng 0 ($a = 0$).'],
  ['(a = 0) tại vị trí cân bằng (x = 0).', '($a = 0$) tại vị trí cân bằng ($x = 0$).'],
  ['(|a|_max = ω²A), tại VTCB gia tốc mới bằng 0.', '($|a|_{\\max} = \\omega^2 A$), tại VTCB gia tốc mới bằng 0.'],

  // Question 13 & 14
  ['sớm pha π/2 so với li độ.', 'sớm pha $\\frac{\\pi}{2}$ so với li độ.'],
  ['trễ pha π/2 so với li độ.', 'trễ pha $\\frac{\\pi}{2}$ so với li độ.'],
  ['x = Acos(ωt + φ) và v = ωAcos(ωt + φ + π/2). Do đó, vận tốc luôn sớm pha π/2 (vuông pha) so với li độ.', '$x = A\\cos(\\omega t + \\varphi)$ và $v = \\omega A\\cos(\\omega t + \\varphi + \\frac{\\pi}{2})$. Do đó, vận tốc luôn sớm pha $\\frac{\\pi}{2}$ (vuông pha) so với li độ.'],
  ['một góc π/2 rad (v sớm pha π/2 so với x).', 'một góc $\\frac{\\pi}{2}\\text{ rad}$ ($v$ sớm pha $\\frac{\\pi}{2}$ so với $x$).'],
  ['góc vuông π/2.', 'góc vuông $\\frac{\\pi}{2}$.'],
  ['a = -ω²x = ω²Acos(ωt + φ + π). Góc pha của gia tốc lệch π rad so với li độ nên gia tốc biến thiên ngược pha với li độ (và sớm pha π/2 so với vận tốc).', '$a = -\\omega^2 x = \\omega^2 A\\cos(\\omega t + \\varphi + \\pi)$. Góc pha của gia tốc lệch $\\pi\\text{ rad}$ so với li độ nên gia tốc biến thiên ngược pha với li độ (và sớm pha $\\frac{\\pi}{2}$ so với vận tốc).'],
  ['a sớm pha π/2 so với v.', '$a$ sớm pha $\\frac{\\pi}{2}$ so với $v$.'],

  // Question 15
  ['x = Acos(ωt + φ), đồ thị li độ - thời gian', '$x = A\\cos(\\omega t + \\varphi)$, đồ thị li độ - thời gian'],

  // Question 18
  ['x = 2cos(4πt + π/2) (cm). Pha của dao động tại thời điểm t = 2 s là', '$x = 2\\cos(4\\pi t + \\frac{\\pi}{2})\\text{ (cm)}$. Pha của dao động tại thời điểm $t = 2\\text{ s}$ là'],
  ['π/2 rad.', '$\\frac{\\pi}{2}\\text{ rad}.$'],
  ['4π rad.', '$4\\pi\\text{ rad}.$'],
  ['8,5π rad.', '$8{,}5\\pi\\text{ rad}.$'],
  ['8π rad.', '$8\\pi\\text{ rad}.$'],
  ['Φ(t) = ωt + φ. Thay t = 2 s vào ta được: Φ(2) = 4π × 2 + π/2 = 8π + 0,5π = 8,5π rad.', '$\\Phi(t) = \\omega t + \\varphi$. Thay $t = 2\\text{ s}$ vào ta được: $\\Phi(2) = 4\\pi \\times 2 + \\frac{\\pi}{2} = 8\\pi + 0{,}5\\pi = 8{,}5\\pi\\text{ rad}.$'],
  ['Φ = ωt + φ biểu thị trạng thái dao động ở thời điểm t.', '$\\Phi = \\omega t + \\varphi$ biểu thị trạng thái dao động ở thời điểm $t$.'],
  ['(t = 0 thì φ = π/2) và "pha dao động tại thời điểm t" (Φ = ωt + φ).', '($t = 0$ thì $\\varphi = \\frac{\\pi}{2}$) và "pha dao động tại thời điểm $t$" ($\\Phi = \\omega t + \\varphi$).'],

  // Question 19
  ['A = 0,2 m; T = 0,4 s.', '$A = 0{,}2\\text{ m}; T = 0{,}4\\text{ s}.$'],
  ['A = 0,2 m; T = 0,2 s.', '$A = 0{,}2\\text{ m}; T = 0{,}2\\text{ s}.$'],
  ['A = 0,4 m; T = 0,4 s.', '$A = 0{,}4\\text{ m}; T = 0{,}4\\text{ s}.$'],
  ['A = 0,1 m; T = 0,2 s.', '$A = 0{,}1\\text{ m}; T = 0{,}2\\text{ s}.$'],
  ['π rad.', '$\\pi\\text{ rad}.$'],
  ['π/4 rad.', '$\\frac{\\pi}{4}\\text{ rad}.$'],
  ['0 rad.', '$0\\text{ rad}.$'],
  ['|Δφ| = ω.Δt = (2π/T) × (T/4) = π/2 rad.', '$|\\Delta\\varphi| = \\omega\\Delta t = \\frac{2\\pi}{T} \\times \\frac{T}{4} = \\frac{\\pi}{2}\\text{ rad}.$'],
  ['Δφ = 2π × (Δt / T). Khi Δt = T/4 thì Δφ = π/2 rad (vuông pha).', '$\\Delta\\varphi = 2\\pi \\times \\frac{\\Delta t}{T}$. Khi $\\Delta t = \\frac{T}{4}$ thì $\\Delta\\varphi = \\frac{\\pi}{2}\\text{ rad}$ (vuông pha).'],
  ['độ lệch pha π/2 rad.', 'độ lệch pha $\\frac{\\pi}{2}\\text{ rad}$.'],

  // Question 20
  ['x = 5cos(10πt) (cm). Tốc độ cực đại của vật là', '$x = 5\\cos(10\\pi t)\\text{ (cm)}$. Tốc độ cực đại của vật là'],
  ['50π cm/s.', '$50\\pi\\text{ cm/s}.$'],
  ['5π cm/s.', '$5\\pi\\text{ cm/s}.$'],
  ['10π cm/s.', '$10\\pi\\text{ cm/s}.$'],
  ['50 cm/s.', '$50\\text{ cm/s}.$'],
  ['x = 5cos(10πt) cm, ta có biên độ A = 5 cm và tần số góc ω = 10π rad/s. Tốc độ cực đại: v_max = ωA = 10π × 5 = 50π cm/s.', '$x = 5\\cos(10\\pi t)\\text{ cm}$, ta có biên độ $A = 5\\text{ cm}$ và tần số góc $\\omega = 10\\pi\\text{ rad/s}$. Tốc độ cực đại: $v_{\\max} = \\omega A = 10\\pi \\times 5 = 50\\pi\\text{ cm/s}.$'],
  ['v_max = ωA.', '$v_{\\max} = \\omega A$.'],
  ['ω = 10π rad/s.', '$\\omega = 10\\pi\\text{ rad/s}$.'],

  // Question 21
  ['tần số góc ω = 2 rad/s. Khi vật có li độ x = -3 cm thì gia tốc của vật là', 'tần số góc $\\omega = 2\\text{ rad/s}$. Khi vật có li độ $x = -3\\text{ cm}$ thì gia tốc của vật là'],
  ['12 cm/s².', '$12\\text{ cm/s}^2.$'],
  ['-12 cm/s².', '$-12\\text{ cm/s}^2.$'],
  ['6 cm/s².', '$6\\text{ cm/s}^2.$'],
  ['-6 cm/s².', '$-6\\text{ cm/s}^2.$'],
  ['a = -ω²x: với ω = 2 rad/s và x = -3 cm, ta có a = -(2²) × (-3) = -4 × (-3) = +12 cm/s².', '$a = -\\omega^2 x$: với $\\omega = 2\\text{ rad/s}$ và $x = -3\\text{ cm}$, ta có $a = -(2^2) \\times (-3) = -4 \\times (-3) = +12\\text{ cm/s}^2.$'],
  ['a = -ω²x; khi x âm', '$a = -\\omega^2 x$; khi $x$ âm'],
  ['-4 * -3 = +12 cm/s²', '$-4 \\times (-3) = +12\\text{ cm/s}^2$'],

  // Question 26 (Thế năng)
  ['thế năng Wt của con lắc lò xo có độ cứng k tại li độ x là', 'thế năng $W_t$ của con lắc lò xo có độ cứng $k$ tại li độ $x$ là'],
  ['"Wt = 1/2 mv²."', '"$W_t = \\frac{1}{2}mv^2$."'],
  ['"Wt = 1/2 kx²."', '"$W_t = \\frac{1}{2}kx^2$."'],
  ['"Wt = kx²."', '"$W_t = kx^2$."'],
  ['"Wt = 1/2 kA²."', '"$W_t = \\frac{1}{2}kA^2$."'],
  ['công thức Wt = 1/2 kx².', 'công thức $W_t = \\frac{1}{2}kx^2$.'],
  ['Thế năng Wt = 1/2 kx².', 'Thế năng $W_t = \\frac{1}{2}kx^2$.'],
  ['W = Wđ + Wt luôn không đổi', '$W = W_đ + W_t$ luôn không đổi'],
  ['W = Wđ + Wt = 1/2 kA² = hằng số.', '$W = W_đ + W_t = \\frac{1}{2}kA^2 = \\text{hằng số}.$'],

  // Question 30
  ['thế năng Wt = 0 nên toàn bộ cơ năng chuyển hóa thành động năng, động năng đạt cực đại Wđ_max = W = 1/2 mv_max².', 'thế năng $W_t = 0$ nên toàn bộ cơ năng chuyển hóa thành động năng, động năng đạt cực đại $W_{đ\\max} = W = \\frac{1}{2}mv_{\\max}^2$.'],
  ['Tại VTCB: Wđ cực đại, Wt = 0. Tại vị trí biên: Wt cực đại, Wđ = 0.', 'Tại VTCB: $W_đ$ cực đại, $W_t = 0$. Tại vị trí biên: $W_t$ cực đại, $W_đ = 0$.'],
  ['Đồ thị của thế năng Wt là', 'Đồ thị của thế năng $W_t$ là'],
  ['Thế năng Wt = 1/2 kx² là hàm bậc hai theo li độ x với hệ số a = 1/2 k > 0. Đồ thị Wt theo x có đỉnh tại gốc tọa độ (0, 0) và có bề lõm hướng lên trên.', 'Thế năng $W_t = \\frac{1}{2}kx^2$ là hàm bậc hai theo li độ $x$ với hệ số $a = \\frac{1}{2}k > 0$. Đồ thị $W_t$ theo $x$ có đỉnh tại gốc tọa độ $(0, 0)$ và có bề lõm hướng lên trên.'],
  ['Wt = 1/2 kx² là parabol bề lõm hướng lên; Wđ = W - 1/2 kx² là parabol bề lõm hướng xuống.', '$W_t = \\frac{1}{2}kx^2$ là parabol bề lõm hướng lên; $W_đ = W - \\frac{1}{2}kx^2$ là parabol bề lõm hướng xuống.'],
  ['Động năng Wđ mới có bề lõm hướng xuống, thế năng Wt có bề lõm hướng lên.', 'Động năng $W_đ$ mới có bề lõm hướng xuống, thế năng $W_t$ có bề lõm hướng lên.'],

  // Question 32 con lắc đơn Wđ = Wt
  ['(Wđ = Wt) thì li độ góc α của con lắc liên hệ với biên độ góc α₀ theo biểu thức nào sau đây?', '($W_đ = W_t$) thì li độ góc $\\alpha$ của con lắc liên hệ với biên độ góc $\\alpha_0$ theo biểu thức nào sau đây?'],
  ['W = Wđ + Wt. Khi Wđ = Wt thì W = 2Wt ⇔ 1/2 mglα₀² = 2 × (1/2 mglα²) ⇔ α² = α₀² / 2 ⇔ α = ± α₀ / √2.', '$W = W_đ + W_t$. Khi $W_đ = W_t$ thì $W = 2W_t \\Leftrightarrow \\frac{1}{2}mg\\ell\\alpha_0^2 = 2 \\times (\\frac{1}{2}mg\\ell\\alpha^2) \\Leftrightarrow \\alpha^2 = \\frac{\\alpha_0^2}{2} \\Leftrightarrow \\alpha = \\pm \\frac{\\alpha_0}{\\sqrt{2}}.$'],
  ['Khi Wđ = n.Wt thì li độ góc α = ± α₀ / √(n + 1). Với n = 1: α = ± α₀ / √2.', 'Khi $W_đ = n W_t$ thì li độ góc $\\alpha = \\pm \\frac{\\alpha_0}{\\sqrt{n + 1}}$. Với $n = 1$: $\\alpha = \\pm \\frac{\\alpha_0}{\\sqrt{2}}.$'],
  ['α = ± α₀ / 2 (đó là vị trí Wt = W/4, tức Wđ = 3Wt).', '$\\alpha = \\pm \\frac{\\alpha_0}{2}$ (đó là vị trí $W_t = \\frac{W}{4}$, tức $W_đ = 3W_t$).'],

  // Question 35 & 50 & 51
  ['F = F₀cos(ωt + φ)', '$F = F_0\\cos(\\omega t + \\varphi)$'],
  ['Fn = F₀sin(10πt)', '$F_n = F_0\\sin(10\\pi t)$'],
  ['ω = 10π rad/s, suy ra tần số của lực cưỡng bức là f = ω / (2π) = 10π / (2π) = 5 Hz. Hiện tượng cộng hưởng xảy ra khi tần số riêng f₀ = f = 5 Hz.', '$\\omega = 10\\pi\\text{ rad/s}$, suy ra tần số của lực cưỡng bức là $f = \\frac{\\omega}{2\\pi} = \\frac{10\\pi}{2\\pi} = 5\\text{ Hz}$. Hiện tượng cộng hưởng xảy ra khi tần số riêng $f_0 = f = 5\\text{ Hz}$.'],
  ['x = Acos(ωt), phương trình vận tốc', '$x = A\\cos(\\omega t)$, phương trình vận tốc'],
  ['"v = -Asin(ωt)."', '"$v = -\\omega A\\sin(\\omega t)$."'],
  ['"v = ωAsin(ωt)."', '"$v = \\omega A\\sin(\\omega t)$."'],
  ['"v = -ωAsin(ωt)."', '"$v = -\\omega A\\sin(\\omega t)$."'],
  ['"v = ωAcos(ωt)."', '"$v = \\omega A\\cos(\\omega t)$."'],

  // Question 54
  ['m = 100 g = 0,1 kg; A = 8 cm = 0,08 m; ω = 10 rad/s. Độ cứng lò xo: k = mω² = 0,1 × 10² = 10 N/m. Thế năng cực đại bằng cơ năng: Wt_max = 1/2 kA² = 1/2 × 10 × (0,08)² = 5 × 0,0064 = 0,032 J = 32 mJ.', '$m = 100\\text{ g} = 0{,}1\\text{ kg}; A = 8\\text{ cm} = 0{,}08\\text{ m}; \\omega = 10\\text{ rad/s}$. Độ cứng lò xo: $k = m\\omega^2 = 0{,}1 \\times 10^2 = 10\\text{ N/m}$. Thế năng cực đại bằng cơ năng: $W_{t\\max} = \\frac{1}{2}kA^2 = \\frac{1}{2} \\times 10 \\times (0{,}08)^2 = 5 \\times 0{,}0064 = 0{,}032\\text{ J} = 32\\text{ mJ}.$'],

  // TF #3
  ['Tại x = A thì thế năng Wt bằng 0.', 'Tại $x = A$ thì thế năng $W_t$ bằng 0.'],
  ['Từ x = 0 đến x = A động năng tăng.', 'Từ $x = 0$ đến $x = A$ động năng tăng.'],
  ['Tại x = A (vị trí biên), thế năng đạt giá trị cực đại Wt = W₀ = 1/2 kA², còn động năng mới bằng 0.', 'Tại $x = A$ (vị trí biên), thế năng đạt giá trị cực đại $W_t = W_0 = \\frac{1}{2}kA^2$, còn động năng mới bằng 0.'],
  ['Khi vật đi từ x = 0 (VTCB) ra x = A (biên), thế năng tăng dần nên động năng giảm dần từ cực đại về 0.', 'Khi vật đi từ $x = 0$ (VTCB) ra $x = A$ (biên), thế năng tăng dần nên động năng giảm dần từ cực đại về 0.'],
  ['Tại x = 8 cm hai đường parabol cắt nhau ở mức W₀/2, tức là Wđ = Wt (động năng bằng thế năng), không phải Wđ = 2Wt.', 'Tại $x = 8\\text{ cm}$ hai đường parabol cắt nhau ở mức $W_0 / 2$, tức là $W_đ = W_t$ (động năng bằng thế năng), không phải $W_đ = 2W_t$.'],
  ['Tại điểm cắt Wđ = Wt ⇒ x = A / √2 = 8 cm ⇒ A = 8√2 cm = 0,08√2 m. Cơ năng: W₀ = 1/2 kA² = 1/2 × 100 × (0,08√2)² = 50 × 0,0128 = 0,64 J (không phải 64 J).', 'Tại điểm cắt $W_đ = W_t \\Rightarrow x = \\frac{A}{\\sqrt{2}} = 8\\text{ cm} \\Rightarrow A = 8\\sqrt{2}\\text{ cm} = 0{,}08\\sqrt{2}\\text{ m}$. Cơ năng: $W_0 = \\frac{1}{2}kA^2 = \\frac{1}{2} \\times 100 \\times (0{,}08\\sqrt{2})^2 = 50 \\times 0{,}0128 = 0{,}64\\text{ J}$ (không phải 64 J).'],
  ['Hai đường cong động năng và thế năng cắt nhau tại li độ x = ±A/√2 khi Wđ = Wt = W₀/2.', 'Hai đường cong động năng và thế năng cắt nhau tại li độ $x = \\pm \\frac{A}{\\sqrt{2}}$ khi $W_đ = W_t = \\frac{W_0}{2}$.'],

  // Short #3
  ['Phương trình x = 10cos(2t - 0,2) cm', 'Phương trình $x = 10\\cos(2t - 0{,}2)\\text{ cm}$'],
  ['Biên độ A = 10 cm, tần số góc ω = 2 rad/s', 'Biên độ $A = 10\\text{ cm}$, tần số góc $\\omega = 2\\text{ rad/s}$'],
  ['a_max = ω²A = 2² × 10 = 4 × 10 = 40 cm/s².', '$a_{\\max} = \\omega^2 A = 2^2 \\times 10 = 4 \\times 10 = 40\\text{ cm/s}^2.$'],
  ['Gia tốc cực đại a_max = ω²A = 2² * 10 = 40 cm/s²', 'Gia tốc cực đại $a_{\\max} = \\omega^2 A = 2^2 \\times 10 = 40\\text{ cm/s}^2$']
];

let applied = 0;
for (const [target, replacement] of replacements) {
  if (content.includes(target)) {
    content = content.replaceAll(target, replacement);
    applied++;
  } else {
    console.log(`[NOT FOUND] "${target.slice(0, 40)}..."`);
  }
}

fs.writeFileSync('src/data/physicsQuestionBank.ts', content, 'utf-8');
console.log(`Enhanced ${applied} LaTeX strings in src/data/physicsQuestionBank.ts`);
