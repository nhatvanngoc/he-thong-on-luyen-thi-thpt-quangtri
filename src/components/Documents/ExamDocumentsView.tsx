import React, { useState, useMemo } from 'react';
import { SubjectId, ExamDocument } from '../../types/biology';
import {
  FileText,
  Download,
  ExternalLink,
  Search,
  Filter,
  Eye,
  X,
  FileSpreadsheet,
  CheckCircle2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

export const EXAM_DOCUMENTS: ExamDocument[] = [
  {
    id: 'doc-phys-outline',
    title: 'Đề Cương & Đề Minh Họa Giữa Kì 1 Vật Lí 11 - THPT Quảng Trị',
    subject: 'physics',
    description:
      'Tài liệu đề cương chính thức 10 trang bám sát cấu trúc mới: Tóm tắt lý thuyết Dao động điều hòa, Phương trình li độ - vận tốc - gia tốc, Năng lượng trong dao động điều hòa (động năng, thế năng), Dao động tắt dần, dao động cưỡng bức và hiện tượng cộng hưởng. Đi kèm 60 câu trắc nghiệm nhiều lựa chọn kèm đồ thị sóng li độ/vận tốc/gia tốc, 10 câu đúng/sai, 4 câu trả lời ngắn và câu hỏi tự luận.',
    fileName: 'De_Cuong_KTGK1_Vat_Ly_11_THPT_Quang_Tri.pdf',
    fileUrl: '/documents/De_Cuong_KTGK1_Vat_Ly_11_THPT_Quang_Tri.pdf',
    fileSize: '416 KB',
    type: 'pdf',
  },
  {
    id: 'doc-chem-outline',
    title: 'Đề Cương Ôn Tập Giữa Kì 1 Hóa Học 11 - THPT Quảng Trị',
    subject: 'chemistry',
    description:
      'Tài liệu đề cương chính thức gồm tóm tắt lý thuyết Cân bằng hóa học, Cân bằng trong dung dịch nước (pH, axit - bazơ), Nitrogen và Sulfur. Bao gồm hệ thống câu hỏi trắc nghiệm nhiều phương án, trắc nghiệm đúng/sai và câu hỏi trả lời ngắn theo chuẩn cấu trúc mới.',
    fileName: 'De_Cuong_GKI_Hoa_Hoc_11_THPT_Quang_Tri.pdf',
    fileUrl: '/documents/De_Cuong_GKI_Hoa_Hoc_11_THPT_Quang_Tri.pdf',
    fileSize: '490 KB',
    type: 'pdf',
  },
  {
    id: 'doc-chem-sample',
    title: 'Đề Thi Minh Họa Giữa Kì 1 Hóa Học 11 (Chuẩn Đề Mới GDPT 2018)',
    subject: 'chemistry',
    description:
      'Đề minh họa chuẩn cấu trúc 3 phần: Phần I (18 câu trắc nghiệm đơn 4,5 điểm), Phần II (4 câu trắc nghiệm đúng/sai 4,0 điểm), Phần III (6 câu trả lời ngắn 1,5 điểm). Kèm ma trận phân bổ năng lực và lời giải chi tiết.',
    fileName: 'De_Minh_Hoa_GKI_Hoa_Hoc_11_THPT_Quang_Tri.pdf',
    fileUrl: '/documents/De_Minh_Hoa_GKI_Hoa_Hoc_11_THPT_Quang_Tri.pdf',
    fileSize: '248 KB',
    type: 'pdf',
  },
  {
    id: 'doc-bio-spec',
    title: 'Ma Trận & Bản Đặc Tả Đề Kiểm Tra Giữa Kì 1 Sinh Học 11',
    subject: 'biology',
    description:
      'Bản đặc tả chi tiết các mức độ nhận thức (Nhận biết, Thông hiểu, Vận dụng) cho các chuyên đề: Khái quát trao đổi chất và chuyển hóa năng lượng, Trao đổi nước và khoáng ở thực vật, Quang hợp ở thực vật. Bám sát chuẩn đầu ra Chương trình GDPT 2018.',
    fileName: 'Ma_Tran_Ban_Dac_Ta_GKI_Sinh_Hoc_11_THPT_Quang_Tri.pdf',
    fileUrl: '/documents/Ma_Tran_Ban_Dac_Ta_GKI_Sinh_Hoc_11_THPT_Quang_Tri.pdf',
    fileSize: '307 KB',
    type: 'pdf',
  },
  {
    id: 'doc-hist-review',
    title: 'Bộ Câu Hỏi Ôn Tập Chuyên Đề Lịch Sử 11',
    subject: 'history',
    description:
      'Hệ thống câu hỏi ôn thi Giữa Kì 1 môn Lịch sử 11: Cách mạng tư sản thời cận đại, Quá trình xâm lược của chủ nghĩa tư bản vào Đông Nam Á, và Phong trào giải phóng dân tộc. Gồm các câu hỏi phân hóa tư duy lịch sử cao.',
    fileName: 'Bo_Cau_Hoi_On_Tap_Lich_Su_11.pdf',
    fileUrl: '/documents/Bo_Cau_Hoi_On_Tap_Lich_Su_11.pdf',
    fileSize: '262 KB',
    type: 'pdf',
  },
];

interface ExamDocumentsViewProps {
  currentSubject?: SubjectId;
}

export const ExamDocumentsView: React.FC<ExamDocumentsViewProps> = ({ currentSubject = 'chemistry' }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | SubjectId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<ExamDocument | null>(null);

  const filteredDocs = useMemo(() => {
    return EXAM_DOCUMENTS.filter((doc) => {
      const matchSubject = selectedFilter === 'all' || doc.subject === selectedFilter;
      const matchQuery =
        searchQuery.trim() === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchQuery;
    });
  }, [selectedFilter, searchQuery]);

  const getSubjectBadge = (subj: SubjectId) => {
    switch (subj) {
      case 'physics':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            Vật Lí 11
          </span>
        );
      case 'chemistry':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Hóa Học 11
          </span>
        );
      case 'biology':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Sinh Học 11
          </span>
        );
      case 'history':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Lịch Sử 11
          </span>
        );
    }
  };

  const handleOpenPreview = (doc: ExamDocument) => {
    soundEffects.playClick();
    setPreviewDoc(doc);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none transform translate-x-20 -translate-y-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kho Tài Liệu Đề Cương Gốc & Bản Đặc Tả</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Tài Liệu Ôn Tập & Đề Thi Chính Thức
            </h1>
            <p className="text-sm md:text-base text-blue-100 mt-2 max-w-2xl">
              Các tệp đề cương và đề minh họa theo chương trình GDPT 2018 để học sinh tra cứu, xem trước hoặc tải về máy.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center min-w-[110px]">
              <div className="text-2xl font-black">{EXAM_DOCUMENTS.length}</div>
              <div className="text-xs text-blue-100 font-medium">Tệp Tài Liệu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'Tất cả tài liệu' },
            { id: 'physics', label: 'Vật lí' },
            { id: 'chemistry', label: 'Hóa học' },
            { id: 'biology', label: 'Sinh học' },
            { id: 'history', label: 'Lịch sử' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundEffects.playClick();
                setSelectedFilter(tab.id as 'all' | SubjectId);
              }}
              className={`px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all ${
                selectedFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên file, nội dung..."
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDocs.map((doc) => {
          const isPdf = doc.type === 'pdf';
          return (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        isPdf
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {isPdf ? <FileText className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getSubjectBadge(doc.subject)}
                        <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {doc.fileSize}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 break-all">{doc.fileName}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">
                  {doc.title}
                </h3>

                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {doc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleOpenPreview(doc)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Xem trực tiếp</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                    title="Mở trong tab mới"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a
                    href={doc.fileUrl}
                    download={doc.fileName}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải về</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-700 dark:text-slate-300">
            Không tìm thấy tài liệu phù hợp
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Vui lòng thử từ khóa khác hoặc xóa bộ lọc để hiển thị toàn bộ tài liệu.
          </p>
        </div>
      )}

      {/* In-App Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                    {previewDoc.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono">{previewDoc.fileName}</span>
                    <span>•</span>
                    <span>{previewDoc.fileSize}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewDoc.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mở tab mới</span>
                </a>
                <a
                  href={previewDoc.fileUrl}
                  download={previewDoc.fileName}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tải về</span>
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Viewer */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 overflow-hidden flex flex-col">
              {previewDoc.type === 'pdf' ? (
                <iframe
                  src={`${previewDoc.fileUrl}#view=FitH`}
                  title={previewDoc.title}
                  className="w-full h-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <FileSpreadsheet className="w-16 h-16 text-emerald-500 mb-4" />
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Tệp Dữ Liệu Bảng Tính CSV
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mb-6 leading-relaxed">
                    Tệp dữ liệu có thể tải về để sử dụng ngoại tuyến.
                  </p>
                  <div className="flex items-center gap-3">
                    <a
                      href={previewDoc.fileUrl}
                      download={previewDoc.fileName}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-md transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Tải Tệp CSV Ngay</span>
                    </a>
                    <a
                      href={previewDoc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Xem Mã Dữ Liệu Gốc</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
