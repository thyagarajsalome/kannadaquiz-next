import type { Locale } from "@/lib/locales";

export type Quiz = {
  slug: string;
  exam: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimitMinutes: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  questions: {
    id: string;
    question: Record<Locale, string>;
    options: Record<Locale, string>[];
    answerIndex: number;
    explanation: Record<Locale, string>;
  }[];
};

export const siteText = {
  kn: {
    nav: ["ಕ್ವಿಜ್", "ಲೇಖನಗಳು", "ಉದ್ಯೋಗಗಳು"],
    language: "English",
    heroTitle: "ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ ವೇಗವಾದ ಅಭ್ಯಾಸ ವೇದಿಕೆ",
    heroLead:
      "KPSC, PSI, FDA-SDA, TET ಮತ್ತು ಸಾಮಾನ್ಯ ಜ್ಞಾನಕ್ಕಾಗಿ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಪ್ರಶ್ನೆಗಳು, ಪ್ರಚಲಿತ ಘಟನೆಗಳು ಮತ್ತು ಉದ್ಯೋಗ ಮಾಹಿತಿ.",
    primaryCta: "ಕ್ವಿಜ್ ಆರಂಭಿಸಿ",
    secondaryCta: "ಇತ್ತೀಚಿನ ಲೇಖನಗಳು",
    featuredQuizzes: "ಪ್ರಮುಖ ಕ್ವಿಜ್‌ಗಳು",
    currentAffairs: "ಪ್ರಚಲಿತ ಘಟನೆಗಳು",
    jobs: "ಉದ್ಯೋಗ ಸೂಚನೆಗಳು",
    posts: "ಅಧ್ಯಯನ ಲೇಖನಗಳು",
    quizStart: "ಪ್ರಾರಂಭಿಸಿ",
    minutes: "ನಿಮಿಷ",
  },
  en: {
    nav: ["Quizzes", "Articles", "Jobs"],
    language: "ಕನ್ನಡ",
    heroTitle: "Fast exam practice for Karnataka competitive exams",
    heroLead:
      "Kannada and English quizzes, current affairs, and job alerts for KPSC, PSI, FDA-SDA, TET, and general knowledge preparation.",
    primaryCta: "Start a quiz",
    secondaryCta: "Read articles",
    featuredQuizzes: "Featured quizzes",
    currentAffairs: "Current affairs",
    jobs: "Job alerts",
    posts: "Study articles",
    quizStart: "Start",
    minutes: "min",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

export const quizzes: Quiz[] = [];

export const posts: {
  slug: string;
  category: string;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  date: string;
}[] = [];

export const jobs: {
  slug: string;
  organization: string;
  title: Record<Locale, string>;
  deadline: string;
  status: string;
}[] = [];

export const currentAffairs: {
  date: string;
  headline: Record<Locale, string>;
}[] = [];
