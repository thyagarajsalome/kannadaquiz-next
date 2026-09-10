"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const totalQuestions = quiz.questions.length;

  const { score, correctCount, wrongCount, unansweredCount, percentage } = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    quiz.questions.forEach((question) => {
      const selected = answers[question.id];
      if (selected === undefined) {
        unanswered++;
      } else if (selected === question.correctOptionIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    const pct = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    return {
      score: correct,
      correctCount: correct,
      wrongCount: wrong,
      unansweredCount: unanswered,
      percentage: pct,
    };
  }, [answers, quiz.questions, totalQuestions]);

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
      totalQuestions: totalQuestions,
      percentage: percentage,
      completedAt: new Date().toISOString(),
    };

    if (currentUser && firestore) {
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

    try {
      const existing = JSON.parse(localStorage.getItem("kq_quiz_attempts") || "[]");
      existing.push(attemptData);
      localStorage.setItem("kq_quiz_attempts", JSON.stringify(existing));
    } catch {}
  }

  function handleSubmit() {
    setSubmitted(true);
    // Smooth scroll to top of scorecard
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
    setAttemptSaved(false);
    setCopied(false);
  }

  // Pre-filled WhatsApp & Telegram Share Text
  const shareUrl = `https://kannadaquiz.in/${locale}/quizzes/${quiz.slug}`;
  const shareText =
    locale === "kn"
      ? `🎯 ನಾನು ಕನ್ನಡಕ್ವಿಜ್ (KannadaQuiz) ನಲ್ಲಿ "${quiz.title}" ಪರೀಕ್ಷೆಯಲ್ಲಿ ${totalQuestions} ರಲ್ಲಿ ${score} ಅಂಕ ಗಳಿಸಿದೆ (${percentage}%)! 🏆\n\nನೀವು ಎಷ್ಟು ಅಂಕ ಗಳಿಸುತ್ತೀರಿ? ನಿಮ್ಮ ಜ್ಞಾನವನ್ನು ಈಗಲೇ ಪರೀಕ್ಷಿಸಿ 👇\n${shareUrl}`
      : `🎯 I scored ${score}/${totalQuestions} (${percentage}%) in "${quiz.title}" on KannadaQuiz! 🏆\n\nCan you beat my score? Test your knowledge now 👇\n${shareUrl}`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
    locale === "kn"
      ? `🎯 ನಾನು "${quiz.title}" ನಲ್ಲಿ ${totalQuestions} ರಲ್ಲಿ ${score} ಅಂಕ ಗಳಿಸಿದೆ (${percentage}%)! ನೀವು ಪ್ರಯತ್ನಿಸಿ:`
      : `🎯 I scored ${score}/${totalQuestions} (${percentage}%) in "${quiz.title}"! Try it:`
  )}`;

  function handleCopyLink() {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  const performanceBadge = useMemo(() => {
    if (percentage >= 80) {
      return {
        badge: locale === "kn" ? "🏆 ಅತ್ಯುತ್ತಮ ಪ್ರದರ್ಶನ!" : "🏆 Outstanding Performance!",
        color: "bg-emerald-100 text-emerald-900 border-emerald-300",
        message:
          locale === "kn"
            ? "ಅದ್ಭುತ ಜ್ಞಾನ! ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗೆ ನಿಮ್ಮ ತಯಾರಿ ತುಂಬಾ ಉತ್ತಮವಾಗಿದೆ."
            : "Brilliant knowledge! Your preparation for competitive exams is top notch.",
      };
    }
    if (percentage >= 50) {
      return {
        badge: locale === "kn" ? "🌟 ಉತ್ತಮ ಪ್ರಯತ್ನ!" : "🌟 Good Effort!",
        color: "bg-amber-100 text-amber-900 border-amber-300",
        message:
          locale === "kn"
            ? "ಉತ್ತಮ ಅಂಕಗಳು! ವಿವರಣೆಗಳನ್ನು ಓದಿ ಇನ್ನಷ್ಟು ಅಭ್ಯಾಸ ಮಾಡಿ."
            : "Good score! Review the explanations below to improve even further.",
      };
    }
    return {
      badge: locale === "kn" ? "📚 ಇನ್ನಷ್ಟು ಅಭ್ಯಾಸದ ಅಗತ್ಯವಿದೆ" : "📚 Needs More Practice",
      color: "bg-rose-100 text-rose-900 border-rose-300",
      message:
        locale === "kn"
          ? "ಚಿಂತಿಸಬೇಡಿ! ಕೆಳಗಿನ ಸರಿಯಾದ ಉತ್ತರಗಳು ಮತ್ತು ವಿವರಣೆಗಳನ್ನು ಓದಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
          : "Don't worry! Review the correct answers and explanations below, then try again.",
    };
  }, [percentage, locale]);

  return (
    <section className="kq-card p-5 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-xs">
      <div ref={resultRef} />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4 mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] block mb-1">
            {quiz.exam || "KPSC"} • {quiz.subject || "General Knowledge"}
          </span>
          <h2 className="font-serif text-2xl font-bold text-[var(--primary)]">
            {locale === "kn" ? "ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು & ಅಣಕು ಪರೀಕ್ಷೆ" : "Practice Mock Test Questions"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--surface-soft)] border border-[var(--border)] px-3.5 py-1 text-sm font-black text-[var(--primary)]">
            {submitted ? `${score} / ${totalQuestions}` : `${Object.keys(answers).length} / ${totalQuestions} ಉತ್ತರಿಸಲಾಗಿದೆ`}
          </span>
        </div>
      </div>

      {/* 🏆 VIRAL RESULT SCORECARD BANNER (Displayed upon submit) */}
      {submitted && (
        <div className="mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-emerald-50 border-2 border-[var(--secondary)]/40 shadow-sm animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--border)]/60 pb-6">
            <div className="space-y-2">
              <span className={`inline-block text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${performanceBadge.color}`}>
                {performanceBadge.badge}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-[var(--primary)]">
                {locale === "kn" ? "ನಿಮ್ಮ ಅಂತಿಮ ಫಲಿತಾಂಶ" : "Your Final Result"}
              </h3>
              <p className="text-xs md:text-sm text-[var(--muted)] leading-relaxed max-w-lg">
                {performanceBadge.message}
              </p>
            </div>

            {/* Big Score Box */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[var(--border)] shadow-xs shrink-0">
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-black text-[var(--secondary)]">
                  {score}
                </span>
                <span className="text-xs text-[var(--muted)] block font-bold">
                  / {totalQuestions} ಅಂಕ
                </span>
              </div>
              <div className="w-px h-10 bg-[var(--border)]" />
              <div className="text-center">
                <span className="text-3xl md:text-4xl font-black text-emerald-600">
                  {percentage}%
                </span>
                <span className="text-xs text-[var(--muted)] block font-bold">
                  ನಿಖರತೆ (Accuracy)
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Counters */}
          <div className="grid grid-cols-3 gap-3 py-4 border-b border-[var(--border)]/60 text-center text-xs font-bold">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="block text-lg font-black">{correctCount}</span>
              <span>{locale === "kn" ? "ಸರಿ (Correct)" : "Correct"}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200">
              <span className="block text-lg font-black">{wrongCount}</span>
              <span>{locale === "kn" ? "ತಪ್ಪು (Wrong)" : "Wrong"}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              <span className="block text-lg font-black">{unansweredCount}</span>
              <span>{locale === "kn" ? "ಬಿಟ್ಟ ಪ್ರಶ್ನೆಗಳು" : "Skipped"}</span>
            </div>
          </div>

          {/* 📲 VIRAL SHARE CONTROLS */}
          <div className="pt-6">
            <p className="text-center text-xs font-black uppercase tracking-wider text-[var(--primary)] mb-3">
              {locale === "kn" ? "ನಿಮ್ಮ ಸ್ನೇಹಿತರಿಗೂ ಸವಾಲು ಹಾಕಿ - ರಿಸಲ್ಟ್ ಹಂಚಿಕೊಳ್ಳಿ:" : "Challenge your friends - Share your score:"}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* WhatsApp Share Button */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-102 select-none"
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.159.57 4.185 1.564 5.939l-1.564 5.889 6.088-1.597c1.706.924 3.659 1.449 5.732 1.449 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ</span>
              </a>

              {/* Telegram Share Button */}
              <a
                href={telegramShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-102 select-none"
              >
                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.828.942z" />
                </svg>
                <span>Telegram</span>
              </a>

              {/* Copy Score Link */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--border)] bg-white hover:bg-[var(--surface-soft)] text-xs font-bold text-[var(--primary)] transition-all select-none"
              >
                <span>{copied ? "✓ ಲಿಂಕ್ ಕಾಪಿ ಆಗಿದೆ!" : "📋 ಸ್ಕೋರ್ ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಿ"}</span>
              </button>

              {/* Retake Quiz */}
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[var(--border)] bg-white hover:bg-slate-100 text-xs font-bold text-[var(--muted)] hover:text-[var(--primary)] transition-all select-none"
              >
                <span>↻ ಮತ್ತೆ ಪರೀಕ್ಷೆ ಬರೆಯಿರಿ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="mt-5 grid gap-6">
        {quiz.questions.map((question, index) => (
          <article
            key={question.id}
            className={`rounded-xl border p-5 transition-colors ${
              submitted
                ? answers[question.id] === question.correctOptionIndex
                  ? "border-emerald-200 bg-emerald-50/20"
                  : "border-rose-200 bg-rose-50/20"
                : "border-[var(--border)] bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="font-serif font-bold text-base md:text-lg text-[var(--primary)] leading-snug">
                <span className="text-[var(--secondary)] mr-2 font-mono">Q{index + 1}.</span>
                {question.question}
              </p>
              {submitted && (
                <span className="shrink-0 text-lg">
                  {answers[question.id] === question.correctOptionIndex ? "✅" : "❌"}
                </span>
              )}
            </div>

            <div className="mt-4 grid gap-2.5">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                const correct = submitted && question.correctOptionIndex === optionIndex;
                const wrong = submitted && selected && !correct;

                return (
                  <button
                    key={optionIndex}
                    type="button"
                    disabled={submitted}
                    onClick={() =>
                      setAnswers((current) => ({ ...current, [question.id]: optionIndex }))
                    }
                    className={[
                      "min-h-12 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all flex items-center justify-between gap-3 text-left w-full cursor-pointer disabled:cursor-default",
                      correct
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20"
                        : wrong
                          ? "border-rose-600 bg-rose-50 text-rose-950 font-bold"
                          : selected
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white shadow-sm font-bold"
                            : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--secondary)]/60 hover:bg-[var(--surface-soft)]",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                          selected && !submitted
                            ? "bg-white text-[var(--secondary)]"
                            : correct
                              ? "bg-emerald-600 text-white"
                              : wrong
                                ? "bg-rose-600 text-white"
                                : "bg-[var(--surface-soft)] text-[var(--muted)]"
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {selected && !submitted && (
                      <svg className="w-5 h-5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {correct && (
                      <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        ಸರಿಯಾದ ಉತ್ತರ
                      </span>
                    )}
                    {wrong && (
                      <span className="text-xs font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                        ನಿಮ್ಮ ಉತ್ತರ
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation */}
            {submitted && question.explanation ? (
              <div className="mt-4 p-3.5 rounded-lg bg-amber-50/80 border border-amber-200/80 text-xs md:text-sm text-amber-950 leading-relaxed">
                <span className="font-bold text-amber-900 block mb-1">
                  💡 {locale === "kn" ? "ವಿವರಣೆ (Explanation):" : "Explanation:"}
                </span>
                {question.explanation}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {/* Bottom Submit Controls */}
      <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="cursor-pointer rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 px-8 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-md hover:scale-101 transition-all"
          >
            {locale === "kn" ? "ಫಲಿತಾಂಶ ನೋಡಿ (Submit & Check Score)" : "Submit & Check Result"}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-90"
            >
              <span>📲 WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ</span>
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 rounded-xl border border-[var(--border)] bg-white text-xs font-bold text-[var(--muted)] hover:text-[var(--primary)]"
            >
              ↻ ಮರುಪ್ರಯತ್ನಿಸಿ
            </button>
          </div>
        )}

        {submitted && !currentUser && (
          <p className="text-xs font-semibold text-[var(--muted)]">
            {locale === "kn"
              ? "💡 ಉಚಿತ ಖಾತೆಗೆ ಲಾಗಿನ್ ಆದರೆ ನಿಮ್ಮ ಎಲ್ಲಾ ಪರೀಕ್ಷಾ ಅಂಕಗಳು ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಉಳಿಯುತ್ತವೆ."
              : "💡 Sign in to save your mock test history and track your ranking."}
          </p>
        )}

        {submitted && currentUser && attemptSaved && (
          <p className="text-xs font-semibold text-emerald-700">
            {locale === "kn"
              ? "✅ ನಿಮ್ಮ ಅಂಕಗಳನ್ನು ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ!"
              : "✅ Attempt saved to your profile!"}
          </p>
        )}
      </div>
    </section>
  );
}
