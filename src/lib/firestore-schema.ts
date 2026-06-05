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
} as const;

export type ContentStatus = "draft" | "published" | "archived";

export type LocalizedContent = {
  locale: "kn" | "en";
  slug: string;
  title: string;
  status: ContentStatus;
  publishedAt?: Date;
  updatedAt?: Date;
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
