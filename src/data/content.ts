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

export const quizzes: Quiz[] = [
  {
    slug: "karnataka-current-affairs-basics",
    exam: "KPSC",
    subject: "Current Affairs",
    difficulty: "Easy",
    timeLimitMinutes: 5,
    title: {
      kn: "ಕರ್ನಾಟಕ ಪ್ರಚಲಿತ ಘಟನೆಗಳು - ಮೂಲಭೂತ ಕ್ವಿಜ್",
      en: "Karnataka Current Affairs - Basic Quiz",
    },
    description: {
      kn: "KPSC ಮತ್ತು ರಾಜ್ಯ ಮಟ್ಟದ ಪರೀಕ್ಷೆಗಳಿಗಾಗಿ ಚಿಕ್ಕ ಅಭ್ಯಾಸ ಕ್ವಿಜ್.",
      en: "A short practice quiz for KPSC and state-level exam preparation.",
    },
    questions: [
      {
        id: "q1",
        question: {
          kn: "ಕರ್ನಾಟಕ ರಾಜ್ಯದ ರಾಜಧಾನಿ ಯಾವುದು?",
          en: "What is the capital of Karnataka?",
        },
        options: [
          { kn: "ಮೈಸೂರು", en: "Mysuru" },
          { kn: "ಬೆಂಗಳೂರು", en: "Bengaluru" },
          { kn: "ಮಂಗಳೂರು", en: "Mangaluru" },
          { kn: "ಧಾರವಾಡ", en: "Dharwad" },
        ],
        answerIndex: 1,
        explanation: {
          kn: "ಬೆಂಗಳೂರು ಕರ್ನಾಟಕದ ರಾಜಧಾನಿ ಮತ್ತು ಪ್ರಮುಖ ಆಡಳಿತ ಕೇಂದ್ರ.",
          en: "Bengaluru is the capital and main administrative center of Karnataka.",
        },
      },
      {
        id: "q2",
        question: {
          kn: "ವಿಧಾನ ಸೌಧ ಯಾವ ನಗರದಲ್ಲಿದೆ?",
          en: "Vidhana Soudha is located in which city?",
        },
        options: [
          { kn: "ಬೆಂಗಳೂರು", en: "Bengaluru" },
          { kn: "ಬೆಳಗಾವಿ", en: "Belagavi" },
          { kn: "ಹುಬ್ಬಳ್ಳಿ", en: "Hubballi" },
          { kn: "ಕಲಬುರಗಿ", en: "Kalaburagi" },
        ],
        answerIndex: 0,
        explanation: {
          kn: "ವಿಧಾನ ಸೌಧ ಬೆಂಗಳೂರಿನಲ್ಲಿರುವ ಕರ್ನಾಟಕ ವಿಧಾನಮಂಡಲದ ಆಸನ.",
          en: "Vidhana Soudha in Bengaluru houses the Karnataka legislature.",
        },
      },
      {
        id: "q3",
        question: {
          kn: "ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ಭಾಷೆ ಯಾವುದು?",
          en: "What is the official language of Karnataka?",
        },
        options: [
          { kn: "ತೆಲುಗು", en: "Telugu" },
          { kn: "ತಮಿಳು", en: "Tamil" },
          { kn: "ಕನ್ನಡ", en: "Kannada" },
          { kn: "ಮರಾಠಿ", en: "Marathi" },
        ],
        answerIndex: 2,
        explanation: {
          kn: "ಕನ್ನಡವು ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ಭಾಷೆ.",
          en: "Kannada is the official language of Karnataka.",
        },
      },
    ],
  },
];

export const posts = [
  {
    slug: "kpsc-preparation-strategy",
    category: "KPSC",
    title: {
      kn: "KPSC ಪರೀಕ್ಷೆಗೆ ದೈನಂದಿನ ಅಧ್ಯಯನ ಯೋಜನೆ",
      en: "Daily Study Plan for KPSC Preparation",
    },
    excerpt: {
      kn: "ಪ್ರಚಲಿತ ಘಟನೆಗಳು, ವಿಷಯವಾರು ಪುನರಾವರ್ತನೆ ಮತ್ತು ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳನ್ನು ಸಮತೋಲನಗೊಳಿಸುವ ಸರಳ ವಿಧಾನ.",
      en: "A practical way to balance current affairs, subject revision, and mock tests.",
    },
    date: "2026-05-20",
  },
  {
    slug: "karnataka-geography-notes",
    category: "Geography",
    title: {
      kn: "ಕರ್ನಾಟಕ ಭೂಗೋಳ: ಮುಖ್ಯ ಅಂಶಗಳು",
      en: "Karnataka Geography: Key Notes",
    },
    excerpt: {
      kn: "ನದಿಗಳು, ಜಿಲ್ಲೆಗಳು, ಹವಾಮಾನ ಮತ್ತು ಕೃಷಿ ಸಂಬಂಧಿತ ಪರೀಕ್ಷಾ ಅಂಶಗಳು.",
      en: "Exam-focused notes on rivers, districts, climate, and agriculture.",
    },
    date: "2026-05-18",
  },
];

export const jobs = [
  {
    slug: "karnataka-govt-jobs-roundup",
    organization: "Karnataka Government",
    title: {
      kn: "ಈ ವಾರದ ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಉದ್ಯೋಗ ಮಾಹಿತಿ",
      en: "This Week's Karnataka Government Job Alerts",
    },
    deadline: "2026-06-15",
    status: "Open",
  },
  {
    slug: "teacher-eligibility-alert",
    organization: "School Education Department",
    title: {
      kn: "ಶಿಕ್ಷಕರ ಅರ್ಹತಾ ಪರೀಕ್ಷೆ ಅಧಿಸೂಚನೆ",
      en: "Teacher Eligibility Exam Notification",
    },
    deadline: "2026-06-30",
    status: "Upcoming",
  },
];

export const currentAffairs = [
  {
    date: "2026-05-23",
    headline: {
      kn: "ರಾಜ್ಯ ಪರೀಕ್ಷೆಗಳಿಗಾಗಿ ಇಂದಿನ ಪ್ರಮುಖ ಘಟನೆಗಳ ಸಂಕ್ಷಿಪ್ತ ನೋಟ.",
      en: "A quick scan of today's important points for state exams.",
    },
  },
  {
    date: "2026-05-22",
    headline: {
      kn: "ಕರ್ನಾಟಕ ಆಡಳಿತ, ಆರ್ಥಿಕತೆ ಮತ್ತು ವಿಜ್ಞಾನ ವಿಷಯಗಳ ಆಯ್ದ ನೋಟ್ಸ್.",
      en: "Selected notes from Karnataka administration, economy, and science.",
    },
  },
];
