export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export interface QuizSection {
  id: number;
  title: string;
  questions: Question[];
  completed: boolean;
  score: number;
  currentQuestion: number;
}

// Quiz Sections Data
export const quizSections: QuizSection[] = [
  {
    id: 1,
    title: "Các Triều Đại",
    completed: false,
    score: 0,
    currentQuestion: 0,
    questions: [
      {
        id: 1,
        text: "Triều đại nào đánh đuổi quân Nguyên Mông 3 lần?",
        options: [
          { id: "1a", text: "Triều Lý" },
          { id: "1b", text: "Triều Trần" },
          { id: "1c", text: "Triều Lê" },
          { id: "1d", text: "Triều Nguyễn" }
        ],
        correctOptionId: "1b"
      },
      {
        id: 2,
        text: "Ai là vị vua đầu tiên của nhà Lý?",
        options: [
          { id: "2a", text: "Lý Thái Tổ" },
          { id: "2b", text: "Lý Thái Tông" },
          { id: "2c", text: "Lý Công Uẩn" },
          { id: "2d", text: "Lý Nam Đế" }
        ],
        correctOptionId: "2a"
      },
      {
        id: 3,
        text: "Thời kỳ nào được coi là 'Thời kỳ Vàng Son' của lịch sử Việt Nam?",
        options: [
          { id: "3a", text: "Thời Lý - Trần" },
          { id: "3b", text: "Thời Hùng Vương" },
          { id: "3c", text: "Thời Hậu Lê" },
          { id: "3d", text: "Thời Nguyễn" }
        ],
        correctOptionId: "3a"
      },
      {
        id: 4,
        text: "Triều đại nào thực hiện cuộc cải cách ruộng đất đầu tiên trong lịch sử Việt Nam?",
        options: [
          { id: "4a", text: "Nhà Đinh" },
          { id: "4b", text: "Nhà Lý" },
          { id: "4c", text: "Nhà Trần" },
          { id: "4d", text: "Nhà Hồ" }
        ],
        correctOptionId: "4b"
      },
      {
        id: 5,
        text: "Vua nào đã đổi tên nước từ Đại Cồ Việt thành Đại Việt?",
        options: [
          { id: "5a", text: "Lý Thái Tổ" },
          { id: "5b", text: "Lý Thánh Tông" },
          { id: "5c", text: "Lý Nhân Tông" },
          { id: "5d", text: "Lý Anh Tông" }
        ],
        correctOptionId: "5b"
      },
      {
        id: 6,
        text: "Vương triều nào đã dời đô từ Hoa Lư về Thăng Long?",
        options: [
          { id: "6a", text: "Nhà Đinh" },
          { id: "6b", text: "Nhà Tiền Lê" },
          { id: "6c", text: "Nhà Lý" },
          { id: "6d", text: "Nhà Trần" }
        ],
        correctOptionId: "6c"
      },
      {
        id: 7,
        text: "Dưới thời vua nào, Đại Việt lần đầu tiên đánh bại quân Tống?",
        options: [
          { id: "7a", text: "Lê Hoàn" },
          { id: "7b", text: "Lý Thường Kiệt" },
          { id: "7c", text: "Lý Thánh Tông" },
          { id: "7d", text: "Trần Hưng Đạo" }
        ],
        correctOptionId: "7a"
      },
      {
        id: 8,
        text: "Năm 1428, ai là người đã lên ngôi vua, lập nên triều đại Hậu Lê?",
        options: [
          { id: "8a", text: "Lê Lợi" },
          { id: "8b", text: "Lê Thái Tổ" },
          { id: "8c", text: "Lê Thánh Tông" },
          { id: "8d", text: "Lê Hiến Tông" }
        ],
        correctOptionId: "8a"
      },
      {
        id: 9,
        text: "Ai là vị hoàng đế cuối cùng của triều Nguyễn?",
        options: [
          { id: "9a", text: "Bảo Đại" },
          { id: "9b", text: "Khải Định" },
          { id: "9c", text: "Đồng Khánh" },
          { id: "9d", text: "Hàm Nghi" }
        ],
        correctOptionId: "9a"
      },
      {
        id: 10,
        text: "Thời kỳ nào được gọi là 'Thịnh Trị' trong lịch sử Việt Nam?",
        options: [
          { id: "10a", text: "Thời Lý Thái Tổ" },
          { id: "10b", text: "Thời Trần Nhân Tông" },
          { id: "10c", text: "Thời Lê Thánh Tông" },
          { id: "10d", text: "Thời Gia Long" }
        ],
        correctOptionId: "10c"
      }
    ]
  },
  {
    id: 2,
    title: "Các Cuộc Chiến",
    completed: false,
    score: 0,
    currentQuestion: 0,
    questions: [
      {
        id: 1,
        text: "Cuộc kháng chiến chống Mỹ cứu nước của nhân dân Việt Nam kết thúc vào thời gian nào?",
        options: [
          { id: "1a", text: "Tháng 4 năm 1975" },
          { id: "1b", text: "Tháng 1 năm 1973" },
          { id: "1c", text: "Tháng 5 năm 1954" },
          { id: "1d", text: "Tháng 10 năm 1954" }
        ],
        correctOptionId: "1a"
      },
      {
        id: 2,
        text: "Chiến thắng nào đánh dấu sự kết thúc của cuộc kháng chiến chống Pháp?",
        options: [
          { id: "2a", text: "Chiến thắng Điện Biên Phủ" },
          { id: "2b", text: "Chiến thắng Việt Bắc" },
          { id: "2c", text: "Chiến thắng Đông Xuân" },
          { id: "2d", text: "Chiến thắng Tây Nguyên" }
        ],
        correctOptionId: "2a"
      },
      {
        id: 3,
        text: "Đâu là trận thủy chiến lớn nhất trong lịch sử chống quân Nguyên Mông?",
        options: [
          { id: "3a", text: "Trận Bạch Đằng năm 938" },
          { id: "3b", text: "Trận Bạch Đằng năm 1288" },
          { id: "3c", text: "Trận Như Nguyệt" },
          { id: "3d", text: "Trận Vân Đồn" }
        ],
        correctOptionId: "3b"
      },
      {
        id: 4,
        text: "Chiến dịch nào mở đầu cuộc kháng chiến chống Pháp của quân và dân ta?",
        options: [
          { id: "4a", text: "Chiến dịch Việt Bắc" },
          { id: "4b", text: "Chiến dịch Biên Giới" },
          { id: "4c", text: "Chiến dịch Điện Biên Phủ" },
          { id: "4d", text: "Chiến dịch Hồ Chí Minh" }
        ],
        correctOptionId: "4a"
      },
      {
        id: 5,
        text: "Cuộc khởi nghĩa nào đã đánh đuổi quân Nam Hán, giành độc lập vào năm 938?",
        options: [
          { id: "5a", text: "Khởi nghĩa Lam Sơn" },
          { id: "5b", text: "Khởi nghĩa Hai Bà Trưng" },
          { id: "5c", text: "Khởi nghĩa Ngô Quyền" },
          { id: "5d", text: "Khởi nghĩa Lý Bí" }
        ],
        correctOptionId: "5c"
      },
      {
        id: 6,
        text: "Đâu là chiến thắng mở đầu cho phong trào Cần Vương chống Pháp?",
        options: [
          { id: "6a", text: "Chiến thắng Ba Đình" },
          { id: "6b", text: "Chiến thắng Bãi Sậy" },
          { id: "6c", text: "Chiến thắng Hương Khê" },
          { id: "6d", text: "Chiến thắng Yên Thế" }
        ],
        correctOptionId: "6a"
      },
      {
        id: 7,
        text: "Ai là người chỉ huy trận Chi Lăng - Xương Giang năm 1427?",
        options: [
          { id: "7a", text: "Lê Lợi" },
          { id: "7b", text: "Nguyễn Trãi" },
          { id: "7c", text: "Lê Sát" },
          { id: "7d", text: "Trần Nguyên Hãn" }
        ],
        correctOptionId: "7a"
      },
      {
        id: 8,
        text: "Hiệp định nào chấm dứt sự can thiệp của Mỹ vào miền Nam Việt Nam?",
        options: [
          { id: "8a", text: "Hiệp định Paris 1973" },
          { id: "8b", text: "Hiệp định Genève 1954" },
          { id: "8c", text: "Hiệp định Fontainebleau 1946" },
          { id: "8d", text: "Hiệp định Sơ bộ 6-3-1946" }
        ],
        correctOptionId: "8a"
      },
      {
        id: 9,
        text: "Ai là người đã lãnh đạo nhân dân Ba Đình kháng chiến chống Pháp?",
        options: [
          { id: "9a", text: "Hoàng Hoa Thám" },
          { id: "9b", text: "Phan Đình Phùng" },
          { id: "9c", text: "Đinh Công Tráng" },
          { id: "9d", text: "Nguyễn Thiện Thuật" }
        ],
        correctOptionId: "9c"
      },
      {
        id: 10,
        text: "Trận đánh nào đánh dấu sự sụp đổ của chế độ Việt Nam Cộng Hòa?",
        options: [
          { id: "10a", text: "Trận Quảng Trị" },
          { id: "10b", text: "Trận Xuân Lộc" },
          { id: "10c", text: "Trận Buôn Ma Thuột" },
          { id: "10d", text: "Trận Huế" }
        ],
        correctOptionId: "10b"
      }
    ]
  },
  {
    id: 3,
    title: "Lịch Sử Sau 1945",
    completed: false,
    score: 0,
    currentQuestion: 0,
    questions: [
      {
        id: 1,
        text: "Nước Việt Nam Dân chủ Cộng hòa được thành lập vào thời gian nào?",
        options: [
          { id: "1a", text: "2/9/1945" },
          { id: "1b", text: "19/8/1945" },
          { id: "1c", text: "3/2/1930" },
          { id: "1d", text: "6/3/1946" }
        ],
        correctOptionId: "1a"
      },
      {
        id: 2,
        text: "Đâu là ngày toàn quốc kháng chiến trong cuộc kháng chiến chống Pháp?",
        options: [
          { id: "2a", text: "19/12/1946" },
          { id: "2b", text: "23/9/1945" },
          { id: "2c", text: "6/3/1946" },
          { id: "2d", text: "19/8/1945" }
        ],
        correctOptionId: "2a"
      },
      {
        id: 3,
        text: "Đại hội Đảng lần thứ III (1960) đã đề ra nhiệm vụ chiến lược nào cho cách mạng Việt Nam?",
        options: [
          { id: "3a", text: "Xây dựng chủ nghĩa xã hội ở miền Bắc" },
          { id: "3b", text: "Giải phóng miền Nam" },
          { id: "3c", text: "Cả A và B" },
          { id: "3d", text: "Thống nhất đất nước" }
        ],
        correctOptionId: "3c"
      },
      {
        id: 4,
        text: "Hiệp định Paris được ký kết vào ngày tháng năm nào?",
        options: [
          { id: "4a", text: "27/1/1973" },
          { id: "4b", text: "21/7/1954" },
          { id: "4c", text: "30/4/1975" },
          { id: "4d", text: "2/7/1976" }
        ],
        correctOptionId: "4a"
      },
      {
        id: 5,
        text: "Đại hội nào của Đảng được gọi là 'Đại hội Đổi mới'?",
        options: [
          { id: "5a", text: "Đại hội V" },
          { id: "5b", text: "Đại hội VI" },
          { id: "5c", text: "Đại hội VII" },
          { id: "5d", text: "Đại hội VIII" }
        ],
        correctOptionId: "5b"
      },
      {
        id: 6,
        text: "Việt Nam gia nhập ASEAN vào năm nào?",
        options: [
          { id: "6a", text: "1995" },
          { id: "6b", text: "1997" },
          { id: "6c", text: "1998" },
          { id: "6d", text: "2000" }
        ],
        correctOptionId: "6a"
      },
      {
        id: 7,
        text: "Chiến dịch Điện Biên Phủ diễn ra trong khoảng thời gian nào?",
        options: [
          { id: "7a", text: "Từ 13/3/1954 đến 7/5/1954" },
          { id: "7b", text: "Từ 13/12/1953 đến 7/5/1954" },
          { id: "7c", text: "Từ 13/3/1954 đến 7/7/1954" },
          { id: "7d", text: "Từ 13/12/1953 đến 7/7/1954" }
        ],
        correctOptionId: "7a"
      },
      {
        id: 8,
        text: "Quốc hội khóa VI đã quyết định đổi tên nước ta thành tên gọi nào?",
        options: [
          { id: "8a", text: "Việt Nam Dân chủ Cộng hòa" },
          { id: "8b", text: "Cộng hòa Xã hội Chủ nghĩa Việt Nam" },
          { id: "8c", text: "Nước Việt Nam" },
          { id: "8d", text: "Việt Nam Cộng hòa" }
        ],
        correctOptionId: "8b"
      },
      {
        id: 9,
        text: "Đâu là chủ trương đổi mới kinh tế được Đảng đề ra tại Đại hội VI?",
        options: [
          { id: "9a", text: "Phát triển kinh tế thị trường định hướng XHCN" },
          { id: "9b", text: "Ưu tiên phát triển công nghiệp nặng" },
          { id: "9c", text: "Tập trung vào kinh tế kế hoạch hóa tập trung" },
          { id: "9d", text: "Đẩy mạnh hợp tác hóa nông nghiệp" }
        ],
        correctOptionId: "9a"
      },
      {
        id: 10,
        text: "Năm nào Việt Nam gia nhập Tổ chức Thương mại Thế giới (WTO)?",
        options: [
          { id: "10a", text: "2005" },
          { id: "10b", text: "2006" },
          { id: "10c", text: "2007" },
          { id: "10d", text: "2008" }
        ],
        correctOptionId: "10c"
      }
    ]
  },
  {
    id: 4,
    title: "Lịch Sử Thế Giới",
    completed: false,
    score: 0,
    currentQuestion: 0,
    questions: [
      {
        id: 1,
        text: "Chiến tranh thế giới thứ nhất diễn ra trong khoảng thời gian nào?",
        options: [
          { id: "1a", text: "1914-1918" },
          { id: "1b", text: "1939-1945" },
          { id: "1c", text: "1915-1919" },
          { id: "1d", text: "1917-1921" }
        ],
        correctOptionId: "1a"
      },
      {
        id: 2,
        text: "Sự kiện nào đánh dấu sự bắt đầu của Chiến tranh thế giới thứ nhất?",
        options: [
          { id: "2a", text: "Vụ ám sát Thái tử Áo-Hung tại Sarajevo" },
          { id: "2b", text: "Đức tấn công Ba Lan" },
          { id: "2c", text: "Nhật Bản tấn công Trân Châu Cảng" },
          { id: "2d", text: "Cách mạng Nga bùng nổ" }
        ],
        correctOptionId: "2a"
      },
      {
        id: 3,
        text: "Cách mạng Tháng Mười Nga diễn ra vào năm nào?",
        options: [
          { id: "3a", text: "1917" },
          { id: "3b", text: "1918" },
          { id: "3c", text: "1919" },
          { id: "3d", text: "1920" }
        ],
        correctOptionId: "3a"
      },
      {
        id: 4,
        text: "Chiến tranh thế giới thứ hai kết thúc sau sự kiện nào?",
        options: [
          { id: "4a", text: "Phát xít Đức đầu hàng" },
          { id: "4b", text: "Phát xít Ý đầu hàng" },
          { id: "4c", text: "Mỹ thả bom nguyên tử xuống Hiroshima và Nagasaki" },
          { id: "4d", text: "Nhật Bản đầu hàng" }
        ],
        correctOptionId: "4d"
      },
      {
        id: 5,
        text: "Ai là lãnh tụ Liên Xô trong thời kỳ Chiến tranh thế giới thứ hai?",
        options: [
          { id: "5a", text: "V.I.Lenin" },
          { id: "5b", text: "J.V.Stalin" },
          { id: "5c", text: "N.Khrushchev" },
          { id: "5d", text: "L.Brezhnev" }
        ],
        correctOptionId: "5b"
      },
      {
        id: 6,
        text: "Mỹ thả bom nguyên tử xuống hai thành phố nào của Nhật Bản?",
        options: [
          { id: "6a", text: "Tokyo và Osaka" },
          { id: "6b", text: "Kyoto và Nagoya" },
          { id: "6c", text: "Hiroshima và Nagasaki" },
          { id: "6d", text: "Yokohama và Kobe" }
        ],
        correctOptionId: "6c"
      },
      {
        id: 7,
        text: "Tổ chức Liên hợp quốc được thành lập vào năm nào?",
        options: [
          { id: "7a", text: "1944" },
          { id: "7b", text: "1945" },
          { id: "7c", text: "1946" },
          { id: "7d", text: "1947" }
        ],
        correctOptionId: "7b"
      },
      {
        id: 8,
        text: "Bức tường Berlin được xây dựng vào năm nào?",
        options: [
          { id: "8a", text: "1949" },
          { id: "8b", text: "1956" },
          { id: "8c", text: "1961" },
          { id: "8d", text: "1968" }
        ],
        correctOptionId: "8c"
      },
      {
        id: 9,
        text: "Liên Xô tan rã vào năm nào?",
        options: [
          { id: "9a", text: "1989" },
          { id: "9b", text: "1990" },
          { id: "9c", text: "1991" },
          { id: "9d", text: "1992" }
        ],
        correctOptionId: "9c"
      },
      {
        id: 10,
        text: "Cuộc Cách mạng Văn hóa diễn ra ở nước nào?",
        options: [
          { id: "10a", text: "Trung Quốc" },
          { id: "10b", text: "Liên Xô" },
          { id: "10c", text: "Cuba" },
          { id: "10d", text: "Triều Tiên" }
        ],
        correctOptionId: "10a"
      }
    ]
  }
];
