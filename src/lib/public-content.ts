import { currentAffairs, jobs, posts, quizzes } from "@/data/content";
import type { Locale } from "@/lib/locales";

function getEnv(val: string | undefined, fallback: string): string {
  if (!val || val === "undefined" || val === "null" || val.trim() === "") {
    return fallback;
  }
  return val;
}

const firestoreProjectId = getEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "kannadaquiz-fc21b");
const firestoreApiKey = getEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "AIzaSyC07b-JG7h-lkTFi4m96fB_He-LeBmus7A");
const revalidateSeconds = 3600; // Aggressive 1-hour cache to drastically cut Firebase reads

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
  isFeatured?: boolean;
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

export async function getPublicFeaturedPosts(locale: Locale, count = 10): Promise<PublicPost[]> {
  const remote = await queryFeaturedByLocale("posts", locale, count);
  const mapped = remote.map(toPublicPost).filter((post): post is PublicPost => Boolean(post));

  return mapped;
}

export async function getPublicPostsByCategory(
  locale: Locale,
  categoryKey: string,
  count = 50
): Promise<PublicPost[]> {
  const categoryNamesMap: Record<string, string[]> = {
    karnataka: ["Karnataka", "Karnataka News", "ಕರ್ನಾಟಕ", "ಕರ್ನಾಟಕ ಸುದ್ದಿ"],
    national: ["National", "National News", "ರಾಷ್ಟ್ರೀಯ", "ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ"],
    international: ["International", "International News", "ಅಂತರರಾಷ್ಟ್ರೀಯ", "ಅಂತರರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ"],
    jobs: ["Jobs", "Jobs & Careers", "KPSC", "Exam Notifications", "ಉದ್ಯೋಗಗಳು", "ಉದ್ಯೋಗ"],
    agriculture: ["Agriculture", "Agriculture Info", "ಕೃಷಿ", "ಕೃಷಿ ಮಾಹಿತಿ"],
    education: ["College Guide", "Education", "Education & College Guide", "College & Education Guide", "ಶಿಕ್ಷಣ"],
    schemes: ["Government Schemes", "Schemes", "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು"],
    tourism: ["Heritage & Tourism", "Tourism", "ಇತಿಹಾಸ ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮ", "ಪ್ರವಾಸೋದ್ಯಮ"],
    sports: ["Sports News", "Sports", "ಕ್ರೀಡಾ ಸುದ್ದಿ", "ಕ್ರೀಡೆ"],
    technology: ["Technology", "Computer & Technology", "ತಂತ್ರಜ್ಞಾನ"],
    movies: ["Movies", "Movies & Cinema", "Cinema", "Film", "ಚಲನಚಿತ್ರ"],
    "home-design": ["Home Design", "Home Design & Real Estate", "Real Estate", "Interior", "House Plans", "Promotion", "Services", "ಮನೆ ವಿನ್ಯಾಸ ಮತ್ತು ರಿಯಲ್ ಎಸ್ಟೇಟ್", "home-design"],
    general: ["General", "General News", "ಸಾಮಾನ್ಯ", "ಸಾಮಾನ್ಯ ಸುದ್ದಿ"],
  };

  const normKey = categoryKey.toLowerCase();
  const allowedCategories = categoryNamesMap[normKey] || [categoryKey];
  const remote = await queryPublishedByLocaleAndCategory("posts", locale, allowedCategories, count);
  let mapped = remote.map(toPublicPost).filter((post): post is PublicPost => Boolean(post));

  // Fallback: If strict category query returned no results, fetch recent published posts and filter client-side by category synonyms
  if (mapped.length === 0) {
    const allPosts = await getPublicPosts(locale, 200);
    const keywords = allowedCategories.map(c => c.toLowerCase());
    mapped = allPosts.filter(p => {
      const pCat = (p.category || "").toLowerCase();
      return keywords.some(kw => pCat.includes(kw) || kw.includes(pCat));
    });
  }

  return mapped;
}

export async function getPublicJobs(locale: Locale, count = 50): Promise<PublicJob[]> {
  // 1. Fetch from 'jobs' collection (Automated)
  const remoteJobs = await queryPublishedByLocale("jobs", locale, count);
  const mappedJobs = remoteJobs.map(toPublicJob).filter((job): job is PublicJob => Boolean(job));

  // 2. Fetch from 'posts' collection where category is Jobs (Manual posts by admin)
  const manualJobsPosts = await getPublicPostsByCategory(locale, "jobs", count);
  const mappedManualJobs: PublicJob[] = manualJobsPosts.map((post) => ({
    id: post.id,
    slug: post.slug,
    locale: post.locale,
    title: post.title,
    organization: post.sourceName || "Government of Karnataka",
    deadline: "Open", // Manual posts don't have a deadline field natively
    status: "published",
    body: post.excerpt || post.body,
    applyUrl: post.sourceUrl || `/${locale}/posts/${post.slug}`,
  }));

  // 3. Combine and sort by date descending (assuming newer IDs or just merge)
  // We will map manual jobs to have an applyUrl that links to the actual post details if they don't have a source url.
  
  // Create a Map to deduplicate by slug just in case
  const jobsMap = new Map<string, PublicJob>();
  
  // Add manual first (so they can be overridden if same slug, or vice versa)
  for (const job of mappedManualJobs) {
    jobsMap.set(job.slug, job);
  }
  for (const job of mappedJobs) {
    jobsMap.set(job.slug, job); // automated takes precedence if duplicate slug
  }

  return Array.from(jobsMap.values()).slice(0, count);
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

export async function getPublicPostBySlug(locale: Locale, slug: string): Promise<PublicPost | undefined> {
  const decodedSlug = decodeURIComponent(slug).trim();

  // 1. Try posts collection by slug and locale
  let doc = await querySingleBySlug("posts", decodedSlug, locale);

  // 2. Try posts collection with raw slug
  if (!doc && decodedSlug !== slug) {
    doc = await querySingleBySlug("posts", slug, locale);
  }

  // 3. Try jobs collection
  if (!doc) {
    const jobDoc = (await querySingleBySlug("jobs", decodedSlug, locale)) || (await querySingleBySlug("jobs", slug, locale));
    if (jobDoc) {
      const job = toPublicJob(jobDoc);
      if (job) {
        return {
          id: job.id,
          slug: job.slug,
          locale: job.locale,
          title: job.title,
          excerpt: `Organization: ${job.organization || "Govt"} | Deadline: ${job.deadline || "Open"}`,
          body: job.body || `Job details for ${job.title}`,
          category: "Jobs",
          date: new Date().toISOString().slice(0, 10),
        };
      }
    }
  }

  // 4. Try currentAffairs collection
  if (!doc) {
    const caDoc = (await querySingleBySlug("currentAffairs", decodedSlug, locale)) || (await querySingleBySlug("currentAffairs", slug, locale));
    if (caDoc) {
      const ca = toPublicCurrentAffair(caDoc);
      if (ca) {
        return {
          id: ca.id,
          slug: slug,
          locale: ca.locale,
          title: ca.headline,
          excerpt: ca.headline,
          body: ca.headline,
          category: "Current Affairs",
          date: ca.date,
        };
      }
    }
  }

  // 5. Query recent posts from Firestore and match by slug or title slugification
  if (!doc) {
    const recentPosts = await getPublicPosts(locale, 200);
    const match = recentPosts.find(p => p.slug === decodedSlug || p.slug === slug || p.id === decodedSlug || p.id === slug);
    if (match) return match;
  }

  // 6. Fallback posts
  if (!doc) {
    const fallbacks = fallbackPosts(locale);
    const match = fallbacks.find((p) => p.slug === decodedSlug || p.slug === slug);
    if (match) return match;
  }

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

  const decodedSlug = decodeURIComponent(slug).trim();

  try {
    // Attempt 1: Match by slug and locale
    const response1 = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents:runQuery?key=${firestoreApiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId }],
            where: {
              compositeFilter: {
                op: "AND",
                filters: [
                  {
                    fieldFilter: {
                      field: { fieldPath: "slug" },
                      op: "EQUAL",
                      value: { stringValue: decodedSlug },
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
                      field: { fieldPath: "status" },
                      op: "EQUAL",
                      value: { stringValue: "published" },
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

    if (response1.ok) {
      const rows = (await response1.json()) as RunQueryRow[];
      const doc = rows[0]?.document;
      if (doc?.fields) return doc;
    }

    // Attempt 2: Match by slug alone (in case locale field is missing or different)
    const response2 = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents:runQuery?key=${firestoreApiKey}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId }],
            where: {
              compositeFilter: {
                op: "AND",
                filters: [
                  {
                    fieldFilter: {
                      field: { fieldPath: "slug" },
                      op: "EQUAL",
                      value: { stringValue: decodedSlug },
                    },
                  },
                  {
                    fieldFilter: {
                      field: { fieldPath: "status" },
                      op: "EQUAL",
                      value: { stringValue: "published" },
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

    if (response2.ok) {
      const rows = (await response2.json()) as RunQueryRow[];
      const doc = rows[0]?.document;
      if (doc?.fields) return doc;
    }

    // Attempt 3: Direct document lookup by Document ID
    const directDocRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${firestoreProjectId}/databases/(default)/documents/${collectionId}/${encodeURIComponent(decodedSlug)}?key=${firestoreApiKey}`,
      {
        method: "GET",
        next: { revalidate: revalidateSeconds },
      },
    );

    if (directDocRes.ok) {
      const doc = (await directDocRes.json()) as FirestoreDocument;
      if (doc?.fields) return doc;
    }
  } catch (error) {
    console.error(`querySingleBySlug error for [${slug}]:`, error);
  }

  return null;
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

async function queryFeaturedByLocale(collectionId: string, locale: Locale, limitCount: number) {
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
                      field: { fieldPath: "isManual" },
                      op: "EQUAL",
                      value: { booleanValue: true },
                    },
                  },
                  {
                    fieldFilter: {
                      field: { fieldPath: "isFeatured" },
                      op: "EQUAL",
                      value: { booleanValue: true },
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
            select: {
              fields: (() => {
                const baseFields = [
                  { fieldPath: "title" },
                  { fieldPath: "slug" },
                  { fieldPath: "locale" },
                  { fieldPath: "publishedAt" },
                  { fieldPath: "updatedAt" },
                  { fieldPath: "isManual" },
                ];
                if (collectionId === "posts") {
                  return [
                    ...baseFields,
                    { fieldPath: "category" },
                    { fieldPath: "excerpt" },
                    { fieldPath: "featuredImageUrl" },
                    { fieldPath: "isFeatured" },
                    { fieldPath: "sourceUrl" },
                    { fieldPath: "sourceName" },
                  ];
                }
                if (collectionId === "jobs") {
                  return [
                    ...baseFields,
                    { fieldPath: "organization" },
                    { fieldPath: "deadline" },
                  ];
                }
                if (collectionId === "currentAffairs") {
                  return [
                    ...baseFields,
                    { fieldPath: "headline" },
                  ];
                }
                return baseFields;
              })()
            },
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
            select: {
              fields: (() => {
                const baseFields = [
                  { fieldPath: "title" },
                  { fieldPath: "slug" },
                  { fieldPath: "locale" },
                  { fieldPath: "publishedAt" },
                  { fieldPath: "updatedAt" },
                  { fieldPath: "isManual" },
                ];
                if (collectionId === "posts") {
                  return [
                    ...baseFields,
                    { fieldPath: "category" },
                    { fieldPath: "excerpt" },
                    { fieldPath: "featuredImageUrl" },
                    { fieldPath: "isFeatured" },
                    { fieldPath: "sourceUrl" },
                    { fieldPath: "sourceName" },
                  ];
                }
                if (collectionId === "jobs") {
                  return [
                    ...baseFields,
                    { fieldPath: "organization" },
                    { fieldPath: "deadline" },
                  ];
                }
                return baseFields;
              })()
            },
            from: [{ collectionId }],
            where: {
              compositeFilter: {
                op: "AND",
                filters: (() => {
                  const f: any[] = [
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
                  ];
                  return f;
                })(),
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
    quiz: Array.isArray(data.quiz)
      ? (data.quiz as MiniQuizQuestion[]).filter((q) => q && typeof q === "object" && typeof q.question === "string")
      : undefined,
    subCategory: typeof data.subCategory === "string" ? data.subCategory : "",
    isFeatured: typeof data.isFeatured === "boolean" ? data.isFeatured : false,
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
