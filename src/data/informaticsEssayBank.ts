export interface InformaticsEssayQuestion {
  id: number;
  topic: string;
  prompt: string;
  solution: string[];
}

export const INFORMATICS_ESSAY_QUESTIONS: InformaticsEssayQuestion[] = [
  {
    id: 1,
    topic: 'Phần cứng và hệ điều hành',
    prompt: 'Trình bày chức năng cơ bản của CPU và RAM. Vì sao dữ liệu và lệnh của chương trình thường được nạp vào RAM trước khi CPU xử lí?',
    solution: [
      'CPU: lấy lệnh, giải mã và thực hiện lệnh; xử lí dữ liệu, điều khiển hoạt động máy tính.',
      'RAM: lưu tạm chương trình, lệnh và dữ liệu đang được sử dụng; mất dữ liệu khi tắt nguồn.',
      'Nạp vào RAM giúp CPU truy cập nhanh dữ liệu/lệnh đang chạy so với đọc trực tiếp từ thiết bị lưu trữ lâu dài.',
    ],
  },
  {
    id: 2,
    topic: 'Nâng cấp và bảo trì máy tính',
    prompt: 'Để tăng hiệu năng máy tính, người dùng có thể làm gì với phần cứng và phần mềm?',
    solution: [
      'Phần cứng: nâng RAM; thay HDD bằng SSD; nâng CPU/GPU nếu tương thích và phù hợp nhu cầu.',
      'Phần mềm: gỡ ứng dụng không dùng; tắt chương trình khởi động không cần thiết; cập nhật hệ điều hành/driver.',
      'Quét mã độc, dọn tệp tạm an toàn và chọn ứng dụng phù hợp; sao lưu trước khi thay đổi lớn.',
    ],
  },
  {
    id: 3,
    topic: 'Phần mềm và giấy phép',
    prompt: 'Cửa hàng tải phần mềm chỉnh sửa ảnh miễn phí và cho rằng có thể tùy ý sử dụng, sao chép, sửa đổi. Nhận xét quan điểm; nêu thông tin cần kiểm tra và cách làm phù hợp.',
    solution: [
      'Quan điểm chưa đúng: miễn phí tải/dùng không đồng nghĩa được tự do sao chép, sửa đổi hoặc dùng thương mại.',
      'Kiểm tra giấy phép, quyền sử dụng thương mại, điều kiện phân phối/sửa đổi, nguồn tải và độ an toàn.',
      'Tải từ trang chính thức; tuân thủ giấy phép; nếu quyền không đủ, xin phép hoặc chọn phần mềm có giấy phép phù hợp.',
    ],
  },
  {
    id: 4,
    topic: 'Phần mềm văn phòng trực tuyến',
    prompt: 'Giáo viên cần giao bài, thu bài, nhận xét và theo dõi chỉnh sửa. So sánh phần mềm cài trên máy với phần mềm văn phòng trực tuyến, rồi chọn phương án phù hợp.',
    solution: [
      'Cài trên máy: hoạt động ngoại tuyến tốt; tệp thường lưu cục bộ; cộng tác đồng thời cần thiết lập thêm.',
      'Trực tuyến: dễ chia sẻ, nhận xét và cùng chỉnh sửa; có lịch sử phiên bản; thường cần Internet và tài khoản.',
      'Chọn phần mềm trực tuyến vì đáp ứng giao/thu bài và theo dõi cộng tác; đặt quyền xem/chỉnh sửa phù hợp.',
    ],
  },
  {
    id: 5,
    topic: 'Dịch vụ học tập trực tuyến',
    prompt: 'Vì sao trường học có thể ưu tiên phần mềm chạy trên Internet cho hệ thống học trực tuyến?',
    solution: [
      'Học sinh và giáo viên truy cập từ nhiều nơi, trên nhiều thiết bị có kết nối.',
      'Dễ cập nhật tập trung, chia sẻ tài liệu, giao/thu bài và cộng tác.',
      'Cần có phương án bảo vệ tài khoản/dữ liệu và xử lí khi mất Internet.',
    ],
  },
  {
    id: 6,
    topic: 'An toàn khi chia sẻ dữ liệu',
    prompt: 'Khi chia sẻ dữ liệu qua mạng, làm thế nào để hạn chế người khác đánh cắp hoặc thay đổi thông tin?',
    solution: [
      'Dùng dịch vụ/kết nối đáng tin cậy; không gửi mật khẩu qua liên kết lạ; dùng mật khẩu mạnh và riêng biệt, bật xác thực hai bước.',
      'Chỉ chia sẻ cho đúng người, cấp quyền tối thiểu; tránh liên kết công khai nếu không cần.',
      'Kiểm tra địa chỉ trang web/người nhận; giữ bản sao lưu và thu hồi quyền khi không còn cần.',
    ],
  },
  {
    id: 7,
    topic: 'Phần mềm trực tuyến và ngoại tuyến',
    prompt: 'Khi Internet gặp sự cố, phần mềm chạy trên Internet có thể bị ảnh hưởng thế nào? Nêu cách khắc phục.',
    solution: [
      'Có thể không đăng nhập/truy cập được, không đồng bộ hoặc không dùng được một số tính năng trực tuyến.',
      'Chuẩn bị bản ngoại tuyến/bản sao cục bộ nếu dịch vụ hỗ trợ; lưu lại công việc thường xuyên.',
      'Kiểm tra kết nối, tiếp tục bằng công cụ ngoại tuyến phù hợp rồi đồng bộ khi mạng ổn định.',
    ],
  },
  {
    id: 8,
    topic: 'Lưu trữ và cộng tác nhóm',
    prompt: 'Khi làm bài nhóm, các bạn cần cùng lưu và chỉnh sửa một tài liệu. Hãy đề xuất cách lưu/chia sẻ và nêu lý do.',
    solution: [
      'Tạo một tài liệu trong dịch vụ lưu trữ đám mây đáng tin cậy (ví dụ Google Drive) và chia sẻ với thành viên.',
      'Cấp quyền chỉnh sửa cho người cùng làm, quyền xem cho người chỉ cần đọc; tránh tạo nhiều bản rời.',
      'Cùng sửa theo thời gian thực, xem lịch sử phiên bản và thống nhất tên/thư mục để dễ quản lý.',
    ],
  },
  {
    id: 9,
    topic: 'Quản lý và tìm kiếm tệp',
    prompt: 'Trong thư mục có hàng trăm tệp, cần tìm nhanh tệp có tên chứa “báo cáo”. Hãy mô tả cách làm.',
    solution: [
      'Mở File Explorer và chọn đúng thư mục cần tìm.',
      'Nhập “báo cáo” vào ô tìm kiếm của thư mục, chờ hệ thống liệt kê kết quả.',
      'Đối chiếu tên, loại tệp và ngày sửa để mở đúng tệp; có thể thêm từ khóa nếu kết quả quá nhiều.',
    ],
  },
  {
    id: 10,
    topic: 'Nhận biết thư lừa đảo',
    prompt: 'Email báo tài khoản học tập sắp bị khóa, yêu cầu bấm liên kết và nhập mật khẩu; địa chỉ gửi không giống địa chỉ chính thức. Nêu dấu hiệu đáng ngờ và cách xử lí.',
    solution: [
      'Dấu hiệu: tạo cảm giác khẩn cấp; yêu cầu nhập mật khẩu; địa chỉ người gửi không chính thức; liên kết có thể dẫn tới trang giả.',
      'Không bấm liên kết, không trả lời và không nhập mật khẩu; xác minh với nhà trường qua địa chỉ/kênh liên hệ đã biết.',
      'Báo cho giáo viên/quản trị, đánh dấu thư lừa đảo rồi xóa. Nếu đã nhập mật khẩu: đổi ngay, đăng xuất phiên lạ và bật xác thực hai bước.',
    ],
  },
];
