"use client";

import { useMemo, useState } from "react";
import type { Quiz } from "@/data/content";
import type { Locale } from "@/lib/locales";

export function QuizPlayer({ quiz, locale }: { quiz: Quiz; locale: Locale }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () =>
      quiz.questions.reduce(
        (total, question) => total + (answers[question.id] === question.answerIndex ? 1 : 0),
        0,
      ),
    [answers, quiz.questions],
  );

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
              {index + 1}. {question.question[locale]}
            </p>
            <div className="mt-4 grid gap-2">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                const correct = submitted && question.answerIndex === optionIndex;
                const wrong = submitted && selected && !correct;

                return (
                  <button
                    key={option[locale]}
                    type="button"
                    onClick={() =>
                      setAnswers((current) => ({ ...current, [question.id]: optionIndex }))
                    }
                    className={[
                      "min-h-11 rounded-md border px-4 py-2 text-left text-sm font-medium transition",
                      correct
                        ? "border-green-700 bg-green-50 text-green-900"
                        : wrong
                          ? "border-red-700 bg-red-50 text-red-900"
                          : selected
                            ? "border-[var(--primary)] bg-[var(--surface-soft)]"
                            : "border-[var(--border)] bg-white hover:border-[var(--primary)]",
                    ].join(" ")}
                  >
                    {option[locale]}
                  </button>
                );
              })}
            </div>
            {submitted ? (
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {question.explanation[locale]}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setSubmitted(true)}
        className="mt-5 rounded-md bg-[var(--secondary)] px-5 py-3 text-sm font-bold text-white"
      >
        {locale === "kn" ? "ಫಲಿತಾಂಶ ನೋಡಿ" : "Check result"}
      </button>
    </section>
  );
}
