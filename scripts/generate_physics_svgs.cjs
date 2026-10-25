const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/images/physics');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function save(name, content) {
  fs.writeFileSync(path.join(outDir, name), content.trim(), 'utf-8');
  console.log(`Saved: ${name}`);
}

// 1. graph_xt_cau19.svg (2 dao động cùng chu kì lệch pha pi/2)
save('graph_xt_cau19.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 280" width="100%" height="100%">
  <rect width="520" height="280" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <g stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,3">
    <line x1="50" y1="50" x2="480" y2="50"/>
    <line x1="50" y1="230" x2="480" y2="230"/>
    <line x1="160" y1="30" x2="160" y2="250"/>
    <line x1="260" y1="30" x2="260" y2="250"/>
    <line x1="360" y1="30" x2="360" y2="250"/>
    <line x1="460" y1="30" x2="460" y2="250"/>
  </g>
  <!-- Axes -->
  <line x1="40" y1="140" x2="490" y2="140" stroke="#334155" stroke-width="2"/>
  <polygon points="495,140 485,135 485,145" fill="#334155"/>
  <text x="485" y="160" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#1e293b">t (s)</text>
  
  <line x1="60" y1="260" x2="60" y2="20" stroke="#334155" stroke-width="2"/>
  <polygon points="60,15 55,25 65,25" fill="#334155"/>
  <text x="25" y="25" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#1e293b">x (m)</text>

  <text x="45" y="155" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">0</text>
  <text x="40" y="55" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">A</text>
  <text x="35" y="235" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">-A</text>
  <text x="255" y="158" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">T</text>

  <!-- Curve 1 (Red/Pink): Cosine peak at t=0 -->
  <!-- t=0: y=50. t=T/4 (x=160): y=140. t=T/2 (x=260): y=230. t=3T/4 (x=360): y=140. t=T (x=460): y=50. -->
  <path d="M 60,50 Q 110,50 160,140 Q 210,230 260,230 Q 310,230 360,140 Q 410,50 460,50" 
        fill="none" stroke="#ef4444" stroke-width="2.5"/>
  <text x="75" y="42" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ef4444">(1)</text>

  <!-- Curve 2 (Blue): Sine starting at t=0, y=140, peak at t=T/4 (x=160), y=50 -->
  <path d="M 60,140 Q 110,50 160,50 Q 210,50 260,140 Q 310,230 360,230 Q 410,230 460,140" 
        fill="none" stroke="#0ea5e9" stroke-width="2.5"/>
  <text x="175" y="42" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#0ea5e9">(2)</text>

  <!-- Legend -->
  <rect x="330" y="245" width="160" height="28" rx="6" fill="#ffffff" stroke="#e2e8f0"/>
  <line x1="340" y1="259" x2="360" y2="259" stroke="#ef4444" stroke-width="2.5"/>
  <text x="365" y="263" font-family="system-ui, sans-serif" font-size="11" fill="#475569">Vật 1</text>
  <line x1="410" y1="259" x2="430" y2="259" stroke="#0ea5e9" stroke-width="2.5"/>
  <text x="435" y="263" font-family="system-ui, sans-serif" font-size="11" fill="#475569">Vật 2 (Δφ = π/2)</text>
</svg>`);

// 2. graph_vt_cau22.svg (đồ thị vận tốc v-t)
save('graph_vt_cau22.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 280" width="100%" height="100%">
  <rect width="520" height="280" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <g stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,3">
    <line x1="50" y1="60" x2="480" y2="60"/>
    <line x1="50" y1="220" x2="480" y2="220"/>
    <line x1="140" y1="30" x2="140" y2="250"/>
    <line x1="220" y1="30" x2="220" y2="250"/>
    <line x1="300" y1="30" x2="300" y2="250"/>
    <line x1="380" y1="30" x2="380" y2="250"/>
    <line x1="460" y1="30" x2="460" y2="250"/>
  </g>
  <!-- Axes -->
  <line x1="40" y1="140" x2="490" y2="140" stroke="#334155" stroke-width="2"/>
  <polygon points="495,140 485,135 485,145" fill="#334155"/>
  <text x="485" y="160" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#1e293b">t (s)</text>
  
  <line x1="60" y1="260" x2="60" y2="20" stroke="#334155" stroke-width="2"/>
  <polygon points="60,15 55,25 65,25" fill="#334155"/>
  <text x="15" y="25" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#1e293b">v (cm/s)</text>

  <text x="45" y="155" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">0</text>
  <text x="25" y="65" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">ωA</text>
  <text x="20" y="225" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">-ωA</text>

  <text x="130" y="158" font-family="system-ui, sans-serif" font-size="12" fill="#334155">T/4</text>
  <text x="210" y="158" font-family="system-ui, sans-serif" font-size="12" fill="#334155">T/2</text>
  <text x="290" y="158" font-family="system-ui, sans-serif" font-size="12" fill="#334155">3T/4</text>
  <text x="375" y="158" font-family="system-ui, sans-serif" font-size="12" fill="#334155">T</text>
  <text x="450" y="158" font-family="system-ui, sans-serif" font-size="12" fill="#334155">5T/4</text>

  <!-- Curve: -sin curve or sin curve. At t=0 v=0, at T/4 v=max ωA (or -ωA) -->
  <path d="M 60,140 Q 100,220 140,220 Q 180,220 220,140 Q 260,60 300,60 Q 340,60 380,140 Q 420,220 460,220" 
        fill="none" stroke="#2563eb" stroke-width="2.5"/>

  <!-- Horizontal tangents indicating zero slope -->
  <circle cx="140" cy="220" r="5" fill="#f59e0b"/>
  <line x1="110" y1="220" x2="170" y2="220" stroke="#f59e0b" stroke-width="2" stroke-dasharray="2,2"/>
  <circle cx="300" cy="60" r="5" fill="#f59e0b"/>
  <line x1="270" y1="60" x2="330" y2="60" stroke="#f59e0b" stroke-width="2" stroke-dasharray="2,2"/>
  <text x="180" y="45" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#d97706">Tại t = T/4, 3T/4: Tiếp tuyến ngang → Độ dốc a = dv/dt = 0</text>
</svg>`);

// 3. graph_energy_x_cau29.svg (động năng & thế năng theo x)
save('graph_energy_x_cau29.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
  <rect width="500" height="280" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Axes -->
  <line x1="40" y1="230" x2="460" y2="230" stroke="#334155" stroke-width="2"/>
  <polygon points="465,230 455,225 455,235" fill="#334155"/>
  <text x="465" y="235" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#1e293b">x</text>

  <line x1="250" y1="250" x2="250" y2="25" stroke="#334155" stroke-width="2"/>
  <polygon points="250,20 245,30 255,30" fill="#334155"/>
  <text x="260" y="25" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#1e293b">W</text>

  <!-- Labels -->
  <text x="242" y="246" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">0</text>
  <text x="90" y="246" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">-A</text>
  <text x="390" y="246" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">A</text>
  <line x1="100" y1="70" x2="400" y2="70" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
  <text x="215" y="65" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#475569">Cơ năng W</text>

  <!-- Parabola 1: The nang Wt (be lom huong len) - Red -->
  <path d="M 100,70 Q 250,230 400,70" fill="none" stroke="#ef4444" stroke-width="3"/>
  <text x="330" y="110" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ef4444">Wt (bề lõm hướng lên)</text>

  <!-- Parabola 2: Dong nang Wd (be lom huong xuong) - Blue -->
  <path d="M 100,230 Q 250,70 400,230" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-dasharray="4,3"/>
  <text x="330" y="170" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#3b82f6">Wđ (bề lõm hướng xuống)</text>
</svg>`);

// 4. graph_resonance_cau42.svg (đồ thị cộng hưởng hai môi trường cản)
save('graph_resonance_cau42.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 280" width="100%" height="100%">
  <rect width="500" height="280" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Axes -->
  <line x1="50" y1="240" x2="460" y2="240" stroke="#334155" stroke-width="2"/>
  <polygon points="465,240 455,235 455,245" fill="#334155"/>
  <text x="440" y="260" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">f (Tần số lực)</text>

  <line x1="80" y1="250" x2="80" y2="25" stroke="#334155" stroke-width="2"/>
  <polygon points="80,20 75,30 85,30" fill="#334155"/>
  <text x="15" y="25" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Biên độ (A)</text>

  <text x="70" y="255" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">0</text>
  <text x="235" y="255" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#0284c7">f₀ (riêng)</text>
  <line x1="250" y1="240" x2="250" y2="40" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>

  <!-- Curve A: Narrow & High (Less resistance) -->
  <path d="M 100,225 C 180,220 220,120 250,50 C 280,120 320,220 420,225" 
        fill="none" stroke="#2563eb" stroke-width="3"/>
  <text x="245" y="42" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#2563eb">A</text>

  <!-- Curve B: Flat & Low (More resistance) -->
  <path d="M 90,230 C 160,225 210,180 250,130 C 290,180 340,225 430,230" 
        fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="5,3"/>
  <text x="245" y="122" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#06b6d4">B</text>

  <!-- Note -->
  <rect x="280" y="70" width="195" height="42" rx="6" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="290" y="87" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#1e293b">• Đỉnh A cao hơn đỉnh B</text>
  <text x="290" y="103" font-family="system-ui, sans-serif" font-size="11" fill="#475569">⇒ Lực cản trường hợp A &lt; B</text>
</svg>`);

// 5. graph_xt_tf_cau1.svg (Phần II Câu 1: dao động A và B)
save('graph_xt_tf_cau1.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 290" width="100%" height="100%">
  <rect width="540" height="290" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <g stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3,3">
    <line x1="50" y1="50" x2="490" y2="50"/>
    <line x1="50" y1="95" x2="490" y2="95"/>
    <line x1="50" y1="185" x2="490" y2="185"/>
    <line x1="50" y1="230" x2="490" y2="230"/>
    <line x1="110" y1="30" x2="110" y2="250"/>
    <line x1="170" y1="30" x2="170" y2="250"/>
    <line x1="230" y1="30" x2="230" y2="250"/>
    <line x1="290" y1="30" x2="290" y2="250"/>
    <line x1="350" y1="30" x2="350" y2="250"/>
    <line x1="410" y1="30" x2="410" y2="250"/>
    <line x1="470" y1="30" x2="470" y2="250"/>
  </g>
  <!-- Axes -->
  <line x1="40" y1="140" x2="500" y2="140" stroke="#334155" stroke-width="2"/>
  <polygon points="505,140 495,135 495,145" fill="#334155"/>
  <text x="495" y="160" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">t (ms)</text>

  <line x1="50" y1="260" x2="50" y2="20" stroke="#334155" stroke-width="2"/>
  <polygon points="50,15 45,25 55,25" fill="#334155"/>
  <text x="15" y="25" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">x (cm)</text>

  <text x="25" y="55" font-family="system-ui, sans-serif" font-size="11" fill="#334155">20</text>
  <text x="25" y="100" font-family="system-ui, sans-serif" font-size="11" fill="#334155">10</text>
  <text x="20" y="190" font-family="system-ui, sans-serif" font-size="11" fill="#334155">-10</text>
  <text x="20" y="235" font-family="system-ui, sans-serif" font-size="11" fill="#334155">-20</text>
  <text x="100" y="155" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">10</text>
  <text x="160" y="155" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">20</text>
  <text x="220" y="155" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">30</text>
  <text x="280" y="155" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">40</text>
  <text x="340" y="155" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">50</text>
  <text x="400" y="155" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">60</text>

  <!-- Curve A: passes VTCB at 10ms, peak at 30ms (x=20) -->
  <path d="M 50,230 Q 80,140 110,140 Q 170,140 230,50 Q 290,140 350,140 Q 410,230 470,140" 
        fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <text x="475" y="130" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#2563eb">A</text>

  <!-- Curve B: peak at 10ms (x=20), VTCB at 30ms -->
  <path d="M 50,95 Q 80,50 110,50 Q 170,140 230,140 Q 290,230 350,230 Q 410,140 470,50" 
        fill="none" stroke="#dc2626" stroke-width="2.5"/>
  <text x="475" y="60" font-family="system-ui, sans-serif" font-size="13" font-weight="800" fill="#dc2626">B</text>
</svg>`);

// 6. graph_xt_tf_cau2.svg (Phần II Câu 2: dao động T=0.6s, A=9cm)
save('graph_xt_tf_cau2.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 280" width="100%" height="100%">
  <rect width="520" height="280" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Axes -->
  <line x1="40" y1="140" x2="490" y2="140" stroke="#334155" stroke-width="2"/>
  <polygon points="495,140 485,135 485,145" fill="#334155"/>
  <text x="485" y="160" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">t (s)</text>

  <line x1="60" y1="260" x2="60" y2="20" stroke="#334155" stroke-width="2"/>
  <polygon points="60,15 55,25 65,25" fill="#334155"/>
  <text x="20" y="25" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">x (cm)</text>

  <text x="40" y="155" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">O</text>
  <text x="45" y="55" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#334155">9</text>
  <text x="38" y="235" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#334155">-9</text>

  <line x1="120" y1="30" x2="120" y2="250" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="110" y="158" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#0284c7">0,1</text>
  <line x1="300" y1="30" x2="300" y2="250" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="290" y="158" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#0284c7">0,4</text>

  <!-- Curve: A=9, T=0.6s (360px). At t=0.1 (x=120) x=0 đi xuống; at t=0.4 (x=300) x=0 đi lên. T/2 = 0.3s -->
  <path d="M 60,65 Q 90,65 120,140 Q 165,225 210,225 Q 255,225 300,140 Q 345,55 390,55 Q 435,55 480,140" 
        fill="none" stroke="#0ea5e9" stroke-width="2.5"/>
  <circle cx="120" cy="140" r="4" fill="#0284c7"/>
  <circle cx="300" cy="140" r="4" fill="#0284c7"/>
  <text x="170" y="260" font-family="system-ui, sans-serif" font-size="11" fill="#475569">T/2 = 0,4 - 0,1 = 0,3 s ⇒ Chu kì T = 0,6 s</text>
</svg>`);

// 7. graph_energy_tf_cau3.svg (Phần II Câu 3: Wt, Wđ cắt nhau ở x=8cm)
save('graph_energy_tf_cau3.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 290" width="100%" height="100%">
  <rect width="520" height="290" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Axes -->
  <line x1="40" y1="220" x2="480" y2="220" stroke="#334155" stroke-width="2"/>
  <polygon points="485,220 475,215 475,225" fill="#334155"/>
  <text x="475" y="240" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">x (cm)</text>

  <line x1="260" y1="250" x2="260" y2="25" stroke="#334155" stroke-width="2"/>
  <polygon points="260,20 255,30 265,30" fill="#334155"/>
  <text x="270" y="25" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">W (J)</text>

  <text x="250" y="235" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">0</text>
  <text x="90" y="235" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">-A</text>
  <text x="420" y="235" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#334155">A</text>
  <text x="375" y="235" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#dc2626">8</text>

  <!-- W0 level -->
  <line x1="100" y1="60" x2="420" y2="60" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="240" y="55" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#475569">W₀</text>
  <text x="225" y="145" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#475569">W₀/2</text>
  <line x1="100" y1="140" x2="420" y2="140" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2,2"/>

  <!-- Wt parabola (upward) -->
  <path d="M 100,60 Q 260,220 420,60" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <text x="140" y="100" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#2563eb">Wt</text>

  <!-- Wd parabola (downward) -->
  <path d="M 100,220 Q 260,60 420,220" fill="none" stroke="#16a34a" stroke-width="2.5"/>
  <text x="140" y="170" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#16a34a">Wđ</text>

  <!-- Intersection point at x = 8 cm -->
  <circle cx="373" cy="140" r="5" fill="#dc2626"/>
  <line x1="373" y1="140" x2="373" y2="220" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3,3"/>
</svg>`);

// 8. graph_resonance_tf_cau5.svg (Phần II Câu 5: đỉnh tại 10 Hz)
save('graph_resonance_tf_cau5.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 270" width="100%" height="100%">
  <rect width="500" height="270" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Axes -->
  <line x1="50" y1="220" x2="460" y2="220" stroke="#334155" stroke-width="2"/>
  <polygon points="465,220 455,215 455,225" fill="#334155"/>
  <text x="390" y="240" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Tần số của lực (Hz)</text>

  <line x1="70" y1="230" x2="70" y2="25" stroke="#334155" stroke-width="2"/>
  <polygon points="70,20 65,30 75,30" fill="#334155"/>
  <text x="15" y="25" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Biên độ (cm)</text>

  <text x="60" y="235" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">0</text>
  <text x="150" y="235" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">5</text>
  <text x="245" y="235" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#dc2626">10</text>
  <text x="330" y="235" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">15</text>

  <line x1="250" y1="220" x2="250" y2="45" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3,3"/>
  <circle cx="250" cy="45" r="5" fill="#dc2626"/>

  <!-- Resonance Curve with single peak at 10 Hz (x=250) -->
  <path d="M 90,215 C 160,210 210,120 250,45 C 290,120 340,210 420,215" 
        fill="none" stroke="#2563eb" stroke-width="3"/>
  <text x="260" y="50" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#dc2626">Cộng hưởng f₀ = 10 Hz</text>
</svg>`);

// 9. pendulum_tf_cau6.svg (Con lắc đơn kéo ra góc alpha0)
save('pendulum_tf_cau6.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 280" width="100%" height="100%">
  <rect width="460" height="280" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Ceiling -->
  <line x1="160" y1="30" x2="300" y2="30" stroke="#334155" stroke-width="4"/>
  <g stroke="#64748b" stroke-width="1.5">
    <line x1="170" y1="30" x2="160" y2="20"/>
    <line x1="190" y1="30" x2="180" y2="20"/>
    <line x1="210" y1="30" x2="200" y2="20"/>
    <line x1="230" y1="30" x2="220" y2="20"/>
    <line x1="250" y1="30" x2="240" y2="20"/>
    <line x1="270" y1="30" x2="260" y2="20"/>
    <line x1="290" y1="30" x2="280" y2="20"/>
  </g>

  <!-- Vertical dashed line (Equilibrium) -->
  <line x1="230" y1="30" x2="230" y2="230" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>
  <circle cx="230" cy="230" r="14" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
  <text x="225" y="258" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#475569">VTCB (O)</text>

  <!-- Deflected string at angle alpha0 to point A -->
  <line x1="230" y1="30" x2="360" y2="190" stroke="#0284c7" stroke-width="2"/>
  <circle cx="360" cy="190" r="16" fill="#10b981" stroke="#047857" stroke-width="2"/>
  <text x="385" y="195" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#047857">A (α₀)</text>
  <text x="290" y="105" font-family="system-ui, sans-serif" font-size="12" fill="#0284c7">Chiều dài l</text>

  <!-- Arc showing angle alpha0 -->
  <path d="M 230,90 A 60 60 0 0 1 268,77" fill="none" stroke="#d97706" stroke-width="2"/>
  <text x="245" y="110" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#d97706">α₀</text>

  <!-- Damping note -->
  <rect x="20" y="200" width="180" height="55" rx="8" fill="#ffffff" stroke="#e2e8f0"/>
  <text x="30" y="222" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#dc2626">• Dao động tắt dần</text>
  <text x="30" y="240" font-family="system-ui, sans-serif" font-size="11" fill="#475569">• Biên độ giảm 3% / chu kì</text>
</svg>`);

// 10. graph_resonance_tf_cau7.svg (Đồ thị cộng hưởng 2 đỉnh B và C)
save('graph_resonance_tf_cau7.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 280" width="100%" height="100%">
  <rect width="520" height="280" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Axes -->
  <line x1="50" y1="230" x2="480" y2="230" stroke="#334155" stroke-width="2"/>
  <polygon points="485,230 475,225 475,235" fill="#334155"/>
  <text x="400" y="250" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Tần số lực (Hz)</text>

  <line x1="70" y1="240" x2="70" y2="25" stroke="#334155" stroke-width="2"/>
  <polygon points="70,20 65,30 75,30" fill="#334155"/>
  <text x="15" y="25" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">Biên độ (A)</text>

  <text x="60" y="245" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">0</text>
  <text x="175" y="245" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">f₁</text>
  <text x="250" y="245" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#0284c7">f₂</text>
  <text x="325" y="245" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">f₃</text>

  <!-- Curve 1 (Sharp peak B) -->
  <path d="M 90,225 C 170,220 215,130 255,45 C 295,130 340,220 440,225" 
        fill="none" stroke="#2563eb" stroke-width="3"/>
  <circle cx="255" cy="45" r="5" fill="#2563eb"/>
  <text x="255" y="35" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#2563eb">B (Đồ thị 1)</text>

  <!-- Curve 2 (Flatter peak C) -->
  <path d="M 90,228 C 170,225 215,190 255,145 C 295,190 340,225 440,228" 
        fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-dasharray="4,3"/>
  <circle cx="255" cy="145" r="5" fill="#0ea5e9"/>
  <text x="255" y="135" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="#0ea5e9">C (Đồ thị 2)</text>

  <line x1="255" y1="230" x2="255" y2="45" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
  <line x1="70" y1="45" x2="255" y2="45" stroke="#2563eb" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="45" y="49" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#2563eb">A₁</text>
  <line x1="70" y1="145" x2="255" y2="145" stroke="#0ea5e9" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="45" y="149" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#0ea5e9">A₃</text>
</svg>`);

// 11. graph_xt_mock_cau16.svg (Đề minh họa Câu 16: T=40ms, A=4cm)
save('graph_xt_mock_cau16.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 270" width="100%" height="100%">
  <rect width="500" height="270" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Axes -->
  <line x1="40" y1="135" x2="470" y2="135" stroke="#334155" stroke-width="2"/>
  <polygon points="475,135 465,130 465,140" fill="#334155"/>
  <text x="465" y="155" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">t (ms)</text>

  <line x1="60" y1="250" x2="60" y2="20" stroke="#334155" stroke-width="2"/>
  <polygon points="60,15 55,25 65,25" fill="#334155"/>
  <text x="20" y="25" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">x (cm)</text>

  <text x="45" y="150" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">0</text>
  <text x="45" y="45" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#334155">4</text>
  <text x="45" y="90" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">2</text>
  <text x="40" y="180" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">-2</text>
  <text x="40" y="225" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#334155">-4</text>

  <!-- 20 ms mark -->
  <line x1="240" y1="25" x2="240" y2="240" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="230" y="152" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#0284c7">20</text>

  <!-- 40 ms mark -->
  <line x1="420" y1="25" x2="420" y2="240" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="410" y="152" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#0284c7">40</text>

  <!-- Sine curve: T = 360px (40ms). t=0 (x=60, y=135). Peak t=10ms (x=150, y=45). 20ms (x=240, y=135). Trough t=30ms (x=330, y=225). End 40ms (x=420, y=135) -->
  <path d="M 60,135 Q 105,45 150,45 Q 195,45 240,135 Q 285,225 330,225 Q 375,225 420,135" 
        fill="none" stroke="#2563eb" stroke-width="3"/>
  <circle cx="420" cy="135" r="5" fill="#2563eb"/>
  <text x="250" y="255" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#475569">1 chu kì đầy đủ hoàn thành tại t = 40 ms = 0,04 s</text>
</svg>`);

// 12. graph_xt_mock_tf2.svg (Đề minh họa Phần II Câu 2: A=10cm, T=2s)
save('graph_xt_mock_tf2.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 280" width="100%" height="100%">
  <rect width="520" height="280" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Axes -->
  <line x1="40" y1="140" x2="490" y2="140" stroke="#334155" stroke-width="2"/>
  <polygon points="495,140 485,135 485,145" fill="#334155"/>
  <text x="485" y="160" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">t (s)</text>

  <line x1="60" y1="260" x2="60" y2="20" stroke="#334155" stroke-width="2"/>
  <polygon points="60,15 55,25 65,25" fill="#334155"/>
  <text x="15" y="25" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#1e293b">x (cm)</text>

  <text x="45" y="155" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">0</text>
  <text x="35" y="55" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#334155">10</text>
  <text x="30" y="235" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#334155">-10</text>

  <!-- t=3s mark is 1.5 cycles: 60px per 0.5s -> 1s is 120px (x=180), 2s is 240px (x=300), 3s is 360px (x=420) -->
  <line x1="180" y1="30" x2="180" y2="250" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="175" y="155" font-family="system-ui, sans-serif" font-size="12" fill="#64748b">1</text>
  <line x1="300" y1="30" x2="300" y2="250" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="295" y="155" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#0284c7">2</text>
  <line x1="420" y1="30" x2="420" y2="250" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="415" y="155" font-family="system-ui, sans-serif" font-size="12" font-weight="800" fill="#dc2626">3</text>

  <!-- Curve: A=10, at t=0 x=0 đi lên, peak at t=0.5s (y=50), VTCB at t=1s (y=140), bottom at t=1.5s (y=230), VTCB at t=2s (y=140), peak at t=2.5s (y=50), VTCB at t=3s (y=140) -->
  <path d="M 60,140 Q 90,50 120,50 Q 150,50 180,140 Q 210,230 240,230 Q 270,230 300,140 Q 330,50 360,50 Q 390,50 420,140 Q 450,230 480,230" 
        fill="none" stroke="#0ea5e9" stroke-width="2.5"/>
  <circle cx="180" cy="140" r="4" fill="#0284c7"/>
  <circle cx="300" cy="140" r="4" fill="#0284c7"/>
  <circle cx="420" cy="140" r="4" fill="#dc2626"/>
  <text x="160" y="265" font-family="system-ui, sans-serif" font-size="11" fill="#475569">1,5 chu kì = 3 s ⇒ Chu kì T = 2 s, Tần số f = 0,5 Hz</text>
</svg>`);

console.log('All physics SVGs generated successfully!');
