import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

/**
 * TẦNG TIỀN XỬ LÝ TỰ PHỤC HỒI CHO KHỐI CÔNG THỨC TOÁN / LÝ / HOÁ (Self-Healing Math Preprocessor)
 * Xử lý tất cả các lỗi cú pháp thường gặp, bao gồm:
 * 1. Double/Multiple backslashes: \\\\text -> \text
 * 2. Unescaped percent sign: % trong môi trường toán là comment của LaTeX, phải escape thành \%
 * 3. Dấu phẩy thập phân kiểu Việt Nam: 0,5 -> 0{,}5 để KaTeX không chèn khoảng trắng phân tách toán tử
 * 4. Mũi tên hoá học hai chiều & một chiều: <=>, <-> -> \rightleftharpoons, -> -> \rightarrow
 * 5. Ký hiệu độ nhiệt độ: ^o, ^oC, ^0C -> ^\circ\text{C}
 * 6. Tự cân bằng dấu ngoặc nhọn { } nếu công thức bị thiếu đóng ngoặc (Self-healing balance)
 */
function healMathExpression(rawMath: string): string {
  if (!rawMath) return '';

  let math = rawMath.trim();

  // 1. Chuẩn hoá dấu gạch chéo ngược bị lặp: \\\\text -> \text, \\frac -> \frac
  math = math.replace(/\\+([a-zA-Z]+)/g, (_, cmd) => '\\' + cmd);

  // 2. Tự phục hồi ký tự % trong công thức toán:
  // Ký tự % là ký tự chú thích (comment) trong LaTeX, nếu không có dấu \ đằng trước thì KaTeX sẽ nuốt chửng đoạn sau
  math = math.replace(/(^|[^\\])%/g, '$1\\%');

  // 3. Chuẩn hoá dấu phẩy thập phân tiếng Việt (Ví dụ: 0,5 -> 0{,}5; 12,34 -> 12{,}34)
  // Trong LaTeX, dấu phẩy trong math mode mặc định thêm khoảng trống (punctuation space).
  // Bọc vào {,} giúp hiển thị liền mạch chuẩn xác theo quy chuẩn SGK Việt Nam.
  math = math.replace(/(\d+),(\d+)/g, '$1{,}$2');

  // 4. Chuẩn hoá ký hiệu độ C và góc độ
  math = math.replace(/\^([0oO])\s*C\b/g, '^\\circ\\text{C}');
  math = math.replace(/\^([0oO])\b/g, '^\\circ');

  // 5. Chuẩn hoá mũi tên phản ứng hoá học thông dụng
  math = math.replace(/<=>|<->|⇌/g, ' \\rightleftharpoons ');
  math = math.replace(/(^|[^\\-])->/g, '$1 \\rightarrow ');
  math = math.replace(/⎯+→/g, ' \\rightarrow ');

  // 6. Chuẩn hoá OCR enthalpy và ký hiệu delta
  math = math.replace(/[0o]\s*r\s*298\s*H[\s\t]*[∆]\s*/g, ' \\Delta_r H^o_{298} ');
  math = math.replace(/∆H|ΔH/g, '\\Delta H');
  math = math.replace(/∆|Δ/g, '\\Delta ');

  // 7. Cơ chế tự cân bằng ngoặc nhọn { } (Self-healing bracket balancer)
  // Nếu copy/paste thiếu dấu đóng ngoặc }, KaTeX sẽ vỡ. Tự động đếm và bù ngoặc.
  let openCount = 0;
  for (let i = 0; i < math.length; i++) {
    if (math[i] === '{' && (i === 0 || math[i - 1] !== '\\')) openCount++;
    if (math[i] === '}' && (i === 0 || math[i - 1] !== '\\')) openCount--;
  }
  if (openCount > 0) {
    math = math + '}'.repeat(openCount);
  }

  return math;
}

/**
 * Tiền xử lý toàn bộ đoạn văn bản trước khi phân tách:
 * - Chuẩn hoá các ký tự OCR cấp toàn cục
 * - Kiểm tra tính toàn vẹn của cặp dấu $
 */
function normalizeFullText(raw: string): string {
  if (!raw) return '';

  let str = raw;

  // Khử nhiễu OCR mũi tên có điều kiện nhiệt độ / xúc tác Pt
  str = str.replace(/[0o]\s*t\s*Pt\s*⎯+→\s*/g, ' \\xrightarrow{t^\\circ,\\text{ Pt}} ');
  str = str.replace(/[0o]\s*t\s*⎯+→\s*/g, ' \\xrightarrow{t^\\circ} ');
  str = str.replace(/⎯+→/g, ' \\rightarrow ');

  // Chuẩn hoá ký hiệu biến thiên enthalpy nhiệt tạo thành/phản ứng chuẩn
  str = str.replace(/[0o]\s*r\s*298\s*H[\s\t]*[∆]\s*/g, ' \\Delta_r H^o_{298} ');
  str = str.replace(/∆H/g, '\\Delta H');
  str = str.replace(/∆/g, '\\Delta ');

  // Tự động xử lý trường hợp lẻ dấu $: nếu số dấu $ là số lẻ và ký tự $ cuối cùng trơ trọi,
  // ta đóng dấu $ ở cuối hoặc chuyển $ trơ trọi thành ký hiệu text để tránh nuốt chửng toàn bộ văn bản
  const dollarCount = (str.match(/(?<!\\)\$/g) || []).length;
  if (dollarCount % 2 !== 0) {
    // Tìm vị trí $ cuối cùng
    const lastDollarIdx = str.lastIndexOf('$');
    // Nếu khoảng cách từ dấu $ cuối cùng đến hết chuỗi nhỏ hơn 40 ký tự và không có ký tự ngắt dòng
    if (str.length - lastDollarIdx < 50 && !str.slice(lastDollarIdx).includes('\n')) {
      str = str + '$';
    }
  }

  return str;
}

/**
 * Component hiển thị văn bản kết hợp công thức toán / lý / hoá với KaTeX
 * Tích hợp Tầng Tiền xử lý Tự phục hồi (Self-Healing) và Cách ly lỗi cấp độ Component.
 */
export const LatexText: React.FC<LatexTextProps> = ({ text, className = '', as = 'span' }) => {
  const renderedContent = useMemo(() => {
    if (!text) return '';

    // Bước 1: Tiền xử lý văn bản cấp hệ thống
    const normalized = normalizeFullText(text);

    // Bước 2: Phân tách an toàn giữa văn bản thường và các khối công thức ($$...$$ hoặc $...$)
    // Giới hạn độ dài nội dung trong $ để tránh tham lam nuốt nhầm văn bản dài
    const regex = /(\$\$[\s\S]*?\$\$|\$(?:\\\$|[^\$\n]){1,350}\$)/g;
    const parts = normalized.split(regex);

    return parts.map((part, index) => {
      // Trường hợp 1: Công thức dạng khối ($$...$$)
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const rawMath = part.slice(2, -2);
        const math = healMathExpression(rawMath);
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
            strict: false,
            trust: false,
          });

          // Nếu KaTeX fallback sinh ra thẻ lỗi katex-error, xử lý để hiển thị sạch sẽ
          const hasError = html.includes('class="katex-error"');

          return (
            <span
              key={index}
              className={`my-2.5 block w-full overflow-x-auto py-1 text-center touch-pan-x scrollbar-thin ${
                hasError ? 'text-amber-700 bg-amber-500/10 rounded px-2' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <span key={index} className="my-2 block w-full overflow-x-auto py-1 text-center font-mono text-sm text-amber-700">
              {part}
            </span>
          );
        }
      }

      // Trường hợp 2: Công thức nội dòng ($...$)
      if (part.startsWith('$') && part.endsWith('$')) {
        const rawMath = part.slice(1, -1);
        const math = healMathExpression(rawMath);
        try {
          const html = katex.renderToString(math, {
            displayMode: false,
            throwOnError: false,
            strict: false,
            trust: false,
          });

          const hasError = html.includes('class="katex-error"');

          return (
            <span
              key={index}
              className={`inline-math mx-0.5 inline-block align-baseline ${
                hasError ? 'text-amber-700 bg-amber-500/10 rounded px-1' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <span key={index} className="mx-0.5 inline-block font-mono text-sm text-amber-700">
              {part}
            </span>
          );
        }
      }

      // Trường hợp 3: Đoạn văn bản thường (giữ nguyên cấu trúc xuống dòng \n)
      if (part.includes('\n')) {
        const subLines = part.split('\n');
        return (
          <span key={index}>
            {subLines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {line}
                {lIdx < subLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  }, [text]);

  const Component = as;
  return <Component className={className}>{renderedContent}</Component>;
};
