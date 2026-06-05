"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { firebaseAuth, firestore } from "@/lib/firebase";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type QuizAttempt = {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  completedAtString: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === "en" ? "en" : "kn";

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [fetchingAttempts, setFetchingAttempts] = useState(false);

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        router.push(`/${locale}/login`);
      }
    });
    return () => unsubscribe();
  }, [router, locale]);

  useEffect(() => {
    if (user && firestore) {
      void fetchAttempts();
    }
  }, [user]);

  async function fetchAttempts() {
    if (!firestore || !user) return;
    setFetchingAttempts(true);

    try {
      const q = query(
        collection(firestore, "quizAttempts"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        let dateStr = "N/A";
        if (data.completedAt?.toDate) {
          dateStr = data.completedAt.toDate().toLocaleDateString(locale === "kn" ? "kn-IN" : "en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        } else if (data.completedAt) {
          dateStr = new Date(data.completedAt).toLocaleDateString();
        }

        return {
          id: doc.id,
          quizId: String(data.quizId ?? ""),
          quizTitle: String(data.quizTitle ?? "Unknown Quiz"),
          score: Number(data.score ?? 0),
          totalQuestions: Number(data.totalQuestions ?? 0),
          completedAtString: dateStr,
          rawDate: data.completedAt?.toDate ? data.completedAt.toDate().getTime() : 0,
        };
      });

      // Sort client-side by date descending
      items.sort((a, b) => b.rawDate - a.rawDate);
      setAttempts(items);
    } catch (error) {
      console.error("Error fetching attempts:", error);
    } finally {
      setFetchingAttempts(false);
    }
  }

  async function handleClearHistory() {
    const db = firestore;
    if (!db || !user || attempts.length === 0) return;
    const confirm = window.confirm(
      locale === "kn"
        ? "ನಿಮ್ಮ ಅಭ್ಯಾಸದ ಇತಿಹಾಸವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?"
        : "Are you sure you want to clear your practice history?"
    );
    if (!confirm) return;

    setFetchingAttempts(true);
    try {
      const deletePromises = attempts.map((attempt) =>
        deleteDoc(doc(db, "quizAttempts", attempt.id))
      );
      await Promise.all(deletePromises);
      setAttempts([]);
    } catch (error) {
      console.error("Error clearing attempts:", error);
    } finally {
      setFetchingAttempts(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm font-semibold text-[var(--muted)]">
          {locale === "kn" ? "ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="kq-container py-10">
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* User Card */}
        <section className="kq-card p-6 h-fit bg-white">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold text-2xl">
              {user.email ? user.email[0].toUpperCase() : "U"}
            </div>
            <h1 className="mt-4 font-serif text-2xl font-bold text-[var(--primary)]">
              {locale === "kn" ? "ನನ್ನ ವಿವರಗಳು" : "My Profile"}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">{user.email}</p>

            <button
              onClick={() => firebaseAuth && signOut(firebaseAuth)}
              className="mt-6 cursor-pointer rounded-md border border-[var(--border)] px-4 py-2 text-sm font-bold text-[var(--primary)] hover:bg-[var(--surface-soft)]"
            >
              {locale === "kn" ? "ಖಾತೆಯಿಂದ ನಿರ್ಗಮಿಸಿ" : "Log out"}
            </button>
          </div>
        </section>

        {/* Quiz Attempts */}
        <section className="kq-card p-6 bg-white">
          <div className="flex items-center justify-between gap-4 mb-5 font-bold">
            <h2 className="font-serif text-2xl font-bold text-[var(--primary)]">
              {locale === "kn" ? "ನಿಮ್ಮ ಅಭ್ಯಾಸದ ಇತಿಹಾಸ" : "Your Practice History"}
            </h2>
            {attempts.length > 0 && (
              <button
                onClick={handleClearHistory}
                disabled={fetchingAttempts}
                className="cursor-pointer text-xs font-bold text-[var(--secondary)] hover:underline disabled:opacity-50"
              >
                {locale === "kn" ? "ಇತಿಹಾಸ ಅಳಿಸಿ" : "Clear History"}
              </button>
            )}
          </div>

          {fetchingAttempts ? (
            <p className="text-sm text-[var(--muted)]">
              {locale === "kn" ? "ಫಲಿತಾಂಶಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..." : "Loading attempts..."}
            </p>
          ) : attempts.length > 0 ? (
            <div className="grid gap-4">
              {attempts.map((attempt) => (
                <div key={attempt.id} className="p-4 rounded-md border border-[var(--border)] flex flex-wrap justify-between items-center gap-4 hover:border-[var(--primary)] transition bg-[var(--surface-soft)]">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[var(--primary)]">{attempt.quizTitle}</h3>
                    <p className="text-xs text-[var(--muted)] mt-1">{attempt.completedAtString}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-bold text-[var(--secondary)] block">
                        {locale === "kn" ? "ಅಂಕಗಳು" : "Score"}
                      </span>
                      <span className="font-bold text-xl text-[var(--primary)]">
                        {attempt.score} / {attempt.totalQuestions}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-[var(--muted)] mb-4">
                {locale === "kn"
                  ? "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಕ್ವಿಜ್ ಅಭ್ಯಾಸ ಮಾಡಿಲ್ಲ."
                  : "You haven't attempted any quizzes yet."}
              </p>
              <Link
                href={`/${locale}/quizzes`}
                className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white"
              >
                {locale === "kn" ? "ಕ್ವಿಜ್ ಪುಟಕ್ಕೆ ಹೋಗಿ" : "Go to Quizzes"}
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
