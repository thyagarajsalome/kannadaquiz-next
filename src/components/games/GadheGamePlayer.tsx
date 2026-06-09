"use client";

import { useState, useEffect, useRef } from "react";
import { type Locale } from "@/lib/locales";

type ProverbData = {
  correctOrder: string[];
  meaningEn: string;
  meaningKn: string;
};

// Selection of famous Kannada proverbs (ಗಾದೆಗಳು)
const proverbsData: ProverbData[] = [
  {
    correctOrder: ["ಕೈ", "ಕೆಸರಾದರೆ", "ಬಾಯಿ", "ಮೊಸರು"],
    meaningKn: "ಕಷ್ಟಪಟ್ಟು ಕೆಲಸ ಮಾಡಿದರೆ ಮಾತ್ರ ಸುಖ ಉಣ್ಣಲು ಸಾಧ್ಯ ಎಂಬ ನೀತಿ.",
    meaningEn: "Hard work yields sweet rewards (literally: if hands are muddy, mouth gets curd)."
  },
  {
    correctOrder: ["ಹಾಸಿಗೆ", "ಇದ್ದಷ್ಟು", "ಕಾಲು", "ಚಾಚು"],
    meaningKn: "ನಮ್ಮ ಆದಾಯ ಮತ್ತು ಶಕ್ತಿಗೆ ತಕ್ಕಂತೆ ನಾವು ಜೀವನ ನಡೆಸಬೇಕು ಎಂಬ ನೀತಿ.",
    meaningEn: "Cut your coat according to your cloth (literally: stretch your legs only as long as the bed is)."
  },
  {
    correctOrder: ["ತಾಳಿದವನು", "ಬಾಳಿಯಾನು"],
    meaningKn: "ತಾಳ್ಮೆ ಮತ್ತು ಸಮಾಧಾನದಿಂದ ಕಾಯುವವನು ಜೀವನದಲ್ಲಿ ಯಶಸ್ವಿಯಾಗುತ್ತಾನೆ ಎಂಬ ನೀತಿ.",
    meaningEn: "He who has patience will live prosperously."
  },
  {
    correctOrder: ["ಕುಂಬಾರನಿಗೆ", "ವರುಷ", "ದೊಣ್ಣೆಗೆ", "ನಿಮಿಷ"],
    meaningKn: "ಒಂದು ವಸ್ತುವನ್ನು ನಿರ್ಮಿಸಲು ಕಷ್ಟಪಡಬೇಕು, ಆದರೆ ನಾಶಮಾಡಲು ಕ್ಷಣ ಸಾಕು ಎಂಬ ನೀತಿ.",
    meaningEn: "Destruction is instant, creation takes time (literally: a year for a potter, a minute for a stick)."
  },
  {
    correctOrder: ["ಉಪ್ಪಿಗಿಂತ", "ರುಚಿಯಿಲ್ಲ", "ತಾಯಿಗಿಂತ", "ಬಂಧುವಿಲ್ಲ"],
    meaningKn: "ಜೀವನಕ್ಕೆ ಉಪ್ಪು ಎಷ್ಟು ಮುಖ್ಯವೋ, ತಾಯಿಯ ಪ್ರೀತಿ ಮತ್ತು ಸಂಬಂಧ ಅಷ್ಟೇ ಶ್ರೇಷ್ಠ ಎಂಬ ನೀತಿ.",
    meaningEn: "Nothing is tastier than salt, and no one is closer than a mother."
  },
  {
    correctOrder: ["ಮಾಡಿದ್ದುಣ್ಣೋ", "ಮಹಾರಾಯ"],
    meaningKn: "ನಾವು ಮಾಡುವ ಪ್ರತಿಯೊಂದು ಕೆಲಸದ ಫಲವನ್ನು ನಾವೇ ಉಣ್ಣಬೇಕಾಗುತ್ತದೆ ಎಂಬ ನೀತಿ.",
    meaningEn: "As you sow, so shall you reap (literally: eat what you made, oh great king)."
  },
  {
    correctOrder: ["ಅತಿ", "ಆಸೆ", "ಗತಿ", "ಗೇಡು"],
    meaningKn: "ಅತಿಯಾದ ಆಸೆಯು ಕೊನೆಗೆ ಮನುಷ್ಯನಿಗೆ ದುಃಖ ಮತ್ತು ಕೆಡುಕನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ ಎಂಬ ನೀತಿ.",
    meaningEn: "Greed leads to grief/ruin."
  },
  {
    correctOrder: ["ಮಾತು", "ಬೆಳ್ಳಿ", "ಮೌನ", "ಬಂಗಾರ"],
    meaningKn: "ಮಾತನಾಡುವುದಕ್ಕಿಂತ ಸಂದರ್ಭಕ್ಕೆ ತಕ್ಕಂತೆ ಮೌನವಾಗಿರುವುದು ಹೆಚ್ಚು ಮೌಲ್ಯಯುತ ಎಂಬ ನೀತಿ.",
    meaningEn: "Speech is silver, silence is golden."
  },
  {
    correctOrder: ["ಸತ್ಯಕ್ಕೆ", "ಸಾವಿಲ್ಲ", "ಸುಳ್ಳಿಗೆ", "ಬಾಳಿಲ್ಲ"],
    meaningKn: "ಸತ್ಯವು ಯಾವಾಗಲೂ ಸಾರ್ವಕಾಲಿಕ ಮತ್ತು ಶಾಶ್ವತ, ಆದರೆ ಸುಳ್ಳು ಹೆಚ್ಚು ಕಾಲ ಬಾಳಲಾರದು ಎಂಬ ನೀತಿ.",
    meaningEn: "Truth never dies, falsehood has no future."
  },
  {
    correctOrder: ["ಚಿಂತೆ", "ಇಲ್ಲದವನಿಗೆ", "ಸಂತೆನಲ್ಲೂ", "ನಿದ್ದೆ"],
    meaningKn: "ಯಾವ ಚಿಂತೆಯೂ ಕಾಡದವನಿಗೆ ಗದ್ದಲದ ಸಂತೆ ಮಾರುಕಟ್ಟೆಯಲ್ಲೂ ನೆಮ್ಮದಿಯ ನಿದ್ದೆ ಬರುತ್ತದೆ.",
    meaningEn: "A worry-free mind can sleep peacefully even in a chaotic market."
  },
  {
    correctOrder: ["ಕೋಪವೇ", "ತನ್ನ", "ಶತ್ರು", "ಶಾಂತಿಯೇ", "ತನ್ನ", "ಬಂಧು"],
    meaningKn: "ನಮ್ಮ ಕೋಪವೇ ನಮಗೆ ದೊಡ್ಡ ಶತ್ರು, ಹಾಗೆಯೇ ನಮ್ಮ ಶಾಂತ ಗುಣವೇ ನಮಗೆ ಉತ್ತಮ ಬಂಧು ಎಂಬ ನೀತಿ.",
    meaningEn: "Anger is your enemy, peace is your friend (literally: anger is one's own enemy, peace is one's relation)."
  },
  {
    correctOrder: ["ತುಂಬಿದ", "ಕೊಡ", "ತುಳುಕುವುದಿಲ್ಲ"],
    meaningKn: "ಜ್ಞಾನ ಹೊಂದಿರುವ ಸುಸಂಸ್ಕೃತ ವ್ಯಕ್ತಿಗಳು ಎಂದಿಗೂ ಅಹಂಕಾರ ಪಡುವುದಿಲ್ಲ ಎಂಬ ನೀತಿ.",
    meaningEn: "Deep rivers run silent (literally: a full pot does not spill)."
  },
  {
    correctOrder: ["ಹನಿ", "ಹನಿ", "ಗೂಡಿದರೆ", "ಹಳ್ಳ"],
    meaningKn: "ಸಣ್ಣ ಪ್ರಯತ್ನಗಳು ಅಥವಾ ಉಳಿತಾಯಗಳು ಸೇರಿ ಕೊನೆಗೆ ದೊಡ್ಡ ಯಶಸ್ಸನ್ನು ನೀಡುತ್ತವೆ ಎಂಬ ನೀತಿ.",
    meaningEn: "Many drops make an ocean (literally: drops joined together make a stream)."
  },
  {
    correctOrder: ["ಮನಸ್ಸಿದ್ದರೆ", "ಮಾರ್ಗ"],
    meaningKn: "ಕೆಲಸ ಮಾಡಲು ಇಚ್ಛೆಯಿದ್ದರೆ ಅದನ್ನು ಸಾಧಿಸಲು ನಮಗೆ ದಾರಿ ತಾನೇ ಸಿಗುತ್ತದೆ ಎಂಬ ನೀತಿ.",
    meaningEn: "Where there is a will, there is a way (literally: if there is mind/intent, there is a path)."
  },
  {
    correctOrder: ["ಹೆಣ್ಣು", "ಸಂಸಾರದ", "ಕಣ್ಣು"],
    meaningKn: "ಮನೆಯ ಹೆಣ್ಣುಮಗಳು ಕುಟುಂಬದ ಜ್ಯೋತಿಯಂತೆ ಇಡೀ ಮನೆಗೆ ಬೆಳಕನ್ನು ನೀಡುತ್ತಾಳೆ ಎಂಬ ನೀತಿ.",
    meaningEn: "A woman is the light/eye of the family."
  }
];

export function GadheGamePlayer({ locale }: { locale: Locale }) {
  const [gameState, setGameState] = useState<"start" | "playing" | "complete">("start");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null);

  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const activeProverb = proverbsData[currentIdx];

  // Scramble utility
  const scramble = (array: string[]) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    // Make sure it is not accidentally scrambled in correct order
    if (JSON.stringify(copy) === JSON.stringify(array) && array.length > 1) {
      return scramble(array);
    }
    return copy;
  };

  const startGame = () => {
    setCurrentIdx(0);
    setTimer(0);
    setErrorCount(0);
    setSelectedWords([]);
    setAvailableWords(scramble(proverbsData[0].correctOrder));
    setGameState("playing");
  };

  // Handle timer
  useEffect(() => {
    if (gameState === "playing") {
      timerInterval.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
    }

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [gameState]);

  // Handle word selection click
  const selectWord = (word: string) => {
    setAvailableWords((prev) => prev.filter((w) => w !== word));
    setSelectedWords((prev) => [...prev, word]);
  };

  // Handle word removal click
  const deselectWord = (word: string) => {
    setSelectedWords((prev) => prev.filter((w) => w !== word));
    setAvailableWords((prev) => [...prev, word]);
  };

  // Check if answer is correct
  const checkAnswer = () => {
    const isCorrect = JSON.stringify(selectedWords) === JSON.stringify(activeProverb.correctOrder);
    
    if (isCorrect) {
      setShowFeedback("correct");
      setTimeout(() => {
        setShowFeedback(null);
        if (currentIdx < proverbsData.length - 1) {
          const nextIdx = currentIdx + 1;
          setCurrentIdx(nextIdx);
          setSelectedWords([]);
          setAvailableWords(scramble(proverbsData[nextIdx].correctOrder));
        } else {
          setTotalTime(timer);
          setGameState("complete");
        }
      }, 1500);
    } else {
      setShowFeedback("incorrect");
      setErrorCount((prev) => prev + 1);
      setTimeout(() => {
        setShowFeedback(null);
      }, 1200);
    }
  };

  // Reset current proverb slots
  const resetCurrent = () => {
    setSelectedWords([]);
    setAvailableWords(scramble(activeProverb.correctOrder));
  };

  // Localized Labels
  const labels = {
    kn: {
      gameTitle: "ಕನ್ನಡ ಗಾದೆ ಮಾತು ಜೋಡಿಸಿ 🧩",
      gameSubtitle: "ಚದರಿದ ಪದಗಳನ್ನು ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಜೋಡಿಸಿ ಗಾದೆ ಮಾತು ಪೂರ್ಣಗೊಳಿಸಿ!",
      rulesHeader: "ಆಟದ ನಿಯಮಗಳು:",
      rule1: "1. ಪರದೆಯ ಮೇಲೆ ಪದಗಳನ್ನು ಯಾದೃಚ್ಛಿಕವಾಗಿ (Scrambled) ನೀಡಲಾಗುತ್ತದೆ.",
      rule2: "2. ಅವುಗಳ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡುವ ಮೂಲಕ ಸರಿಯಾದ ಗಾದೆ ಮಾತನ್ನು ರಚಿಸಿ.",
      rule3: "3. ಒಟ್ಟು 15 ಗಾದೆ ಮಾತುಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ ಸಮಯವನ್ನು ದಾಖಲಿಸಲಾಗುತ್ತದೆ.",
      startButton: "ಆಟ ಪ್ರಾರಂಭಿಸಿ ➔",
      timerLabel: "ಸಮಯ:",
      seconds: "ಸೆಕೆಂಡುಗಳು",
      levelLabel: "ಹಂತ:",
      selectedLabel: "ನಿಮ್ಮ ವಾಕ್ಯ (ಇಲ್ಲಿ ಜೋಡಣೆಯಾಗುತ್ತದೆ):",
      availableLabel: "ಲಭ್ಯವಿರುವ ಪದಗಳು (ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ):",
      resetButton: "ಮರುಜೋಡಿಸು 🔄",
      checkButton: "ಉತ್ತರ ಪರಿಶೀಲಿಸಿ ➔",
      correctText: "ಅದ್ಭುತ! ಸರಿಯಾದ ಉತ್ತರ 🎉",
      incorrectText: "ತಪ್ಪು ಜೋಡಣೆ! ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ ❌",
      congrats: "ಅಭಿನಂದನೆಗಳು! 🏆",
      completeSubtitle: "ನೀವು ಎಲ್ಲಾ ಹಂತಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ!",
      timeTaken: "ತೆಗೆದುಕೊಂಡ ಒಟ್ಟು ಸಮಯ:",
      errorsLabel: "ತಪ್ಪು ಪ್ರಯತ್ನಗಳು:",
      shareText: "ನಿಮ್ಮ ಸಾಧನೆಯನ್ನು ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ನಿಮ್ಮ ಸ್ನೇಹಿತರಿಗೆ ಸವಾಲು ಹಾಕಿ!",
      shareButton: "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ 📱",
      playAgain: "ಮತ್ತೆ ಪ್ಲೇ ಮಾಡಿ 🔄",
      meaningLabel: "ಗಾದೆಯ ಅರ್ಥ:"
    },
    en: {
      gameTitle: "Kannada Proverb Jumble 🧩",
      gameSubtitle: "Arrange scrambled words in the correct order to complete the Kannada proverb!",
      rulesHeader: "Rules of the Game:",
      rule1: "1. Words of a famous proverb will be shown in a scrambled format.",
      rule2: "2. Click the words in order to construct the proverb.",
      rule3: "3. Complete 15 levels. Your total time will be recorded.",
      startButton: "Start Game ➔",
      timerLabel: "Time:",
      seconds: "seconds",
      levelLabel: "Level:",
      selectedLabel: "Your Sentence (assembled here):",
      availableLabel: "Available Words (click to select):",
      resetButton: "Reset Slots 🔄",
      checkButton: "Check Answer ➔",
      correctText: "Brilliant! Correct Answer 🎉",
      incorrectText: "Incorrect order! Try again ❌",
      congrats: "Congratulations! 🏆",
      completeSubtitle: "You successfully completed all levels!",
      timeTaken: "Total Time Taken:",
      errorsLabel: "Incorrect attempts:",
      shareText: "Share your score on WhatsApp and challenge your friends to beat your time!",
      shareButton: "Share on WhatsApp 📱",
      playAgain: "Play Again 🔄",
      meaningLabel: "Meaning of Proverb:"
    }
  };

  const text = labels[locale];

  // WhatsApp Share Handler
  const shareOnWhatsApp = () => {
    const msg =
      locale === "kn"
        ? `🏆 ನಾನು ಇಂದಿನ ಕನ್ನಡ "ಗಾದೆ ಮಾತು ಜೋಡಿಸಿ" ಆಟವನ್ನು ${totalTime} ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಪೂರ್ಣಗೊಳಿಸಿದೆ! ನಿಮ್ಮ ಸಮಯ ಎಷ್ಟು? ಪರೀಕ್ಷಿಸಿ: http://kannadaquiz.com/kn/games/gadhe`
        : `🏆 I solved today's Kannada "Proverb Jumble" puzzle in ${totalTime} seconds! Can you beat my time? Play here: http://kannadaquiz.com/en/games/gadhe`;
    
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background soft styling blur blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-violet-100 rounded-full blur-3xl opacity-60"></div>

      <div className="w-full max-w-xl bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-md relative z-10">
        
        {/* START STATE */}
        {gameState === "start" && (
          <div className="text-center">
            <span className="text-4xl">🧩</span>
            <h1 className="text-2xl font-serif font-black text-slate-900 mt-4 leading-snug">
              {text.gameTitle}
            </h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
              {text.gameSubtitle}
            </p>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-left text-xs text-slate-600 space-y-2.5 my-6 leading-relaxed">
              <strong className="text-slate-800 font-extrabold">{text.rulesHeader}</strong>
              <p>{text.rule1}</p>
              <p>{text.rule2}</p>
              <p>{text.rule3}</p>
            </div>

            <button
              onClick={startGame}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all select-none cursor-pointer active:scale-[0.99]"
            >
              {text.startButton}
            </button>
          </div>
        )}

        {/* PLAYING STATE */}
        {gameState === "playing" && (
          <div>
            {/* Header info */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1">
                <span>{text.levelLabel}</span>
                <span className="text-indigo-600 font-extrabold text-sm">{currentIdx + 1} / {proverbsData.length}</span>
              </div>
              <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg">
                <span>{text.timerLabel}</span>
                <span className="font-extrabold text-sm">{timer} s</span>
              </div>
            </div>

            {/* Slots Area */}
            <div className="mt-4">
              <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2.5">
                {text.selectedLabel}
              </h3>
              <div className="min-h-16 w-full border border-dashed border-slate-300 rounded-2xl bg-slate-50/50 p-4 flex flex-wrap gap-2.5 items-center justify-center relative">
                {selectedWords.length === 0 && (
                  <span className="text-xs text-slate-300 pointer-events-none select-none">
                    {locale === "kn" ? "ಪದಗಳನ್ನು ಇಲ್ಲಿ ಜೋಡಿಸಿ" : "Words will appear here"}
                  </span>
                )}
                {selectedWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => deselectWord(word)}
                    disabled={showFeedback !== null}
                    className="bg-white border-2 border-indigo-200 text-indigo-700 font-semibold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer select-none hover:border-red-400 hover:text-red-500 hover:scale-[0.97] transition-all"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Words Pool */}
            <div className="mt-6">
              <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2.5">
                {text.availableLabel}
              </h3>
              <div className="min-h-16 w-full flex flex-wrap gap-2.5 justify-center items-center">
                {availableWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectWord(word)}
                    disabled={showFeedback !== null}
                    className="bg-indigo-50 border border-indigo-100 hover:border-indigo-300 text-slate-800 hover:bg-white font-medium px-4.5 py-2.5 rounded-xl text-xs cursor-pointer select-none shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Success/Error Toast Feedback */}
            {showFeedback && (
              <div className={`mt-5 p-3 rounded-xl border text-center text-xs font-bold animate-[fadeIn_0.2s_ease-out] ${
                showFeedback === "correct" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                  : "bg-rose-50 border-rose-200 text-rose-800 animate-shake"
              }`}>
                {showFeedback === "correct" ? text.correctText : text.incorrectText}
              </div>
            )}

            {/* Action Bar */}
            <div className="mt-8 border-t border-slate-100 pt-5 flex gap-3">
              <button
                type="button"
                onClick={resetCurrent}
                disabled={showFeedback !== null}
                className="flex-1 py-3 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors select-none cursor-pointer active:scale-[0.99]"
              >
                {text.resetButton}
              </button>
              <button
                type="button"
                onClick={checkAnswer}
                disabled={selectedWords.length === 0 || showFeedback !== null}
                className="flex-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
              >
                {text.checkButton}
              </button>
            </div>
          </div>
        )}

        {/* WIN/COMPLETE STATE */}
        {gameState === "complete" && (
          <div className="text-center">
            <span className="text-5xl">🏆</span>
            <h1 className="text-2xl font-serif font-black text-slate-900 mt-4 leading-snug">
              {text.congrats}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {text.completeSubtitle}
            </p>

            <div className="my-6 p-5 bg-indigo-50 border border-indigo-100 rounded-2xl max-w-sm mx-auto space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">{text.timeTaken}</span>
                <span className="font-extrabold text-sm text-indigo-700">{totalTime} {text.seconds}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">{text.errorsLabel}</span>
                <span className="font-extrabold text-sm text-slate-800">{errorCount}</span>
              </div>
            </div>

            <div className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mb-6">
              {text.shareText}
            </div>

            <div className="space-y-3">
              <button
                onClick={shareOnWhatsApp}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 select-none cursor-pointer active:scale-[0.99]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.324 5.328 0 11.91 0c3.192.001 6.192 1.242 8.448 3.498 2.256 2.257 3.497 5.257 3.496 8.449-.003 6.585-5.328 11.91-11.91 11.91-2.006-.002-3.98-.507-5.746-1.472L0 24zm6.59-4.846c1.67.991 3.31 1.52 5.309 1.52 5.562 0 10.08-4.519 10.083-10.083C22.043 5.027 17.525.51 11.96.51c-5.562 0-10.08 4.517-10.083 10.08-.002 2.012.532 3.68 1.547 5.324L2.39 20.25l4.257-1.096z" />
                </svg>
                {text.shareButton}
              </button>

              <button
                onClick={startGame}
                className="w-full py-3 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors select-none cursor-pointer active:scale-[0.99]"
              >
                {text.playAgain}
              </button>
            </div>
          </div>
        )}

        {/* Meaning/Explanation block below the play board for educational value */}
        {gameState === "playing" && (
          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed text-center italic">
            <strong className="text-slate-700 font-extrabold not-italic block mb-0.5">
              {text.meaningLabel}
            </strong>
            {locale === "kn" ? activeProverb.meaningKn : activeProverb.meaningEn}
          </div>
        )}
      </div>
    </div>
  );
}
