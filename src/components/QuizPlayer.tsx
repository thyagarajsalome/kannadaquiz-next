"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import type { PublicQuiz } from "@/lib/public-content";
import type { Locale } from "@/lib/locales";
import { onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firebaseAuth, firestore } from "@/lib/firebase";

// 🎉 Canvas Confetti Celebration Particle Cannon
function launchCelebrationConfetti() {
  if (typeof window === "undefined") return;
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    return;
  }
  const ctx: CanvasRenderingContext2D = context;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);

  const colors = ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#fbbf24", "#06b6d4"];
  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    vRot: number;
    shape: "rect" | "circle" | "star";
    alpha: number;
    decay: number;
  }> = [];

  // Spawn 150 vibrant particles from left & right cannons
  for (let i = 0; i < 150; i++) {
    const fromLeft = i % 2 === 0;
    const startX = fromLeft ? window.innerWidth * 0.15 : window.innerWidth * 0.85;
    const startY = window.innerHeight * 0.85;
    const angle = fromLeft
      ? -Math.PI / 4 + (Math.random() - 0.5) * 0.6
      : (-3 * Math.PI) / 4 + (Math.random() - 0.5) * 0.6;
    const speed = 14 + Math.random() * 18;

    particles.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 7 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.3,
      shape: Math.random() > 0.4 ? "rect" : Math.random() > 0.5 ? "circle" : "star",
      alpha: 1,
      decay: 0.006 + Math.random() * 0.008,
    });
  }

  let animationFrameId: number;
  const gravity = 0.38;
  const drag = 0.985;

  function render() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let active = 0;

    for (const p of particles) {
      if (p.alpha <= 0) continue;
      active++;

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= drag;
      p.vy = p.vy * drag + gravity;
      p.rotation += p.vRot;
      p.alpha = Math.max(0, p.alpha - p.decay);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          ctx.lineTo(
            Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size,
            -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size
          );
          ctx.lineTo(
            Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 2),
            -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 2)
          );
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    if (active > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  }

  animationFrameId = requestAnimationFrame(render);

  setTimeout(() => {
    cancelAnimationFrame(animationFrameId);
    if (canvas.parentNode) canvas.remove();
  }, 6000);
}

// 🎵 Web Audio API Victory Fanfare Chime
function playVictoryChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.5, d: 0.38 }, // C6 (High triumph)
    ];
    let start = ctx.currentTime + 0.05;
    notes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(n.f, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + n.d + 0.05);
      start += n.d * 0.85;
    });
  } catch {}
}

export function QuizPlayer({ quiz, locale }: { quiz: PublicQuiz; locale: Locale }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [attemptSaved, setAttemptSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayPercentage, setDisplayPercentage] = useState(0);
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

  // Smooth Count-Up Animation & Celebration on Submit
  useEffect(() => {
    if (submitted) {
      if (percentage >= 60) {
        launchCelebrationConfetti();
        playVictoryChime();
      }

      let startTime: number | null = null;
      const duration = 1000;
      function step(timestamp: number) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setDisplayScore(Math.round(ease * score));
        setDisplayPercentage(Math.round(ease * percentage));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    }
  }, [submitted, score, percentage]);

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
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function handleReset() {
    setAnswers({});
    setSubmitted(false);
    setAttemptSaved(false);
    setCopied(false);
    setDisplayScore(0);
    setDisplayPercentage(0);
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
        badge: locale === "kn" ? "🏆 ಅದ್ಭುತ ಸಾಧನೆ! ಅತ್ಯುತ್ತಮ ಪ್ರದರ್ಶನ!" : "🏆 Outstanding Performance!",
        color: "bg-emerald-100 text-emerald-900 border-emerald-300",
        message:
          locale === "kn"
            ? "ಅಭಿನಂದನೆಗಳು! ನಿಮ್ಮ ಸಿದ್ಧತೆ ಅತ್ಯುತ್ತಮವಾಗಿದೆ. ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಯಲ್ಲಿ ನೀವು ಖಚಿತವಾಗಿ ಯಶಸ್ಸು ಸಾಧಿಸುತ್ತೀರಿ!"
            : "Congratulations! Exceptional performance! Your preparation for competitive exams is top notch.",
        isTop: true,
      };
    }
    if (percentage >= 60) {
      return {
        badge: locale === "kn" ? "🌟 ಉತ್ತಮ ಪ್ರದರ್ಶನ!" : "🌟 Great Performance!",
        color: "bg-blue-100 text-blue-900 border-blue-300",
        message:
          locale === "kn"
            ? "ತುಂಬಾ ಉತ್ತಮ ಅಂಕಗಳು! ವಿವರಣೆಗಳನ್ನು ಗಮನಿಸಿ ಇನ್ನಷ್ಟು ಪರಿಣತಿ ಪಡೆಯಿರಿ."
            : "Very good score! Check the detailed explanations below to master every concept.",
        isTop: true,
      };
    }
    if (percentage >= 40) {
      return {
        badge: locale === "kn" ? "👍 ಉತ್ತಮ ಪ್ರಯತ್ನ!" : "👍 Good Effort!",
        color: "bg-amber-100 text-amber-900 border-amber-300",
        message:
          locale === "kn"
            ? "ಉತ್ತಮ ಪ್ರಯತ್ನ! ವಿವರಣೆಗಳನ್ನು ಓದಿ ಮತ್ತೆ ಪರೀಕ್ಷೆ ಬರೆದು ಪೂರ್ಣ ಅಂಕ ಗಳಿಸಿ."
            : "Good effort! Review the correct answers and retake to score 100%.",
        isTop: false,
      };
    }
    return {
      badge: locale === "kn" ? "📚 ಇನ್ನಷ್ಟು ಅಭ್ಯಾಸದ ಅಗತ್ಯವಿದೆ" : "📚 Needs More Practice",
      color: "bg-rose-100 text-rose-900 border-rose-300",
      message:
        locale === "kn"
          ? "ಚಿಂತಿಸಬೇಡಿ! ಕೆಳಗಿನ ಸರಿಯಾದ ಉತ್ತರಗಳು ಮತ್ತು ವಿವರಣೆಗಳನ್ನು ಓದಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
          : "Don't worry! Review the correct answers and explanations below, then try again.",
      isTop: false,
    };
  }, [percentage, locale]);

  const answeredCount = Object.keys(answers).length;

  return (
    <section className="kq-card p-4 sm:p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-sm w-full overflow-hidden">
      <div ref={resultRef} />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4 mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] block mb-1">
            {quiz.exam || "KPSC"} • {quiz.subject || "General Knowledge"}
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--primary)]">
            {locale === "kn" ? "ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು & ಅಣಕು ಪರೀಕ್ಷೆ" : "Practice Mock Test Questions"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[var(--surface-soft)] border border-[var(--border)] px-3 py-1 text-xs sm:text-sm font-black text-[var(--primary)] whitespace-nowrap">
            {submitted ? `${score} / ${totalQuestions}` : `${answeredCount} / ${totalQuestions} ${locale === "kn" ? "ಉತ್ತರಿಸಲಾಗಿದೆ" : "Answered"}`}
          </span>
        </div>
      </div>

      {/* Progress Bar (While Answering) */}
      {!submitted && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted)] mb-1.5">
            <span>{locale === "kn" ? "ಪ್ರಗತಿ" : "Progress"}</span>
            <span>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--secondary)] transition-all duration-300 rounded-full"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 🏆 CRAZY CELEBRATION SCORECARD BANNER (Displayed upon submit) */}
      {submitted && (
        <div className={`mb-8 p-5 sm:p-7 md:p-8 rounded-2xl border-2 shadow-md relative overflow-hidden transition-all ${
          performanceBadge.isTop
            ? "bg-gradient-to-br from-amber-50 via-yellow-50/50 to-emerald-50 border-amber-300 ring-4 ring-amber-100/70"
            : "bg-gradient-to-br from-slate-50 via-white to-blue-50 border-[var(--border)]"
        }`}>
          {/* Celebratory Floating Icons */}
          {performanceBadge.isTop && (
            <div className="absolute top-2 right-3 flex items-center gap-1 text-xl sm:text-2xl animate-bounce select-none pointer-events-none opacity-80">
              <span>🎉</span>
              <span>⭐</span>
              <span>🏆</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--border)]/60 pb-6">
            <div className="space-y-2">
              <span className={`inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border shadow-2xs ${performanceBadge.color}`}>
                {performanceBadge.badge}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--primary)] leading-tight">
                {locale === "kn" ? "ನಿಮ್ಮ ಅಂತಿಮ ಫಲಿತಾಂಶ" : "Your Final Result"}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed max-w-lg">
                {performanceBadge.message}
              </p>
            </div>

            {/* Big Animated Score Box */}
            <div className="flex items-center justify-around gap-4 bg-white p-4 sm:p-5 rounded-2xl border-2 border-[var(--secondary)]/30 shadow-sm shrink-0">
              <div className="text-center px-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--secondary)] block transition-all">
                  {displayScore}
                </span>
                <span className="text-[11px] sm:text-xs text-[var(--muted)] block font-bold mt-0.5">
                  / {totalQuestions} {locale === "kn" ? "ಅಂಕ" : "Marks"}
                </span>
              </div>
              <div className="w-px h-12 bg-[var(--border)]" />
              <div className="text-center px-2">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-600 block transition-all">
                  {displayPercentage}%
                </span>
                <span className="text-[11px] sm:text-xs text-[var(--muted)] block font-bold mt-0.5">
                  {locale === "kn" ? "ನಿಖರತೆ" : "Accuracy"}
                </span>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown Counters (Mobile Responsive 3-Cols) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 py-4 border-b border-[var(--border)]/60 text-center text-xs font-bold">
            <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
              <span className="block text-xl sm:text-2xl font-black">{correctCount}</span>
              <span className="text-[11px] sm:text-xs font-bold">{locale === "kn" ? "ಸರಿ (Correct)" : "Correct"}</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 shadow-2xs">
              <span className="block text-xl sm:text-2xl font-black">{wrongCount}</span>
              <span className="text-[11px] sm:text-xs font-bold">{locale === "kn" ? "ತಪ್ಪು (Wrong)" : "Wrong"}</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
              <span className="block text-xl sm:text-2xl font-black">{unansweredCount}</span>
              <span className="text-[11px] sm:text-xs font-bold">{locale === "kn" ? "ಬಿಟ್ಟ ಪ್ರಶ್ನೆಗಳು" : "Skipped"}</span>
            </div>
          </div>

          {/* 📲 VIRAL SHARE CONTROLS (Full-Width Touch Targets) */}
          <div className="pt-6">
            <p className="text-center text-xs font-black uppercase tracking-wider text-[var(--primary)] mb-3">
              {locale === "kn" ? "ಸ್ನೇಹಿತರಿಗೂ ಸವಾಲು ಹಾಕಿ - ರಿಸಲ್ಟ್ ಹಂಚಿಕೊಳ್ಳಿ:" : "Challenge your friends - Share your score:"}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {/* WhatsApp Share Button */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:scale-102 select-none"
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-102 select-none"
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
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-[var(--border)] bg-white hover:bg-[var(--surface-soft)] text-xs font-bold text-[var(--primary)] transition-all select-none"
              >
                <span>{copied ? "✓ ಲಿಂಕ್ ಕಾಪಿ ಆಗಿದೆ!" : "📋 ಸ್ಕೋರ್ ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಿ"}</span>
              </button>

              {/* Retake Quiz */}
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl border border-[var(--border)] bg-white hover:bg-slate-100 text-xs font-bold text-[var(--muted)] hover:text-[var(--primary)] transition-all select-none"
              >
                <span>↻ ಮತ್ತೆ ಪರೀಕ್ಷೆ ಬರೆಯಿರಿ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="mt-5 grid gap-5 sm:gap-6">
        {quiz.questions.map((question, index) => (
          <article
            key={question.id}
            className={`rounded-2xl border p-4 sm:p-5 transition-all ${
              submitted
                ? answers[question.id] === question.correctOptionIndex
                  ? "border-emerald-300 bg-emerald-50/25"
                  : "border-rose-300 bg-rose-50/25"
                : "border-[var(--border)] bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="font-serif font-bold text-base sm:text-lg text-[var(--primary)] leading-snug">
                <span className="text-[var(--secondary)] mr-2 font-mono">Q{index + 1}.</span>
                {question.question}
              </p>
              {submitted && (
                <span className="shrink-0 text-xl select-none">
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
                      "min-h-12 rounded-xl border px-3.5 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 text-left w-full cursor-pointer disabled:cursor-default",
                      correct
                        ? "border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20"
                        : wrong
                          ? "border-rose-600 bg-rose-50 text-rose-950 font-bold"
                          : selected
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white shadow-sm font-bold"
                            : "border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--secondary)]/60 hover:bg-[var(--surface-soft)] active:scale-[0.99]",
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
                      <span className="leading-snug break-words">{option}</span>
                    </div>

                    {selected && !submitted && (
                      <svg className="w-5 h-5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {correct && (
                      <span className="text-[10px] sm:text-xs font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded whitespace-nowrap">
                        ಸರಿಯಾದ ಉತ್ತರ
                      </span>
                    )}
                    {wrong && (
                      <span className="text-[10px] sm:text-xs font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded whitespace-nowrap">
                        ನಿಮ್ಮ ಉತ್ತರ
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation */}
            {submitted && question.explanation ? (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-amber-950 leading-relaxed">
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
      <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full sm:w-auto cursor-pointer rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-md hover:shadow-lg hover:scale-101 active:scale-99 transition-all text-center"
          >
            {locale === "kn" ? "ಫಲಿತಾಂಶ ನೋಡಿ (Submit & Check Score)" : "Submit & Check Result"}
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-90"
            >
              <span>📲 WhatsApp ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ</span>
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-[var(--border)] bg-white text-xs font-bold text-[var(--muted)] hover:text-[var(--primary)]"
            >
              ↻ ಮರುಪ್ರಯತ್ನಿಸಿ
            </button>
          </div>
        )}

        {submitted && !currentUser && (
          <p className="text-xs font-semibold text-[var(--muted)] text-center sm:text-right">
            {locale === "kn"
              ? "💡 ಉಚಿತ ಖಾತೆಗೆ ಲಾಗಿನ್ ಆದರೆ ನಿಮ್ಮ ಎಲ್ಲಾ ಪರೀಕ್ಷಾ ಅಂಕಗಳು ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಉಳಿಯುತ್ತವೆ."
              : "💡 Sign in to save your mock test history and track your ranking."}
          </p>
        )}

        {submitted && currentUser && attemptSaved && (
          <p className="text-xs font-semibold text-emerald-700 text-center sm:text-right">
            {locale === "kn"
              ? "✅ ನಿಮ್ಮ ಅಂಕಗಳನ್ನು ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ!"
              : "✅ Attempt saved to your profile!"}
          </p>
        )}
      </div>

      {/* 📱 Sticky Mobile Bottom Bar (When taking quiz, before submit) */}
      {!submitted && (
        <div className="fixed bottom-3 inset-x-3 z-40 md:hidden bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-white/15 flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-white/70">
              {locale === "kn" ? "ಉತ್ತರಿಸಲಾಗಿದೆ" : "Answered"}
            </span>
            <span className="text-sm font-black text-amber-400">
              {answeredCount} / {totalQuestions}
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md active:scale-95 transition-all"
          >
            {locale === "kn" ? "ಫಲಿತಾಂಶ ➔" : "Submit ➔"}
          </button>
        </div>
      )}
    </section>
  );
}
