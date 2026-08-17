"use client";

import { useEffect, useMemo, useState } from "react";
import type { PublicQuiz } from "@/lib/public-content";
import type { Locale } from "@/lib/locales";
import { onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firebaseAuth, firestore } from "@/lib/firebase";

export function QuizPlayer({ quiz, locale }: { quiz: PublicQuiz; locale: Locale }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [attemptSaved, setAttemptSaved] = useState(false);

  const score = useMemo(
    () =>
      quiz.questions.reduce(
        (total, question) => total + (answers[question.id] === question.correctOptionIndex ? 1 : 0),
        0,
      ),
    [answers, quiz.questions],
  );

  useEffect(() => {
    if (!firebaseAuth) return;
    return onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    if (submitted && currentUser && firestore && !attemptSaved) {
      setAttemptSaved(true);
      void saveQuizAttempt();
    }
  }, [submitted, currentUser, attemptSaved]);

  async function saveQuizAttempt() {
    const attemptData = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: score,
      totalQuestions: quiz.questions.length,
      completedAt: new Date().toISOString(),
    };

    if (firestore && currentUser) {
      try {
        await addDoc(collection(firestore, "quizAttempts"), {
          ...attemptData,
          userId: currentUser.uid,
          completedAt: serverTimestamp(),
        });
        return;
      } catch (error) {
        console.warn("Firestore quiz attempt save failed, storing locally:", error);
      }
    }

    // Zero-cost local storage fallback
    try {
      const existing = JSON.parse(localStorage.getItem("kq_quiz_attempts") || "[]");
      existing.push(attemptData);
      localStorage.setItem("kq_quiz_attempts", JSON.stringify(existing));
    } catch {}
  }

  return (
    <section className="kq-card p-5 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <h2 className="font-serif text-2xl font-bold text-[var(--primary)]">
          {locale === "kn" ? "ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು" : "Practice questions"}
        </h2>
        <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-sm font-semibold">
          {score}/{quiz.questions.length}
        </span>
      </div>

      <div className="mt-5 grid gap-5">
        {quiz.questions.map((question, index) => (
          <article key={question.id} className="rounded-md border border-[var(--border)] p-4">
            <p className="font-semibold text-[var(--primary)]">
              {index + 1}. {question.question}
            </p>
            <div className="mt-4 grid gap-2">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                const correct = submitted && question.correctOptionIndex === optionIndex;
                const wrong = submitted && selected && !correct;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setAnswers((current) => ({ ...current, [question.id]: optionIndex }))
                    }
                    className={[
                      "min-h-11 rounded-md border px-4 py-2 text-sm font-medium transition flex items-center justify-between gap-3 text-left w-full",
                      correct
                        ? "border-green-700 bg-green-50 text-green-900"
                        : wrong
                          ? "border-red-700 bg-red-50 text-red-900"
                          : selected
                            ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-md"
                            : "border-[var(--border)] bg-white text-[var(--primary)] hover:border-[var(--primary)]/50",
                    ].join(" ")}
                  >
                    <span>{option}</span>
                    {selected && !submitted && (
                      <svg className="w-5 h-5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {correct && (
                      <svg className="w-5 h-5 shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {wrong && (
                      <svg className="w-5 h-5 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            {submitted && question.explanation ? (
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {question.explanation}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="cursor-pointer rounded-md bg-[var(--secondary)] px-5 py-3 text-sm font-bold text-white"
        >
          {locale === "kn" ? "ಫಲಿತಾಂಶ ನೋಡಿ" : "Check result"}
        </button>

        {submitted && !currentUser ? (
          <p className="text-xs font-semibold text-[var(--secondary)]">
            {locale === "kn"
              ? "ಗಮನಿಸಿ: ನಿಮ್ಮ ಅಂಕಗಳನ್ನು ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಉಳಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ."
              : "Note: Please sign in to save your results to your profile."}
          </p>
        ) : null}

        {submitted && currentUser && attemptSaved ? (
          <p className="text-xs font-semibold text-green-700">
            {locale === "kn"
              ? "ನಿಮ್ಮ ಅಂಕಗಳನ್ನು ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ!"
              : "Attempt saved to your profile!"}
          </p>
        ) : null}
      </div>
    </section>
  );
}
