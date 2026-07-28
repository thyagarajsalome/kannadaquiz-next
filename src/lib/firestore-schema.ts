export const firestoreCollections = {
  posts: "posts",
  quizzes: "quizzes",
  quizQuestions: "quizQuestions",
  jobs: "jobs",
  currentAffairs: "currentAffairs",
  subjects: "subjects",
  profiles: "profiles",
  quizAttempts: "quizAttempts",
  leaderboard: "leaderboard",
  syncLogs: "syncLogs",
} as const;

export type ContentStatus = "draft" | "published" | "archived";

export type ContentSource = "firestore" | "cache" | "fallback";

export type LocalizedContent = {
  id?: string;
  locale: "kn" | "en";
  slug: string;
  title: string;
  status: ContentStatus;
  publishedAt?: Date | string;
  updatedAt?: Date | string;
  _source?: ContentSource;
};

export type FirestorePost = LocalizedContent & {
  excerpt: string;
  body: string;
  category: string;
  featuredImagePath?: string;
  featuredImageUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
};

export type FirestoreQuiz = LocalizedContent & {
  description: string;
  exam: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimitSeconds: number;
};

export type FirestoreQuizQuestion = {
  id?: string;
  quizId: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  sortOrder: number;
};

export type FirestoreJob = LocalizedContent & {
  organization: string;
  deadline: string;
  body: string;
  applyUrl?: string;
};

