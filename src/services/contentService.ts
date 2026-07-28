import { cacheService } from "@/services/cacheService";
import { firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, limit as limitQuery } from "firebase/firestore";
import {
  FirestorePost,
  FirestoreJob,
  ContentSource,
} from "@/lib/firestore-schema";
import {
  getPublicPosts,
  getPublicQuizzes,
  getPublicJobs,
  PublicPost,
  PublicQuiz,
  PublicJob,
} from "@/lib/public-content";
import type { Locale } from "@/lib/locales";

// Default cache TTL for zero-cost operation (1 hour)
const CACHE_TTL_MS = 60 * 60 * 1000;

export interface ServiceResult<T> {
  data: T;
  source: ContentSource;
}

export const contentService = {
  /**
   * Fetch published posts with 3-tier fallback strategy (Cache -> Firestore -> Local Static Fallback)
   */
  async getPosts(locale: Locale = "kn"): Promise<ServiceResult<FirestorePost[]>> {
    const cacheKey = `posts_${locale}`;
    const cached = cacheService.get<FirestorePost[]>(cacheKey);

    if (cached && cached.length > 0) {
      return { data: cached, source: "cache" };
    }

    const db = firestore;
    if (db) {
      try {
        const postsRef = collection(db, "posts");
        const q = query(
          postsRef,
          where("locale", "==", locale),
          where("status", "==", "published"),
          limitQuery(30)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const posts: FirestorePost[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              slug: data.slug || doc.id,
              locale: data.locale || locale,
              title: data.title || "",
              excerpt: data.excerpt || "",
              body: data.body || "",
              category: data.category || "General",
              status: data.status || "published",
              publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : data.publishedAt,
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
              featuredImageUrl: data.featuredImageUrl,
              sourceUrl: data.sourceUrl,
              sourceName: data.sourceName,
              _source: "firestore",
            };
          });

          cacheService.set(cacheKey, posts, CACHE_TTL_MS);
          return { data: posts, source: "firestore" };
        }
      } catch (err) {
        console.warn("Firestore fetch post error, falling back to static content:", err);
      }
    }

    // Fallback to static content (Zero Cost)
    const staticPosts: PublicPost[] = await getPublicPosts(locale);
    const mapped: FirestorePost[] = staticPosts.map((sp) => ({
      id: sp.id,
      slug: sp.slug,
      locale: sp.locale,
      title: sp.title,
      excerpt: sp.excerpt,
      body: sp.body,
      category: sp.category,
      status: "published",
      featuredImageUrl: sp.featuredImageUrl,
      sourceUrl: sp.sourceUrl,
      sourceName: sp.sourceName,
      _source: "fallback",
    }));

    return { data: mapped, source: "fallback" };
  },

  /**
   * Fetch published quizzes with 3-tier fallback strategy
   */
  async getQuizzes(locale: Locale = "kn"): Promise<ServiceResult<PublicQuiz[]>> {
    const cacheKey = `quizzes_${locale}`;
    const cached = cacheService.get<PublicQuiz[]>(cacheKey);

    if (cached && cached.length > 0) {
      return { data: cached, source: "cache" };
    }

    const db = firestore;
    if (db) {
      try {
        const quizzesRef = collection(db, "quizzes");
        const q = query(
          quizzesRef,
          where("locale", "==", locale),
          where("status", "==", "published"),
          limitQuery(20)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const quizzesPromises = snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const quizId = docSnap.id;

            // Fetch questions for this quiz
            const qRef = collection(db, "quizQuestions");
            const qQuery = query(qRef, where("quizId", "==", quizId));
            const qSnap = await getDocs(qQuery);

            const questions = qSnap.docs.map((qDoc) => {
              const qData = qDoc.data();
              return {
                id: qDoc.id,
                question: qData.question || "",
                options: qData.options || [],
                correctOptionIndex: qData.correctOptionIndex ?? 0,
                explanation: qData.explanation,
                sortOrder: qData.sortOrder ?? 0,
              };
            });

            return {
              id: quizId,
              slug: data.slug || quizId,
              locale: data.locale || locale,
              title: data.title || "",
              description: data.description || "",
              exam: data.exam || "General",
              subject: data.subject || "General Knowledge",
              difficulty: (data.difficulty as "Easy" | "Medium" | "Hard") || "Medium",
              timeLimitMinutes: Math.round((data.timeLimitSeconds || 300) / 60),
              questions: questions.sort((a, b) => a.sortOrder - b.sortOrder),
            } as PublicQuiz;
          });

          const quizzes = await Promise.all(quizzesPromises);
          cacheService.set(cacheKey, quizzes, CACHE_TTL_MS);
          return { data: quizzes, source: "firestore" };
        }
      } catch (err) {
        console.warn("Firestore fetch quizzes error, falling back to static content:", err);
      }
    }

    // Static fallback
    const staticQuizzes = await getPublicQuizzes(locale);
    return { data: staticQuizzes, source: "fallback" };
  },

  /**
   * Fetch active job alerts with 3-tier fallback strategy
   */
  async getJobs(locale: Locale = "kn"): Promise<ServiceResult<FirestoreJob[]>> {
    const cacheKey = `jobs_${locale}`;
    const cached = cacheService.get<FirestoreJob[]>(cacheKey);

    if (cached && cached.length > 0) {
      return { data: cached, source: "cache" };
    }

    const db = firestore;
    if (db) {
      try {
        const jobsRef = collection(db, "jobs");
        const q = query(
          jobsRef,
          where("locale", "==", locale),
          where("status", "==", "published"),
          limitQuery(20)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const jobs: FirestoreJob[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              slug: data.slug || doc.id,
              locale: data.locale || locale,
              title: data.title || "",
              organization: data.organization || "",
              deadline: data.deadline || "",
              body: data.body || "",
              status: data.status || "published",
              applyUrl: data.applyUrl,
              _source: "firestore",
            };
          });

          cacheService.set(cacheKey, jobs, CACHE_TTL_MS);
          return { data: jobs, source: "firestore" };
        }
      } catch (err) {
        console.warn("Firestore fetch jobs error, falling back to static content:", err);
      }
    }

    // Static fallback
    const staticJobs: PublicJob[] = await getPublicJobs(locale);
    const mapped: FirestoreJob[] = staticJobs.map((j) => ({
      id: j.id,
      slug: j.slug,
      locale: j.locale,
      title: j.title,
      organization: j.organization,
      deadline: j.deadline,
      body: j.body,
      status: j.status as any,
      applyUrl: j.applyUrl,
      _source: "fallback",
    }));

    return { data: mapped, source: "fallback" };
  },
};
