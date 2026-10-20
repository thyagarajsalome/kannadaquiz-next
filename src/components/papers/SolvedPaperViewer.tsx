"use client";

import { useState } from "react";
import Link from "next/link";
import { type Locale } from "@/lib/locales";

export interface QuestionItem {
  id: string;
  questionKn: string;
  questionEn: string;
  optionsKn: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationKn: string;
  explanationEn: string;
}

export interface SolvedPaperData {
  slug: string;
  examId: string;
  examNameKn: string;
  examNameEn: string;
  year: string;
  paperTitleKn: string;
  paperTitleEn: string;
  metaDescriptionKn: string;
  metaDescriptionEn: string;
  totalQuestions: number;
  timeMinutes: number;
  questions: QuestionItem[];
}

export function SolvedPaperViewer({
  paper,
  locale,
}: {
  paper: SolvedPaperData;
  locale: Locale;
}) {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [mode, setMode] = useState<"study" | "exam">("study");
  const [examSubmitted, setExamSubmitted] = useState(false);

  const handleSelectOption = (qIdx: number, oIdx: number) => {
    if (mode === "exam" && examSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
    if (mode === "study") {
      setRevealed((prev) => ({ ...prev, [qIdx]: true }));
    }
  };

  const toggleReveal = (qIdx: number) => {
    setRevealed((prev) => ({ ...prev, [qIdx]: !prev[qIdx] }));
  };

  const calculateScore = () => {
    let score = 0;
    paper.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const score = calculateScore();
  const shareText =
    locale === "kn"
      ? `ನಾನು ${paper.paperTitleKn} ಪತ್ರಿಕೆಯನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅಭ್ಯಾಸ ಮಾಡಿದ್ದೇನೆ. ${paper.totalQuestions} ಪ್ರಶ್ನೆಗಳಿಗೆ ${score} ಅಂಕ ಗಳಿಸಿದೆ! ಅಭ್ಯಾಸ ಮಾಡಲು ಭೇಟಿ ನೀಡಿ: https://kannadaquiz.in/kn/papers/${paper.slug}`
      : `I practiced ${paper.paperTitleEn} on KannadaQuiz and scored ${score}/${paper.totalQuestions}! Practice here: https://kannadaquiz.in/en/papers/${paper.slug}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="bg-[var(--background)] min-h-screen py-8 md:py-12">
      <div className="kq-container max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--muted)] flex items-center gap-2 mb-6">
          <Link href={`/${locale}`} className="hover:text-[var(--primary)]">
            {locale === "kn" ? "ಮುಖಪುಟ" : "Home"}
          </Link>
          <span>›</span>
          <Link href={`/${locale}/papers`} className="hover:text-[var(--primary)]">
            {locale === "kn" ? "ಹಿಂದಿನ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು" : "Previous Papers"}
          </Link>
          <span>›</span>
          <span className="text-[var(--foreground)] font-semibold truncate max-w-xs md:max-w-md">
            {locale === "kn" ? paper.paperTitleKn : paper.paperTitleEn}
          </span>
        </nav>

        {/* Paper Header Card */}
        <header className="kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-xs mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-blue-200">
              {locale === "kn" ? paper.examNameKn : paper.examNameEn}
            </span>
            <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
              {locale === "kn" ? `${paper.year} ಸಾಲಿನ ಪರೀಕ್ಷೆ` : `Year ${paper.year}`}
            </span>
            <span className="bg-purple-50 text-purple-700 font-bold text-xs px-3 py-1 rounded-full border border-purple-200">
              {paper.totalQuestions} {locale === "kn" ? "ಪ್ರಶ್ನೆಗಳು" : "Questions"}
            </span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-extrabold text-[var(--primary)] leading-tight mb-4">
            {locale === "kn" ? paper.paperTitleKn : paper.paperTitleEn}
          </h1>

          <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
            {locale === "kn" ? paper.metaDescriptionKn : paper.metaDescriptionEn}
          </p>

          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--foreground)]">
                {locale === "kn" ? "ಅಭ್ಯಾಸ ವಿಧಾನ:" : "Mode:"}
              </span>
              <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode("study");
                    setExamSubmitted(false);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    mode === "study"
                      ? "bg-white text-[var(--primary)] shadow-xs"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {locale === "kn" ? "📖 ಅಧ್ಯಯನ (Instant Answers)" : "📖 Study Mode"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("exam");
                    setRevealed({});
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    mode === "exam"
                      ? "bg-white text-[var(--primary)] shadow-xs"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {locale === "kn" ? "⏱️ ಪರೀಕ್ಷಾ ವಿಧಾನ (Mock Test)" : "⏱️ Exam Mode"}
                </button>
              </div>
            </div>

            {/* WhatsApp Share */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline"
            >
              <span>📲 WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ</span>
            </a>
          </div>
        </header>

        {/* Questions List */}
        <div className="space-y-6">
          {paper.questions.map((q, qIdx) => {
            const isUserAnswered = userAnswers[qIdx] !== undefined;
            const isCorrect = userAnswers[qIdx] === q.correctIndex;
            const isAnswerVisible = mode === "study" ? revealed[qIdx] : examSubmitted;

            return (
              <article
                key={q.id}
                id={`q-${qIdx + 1}`}
                className="kq-card p-5 md:p-7 rounded-2xl border border-[var(--border)] bg-white shadow-xs"
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-black text-sm flex items-center justify-center">
                    {qIdx + 1}
                  </span>
                  <div className="space-y-1 flex-1">
                    <h2 className="font-serif text-base md:text-lg font-bold text-[var(--foreground)] leading-snug">
                      {locale === "kn" ? q.questionKn : q.questionEn}
                    </h2>
                    {locale === "kn" && (
                      <p className="text-xs text-[var(--muted)] italic">
                        {q.questionEn}
                      </p>
                    )}
                  </div>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  {(locale === "kn" ? q.optionsKn : q.optionsEn).map((opt, oIdx) => {
                    const isSelected = userAnswers[qIdx] === oIdx;
                    const isRightOption = oIdx === q.correctIndex;

                    let btnStyle = "border-[var(--border)] hover:border-[var(--secondary)]/60 bg-white";
                    if (isAnswerVisible) {
                      if (isRightOption) {
                        btnStyle = "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold";
                      } else if (isSelected && !isRightOption) {
                        btnStyle = "border-rose-400 bg-rose-50 text-rose-900 line-through";
                      }
                    } else if (isSelected) {
                      btnStyle = "border-[var(--primary)] bg-[var(--primary)]/5 font-bold";
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, oIdx)}
                        className={`text-left p-3 rounded-xl border text-xs md:text-sm transition-all flex items-center gap-3 ${btnStyle}`}
                      >
                        <span className="w-6 h-6 rounded-md bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Answer & Explanation Box */}
                {mode === "study" && (
                  <div className="border-t border-[var(--border)] pt-3">
                    <button
                      type="button"
                      onClick={() => toggleReveal(qIdx)}
                      className="text-xs font-bold text-[var(--secondary)] hover:underline inline-flex items-center gap-1 mb-2"
                    >
                      <span>{revealed[qIdx] ? "▲ ವಿವರಣೆ ಮರೆಮಾಡಿ" : "▼ ಸರಿಯಾದ ಉತ್ತರ ಮತ್ತು ವಿವರಣೆ ನೋಡಿ"}</span>
                    </button>

                    {revealed[qIdx] && (
                      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs md:text-sm space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-950">
                            {locale === "kn" ? "ಸರಿಯಾದ ಉತ್ತರ:" : "Correct Answer:"}
                          </span>
                          <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                            ({String.fromCharCode(65 + q.correctIndex)}){" "}
                            {locale === "kn" ? q.optionsKn[q.correctIndex] : q.optionsEn[q.correctIndex]}
                          </span>
                        </div>
                        <p className="text-amber-900 leading-relaxed">
                          <strong>{locale === "kn" ? "ವಿವರಣೆ: " : "Explanation: "}</strong>
                          {locale === "kn" ? q.explanationKn : q.explanationEn}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* Exam Mode Submit Card */}
        {mode === "exam" && !examSubmitted && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setExamSubmitted(true)}
              className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-xl shadow-md transition-all"
            >
              {locale === "kn" ? "ಉತ್ತರಗಳನ್ನು ಸಬ್ಮಿಟ್ ಮಾಡಿ ಫಲಿತಾಂಶ ನೋಡಿ ➔" : "Submit Answers & View Scorecard ➔"}
            </button>
          </div>
        )}

        {/* Scorecard in Exam Mode */}
        {mode === "exam" && examSubmitted && (
          <div className="mt-8 kq-card p-6 md:p-8 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-blue-50 text-center shadow-md">
            <h3 className="font-serif text-2xl font-black text-[var(--primary)] mb-2">
              {locale === "kn" ? "ನಿಮ್ಮ ಅಣಕು ಪರೀಕ್ಷೆ ಫಲಿತಾಂಶ" : "Your Mock Test Score"}
            </h3>
            <div className="text-4xl md:text-5xl font-black text-[var(--secondary)] my-3">
              {score} / {paper.totalQuestions}
            </div>
            <p className="text-xs text-[var(--muted)] mb-5">
              {locale === "kn"
                ? `ಶೇಕಡಾವಾರು: ${Math.round((score / paper.totalQuestions) * 100)}%`
                : `Accuracy: ${Math.round((score / paper.totalQuestions) * 100)}%`}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-sm"
              >
                <span>WhatsApp ನಲ್ಲಿ ಸ್ಕೋರ್ ಹಂಚಿಕೊಳ್ಳಿ</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setUserAnswers({});
                  setExamSubmitted(false);
                }}
                className="px-5 py-3 rounded-xl bg-white border border-[var(--border)] font-bold text-xs uppercase tracking-wider text-[var(--primary)] hover:bg-gray-50"
              >
                {locale === "kn" ? "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ" : "Retake Test"}
              </button>
            </div>
          </div>
        )}

        {/* Related Papers Navigation */}
        <footer className="mt-12 kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-xs">
          <h3 className="font-serif text-lg font-bold text-[var(--primary)] mb-3">
            {locale === "kn" ? "ಇತರ ವರ್ಷಗಳ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು" : "Explore Other Previous Papers"}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <Link
              href={`/${locale}/papers`}
              className="px-4 py-2 rounded-lg bg-[var(--surface-soft)] hover:bg-[var(--secondary)] hover:text-white transition-all font-semibold"
            >
              {locale === "kn" ? "ಎಲ್ಲಾ ಹಿಂದಿನ ಪತ್ರಿಕೆಗಳು ➔" : "All Previous Papers ➔"}
            </Link>
            <Link
              href={`/${locale}/tools/kannada-typing`}
              className="px-4 py-2 rounded-lg bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100 transition-all font-semibold"
            >
              ⌨️ {locale === "kn" ? "ಕನ್ನಡ ಟೈಪಿಂಗ್ ಅಭ್ಯಾಸ" : "Kannada Typing Practice"}
            </Link>
            <Link
              href={`/${locale}/tools/age-calculator`}
              className="px-4 py-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-all font-semibold"
            >
              🎯 {locale === "kn" ? "ವಯಸ್ಸು ಕ್ಯಾಲ್ಕುಲೇಟರ್" : "Age Calculator"}
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
