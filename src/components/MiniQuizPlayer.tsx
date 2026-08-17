"use client";

import { useState } from "react";
import type { MiniQuizQuestion } from "@/lib/public-content";

type MiniQuizPlayerProps = {
  questions: MiniQuizQuestion[];
  locale: "kn" | "en";
};

export function MiniQuizPlayer({ questions, locale }: MiniQuizPlayerProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({}); // maps questionIndex -> selectedOptionIndex

  if (!questions || questions.length === 0) return null;

  const titleText = locale === "kn" ? "ವಿಷಯ ವಿಶ್ಲೇಷಣೆ ರಸಪ್ರಶ್ನೆ" : "Topic Comprehension Quiz";
  const subtitleText =
    locale === "kn"
      ? "ಈ ಲೇಖನದ ಆಧಾರದ ಮೇಲೆ ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ:"
      : "Test your understanding of this article:";
  const explanationLabel = locale === "kn" ? "ವಿವರಣೆ:" : "Explanation:";

  return (
    <div className="mt-8 border border-[var(--border)] rounded-xl bg-white p-6 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4 mb-5">
        <div className="bg-violet-100 text-violet-700 p-2 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold text-[var(--primary)]">{titleText}</h3>
          <p className="text-xs text-[var(--muted)]">{subtitleText}</p>
        </div>
      </div>

      <div className="space-y-6">
        {questions.filter(Boolean).map((q, qIdx) => {
          const selectedOption = answers[qIdx];
          const isAnswered = selectedOption !== undefined;

          return (
            <div key={qIdx} className="p-4 rounded-lg bg-slate-50 border border-slate-200/60">
              <h4 className="font-serif font-bold text-sm text-[var(--primary)] leading-relaxed flex gap-2">
                <span className="text-violet-600 font-extrabold">{qIdx + 1}.</span>
                <span>{q.question}</span>
              </h4>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(q.options || []).map((opt, oIdx) => {
                  const isSelected = selectedOption === oIdx;
                  const isCorrect = oIdx === q.correctOptionIndex;
                  const isWrong = isSelected && !isCorrect;

                  let btnClass = "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300";
                  if (isAnswered) {
                    if (isCorrect) {
                      btnClass = "bg-emerald-550 border-emerald-300 text-emerald-800 font-semibold";
                    } else if (isWrong) {
                      btnClass = "bg-rose-50 border-rose-300 text-rose-800 font-semibold";
                    } else {
                      btnClass = "bg-white border-slate-200 text-slate-400 opacity-60 pointer-events-none";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                      className={`w-full px-4 py-2.5 rounded-lg border text-xs leading-relaxed transition-all select-none flex items-center justify-between gap-3 ${btnClass} ${
                        !isAnswered ? "cursor-pointer active:scale-[0.99]" : "pointer-events-none"
                      }`}
                    >
                      <div className="flex text-left">
                        <span className="font-extrabold uppercase mr-1.5 opacity-60">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isAnswered && isCorrect && (
                        <svg className="w-5 h-5 shrink-0 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {isAnswered && isWrong && (
                        <svg className="w-5 h-5 shrink-0 text-rose-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-3.5 pt-3 border-t border-slate-200 text-xs text-[var(--muted)] leading-relaxed animate-[fadeIn_0.3s_ease-out]">
                  <strong className="text-slate-800 font-extrabold block mb-1">
                    {explanationLabel}
                  </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
