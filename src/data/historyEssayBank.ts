export interface HistoryEssayQuestion {
  id: number;
  topic: 'CĐ 1: Cách mạng tư sản & chủ nghĩa tư bản' | 'CĐ 2: Chủ nghĩa xã hội & Liên Xô';
  title: string;
  prompt: string;
  answer: string[];
  keyPoints: string[];
  distractors: string[];
}

// Consolidated from the school's "Tự luận Lịch sử gk1" outline.
// Answers are study guides; students should adapt them to the exact wording of the exam.
export const HISTORY_ESSAY_QUESTIONS: HistoryEssayQuestion[] = [
  {
    id: 1,
    topic: 'CĐ 1: Cách mạng tư sản & chủ nghĩa tư bản',
    title: 'Tiền đề của các cuộc cách mạng tư sản',
    prompt: 'Trình bày các tiền đề về kinh tế, chính trị, xã hội và tư tưởng dẫn đến các cuộc cách mạng tư sản.',
    answer: ['Kinh tế: CNTB phát triển nhưng bị chế độ phong kiến / thực dân kìm hãm.', 'Chính trị: quân chủ chuyên chế, cai trị thuộc địa hà khắc gây bất mãn.', 'Xã hội: mâu thuẫn giữa các lực lượng mới với chế độ cũ gay gắt.', 'Tư tưởng: tư tưởng mới, nhất là Triết học Ánh sáng, cổ vũ cách mạng.'],
    keyPoints: ['Kinh tế tư bản phát triển nhưng bị trật tự cũ kìm hãm', 'Chế độ chính trị chuyên chế hoặc cai trị thuộc địa gây bất mãn', 'Mâu thuẫn xã hội gay gắt giữa các lực lượng mới với chế độ cũ', 'Tư tưởng mới tập hợp quần chúng và cổ vũ thay đổi'],
    distractors: ['Kinh tế tư bản đã được chế độ phong kiến khuyến khích phát triển không hạn chế.', 'Các mâu thuẫn xã hội đã được giải quyết hoàn toàn trước cách mạng.'],
  },
  {
    id: 2,
    topic: 'CĐ 1: Cách mạng tư sản & chủ nghĩa tư bản',
    title: 'Kết quả và ý nghĩa của các cuộc cách mạng tư sản',
    prompt: 'Nêu kết quả và ý nghĩa chung của các cuộc cách mạng tư sản. Có thể lấy ví dụ tiêu biểu.',
    answer: ['Kết quả: lật đổ / làm suy yếu phong kiến; một số nơi giành độc lập.', 'Xác lập nhà nước tư sản, mở đường cho CNTB phát triển.', 'Ý nghĩa: thúc đẩy sản xuất, quyền tự do và dân chủ tư sản.', 'Ví dụ: Mỹ tuyên bố độc lập (1776); Pháp lập nền cộng hòa (1792).'],
    keyPoints: ['Lật đổ hoặc làm suy yếu chế độ phong kiến; một số nơi giành độc lập', 'Xác lập nhà nước và quan hệ sản xuất tư bản chủ nghĩa', 'Mở đường cho lực lượng sản xuất và chủ nghĩa tư bản phát triển', 'Thúc đẩy quyền tự do, dân chủ tư sản; kết quả khác nhau theo từng nước'],
    distractors: ['Mọi cuộc cách mạng tư sản đều lập tức xây dựng xã hội chủ nghĩa.', 'Các cuộc cách mạng tư sản không làm thay đổi thể chế chính trị.'],
  },
  {
    id: 3,
    topic: 'CĐ 1: Cách mạng tư sản & chủ nghĩa tư bản',
    title: 'Cách mạng tư sản Pháp: triệt để và vĩ đại',
    prompt: 'Vì sao Cách mạng tư sản Pháp cuối thế kỉ XVIII được xem là cuộc cách mạng tư sản triệt để và vĩ đại?',
    answer: ['Lật đổ quân chủ chuyên chế, xóa bỏ đặc quyền phong kiến.', 'Giải quyết vấn đề ruộng đất cho nông dân.', 'Mở đường cho CNTB phát triển.', 'Tư tưởng “Tự do – Bình đẳng – Bác ái” lan rộng khắp châu Âu.'],
    keyPoints: ['Lật đổ quân chủ chuyên chế và xóa bỏ đặc quyền phong kiến', 'Giải quyết vấn đề ruộng đất cho nông dân', 'Mở đường cho chủ nghĩa tư bản phát triển', 'Tư tưởng và ảnh hưởng lan rộng ra ngoài nước Pháp'],
    distractors: ['Cách mạng duy trì nguyên vẹn chế độ quân chủ chuyên chế và đặc quyền phong kiến.', 'Ảnh hưởng của cách mạng chỉ giới hạn trong phạm vi nước Pháp.'],
  },
  {
    id: 4,
    topic: 'CĐ 1: Cách mạng tư sản & chủ nghĩa tư bản',
    title: 'Từ tự do cạnh tranh đến độc quyền',
    prompt: 'Phân tích sự chuyển biến của chủ nghĩa tư bản từ tự do cạnh tranh sang độc quyền.',
    answer: ['Tự do cạnh tranh: doanh nghiệp cạnh tranh mở rộng sản xuất, thị trường.', 'Cuối XIX – đầu XX: khoa học – kỹ thuật phát triển, tư bản tập trung.', 'Tư bản lớn lập tổ chức độc quyền để chi phối sản xuất / thị trường.', 'Hình thức: các-ten, xanh-đi-ca, tơ-rớt → CNTB chuyển sang giai đoạn độc quyền.'],
    keyPoints: ['Tự do cạnh tranh là giai đoạn phát triển trước đó', 'Khoa học – kỹ thuật và quy mô sản xuất tăng nhanh cuối thế kỉ XIX', 'Tư bản và sản xuất tập trung vào các nhà tư bản lớn', 'Tổ chức độc quyền liên kết để chi phối sản xuất hoặc thị trường'],
    distractors: ['Tư bản ngày càng phân tán, không hình thành các tổ chức độc quyền.', 'Độc quyền xuất hiện trước giai đoạn tự do cạnh tranh.'],
  },
  {
    id: 5,
    topic: 'CĐ 1: Cách mạng tư sản & chủ nghĩa tư bản',
    title: 'Khái niệm và đặc điểm của chủ nghĩa tư bản hiện đại',
    prompt: 'Nêu khái niệm và một số đặc điểm cơ bản của chủ nghĩa tư bản hiện đại.',
    answer: ['Khái niệm: giai đoạn CNTB từ sau Chiến tranh thế giới thứ hai (1945) đến nay.', 'Kết hợp độc quyền tư nhân với vai trò điều tiết của nhà nước tư sản.', 'Sức sản xuất cao nhờ khoa học – công nghệ.', 'Liên tục điều chỉnh cách sản xuất và quản lý.'],
    keyPoints: ['Giai đoạn từ sau Chiến tranh thế giới thứ hai năm 1945 đến nay', 'Kết hợp sức mạnh của độc quyền tư nhân và vai trò nhà nước tư sản', 'Sức sản xuất cao nhờ khoa học – công nghệ', 'Liên tục điều chỉnh phương thức sản xuất và quản lý'],
    distractors: ['Chỉ phát triển dựa vào nông nghiệp, không ứng dụng khoa học – công nghệ.', 'Nhà nước tư sản hoàn toàn không tham gia điều tiết kinh tế.'],
  },
  {
    id: 6,
    topic: 'CĐ 2: Chủ nghĩa xã hội & Liên Xô',
    title: 'Bài học từ sự sụp đổ của mô hình ở Liên Xô và Đông Âu',
    prompt: 'Từ sự sụp đổ của mô hình chủ nghĩa xã hội ở Liên Xô và Đông Âu, nêu bài học kinh nghiệm được đề cương nhấn mạnh đối với Việt Nam.',
    answer: ['Kiên định mục tiêu, con đường đi lên CNXH.', 'Tăng cường vai trò lãnh đạo của Đảng.', 'Tiếp tục đổi mới, phát triển kinh tế thị trường định hướng XHCN.', 'Nâng cao cảnh giác, bảo vệ nền tảng tư tưởng.'],
    keyPoints: ['Kiên định mục tiêu và con đường phát triển', 'Tăng cường vai trò lãnh đạo của Đảng', 'Tiếp tục đổi mới và phát triển kinh tế thị trường định hướng xã hội chủ nghĩa', 'Nâng cao cảnh giác, bảo vệ nền tảng tư tưởng'],
    distractors: ['Từ bỏ đổi mới và giữ nguyên mọi cơ chế quản lý cũ.', 'Ngừng phát triển kinh tế trong nước, chỉ dựa vào viện trợ bên ngoài.'],
  },
  {
    id: 7,
    topic: 'CĐ 2: Chủ nghĩa xã hội & Liên Xô',
    title: 'Trách nhiệm của bản thân trong xây dựng đất nước',
    prompt: 'Xác định trách nhiệm của bản thân trong việc đóng góp vào công cuộc xây dựng chủ nghĩa xã hội ở Việt Nam.',
    answer: ['Chấp hành pháp luật, nội quy.', 'Học tập và rèn luyện tốt.', 'Sống lành mạnh, có trách nhiệm với cộng đồng.', 'Góp phần giữ gìn an ninh, chủ quyền; ứng dụng công nghệ có ích.'],
    keyPoints: ['Chấp hành pháp luật và quy định chung', 'Học tập, rèn luyện năng lực và đạo đức', 'Sống có trách nhiệm, đóng góp cho cộng đồng', 'Gắn trách nhiệm công dân với hành động phù hợp lứa tuổi'],
    distractors: ['Có thể bỏ qua pháp luật nếu việc đó thuận tiện cho bản thân.', 'Trách nhiệm xây dựng đất nước chỉ thuộc về người trưởng thành.'],
  },
];
