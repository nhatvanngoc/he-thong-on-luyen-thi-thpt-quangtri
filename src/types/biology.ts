export type QuestionDifficulty = 'NhanBiet' | 'ThongHieu' | 'VanDung';

export type SubjectId = 'biology' | 'history' | 'chemistry' | 'physics' | 'informatics';

export type QuestionTopic =
  | 'topic1' // Sinh: 1.1 Khái quát về trao đổi chất và chuyển hóa năng lượng
  | 'topic2' // Sinh: 1.2 Trao đổi nước và khoáng ở thực vật
  | 'topic3' // Sinh: 1.3 Quang hợp ở thực vật
  | 'history1' // Sử: Chủ đề 1 - Cách mạng tư sản & Chủ nghĩa tư bản
  | 'history2' // Sử: Chủ đề 2 - Chủ nghĩa xã hội từ 1917 đến nay & Liên Xô
  | 'chem1' // Hóa: Khái niệm & Cân bằng hóa học (K_C, Le Chatelier)
  | 'chem2' // Hóa: Cân bằng trong dung dịch nước (Acid-Base Bronsted, pH, chuẩn độ)
  | 'chem3' // Hóa: Nitrogen, Ammonia, muối ammonium, Oxides & HNO3
  | 'phys1' // Lý: Dao động điều hòa (Mô tả, phương trình x, v, a, đồ thị)
  | 'phys2' // Lý: Năng lượng trong dao động điều hòa (Động năng, thế năng, cơ năng)
  | 'phys3' // Lý: Dao động tắt dần, dao động cưỡng bức, hiện tượng cộng hưởng
  | 'info1' // Tin: Hệ điều hành, phần cứng và tệp
  | 'info2' // Tin: Phần mềm, giấy phép và dịch vụ trực tuyến
  | 'info3' // Tin: Thiết bị số, dữ liệu và logic
  | 'info4'; // Tin: Internet, tìm kiếm, thư điện tử và an toàn số

export interface MultipleChoiceQuestion {
  id: number;
  part: 'I';
  topic: QuestionTopic;
  difficulty: QuestionDifficulty;
  question: string;
  imageUrl?: string;
  imageCaption?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  corePrinciple: string;
  trapWarning: string;
  sgkReference: string;
}

export interface TrueFalseStatement {
  subId: 'a' | 'b' | 'c' | 'd';
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface TrueFalseQuestion {
  id: number;
  part: 'II';
  topic: QuestionTopic;
  difficulty: QuestionDifficulty;
  context: string;
  imageUrl?: string;
  imageCaption?: string;
  statements: TrueFalseStatement[];
  analysis: string;
}

export interface ShortAnswerQuestion {
  id: number;
  part: 'III';
  topic: QuestionTopic;
  difficulty: QuestionDifficulty;
  question: string;
  imageUrl?: string;
  imageCaption?: string;
  items: string[];
  correctCountOrValue: number;
  acceptedAnswers: string[];
  explanation: string;
  detailedItemAnalysis: { index: number; statement: string; isCorrect: boolean; reason: string }[];
}

export interface FlashcardItem {
  id: number;
  part?: 'IV';
  topic: QuestionTopic;
  difficulty?: QuestionDifficulty;
  question?: string;
  answer?: string;
  imageUrl?: string;
  imageCaption?: string;
  topicLabel?: string;
  keyPoints?: string[];
  // Optional essay-style backward compatibility fields
  title?: string;
  prompt?: string;
  subQuestions?: { label: string; text: string; fullAnswer: string }[];
  summaryKeyPoints?: string[];
  deepMechanism?: string;
  practicalApplication?: string;
  commonPitfalls?: string[];
}

export interface ExamDocument {
  id: string;
  title: string;
  subject: SubjectId;
  description: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  type: 'pdf' | 'csv';
}


export type EssayFlashcard = FlashcardItem;


export interface CouncilAdvisorOpinion {
  advisorId: 'executor' | 'skeptic' | 'visionary' | 'advocate' | 'analyst';
  advisorName: string;
  roleTitle: string;
  avatarIcon: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
  };
  keyTakeaway: string;
  detailedArgument: string;
  actionableTip: string;
}

export interface CouncilConsensus {
  questionTitle: string;
  coreDecision: string;
  opinions: CouncilAdvisorOpinion[];
  matrixTable: {
    criteria: string;
    executor: string;
    skeptic: string;
    visionary: string;
    advocate: string;
    analyst: string;
  }[];
  finalConsensusRecommendation: string;
  advancedRisks: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'accuracy' | 'streak' | 'topic' | 'mastery' | 'flashcard';
}

export interface QuestionAttemptRecord {
  id: string;
  questionId: number;
  subject: SubjectId;
  type: 'mcq' | 'tf' | 'short';
  topic: QuestionTopic;
  questionText: string;
  imageUrl?: string;
  imageCaption?: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  timestamp: number;
}


export interface UserStats {
  userName: string;
  userClass: string;
  userAvatar: string;
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  topicProgress: Record<string, { answered: number; correct: number }>;
  completedExams: number;
  highestExamScore: number;
  unlockedBadgeIds: string[];
  masteredFlashcardIds: number[];
  masteredFormulaIds?: string[];
  formulaReflexScore?: number;
  treeStage: number; // 0 to 5
  attemptHistory?: QuestionAttemptRecord[];
}

