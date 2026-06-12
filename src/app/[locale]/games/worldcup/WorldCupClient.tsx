"use client";

import React, { useState } from "react";
import type { Locale } from "@/lib/locales";

interface Match {
  id: string;
  teamA: string;
  teamAKn: string;
  flagA: string;
  teamB: string;
  teamBKn: string;
  flagB: string;
  date: string;
  timeIst: string;
  group: string;
  groupKn: string;
}

interface TriviaQuestion {
  question: string;
  questionKn: string;
  options: string[];
  optionsKn: string[];
  correctIdx: number;
  explanation: string;
  explanationKn: string;
}

const UPCOMING_MATCHES: Match[] = [
  {
    id: "m1",
    teamA: "USA",
    teamAKn: "ಯು.ಎಸ್.ಎ",
    flagA: "🇺🇸",
    teamB: "Italy",
    teamBKn: "ಇಟಲಿ",
    flagB: "🇮🇹",
    date: "June 13, 2026",
    timeIst: "06:30 PM IST",
    group: "Group A",
    groupKn: "ಗುಂಪು ಎ"
  },
  {
    id: "m2",
    teamA: "Argentina",
    teamAKn: "ಅರ್ಜೆಂಟೀನಾ",
    flagA: "🇦🇷",
    teamB: "France",
    teamBKn: "ಫ್ರಾನ್ಸ್",
    flagB: "🇫🇷",
    date: "June 14, 2026",
    timeIst: "09:30 PM IST",
    group: "Group B",
    groupKn: "ಗುಂಪು ಬಿ"
  },
  {
    id: "m3",
    teamA: "Spain",
    teamAKn: "ಸ್ಪೇನ್",
    flagA: "🇪🇸",
    teamB: "Germany",
    teamBKn: "ಜರ್ಮನಿ",
    flagB: "🇩🇪",
    date: "June 15, 2026",
    timeIst: "11:30 PM IST",
    group: "Group C",
    groupKn: "ಗುಂಪು ಸಿ"
  },
  {
    id: "m4",
    teamA: "Brazil",
    teamAKn: "ಬ್ರೆಜಿಲ್",
    flagA: "🇧🇷",
    teamB: "England",
    teamBKn: "ಇಂಗ್ಲೆಂಡ್",
    flagB: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    date: "June 16, 2026",
    timeIst: "06:30 PM IST",
    group: "Group D",
    groupKn: "ಗುಂಪು ಡಿ"
  },
  {
    id: "m5",
    teamA: "Portugal",
    teamAKn: "ಪೋರ್ಚುಗಲ್",
    flagA: "🇵🇹",
    teamB: "Japan",
    teamBKn: "ಜಪಾನ್",
    flagB: "🇯🇵",
    date: "June 17, 2026",
    timeIst: "09:30 PM IST",
    group: "Group E",
    groupKn: "ಗುಂಪು ಇ"
  }
];

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: "Which country has won the most FIFA World Cup titles in history?",
    questionKn: "ಇತಿಹಾಸದಲ್ಲಿ ಅತಿ ಹೆಚ್ಚು ಫಿಫಾ ವಿಶ್ವಕಪ್ ಪ್ರಶಸ್ತಿಗಳನ್ನು ಗೆದ್ದ ದೇಶ ಯಾವುದು?",
    options: ["Germany", "Brazil", "Italy", "Argentina"],
    optionsKn: ["ಜರ್ಮನಿ", "ಬ್ರೆಜಿಲ್", "ಇಟಲಿ", "ಅರ್ಜೆಂಟೀನಾ"],
    correctIdx: 1,
    explanation: "Brazil has won the World Cup a record 5 times (1958, 1962, 1970, 1994, 2002).",
    explanationKn: "ಬ್ರೆಜಿಲ್ ದಾಖಲೆಯ 5 ಬಾರಿ ವಿಶ್ವಕಪ್ ಗೆದ್ದಿದೆ (1958, 1962, 1970, 1994, 2002)."
  },
  {
    question: "How many nations are participating in the FIFA World Cup 2026?",
    questionKn: "ಫಿಫಾ ವಿಶ್ವಕಪ್ 2026 ರಲ್ಲಿ ಎಷ್ಟು ದೇಶಗಳು ಭಾಗವಹಿಸುತ್ತಿವೆ?",
    options: ["32 Teams", "40 Teams", "48 Teams", "64 Teams"],
    optionsKn: ["32 ತಂಡಗಳು", "40 ತಂಡಗಳು", "48 ತಂಡಗಳು", "64 ತಂಡಗಳು"],
    correctIdx: 2,
    explanation: "The 2026 World Cup is the first to feature 48 teams, expanding from the traditional 32 teams.",
    explanationKn: "2026 ರ ವಿಶ್ವಕಪ್ ಮೊದಲ ಬಾರಿಗೆ 48 ತಂಡಗಳನ್ನು ಒಳಗೊಂಡಿದೆ, ಇದು ಸಾಂಪ್ರದಾಯಿಕ 32 ತಂಡಗಳಿಂದ ವಿಸ್ತರಿಸಲ್ಪಟ್ಟಿದೆ."
  },
  {
    question: "Who is the defending champion entering the 2026 FIFA World Cup?",
    questionKn: "2026 ರ ಫಿಫಾ ವಿಶ್ವಕಪ್‌ಗೆ ಪ್ರವೇಶಿಸುವಾಗ ಹಾಲಿ ಚಾಂಪಿಯನ್ ದೇಶ ಯಾವುದು?",
    options: ["France", "Argentina", "Croatia", "Brazil"],
    optionsKn: ["ಫ್ರಾನ್ಸ್", "ಅರ್ಜೆಂಟೀನಾ", "ಕ್ರೊಯೇಷಿಯಾ", "ಬ್ರೆಜಿಲ್"],
    correctIdx: 1,
    explanation: "Argentina won the previous FIFA World Cup in Qatar in 2022, defeating France on penalties.",
    explanationKn: "ಅರ್ಜೆಂಟೀನಾ 2022 ರಲ್ಲಿ ಕತಾರ್‌ನಲ್ಲಿ ನಡೆದ ಫಿಫಾ ವಿಶ್ವಕಪ್‌ನಲ್ಲಿ ಫ್ರಾನ್ಸ್ ಅನ್ನು ಪೆನಾಲ್ಟಿಯಲ್ಲಿ ಸೋಲಿಸಿ ಚಾಂಪಿಯನ್ ಆಗಿತ್ತು."
  },
  {
    question: "Which country has played the most World Cup finals without ever winning?",
    questionKn: "ಒಮ್ಮೆಯೂ ಕಪ್ ಗೆಲ್ಲದೆ ಅತಿ ಹೆಚ್ಚು ಬಾರಿ ವಿಶ್ವಕಪ್ ಫೈನಲ್ ಆಡಿದ ದೇಶ ಯಾವುದು?",
    options: ["Netherlands", "Croatia", "Sweden", "Mexico"],
    optionsKn: ["ನೆದರ್ಲ್ಯಾಂಡ್ಸ್ (ಹಾಲೆಂಡ್)", "ಕ್ರೊಯೇಷಿಯಾ", "ಸ್ವೀಡನ್", "ಮೆಕ್ಸಿಕೋ"],
    correctIdx: 0,
    explanation: "Netherlands has reached the World Cup final 3 times (1974, 1978, 2010) but lost all of them.",
    explanationKn: "ನೆದರ್ಲ್ಯಾಂಡ್ಸ್ 3 ಬಾರಿ ವಿಶ್ವಕಪ್ ಫೈನಲ್ ತಲುಪಿದ್ದರೂ (1974, 1978, 2010) ಮೂರರಲ್ಲೂ ರನ್ನರ್-ಅಪ್ ಆಗಿದೆ."
  },
  {
    question: "Who is the all-time top goalscorer in FIFA World Cup history?",
    questionKn: "ಫಿಫಾ ವಿಶ್ವಕಪ್ ಇತಿಹಾಸದಲ್ಲಿ ಸಾರ್ವಕಾಲಿಕ ಅತಿ ಹೆಚ್ಚು ಗೋಲು ಗಳಿಸಿದ ಆಟಗಾರ ಯಾರು?",
    options: ["Pelé", "Lionel Messi", "Miroslav Klose", "Cristiano Ronaldo"],
    optionsKn: ["ಪೆಲೆ", "ಲಿಯೋನೆಲ್ ಮೆಸ್ಸಿ", "ಮಿರೋಸ್ಲಾವ್ ಕ್ಲೋಸ್", "ಕ್ರಿಸ್ಟಿಯಾನೋ ರೊನಾಲ್ಡೊ"],
    correctIdx: 2,
    explanation: "Germany's Miroslav Klose holds the record with 16 World Cup goals scored across four tournaments.",
    explanationKn: "ಜರ್ಮನಿಯ ಮಿರೋಸ್ಲಾವ್ ಕ್ಲೋಸ್ ನಾಲ್ಕು ವಿಶ್ವಕಪ್‌ಗಳಲ್ಲಿ ಒಟ್ಟು 16 ಗೋಲುಗಳನ್ನು ಗಳಿಸಿ ದಾಖಲೆ ಬರೆದಿದ್ದಾರೆ."
  },
  {
    question: "Who won the Golden Boot (Top Scorer) in the 2022 World Cup?",
    questionKn: "2022 ರ ವಿಶ್ವಕಪ್‌ನಲ್ಲಿ ಗೋಲ್ಡನ್ ಬೂಟ್ (ಅತಿ ಹೆಚ್ಚು ಗೋಲು) ಗೆದ್ದ ಆಟಗಾರ ಯಾರು?",
    options: ["Lionel Messi", "Kylian Mbappé", "Neymar Jr", "Olivier Giroud"],
    optionsKn: ["ಲಿಯೋನೆಲ್ ಮೆಸ್ಸಿ", "ಕಿಲಿಯನ್ ಎಂಬಪ್ಪೆ", "ನೈಮಾರ್ ಜೆಆರ್", "ಒಲಿವಿಯರ್ ಗಿರೌಡ್"],
    correctIdx: 1,
    explanation: "France's Kylian Mbappé won the Golden Boot in 2022 by scoring 8 goals, including a hat-trick in the final.",
    explanationKn: "ಫ್ರಾನ್ಸ್‌ನ ಕಿಲಿಯನ್ ಎಂಬಪ್ಪೆ ಫೈನಲ್‌ನಲ್ಲಿ ಹ್ಯಾಟ್ರಿಕ್ ಸೇರಿದಂತೆ ಒಟ್ಟು 8 ಗೋಲುಗಳನ್ನು ಗಳಿಸಿ ಗೋಲ್ಡನ್ ಬೂಟ್ ಗೆದ್ದರು."
  },
  {
    question: "Which countries are co-hosting the FIFA World Cup 2026?",
    questionKn: "ಫಿಫಾ ವಿಶ್ವಕಪ್ 2026 ರ ಜಂಟಿ ಆತಿಥ್ಯ ವಹಿಸಿರುವ ದೇಶಗಳು ಯಾವುವು?",
    options: ["Japan & South Korea", "USA, Canada & Mexico", "Spain & Portugal", "Australia & New Zealand"],
    optionsKn: ["ಜಪಾನ್ ಮತ್ತು ದಕ್ಷಿಣ ಕೊರಿಯಾ", "ಯು.ಎಸ್.ಎ, ಕೆನಡಾ ಮತ್ತು ಮೆಕ್ಸಿಕೋ", "ಸ್ಪೇನ್ ಮತ್ತು ಪೋರ್ಚುಗಲ್", "ಆಸ್ಟ್ರೇಲಿಯಾ ಮತ್ತು ನ್ಯೂಜಿಲೆಂಡ್"],
    correctIdx: 1,
    explanation: "The 2026 World Cup is co-hosted by three North American countries: USA, Canada, and Mexico.",
    explanationKn: "2026 ರ ವಿಶ್ವಕಪ್ ಅನ್ನು ಮೂರು ಉತ್ತರ ಅಮೆರಿಕದ ದೇಶಗಳು ಜಂಟಿಯಾಗಿ ಆಯೋಜಿಸುತ್ತಿವೆ: ಯುಎಸ್ಎ, ಕೆನಡಾ ಮತ್ತು ಮೆಕ್ಸಿಕೋ."
  }
];

export function WorldCupClient({ locale }: { locale: Locale }) {
  // Predictor State
  const [predictions, setPredictions] = useState<Record<string, "A" | "Draw" | "B">>({});
  const [showStats, setShowStats] = useState<Record<string, boolean>>({});

  // Trivia Quiz State
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Predictor vote handler (mock data calculation)
  const handlePredict = (matchId: string, choice: "A" | "Draw" | "B") => {
    setPredictions((prev) => ({ ...prev, [matchId]: choice }));
    setShowStats((prev) => ({ ...prev, [matchId]: true }));
  };

  // Mock community percentages
  const getMockPercentages = (matchId: string, choice: "A" | "Draw" | "B" | null) => {
    // Generate deterministic stats based on matchId
    const base = matchId === "m1" ? 45 : matchId === "m2" ? 65 : matchId === "m3" ? 50 : matchId === "m4" ? 55 : 40;
    const aVal = base;
    const drawVal = Math.round((100 - base) * 0.3);
    const bVal = 100 - aVal - drawVal;

    return { aVal, drawVal, bVal };
  };

  // Trivia Answer handler
  const handleAnswerSelect = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);

    if (optIdx === TRIVIA_QUESTIONS[currentQIdx].correctIdx) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    if (currentQIdx < TRIVIA_QUESTIONS.length - 1) {
      setCurrentQIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Social share predictors
  const sharePrediction = (match: Match, choice: "A" | "Draw" | "B") => {
    const predictedTeam = choice === "A" ? match.teamA : choice === "B" ? match.teamB : "Draw";
    const predictedTeamKn = choice === "A" ? match.teamAKn : choice === "B" ? match.teamBKn : "ಡ್ರಾ";
    
    const text = locale === "kn"
      ? `🏆 ನಾನು ಫಿಫಾ ವಿಶ್ವಕಪ್ 2026 ರ ${match.teamAKn} vs ${match.teamBKn} ಪಂದ್ಯಕ್ಕೆ "${predictedTeamKn}" ಗೆಲ್ಲುತ್ತದೆ ಎಂದು ಭವಿಷ್ಯ ನುಡಿದಿದ್ದೇನೆ! ನೀವೂ ಪ್ರೆಡಿಕ್ಟ್ ಮಾಡಿ ಮತ್ತು ರಸಪ್ರಶ್ನೆ ಆಡಿ: `
      : `🏆 I predicted "${predictedTeam}" in the FIFA World Cup 2026 match between ${match.teamA} vs ${match.teamB}! Play Predictor & Trivia now: `;
      
    const url = typeof window !== "undefined" ? window.location.href : "";
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + url)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareQuizScore = () => {
    const text = locale === "kn"
      ? `⚽ ನಾನು ಕನ್ನಡಕ್ವಿಜ್ ಫಿಫಾ ವಿಶ್ವಕಪ್ 2026 ಕ್ವಿಜ್‌ನಲ್ಲಿ ${score}/${TRIVIA_QUESTIONS.length} ಅಂಕ ಗಳಿಸಿದ್ದೇನೆ! ನಿಮ್ಮ ಫುಟ್‌ಬಾಲ್ ಜ್ಞಾನ ಪರೀಕ್ಷಿಸಿ ನೋಡಿ: `
      : `⚽ I scored ${score}/${TRIVIA_QUESTIONS.length} in the KannadaQuiz FIFA World Cup 2026 Trivia! Can you beat me? Play here: `;
      
    const url = typeof window !== "undefined" ? window.location.href : "";
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + url)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <article className="kq-container py-8 md:py-12">
      {/* Stadium Banner Hero */}
      <div className="relative rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-green-950 text-white p-6 md:p-10 mb-10 overflow-hidden shadow-lg border border-emerald-600/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="bg-yellow-500 text-slate-950 text-[10px] font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full select-none shadow-md mb-4 flex items-center gap-1">
            <span>⚽</span> FIFA WORLD CUP 2026 SPECIAL <span>🏆</span>
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
            {locale === "kn" ? "ಫಿಫಾ ವಿಶ್ವಕಪ್ 2026 ಹಬ್" : "FIFA World Cup 2026 Hub"}
          </h1>
          <p className="mt-3 text-sm md:text-base text-emerald-100/90 leading-relaxed font-normal">
            {locale === "kn"
              ? "ಫುಟ್‌ಬಾಲ್ ಹಬ್ಬ ಪ್ರಾರಂಭವಾಗಿದೆ! ಇಂದು ನಡೆಯುವ ಪಂದ್ಯಗಳಿಗೆ ನಿಮ್ಮ ಊಹೆಯನ್ನು ಪ್ರೆಡಿಕ್ಟ್ ಮಾಡಿ, ನಿಮ್ಮ ಕ್ರೇಜ್ ಅನ್ನು ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಶೇರ್ ಮಾಡಿ ಮತ್ತು ರೋಮಾಂಚಕ ವಿಶ್ವಕಪ್ ರಸಪ್ರಶ್ನೆ ಆಡಿ ಜಯಿಸಿ."
              : "The football fever is here! Predict outcomes of today's matches, challenge your friends on WhatsApp, and test your knowledge with our special World Cup Trivia Quiz."}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] max-w-6xl mx-auto">
        {/* LEFT COLUMN: PREDICTOR GAME & SCHEDULE */}
        <div className="space-y-8">
          {/* Section 1: Match Predictor */}
          <section className="kq-card p-5 md:p-6 bg-white border border-[var(--border)] rounded-xl shadow-sm">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--primary)] border-b pb-3 mb-5 flex items-center gap-2">
              <span className="text-xl">🏆</span>
              {locale === "kn" ? "ಇಂದಿನ ಪಂದ್ಯಗಳ ವಿಜೇತರನ್ನು ಪ್ರೆಡಿಕ್ಟ್ ಮಾಡಿ!" : "Predict the Winner & Vote!"}
            </h2>

            <div className="space-y-4">
              {UPCOMING_MATCHES.map((match) => {
                const choice = predictions[match.id] || null;
                const stats = showStats[match.id] ? getMockPercentages(match.id, choice) : null;

                return (
                  <div key={match.id} className="border border-[var(--border)]/70 rounded-xl p-4 md:p-5 bg-[var(--surface-soft)]">
                    <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-[var(--muted)]/60 mb-3 tracking-wider">
                      <span>{locale === "kn" ? match.groupKn : match.group}</span>
                      <span>{match.date} • {match.timeIst}</span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      {/* Team A */}
                      <button
                        onClick={() => !choice && handlePredict(match.id, "A")}
                        disabled={!!choice}
                        className={`p-3 rounded-lg border font-bold text-sm flex flex-col items-center transition-all ${
                          choice === "A"
                            ? "bg-emerald-600 text-white border-emerald-600 scale-102"
                            : choice
                            ? "bg-white/40 text-[var(--muted)] border-[var(--border)]/40 opacity-70"
                            : "bg-white border-[var(--border)] hover:border-emerald-500 hover:text-emerald-700 cursor-pointer"
                        }`}
                      >
                        <span className="text-2xl mb-1">{match.flagA}</span>
                        <span>{locale === "kn" ? match.teamAKn : match.teamA}</span>
                      </button>

                      {/* Draw Button */}
                      <button
                        onClick={() => !choice && handlePredict(match.id, "Draw")}
                        disabled={!!choice}
                        className={`px-3 py-2 rounded-lg border font-bold text-xs transition-all ${
                          choice === "Draw"
                            ? "bg-emerald-600 text-white border-emerald-600 scale-102"
                            : choice
                            ? "bg-white/40 text-[var(--muted)] border-[var(--border)]/40 opacity-70"
                            : "bg-white border-[var(--border)] hover:border-emerald-500 hover:text-emerald-700 cursor-pointer"
                        }`}
                      >
                        {locale === "kn" ? "ಡ್ರಾ" : "Draw"}
                      </button>

                      {/* Team B */}
                      <button
                        onClick={() => !choice && handlePredict(match.id, "B")}
                        disabled={!!choice}
                        className={`p-3 rounded-lg border font-bold text-sm flex flex-col items-center transition-all ${
                          choice === "B"
                            ? "bg-emerald-600 text-white border-emerald-600 scale-102"
                            : choice
                            ? "bg-white/40 text-[var(--muted)] border-[var(--border)]/40 opacity-70"
                            : "bg-white border-[var(--border)] hover:border-emerald-500 hover:text-emerald-700 cursor-pointer"
                        }`}
                      >
                        <span className="text-2xl mb-1">{match.flagB}</span>
                        <span>{locale === "kn" ? match.teamBKn : match.teamB}</span>
                      </button>
                    </div>

                    {/* Prediction Stats & WhatsApp share */}
                    {stats && choice && (
                      <div className="mt-4 pt-3 border-t border-[var(--border)]/40 animate-fade-in">
                        <div className="text-[10px] font-extrabold uppercase text-[var(--muted)]/60 mb-2">
                          {locale === "kn" ? "ವೋಟಿಂಗ್ ಫಲಿತಾಂಶ (ಕಮ್ಯುನಿಟಿ ವೋಟ್):" : "Community Vote Percentages:"}
                        </div>
                        {/* Vote Percent Bars */}
                        <div className="space-y-1.5 text-xs font-bold">
                          {/* A */}
                          <div className="flex justify-between items-center bg-white border border-[var(--border)]/40 rounded p-1.5">
                            <span className="flex items-center gap-1.5">
                              <span>{match.flagA}</span>
                              <span>{locale === "kn" ? match.teamAKn : match.teamA}</span>
                            </span>
                            <span className="text-[var(--secondary)]">{stats.aVal}%</span>
                          </div>
                          {/* Draw */}
                          <div className="flex justify-between items-center bg-white border border-[var(--border)]/40 rounded p-1.5">
                            <span>{locale === "kn" ? "ಡ್ರಾ" : "Draw"}</span>
                            <span className="text-[var(--secondary)]">{stats.drawVal}%</span>
                          </div>
                          {/* B */}
                          <div className="flex justify-between items-center bg-white border border-[var(--border)]/40 rounded p-1.5">
                            <span className="flex items-center gap-1.5">
                              <span>{match.flagB}</span>
                              <span>{locale === "kn" ? match.teamBKn : match.teamB}</span>
                            </span>
                            <span className="text-[var(--secondary)]">{stats.bVal}%</span>
                          </div>
                        </div>

                        {/* Share to whatsapp button */}
                        <button
                          onClick={() => sharePrediction(match, choice)}
                          className="mt-3.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
                        >
                          <svg className="w-4 h-4 shrink-0 fill-white" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847.001-2.63-1.019-5.101-2.871-6.958C16.612 1.984 14.145 1.98 12.01 1.98 6.57 1.98 2.147 6.397 2.143 11.83c-.002 1.766.478 3.49 1.39 5.04l-1.011 3.693 3.79-.993.265-.138zm11.23-5.321c-.301-.15-1.782-.88-2.062-.982-.28-.103-.483-.153-.687.153-.203.305-.788.982-.966 1.186-.178.203-.355.228-.656.078-3.002-1.425-4.337-2.582-6.13-5.642-.26-.445.26-.413.743-1.378.079-.153.039-.288-.02-.439-.06-.15-.483-1.166-.662-1.597-.174-.421-.349-.364-.482-.371-.127-.007-.271-.007-.417-.007-.146 0-.383.055-.583.273-.2.218-.765.748-.765 1.822 0 1.074.783 2.114.893 2.263.11.15 1.516 2.41 3.722 3.284 1.488.59 2.128.69 2.89.588.468-.062 1.436-.588 1.638-1.127.202-.538.202-1.002.141-1.102-.061-.101-.223-.153-.524-.303z"/>
                          </svg>
                          <span>{locale === "kn" ? "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಸ್ನೇಹಿತರಿಗೆ ಚಾಲೆಂಜ್ ಮಾಡಿ!" : "Share prediction and challenge friends!"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: IST Match Calendar */}
          <section className="kq-card p-5 md:p-6 bg-white border border-[var(--border)] rounded-xl shadow-sm">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--primary)] border-b pb-3 mb-5 flex items-center gap-2">
              <span className="text-xl">📅</span>
              {locale === "kn" ? "ವಿಶ್ವಕಪ್ ಮುಖ್ಯ ಪಂದ್ಯಗಳ ವೇಳಾಪಟ್ಟಿ (IST)" : "Key Matches Schedule (IST Timing)"}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)]/75">
                    <th className="py-2.5 font-bold uppercase">{locale === "kn" ? "ಗುಂಪು" : "Group"}</th>
                    <th className="py-2.5 font-bold uppercase">{locale === "kn" ? "ಪಂದ್ಯ" : "Match"}</th>
                    <th className="py-2.5 font-bold uppercase">{locale === "kn" ? "ದಿನಾಂಕ" : "Date"}</th>
                    <th className="py-2.5 font-bold uppercase">{locale === "kn" ? "ಸಮಯ (IST)" : "Time (IST)"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/40 font-medium">
                  {UPCOMING_MATCHES.map((match) => (
                    <tr key={match.id} className="hover:bg-[var(--surface-soft)]">
                      <td className="py-3 pr-2 text-xs font-extrabold text-[var(--secondary)]">
                        {locale === "kn" ? match.groupKn : match.group}
                      </td>
                      <td className="py-3 flex items-center gap-1.5 pr-2 font-bold text-[var(--primary)]">
                        <span>{match.flagA} {locale === "kn" ? match.teamAKn : match.teamA}</span>
                        <span className="text-[var(--muted)]/50 font-normal">vs</span>
                        <span>{match.flagB} {locale === "kn" ? match.teamBKn : match.teamB}</span>
                      </td>
                      <td className="py-3 pr-2 text-[var(--muted)]">{match.date}</td>
                      <td className="py-3 text-[var(--muted)] font-mono">{match.timeIst}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE TRIVIA QUIZ */}
        <div>
          <section className="p-5 md:p-6 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 relative overflow-hidden h-fit sticky top-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

            {/* Header */}
            <div className="border-b border-slate-800 pb-3.5 mb-5 flex justify-between items-center relative z-10">
              <h2 className="font-serif text-lg md:text-xl font-bold text-emerald-400 flex items-center gap-1.5">
                <span>⚽</span> {locale === "kn" ? "ವಿಶ್ವಕಪ್ ರಸಪ್ರಶ್ನೆ" : "World Cup Trivia"}
              </h2>
              <span className="text-xs font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-emerald-400/80">
                {!quizFinished ? `${currentQIdx + 1} / ${TRIVIA_QUESTIONS.length}` : "Done"}
              </span>
            </div>

            {/* Quiz Body */}
            {!quizFinished ? (
              <div className="relative z-10">
                {/* Question */}
                <h3 className="font-serif text-sm md:text-base font-bold leading-relaxed mb-5">
                  {locale === "kn" ? TRIVIA_QUESTIONS[currentQIdx].questionKn : TRIVIA_QUESTIONS[currentQIdx].question}
                </h3>

                {/* Options List */}
                <div className="space-y-3 mb-6">
                  {(locale === "kn" ? TRIVIA_QUESTIONS[currentQIdx].optionsKn : TRIVIA_QUESTIONS[currentQIdx].options).map((opt, idx) => {
                    const isCorrect = idx === TRIVIA_QUESTIONS[currentQIdx].correctIdx;
                    const isSelected = idx === selectedOpt;
                    let optStyle = "bg-slate-800 hover:bg-slate-700 border-slate-700";

                    if (isAnswered) {
                      if (isCorrect) {
                        optStyle = "bg-emerald-600 border-emerald-600 text-white";
                      } else if (isSelected) {
                        optStyle = "bg-red-600 border-red-600 text-white";
                      } else {
                        optStyle = "bg-slate-800/50 border-slate-800/50 opacity-60 text-slate-400";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-3.5 rounded-lg border text-xs md:text-sm font-bold transition-all flex justify-between items-center ${optStyle} ${
                          !isAnswered ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
                          </svg>
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {isAnswered && (
                  <div className="border border-emerald-800/40 bg-emerald-950/40 text-emerald-300 rounded-lg p-3.5 mb-5 text-xs leading-relaxed animate-fade-in">
                    <strong className="font-extrabold uppercase tracking-wide block mb-1">
                      {locale === "kn" ? "ವಿಶ್ಲೇಷಣೆ / ವಿವರಣೆ:" : "GK Insight & Explanation:"}
                    </strong>
                    {locale === "kn" ? TRIVIA_QUESTIONS[currentQIdx].explanationKn : TRIVIA_QUESTIONS[currentQIdx].explanation}
                  </div>
                )}

                {/* Next Button */}
                {isAnswered && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs py-3 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer select-none tracking-wider"
                  >
                    <span>
                      {currentQIdx < TRIVIA_QUESTIONS.length - 1
                        ? (locale === "kn" ? "ಮುಂದಿನ ಪ್ರಶ್ನೆ ➔" : "Next Question ➔")
                        : (locale === "kn" ? "ಫಲಿತಾಂಶ ವೀಕ್ಷಿಸಿ 🏆" : "View Results 🏆")}
                    </span>
                  </button>
                )}
              </div>
            ) : (
              /* Quiz Score Summary Card */
              <div className="relative z-10 text-center py-6">
                <span className="text-5xl block mb-4">🏆</span>
                <h3 className="font-serif text-2xl font-black text-white mb-2">
                  {locale === "kn" ? "ರಸಪ್ರಶ್ನೆ ಮುಕ್ತಾಯ!" : "Quiz Completed!"}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm mb-6 max-w-xs mx-auto">
                  {locale === "kn"
                    ? `ನೀವು ಫಿಫಾ ವಿಶ್ವಕಪ್ ಸ್ಪೆಷಲ್ ರಸಪ್ರಶ್ನೆಯಲ್ಲಿ ${TRIVIA_QUESTIONS.length} ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ${score} ಉತ್ತರಗಳನ್ನು ಸರಿಯಾಗಿ ನೀಡಿದ್ದೀರಿ.`
                    : `You answered ${score} out of ${TRIVIA_QUESTIONS.length} questions correctly.`}
                </p>

                {/* score ring */}
                <div className="inline-flex items-center justify-center p-5 rounded-full bg-slate-800 border-2 border-emerald-500 text-2xl font-black font-mono text-emerald-400 mb-8 w-24 h-24">
                  {score}/{TRIVIA_QUESTIONS.length}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={shareQuizScore}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none tracking-wider"
                  >
                    <svg className="w-4 h-4 shrink-0 fill-slate-950" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847.001-2.63-1.019-5.101-2.871-6.958C16.612 1.984 14.145 1.98 12.01 1.98 6.57 1.98 2.147 6.397 2.143 11.83c-.002 1.766.478 3.49 1.39 5.04l-1.011 3.693 3.79-.993.265-.138zm11.23-5.321c-.301-.15-1.782-.88-2.062-.982-.28-.103-.483-.153-.687.153-.203.305-.788.982-.966 1.186-.178.203-.355.228-.656.078-3.002-1.425-4.337-2.582-6.13-5.642-.26-.445.26-.413.743-1.378.079-.153.039-.288-.02-.439-.06-.15-.483-1.166-.662-1.597-.174-.421-.349-.364-.482-.371-.127-.007-.271-.007-.417-.007-.146 0-.383.055-.583.273-.2.218-.765.748-.765 1.822 0 1.074.783 2.114.893 2.263.11.15 1.516 2.41 3.722 3.284 1.488.59 2.128.69 2.89.588.468-.062 1.436-.588 1.638-1.127.202-.538.202-1.002.141-1.102-.061-.101-.223-.153-.524-.303z"/>
                    </svg>
                    <span>{locale === "kn" ? "ಗೆದ್ದ ಅಂಕವನ್ನು ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ!" : "Share score on WhatsApp!"}</span>
                  </button>

                  <button
                    onClick={resetQuiz}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs py-3 rounded-lg border border-slate-700 transition-colors cursor-pointer select-none"
                  >
                    {locale === "kn" ? "ಮತ್ತೆ ಆಡಿ ↺" : "Play Again ↺"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </article>
  );
}
