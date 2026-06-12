import { currentAffairs, jobs, posts, quizzes } from "@/data/content";
import type { Locale } from "@/lib/locales";

const firestoreProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const firestoreApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const revalidateSeconds = 300;

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
  nullValue?: null;
};

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
};

type RunQueryRow = {
  document?: FirestoreDocument;
};

export type MiniQuizQuestion = {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

export type PublicPost = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  date: string;
  featuredImageUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  quiz?: MiniQuizQuestion[];
  subCategory?: string;
};

export type PublicJob = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  organization: string;
  deadline: string;
  status: string;
  body: string;
  applyUrl?: string;
};

export type PublicCurrentAffair = {
  id: string;
  locale: Locale;
  headline: string;
  date: string;
};

export type PublicQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  sortOrder: number;
};

export type PublicQuiz = {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  exam: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeLimitMinutes: number;
  questions: PublicQuizQuestion[];
  featuredImageUrl?: string;
};

export async function getPublicQuizzes(locale: Locale, count = 20): Promise<PublicQuiz[]> {
  const remote = await queryPublishedByLocale("quizzes", locale, count);
  const mapped = remote
    .map(toPublicQuiz)
    .filter((quiz): quiz is Omit<PublicQuiz, "questions"> => Boolean(quiz));

  return mapped.map((quiz) => ({
    ...quiz,
    questions: [], // Optimize: List views do not require questions. Saves N extra database reads.
  }));
}

export async function getPublicQuizBySlug(locale: Locale, slug: string): Promise<PublicQuiz | null> {
  const doc = await querySingleBySlug("quizzes", slug, locale);
  if (!doc) return null;

  const quiz = toPublicQuiz(doc);
  if (!quiz) return null;

  const qDocs = await queryQuestionsForQuiz(quiz.id);
  const questions = qDocs
    .map(toPublicQuizQuestion)
    .filter((q): q is PublicQuizQuestion => Boolean(q))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    ...quiz,
    questions,
  };
}

export async function getPublicPosts(locale: Locale, count = 20): Promise<PublicPost[]> {
  const remote = await queryPublishedByLocale("posts", locale, count);
  const mapped = remote.map(toPublicPost).filter((post): post is PublicPost => Boolean(post));

  return mapped;
}

export async function getPublicPostsByCategory(
  locale: Locale,
  categoryKey: string,
  count = 20
): Promise<PublicPost[]> {
  const categoryNamesMap: Record<string, string[]> = {
    karnataka: ["Karnataka", "ಕರ್ನಾಟಕ"],
    national: ["National", "National News"],
    international: ["International", "International News"],
    jobs: ["Jobs", "KPSC", "Exam Notifications"],
    agriculture: ["Agriculture", "Agriculture Info"],
    education: ["College Guide", "Education", "Education & College Guide"],
    schemes: ["Government Schemes", "Schemes"],
    tourism: ["Heritage & Tourism", "Tourism"],
    sports: ["Sports News", "Sports"],
    technology: ["Technology"],
  };

  const allowedCategories = categoryNamesMap[categoryKey.toLowerCase()] || [categoryKey];
  const remote = await queryPublishedByLocaleAndCategory("posts", locale, allowedCategories, count);
  const mapped = remote.map(toPublicPost).filter((post): post is PublicPost => Boolean(post));
  return mapped;
}

export async function getPublicJobs(locale: Locale, count = 20): Promise<PublicJob[]> {
  const remote = await queryPublishedByLocale("jobs", locale, count);
  const mapped = remote.map(toPublicJob).filter((job): job is PublicJob => Boolean(job));

  return mapped;
}

export async function getPublicCurrentAffairs(
  locale: Locale,
  count = 10,
): Promise<PublicCurrentAffair[]> {
  const remote = await queryPublishedByLocale("currentAffairs", locale, count);
  const mapped = remote
    .map(toPublicCurrentAffair)
    .filter((item): item is PublicCurrentAffair => Boolean(item));

  return mapped;
}

export async function getPublicPostBySlug(locale: Locale, slug: string) {
  const doc = await querySingleBySlug("posts", slug, locale);
  if (!doc) return undefined;
  return toPublicPost(doc) ?? undefined;
}

export async function getPublicJobBySlug(locale: Locale, slug: string) {
  const doc = await querySingleBySlug("jobs", slug, locale);
  if (!doc) return undefined;
  return toPublicJob(doc) ?? undefined;
}

async function querySingleBySlug(collectionId: string, slug: string, locale: Locale) {
  if (!firestoreProjectId || !firestoreApiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents:runQuery?key=${firestoreApiKey}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId }],
            where: {
              compositeFilter: {
                op: "AND",
                filters: [
                  {
                    fieldFilter: {
                      field: { fieldPath: "status" },
                      op: "EQUAL",
                      value: { stringValue: "published" },
                    },
                  },
                  {
                    fieldFilter: {
                      field: { fieldPath: "slug" },
                      op: "EQUAL",
                      value: { stringValue: slug },
                    },
                  },
                  {
                    fieldFilter: {
                      field: { fieldPath: "locale" },
                      op: "EQUAL",
                      value: { stringValue: locale },
                    },
                  },
                ],
              },
            },
            limit: 1,
          },
        }),
        next: { revalidate: revalidateSeconds },
      },
    );

    if (!response.ok) {
      return null;
    }

    const rows = (await response.json()) as RunQueryRow[];
    const doc = rows[0]?.document;
    return doc?.fields ? doc : null;
  } catch {
    return null;
  }
}

async function queryPublished(collectionId: string, limitCount: number) {
  if (!firestoreProjectId || !firestoreApiKey) {
    return [];
  }

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents:runQuery?key=${firestoreApiKey}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId }],
            where: {
              fieldFilter: {
                field: { fieldPath: "status" },
                op: "EQUAL",
                value: { stringValue: "published" },
              },
            },
            limit: limitCount,
          },
        }),
        next: { revalidate: revalidateSeconds },
      },
    );

    if (!response.ok) {
      return [];
    }

    const rows = (await response.json()) as RunQueryRow[];
    return rows
      .map((row) => row.document)
      .filter((doc): doc is FirestoreDocument => Boolean(doc?.fields));
  } catch {
    return [];
  }
}

async function queryPublishedByLocale(collectionId: string, locale: Locale, limitCount: number) {
  if (!firestoreProjectId || !firestoreApiKey) {
    return [];
  }

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents:runQuery?key=${firestoreApiKey}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId }],
            where: {
              compositeFilter: {
                op: "AND",
                filters: [
                  {
                    fieldFilter: {
                      field: { fieldPath: "status" },
                      op: "EQUAL",
                      value: { stringValue: "published" },
                    },
                  },
                  {
                    fieldFilter: {
                      field: { fieldPath: "locale" },
                      op: "EQUAL",
                      value: { stringValue: locale },
                    },
                  },
                ],
              },
            },
            limit: limitCount,
          },
        }),
        next: { revalidate: revalidateSeconds },
      },
    );

    if (!response.ok) {
      return [];
    }

    const rows = (await response.json()) as RunQueryRow[];
    return rows
      .map((row) => row.document)
      .filter((doc): doc is FirestoreDocument => Boolean(doc?.fields));
  } catch {
    return [];
  }
}

async function queryPublishedByLocaleAndCategory(
  collectionId: string,
  locale: Locale,
  categories: string[],
  limitCount: number
) {
  if (!firestoreProjectId || !firestoreApiKey) {
    return [];
  }

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents:runQuery?key=${firestoreApiKey}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId }],
            where: {
              compositeFilter: {
                op: "AND",
                filters: [
                  {
                    fieldFilter: {
                      field: { fieldPath: "status" },
                      op: "EQUAL",
                      value: { stringValue: "published" },
                    },
                  },
                  {
                    fieldFilter: {
                      field: { fieldPath: "locale" },
                      op: "EQUAL",
                      value: { stringValue: locale },
                    },
                  },
                  {
                    fieldFilter: {
                      field: { fieldPath: "category" },
                      op: "IN",
                      value: {
                        arrayValue: {
                          values: categories.map((cat) => ({ stringValue: cat })),
                        },
                      },
                    },
                  },
                ],
              },
            },
            limit: limitCount,
          },
        }),
        next: { revalidate: revalidateSeconds },
      },
    );

    if (!response.ok) {
      return [];
    }

    const rows = (await response.json()) as RunQueryRow[];
    return rows
      .map((row) => row.document)
      .filter((doc): doc is FirestoreDocument => Boolean(doc?.fields));
  } catch {
    return [];
  }
}

function toPublicPost(doc: FirestoreDocument): PublicPost | null {
  const data = parseFields(doc.fields);
  const locale = parseLocale(data.locale);
  const slug = stringOrEmpty(data.slug);
  const title = stringOrEmpty(data.title);

  if (!locale || !slug || !title) {
    return null;
  }

  return {
    id: docId(doc),
    slug,
    locale,
    title,
    excerpt: stringOrEmpty(data.excerpt),
    body: stringOrEmpty(data.body),
    category: stringOrDefault(data.category, "General"),
    date: dateOnly(data.publishedAt ?? data.updatedAt ?? doc.updateTime),
    featuredImageUrl: typeof data.featuredImageUrl === "string" ? data.featuredImageUrl : undefined,
    sourceUrl: typeof data.sourceUrl === "string" ? data.sourceUrl : undefined,
    sourceName: typeof data.sourceName === "string" ? data.sourceName : undefined,
    quiz: Array.isArray(data.quiz) ? (data.quiz as MiniQuizQuestion[]) : undefined,
    subCategory: typeof data.subCategory === "string" ? data.subCategory : "",
  };
}

function toPublicJob(doc: FirestoreDocument): PublicJob | null {
  const data = parseFields(doc.fields);
  const locale = parseLocale(data.locale);
  const slug = stringOrEmpty(data.slug);
  const title = stringOrEmpty(data.title);

  if (!locale || !slug || !title) {
    return null;
  }

  return {
    id: docId(doc),
    slug,
    locale,
    title,
    organization: stringOrDefault(data.organization, "KannadaQuiz"),
    deadline: stringOrDefault(data.deadline, "TBA"),
    status: stringOrDefault(data.status, "published"),
    body: stringOrEmpty(data.body),
    applyUrl: typeof data.applyUrl === "string" ? data.applyUrl : undefined,
  };
}

function toPublicCurrentAffair(doc: FirestoreDocument): PublicCurrentAffair | null {
  const data = parseFields(doc.fields);
  const locale = parseLocale(data.locale);
  const headline = stringOrEmpty(data.headline ?? data.title);

  if (!locale || !headline) {
    return null;
  }

  return {
    id: docId(doc),
    locale,
    headline,
    date: dateOnly(data.publishedAt ?? data.updatedAt ?? doc.updateTime),
  };
}

function parseFields(fields?: Record<string, FirestoreValue>) {
  return Object.fromEntries(
    Object.entries(fields ?? {}).map(([key, value]) => [key, parseValue(value)]),
  );
}

function parseValue(value: FirestoreValue): unknown {
  if ("stringValue" in value) return value.stringValue ?? "";
  if ("integerValue" in value) return Number(value.integerValue ?? 0);
  if ("doubleValue" in value) return value.doubleValue ?? 0;
  if ("booleanValue" in value) return Boolean(value.booleanValue);
  if ("timestampValue" in value) return value.timestampValue ?? "";
  if ("arrayValue" in value) return (value.arrayValue?.values ?? []).map(parseValue);
  if ("mapValue" in value) return parseFields(value.mapValue?.fields);
  return null;
}

function parseLocale(value: unknown): Locale | null {
  return value === "kn" || value === "en" ? value : null;
}

function stringOrEmpty(value: unknown) {
  return typeof value === "string" ? value : "";
}

function stringOrDefault(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function docId(doc: FirestoreDocument) {
  return doc.name.split("/").at(-1) ?? doc.name;
}

function dateOnly(value: unknown) {
  if (typeof value !== "string" || !value) {
    return new Date().toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

function fallbackPosts(locale: Locale): PublicPost[] {
  return posts.map((post) => ({
    id: post.slug,
    slug: post.slug,
    locale,
    title: post.title[locale],
    excerpt: post.excerpt[locale],
    body:
      locale === "kn"
        ? "ಪೂರ್ಣ ಲೇಖನವನ್ನು Firestore ಅಥವಾ ವಿಷಯ ವ್ಯವಸ್ಥೆಯಿಂದ ಇಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತದೆ."
        : "Full article content will appear here from Firestore or the content system.",
    category: post.category,
    date: post.date,
  }));
}

function fallbackJobs(locale: Locale): PublicJob[] {
  return jobs.map((job) => ({
    id: job.slug,
    slug: job.slug,
    locale,
    title: job.title[locale],
    organization: job.organization,
    deadline: job.deadline,
    status: job.status,
    body:
      locale === "kn"
        ? "ಪೂರ್ಣ ಉದ್ಯೋಗ ವಿವರಗಳನ್ನು Firestore ನಿಂದ ಇಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತದೆ."
        : "Full job details will appear here from Firestore.",
  }));
}

function fallbackCurrentAffairs(locale: Locale): PublicCurrentAffair[] {
  return currentAffairs.map((item) => ({
    id: item.date,
    locale,
    headline: item.headline[locale],
    date: item.date,
  }));
}

async function queryQuestionsForQuiz(quizId: string) {
  if (!firestoreProjectId || !firestoreApiKey) {
    return [];
  }

  try {
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents:runQuery?key=${firestoreApiKey}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "quizQuestions" }],
            where: {
              fieldFilter: {
                field: { fieldPath: "quizId" },
                op: "EQUAL",
                value: { stringValue: quizId },
              },
            },
          },
        }),
        next: { revalidate: revalidateSeconds },
      },
    );

    if (!response.ok) {
      return [];
    }

    const rows = (await response.json()) as RunQueryRow[];
    return rows
      .map((row) => row.document)
      .filter((doc): doc is FirestoreDocument => Boolean(doc?.fields));
  } catch {
    return [];
  }
}

function toPublicQuizQuestion(doc: FirestoreDocument): PublicQuizQuestion | null {
  const data = parseFields(doc.fields);
  const question = stringOrEmpty(data.question);

  const rawOptions = Array.isArray(data.options) ? data.options : [];
  const options = rawOptions.map((val) => String(val ?? ""));

  if (!question || options.length === 0) {
    return null;
  }

  return {
    id: docId(doc),
    question,
    options,
    correctOptionIndex: typeof data.correctOptionIndex === "number" ? data.correctOptionIndex : 0,
    explanation: typeof data.explanation === "string" ? data.explanation : undefined,
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 1,
  };
}

function toPublicQuiz(doc: FirestoreDocument): Omit<PublicQuiz, "questions"> | null {
  const data = parseFields(doc.fields);
  const locale = parseLocale(data.locale);
  const slug = stringOrEmpty(data.slug);
  const title = stringOrEmpty(data.title);

  if (!locale || !slug || !title) {
    return null;
  }

  const timeLimitSeconds = typeof data.timeLimitSeconds === "number" ? data.timeLimitSeconds : 300;
  const timeLimitMinutes = Math.ceil(timeLimitSeconds / 60);

  return {
    id: docId(doc),
    slug,
    locale,
    title,
    description: stringOrEmpty(data.description),
    exam: stringOrDefault(data.exam, "KPSC"),
    subject: stringOrDefault(data.subject, "General"),
    difficulty: (data.difficulty === "Easy" || data.difficulty === "Medium" || data.difficulty === "Hard")
      ? data.difficulty
      : "Easy",
    timeLimitMinutes,
    featuredImageUrl: typeof data.featuredImageUrl === "string" ? data.featuredImageUrl : undefined,
  };
}

function fallbackQuizzes(locale: Locale): PublicQuiz[] {
  return quizzes.map((quiz) => ({
    id: quiz.slug,
    slug: quiz.slug,
    locale,
    title: quiz.title[locale],
    description: quiz.description[locale],
    exam: quiz.exam,
    subject: quiz.subject,
    difficulty: quiz.difficulty,
    timeLimitMinutes: quiz.timeLimitMinutes,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      question: q.question[locale],
      options: q.options.map((opt) => opt[locale]),
      correctOptionIndex: q.answerIndex,
      explanation: q.explanation[locale],
      sortOrder: 1,
    })),
  }));
}
