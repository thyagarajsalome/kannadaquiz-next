"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { type Locale } from "@/lib/locales";

// --- Practice passages organized by difficulty ---
type Passage = {
  id: string;
  titleKn: string;
  titleEn: string;
  text: string;
  difficulty: "easy" | "medium" | "hard";
  categoryKn: string;
  categoryEn: string;
};

const passages: Passage[] = [
  // --- EASY (short, common words) ---
  {
    id: "e1",
    titleKn: "ಕರ್ನಾಟಕ ಪರಿಚಯ",
    titleEn: "Introduction to Karnataka",
    text: "ಕರ್ನಾಟಕ ಭಾರತದ ದಕ್ಷಿಣ ಭಾಗದಲ್ಲಿರುವ ಒಂದು ರಾಜ್ಯ. ಬೆಂಗಳೂರು ಇದರ ರಾಜಧಾನಿ. ಕನ್ನಡ ಇಲ್ಲಿಯ ಅಧಿಕೃತ ಭಾಷೆ.",
    difficulty: "easy",
    categoryKn: "ಸಾಮಾನ್ಯ ಜ್ಞಾನ",
    categoryEn: "General Knowledge",
  },
  {
    id: "e2",
    titleKn: "ನಮ್ಮ ದೇಶ",
    titleEn: "Our Country",
    text: "ಭಾರತ ನಮ್ಮ ದೇಶ. ಇದು ಏಷ್ಯಾ ಖಂಡದಲ್ಲಿದೆ. ನವ ದೆಹಲಿ ನಮ್ಮ ರಾಜಧಾನಿ. ಭಾರತದಲ್ಲಿ ಹಲವು ಭಾಷೆಗಳಿವೆ.",
    difficulty: "easy",
    categoryKn: "ಸಾಮಾನ್ಯ ಜ್ಞಾನ",
    categoryEn: "General Knowledge",
  },
  {
    id: "e3",
    titleKn: "ನೀರಿನ ಮಹತ್ವ",
    titleEn: "Importance of Water",
    text: "ನೀರು ಜೀವನಕ್ಕೆ ಅತ್ಯಗತ್ಯ. ನಾವು ಪ್ರತಿ ದಿನ ನೀರು ಕುಡಿಯಬೇಕು. ನೀರನ್ನು ಪೋಲು ಮಾಡಬಾರದು.",
    difficulty: "easy",
    categoryKn: "ಪರಿಸರ",
    categoryEn: "Environment",
  },
  {
    id: "e4",
    titleKn: "ಶಾಲೆ",
    titleEn: "School",
    text: "ನಾನು ಪ್ರತಿ ದಿನ ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ. ನಮ್ಮ ಶಾಲೆ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ. ನಮ್ಮ ಶಿಕ್ಷಕರು ತುಂಬಾ ಒಳ್ಳೆಯವರು.",
    difficulty: "easy",
    categoryKn: "ಶಿಕ್ಷಣ",
    categoryEn: "Education",
  },
  // --- MEDIUM (exam-style content) ---
  {
    id: "m1",
    titleKn: "ಭಾರತದ ಸಂವಿಧಾನ",
    titleEn: "Indian Constitution",
    text: "ಭಾರತದ ಸಂವಿಧಾನವನ್ನು ಡಾ. ಬಿ. ಆರ್. ಅಂಬೇಡ್ಕರ್ ಅವರು ರಚಿಸಿದರು. ಸಂವಿಧಾನವು ಜನವರಿ ಇಪ್ಪತ್ತಾರು ಸಾವಿರದ ಒಂಬೈನೂರ ಐವತ್ತರಲ್ಲಿ ಜಾರಿಗೆ ಬಂದಿತು. ಇದು ಭಾರತದ ಪ್ರಜಾಪ್ರಭುತ್ವ ವ್ಯವಸ್ಥೆಯ ಆಧಾರ ಸ್ತಂಭವಾಗಿದೆ.",
    difficulty: "medium",
    categoryKn: "ನಾಗರಿಕಶಾಸ್ತ್ರ",
    categoryEn: "Civics",
  },
  {
    id: "m2",
    titleKn: "ಕರ್ನಾಟಕದ ನದಿಗಳು",
    titleEn: "Rivers of Karnataka",
    text: "ಕಾವೇರಿ ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ನದಿ. ಕೃಷ್ಣಾ ಮತ್ತು ತುಂಗಭದ್ರಾ ನದಿಗಳು ಉತ್ತರ ಕರ್ನಾಟಕದಲ್ಲಿ ಹರಿಯುತ್ತವೆ. ಶರಾವತಿ ನದಿಯ ಜೋಗ ಜಲಪಾತವು ಭಾರತದ ಎರಡನೇ ಅತಿ ಎತ್ತರದ ಜಲಪಾತವಾಗಿದೆ.",
    difficulty: "medium",
    categoryKn: "ಭೂಗೋಳ",
    categoryEn: "Geography",
  },
  {
    id: "m3",
    titleKn: "ಪಂಚಾಯತ್ ರಾಜ್ ವ್ಯವಸ್ಥೆ",
    titleEn: "Panchayat Raj System",
    text: "ಪಂಚಾಯತ್ ರಾಜ್ ವ್ಯವಸ್ಥೆಯು ಮೂರು ಹಂತಗಳನ್ನು ಹೊಂದಿದೆ. ಗ್ರಾಮ ಪಂಚಾಯತ್ ಮೊದಲ ಹಂತ. ತಾಲೂಕು ಪಂಚಾಯತ್ ಮಧ್ಯಮ ಹಂತ. ಜಿಲ್ಲಾ ಪಂಚಾಯತ್ ಮೇಲಿನ ಹಂತವಾಗಿದೆ.",
    difficulty: "medium",
    categoryKn: "ನಾಗರಿಕಶಾಸ್ತ್ರ",
    categoryEn: "Civics",
  },
  {
    id: "m4",
    titleKn: "ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ",
    titleEn: "Vijayanagara Empire",
    text: "ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯವನ್ನು ಹರಿಹರ ಮತ್ತು ಬುಕ್ಕರಾಯ ಸ್ಥಾಪಿಸಿದರು. ಹಂಪಿ ಇದರ ರಾಜಧಾನಿಯಾಗಿತ್ತು. ಕೃಷ್ಣದೇವರಾಯ ಈ ಸಾಮ್ರಾಜ್ಯದ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ರಾಜನಾಗಿದ್ದನು.",
    difficulty: "medium",
    categoryKn: "ಇತಿಹಾಸ",
    categoryEn: "History",
  },
  // --- HARD (long, complex sentences for FDA/SDA level) ---
  {
    id: "h1",
    titleKn: "ಮೂಲಭೂತ ಹಕ್ಕುಗಳು",
    titleEn: "Fundamental Rights",
    text: "ಭಾರತದ ಸಂವಿಧಾನದ ಮೂರನೇ ಭಾಗದಲ್ಲಿ ಮೂಲಭೂತ ಹಕ್ಕುಗಳನ್ನು ನಮೂದಿಸಲಾಗಿದೆ. ಸಮಾನತೆಯ ಹಕ್ಕು ಸ್ವಾತಂತ್ರ್ಯದ ಹಕ್ಕು ಶೋಷಣೆ ವಿರುದ್ಧದ ಹಕ್ಕು ಧಾರ್ಮಿಕ ಸ್ವಾತಂತ್ರ್ಯದ ಹಕ್ಕು ಸಾಂಸ್ಕೃತಿಕ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಹಕ್ಕು ಹಾಗೂ ಸಾಂವಿಧಾನಿಕ ಪರಿಹಾರಗಳ ಹಕ್ಕು ಇವು ಆರು ಮೂಲಭೂತ ಹಕ್ಕುಗಳಾಗಿವೆ.",
    difficulty: "hard",
    categoryKn: "ನಾಗರಿಕಶಾಸ್ತ್ರ",
    categoryEn: "Civics",
  },
  {
    id: "h2",
    titleKn: "ಕರ್ನಾಟಕದ ಏಕೀಕರಣ",
    titleEn: "Unification of Karnataka",
    text: "ಕರ್ನಾಟಕ ಏಕೀಕರಣ ಚಳವಳಿಯು ಕನ್ನಡ ಮಾತನಾಡುವ ಜನರನ್ನು ಒಂದು ಆಡಳಿತಾತ್ಮಕ ಘಟಕವಾಗಿ ಒಗ್ಗೂಡಿಸಲು ನಡೆದ ಚಳವಳಿಯಾಗಿದೆ. ನವೆಂಬರ್ ಒಂದು ಸಾವಿರದ ಒಂಬೈನೂರ ಐವತ್ತಾರರಲ್ಲಿ ಮೈಸೂರು ರಾಜ್ಯವಾಗಿ ರೂಪುಗೊಂಡಿತು. ನಂತರ ಸಾವಿರದ ಒಂಬೈನೂರ ಎಪ್ಪತ್ಮೂರರಲ್ಲಿ ಕರ್ನಾಟಕ ಎಂದು ಮರುನಾಮಕರಣ ಮಾಡಲಾಯಿತು.",
    difficulty: "hard",
    categoryKn: "ಇತಿಹಾಸ",
    categoryEn: "History",
  },
  {
    id: "h3",
    titleKn: "ಪರಿಸರ ಸಂರಕ್ಷಣೆ",
    titleEn: "Environmental Protection",
    text: "ಪರಿಸರ ಸಂರಕ್ಷಣೆಯು ಪ್ರತಿಯೊಬ್ಬ ನಾಗರಿಕನ ಕರ್ತವ್ಯವಾಗಿದೆ. ಮರಗಿಡಗಳನ್ನು ಬೆಳೆಸುವುದು ನೀರನ್ನು ಮಿತವಾಗಿ ಬಳಸುವುದು ಪ್ಲಾಸ್ಟಿಕ್ ಬಳಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುವುದು ಮತ್ತು ಕಸವನ್ನು ಸೂಕ್ತ ರೀತಿಯಲ್ಲಿ ವಿಲೇವಾರಿ ಮಾಡುವುದು ನಮ್ಮೆಲ್ಲರ ಜವಾಬ್ದಾರಿಯಾಗಿದೆ.",
    difficulty: "hard",
    categoryKn: "ಪರಿಸರ",
    categoryEn: "Environment",
  },
  {
    id: "h4",
    titleKn: "ಆರ್ಥಿಕ ಯೋಜನೆ",
    titleEn: "Economic Planning",
    text: "ಭಾರತದ ಆರ್ಥಿಕ ಯೋಜನೆಯ ಮೊದಲ ಪಂಚವಾರ್ಷಿಕ ಯೋಜನೆಯು ಸಾವಿರದ ಒಂಬೈನೂರ ಐವತ್ತೊಂದರಲ್ಲಿ ಪ್ರಾರಂಭವಾಯಿತು. ಯೋಜನಾ ಆಯೋಗವನ್ನು ಸ್ಥಾಪಿಸಲಾಯಿತು. ಈಗ ಅದರ ಸ್ಥಾನದಲ್ಲಿ ನೀತಿ ಆಯೋಗವು ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ.",
    difficulty: "hard",
    categoryKn: "ಅರ್ಥಶಾಸ್ತ್ರ",
    categoryEn: "Economics",
  },
];

// Kannada keyboard layout reference (Nudi/Inscript style)
const kannadaKeyboardRows = [
  ["ೌ", "ೈ", "ಾ", "ೀ", "ೂ", "ಬ", "ಹ", "ಗ", "ದ", "ಜ", "ಡ"],
  ["ೋ", "ೇ", "್", "ಿ", "ು", "ಪ", "ರ", "ಕ", "ತ", "ಚ", "ಟ"],
  ["ೆ", "ಂ", "ಮ", "ನ", "ವ", "ಲ", "ಸ", "ಯ", "ಷ", "ಶ"],
];

type TestState = "idle" | "running" | "finished";

export function KannadaTypingPlayer({ locale }: { locale: Locale }) {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [currentPassage, setCurrentPassage] = useState<Passage | null>(null);
  const [typedText, setTypedText] = useState("");
  const [testState, setTestState] = useState<TestState>("idle");
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [bestWpm, setBestWpm] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const t = useCallback(
    (kn: string, en: string) => (locale === "kn" ? kn : en),
    [locale],
  );

  // Filter passages by difficulty
  const filteredPassages = passages.filter((p) => p.difficulty === difficulty);

  // Pick a random passage from the filtered list
  const pickRandomPassage = useCallback(() => {
    const available = passages.filter((p) => p.difficulty === difficulty);
    const idx = Math.floor(Math.random() * available.length);
    return available[idx];
  }, [difficulty]);

  // Start the test
  const startTest = useCallback(() => {
    const passage = pickRandomPassage();
    setCurrentPassage(passage);
    setTypedText("");
    setTestState("running");
    setStartTime(Date.now());
    setEndTime(0);
    setElapsedSeconds(0);
    setWpm(0);
    setAccuracy(100);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);

    // Start the timer
    if (timerRef.current) clearInterval(timerRef.current);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 200);

    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [pickRandomPassage]);

  // Stop the test
  const finishTest = useCallback(
    (typed: string) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const end = Date.now();
      setEndTime(end);
      setTestState("finished");

      // Calculate final stats
      if (currentPassage) {
        const durationMin = (end - startTime) / 60000;
        const wordsTyped = typed.trim().split(/\s+/).filter(Boolean).length;
        const finalWpm = durationMin > 0 ? Math.round(wordsTyped / durationMin) : 0;
        setWpm(finalWpm);
        if (finalWpm > bestWpm) setBestWpm(finalWpm);
        setCompletedCount((c) => c + 1);
      }
    },
    [currentPassage, startTime, bestWpm],
  );

  // Handle typing input
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (testState !== "running" || !currentPassage) return;

      const newText = e.target.value;
      setTypedText(newText);

      // Calculate accuracy character by character
      const target = currentPassage.text;
      let correct = 0;
      const totalChars = newText.length;
      for (let i = 0; i < totalChars; i++) {
        if (i < target.length && newText[i] === target[i]) {
          correct++;
        }
      }
      setTotalKeystrokes(totalChars);
      setCorrectKeystrokes(correct);
      setAccuracy(totalChars > 0 ? Math.round((correct / totalChars) * 100) : 100);

      // Live WPM
      const durationMin = (Date.now() - startTime) / 60000;
      const wordsTyped = newText.trim().split(/\s+/).filter(Boolean).length;
      setWpm(durationMin > 0.05 ? Math.round(wordsTyped / durationMin) : 0);

      // Check if finished
      if (newText.length >= target.length) {
        finishTest(newText);
      }
    },
    [testState, currentPassage, startTime, finishTest],
  );

  // Reset
  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTestState("idle");
    setCurrentPassage(null);
    setTypedText("");
    setElapsedSeconds(0);
    setWpm(0);
    setAccuracy(100);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Format time display
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Render character comparison
  const renderPassageText = () => {
    if (!currentPassage) return null;
    const target = currentPassage.text;

    return (
      <div className="font-serif text-lg md:text-xl leading-relaxed tracking-wide select-none" aria-hidden="true">
        {target.split("").map((char, i) => {
          let className = "text-gray-400"; // not yet typed
          if (i < typedText.length) {
            if (typedText[i] === char) {
              className = "text-green-600 bg-green-50"; // correct
            } else {
              className = "text-red-600 bg-red-100 underline decoration-red-400"; // wrong
            }
          } else if (i === typedText.length) {
            className = "text-gray-800 bg-yellow-100 border-b-2 border-yellow-500"; // cursor
          }
          return (
            <span key={i} className={className}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  // Performance grade
  const getGrade = (wpmVal: number, accVal: number) => {
    if (accVal >= 95 && wpmVal >= 30) return { grade: "A+", emoji: "🏆", colorClass: "text-yellow-600" };
    if (accVal >= 90 && wpmVal >= 25) return { grade: "A", emoji: "⭐", colorClass: "text-green-600" };
    if (accVal >= 85 && wpmVal >= 20) return { grade: "B+", emoji: "👍", colorClass: "text-blue-600" };
    if (accVal >= 80 && wpmVal >= 15) return { grade: "B", emoji: "✅", colorClass: "text-blue-500" };
    if (accVal >= 70 && wpmVal >= 10) return { grade: "C", emoji: "📝", colorClass: "text-orange-500" };
    return { grade: "D", emoji: "💪", colorClass: "text-red-500" };
  };

  // FDA/SDA requirement check
  const getFdaSdaStatus = (wpmVal: number, accVal: number) => {
    if (wpmVal >= 25 && accVal >= 90) {
      return { pass: true, messageKn: "FDA/SDA ಟೈಪಿಂಗ್ ಪರೀಕ್ಷೆಗೆ ಅರ್ಹತೆ ✅", messageEn: "Qualified for FDA/SDA typing test ✅" };
    }
    if (wpmVal >= 20 && accVal >= 80) {
      return { pass: false, messageKn: "ಇನ್ನಷ್ಟು ಅಭ್ಯಾಸ ಮಾಡಿ — ಹತ್ತಿರದಲ್ಲಿದ್ದೀರಿ! 🔶", messageEn: "Keep practicing — you're almost there! 🔶" };
    }
    return { pass: false, messageKn: "ಹೆಚ್ಚು ಅಭ್ಯಾಸ ಅಗತ್ಯ — ಪ್ರಯತ್ನ ಮುಂದುವರಿಸಿ! 💪", messageEn: "More practice needed — keep going! 💪" };
  };

  return (
    <div className="bg-[var(--background)] min-h-screen py-6 md:py-10">
      <div className="kq-container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-orange-200 mb-4">
            <span>⌨️</span>
            <span>{t("ಟೈಪಿಂಗ್ ಅಭ್ಯಾಸ", "Typing Practice")}</span>
          </div>
          <h1 className="font-serif text-2xl md:text-4xl font-extrabold text-[var(--primary)] leading-tight">
            {t("ಕನ್ನಡ ಟೈಪಿಂಗ್ ಅಭ್ಯಾಸ", "Kannada Typing Practice")}
          </h1>
          <p className="text-[var(--muted)] text-sm md:text-base mt-2 max-w-xl mx-auto">
            {t(
              "FDA/SDA ಪರೀಕ್ಷೆಗಾಗಿ ಕನ್ನಡ ಟೈಪಿಂಗ್ ವೇಗ ಮತ್ತು ನಿಖರತೆಯನ್ನು ಸುಧಾರಿಸಿ. ಗುರಿ: 25+ WPM, 90%+ ನಿಖರತೆ.",
              "Improve your Kannada typing speed and accuracy for FDA/SDA exams. Target: 25+ WPM, 90%+ accuracy.",
            )}
          </p>
        </div>

        {/* --- IDLE STATE: Difficulty Selection + Start --- */}
        {testState === "idle" && (
          <div className="kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-xs">
            {/* Session stats */}
            {completedCount > 0 && (
              <div className="flex flex-wrap gap-4 justify-center mb-6 text-sm">
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl border border-blue-200">
                  {t("ಪೂರ್ಣಗೊಂಡ ಪರೀಕ್ಷೆಗಳು", "Tests Completed")}: <strong>{completedCount}</strong>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-200">
                  {t("ಅತ್ಯುತ್ತಮ WPM", "Best WPM")}: <strong>{bestWpm}</strong>
                </div>
              </div>
            )}

            {/* Difficulty selector */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-[var(--foreground)] mb-3">
                {t("ಕಠಿಣತೆಯ ಮಟ್ಟ ಆಯ್ಕೆ ಮಾಡಿ", "Select Difficulty Level")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["easy", "medium", "hard"] as const).map((level) => {
                  const labels = {
                    easy: { kn: "ಸುಲಭ", en: "Easy", emoji: "🟢", desc: { kn: "ಚಿಕ್ಕ ವಾಕ್ಯಗಳು", en: "Short sentences" } },
                    medium: { kn: "ಮಧ್ಯಮ", en: "Medium", emoji: "🟡", desc: { kn: "ಪರೀಕ್ಷಾ ವಿಷಯಗಳು", en: "Exam topics" } },
                    hard: { kn: "ಕಠಿಣ", en: "Hard", emoji: "🔴", desc: { kn: "FDA/SDA ಮಟ್ಟ", en: "FDA/SDA level" } },
                  };
                  const l = labels[level];
                  const isSelected = difficulty === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`p-4 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-sm"
                          : "border-[var(--border)] hover:border-[var(--primary)]/40"
                      }`}
                    >
                      <div className="text-2xl mb-1">{l.emoji}</div>
                      <div className="font-bold text-sm">{t(l.kn, l.en)}</div>
                      <div className="text-xs text-[var(--muted)] mt-1">{t(l.desc.kn, l.desc.en)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Available passages preview */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-2">
                {t("ಲಭ್ಯವಿರುವ ಪ್ಯಾಸೇಜ್‌ಗಳು", "Available Passages")} ({filteredPassages.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredPassages.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-2 text-xs p-2 rounded-lg bg-gray-50 border border-gray-100"
                  >
                    <span className="text-gray-400">📄</span>
                    <span className="font-medium">{t(p.titleKn, p.titleEn)}</span>
                    <span className="text-gray-400 ml-auto">{t(p.categoryKn, p.categoryEn)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={startTest}
              className="w-full bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white font-bold text-base uppercase tracking-wider px-8 py-4 rounded-xl transition-colors shadow-sm"
            >
              {t("ಟೈಪಿಂಗ್ ಪರೀಕ್ಷೆ ಪ್ರಾರಂಭಿಸಿ ➔", "Start Typing Test ➔")}
            </button>

            {/* Keyboard toggle */}
            <button
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="w-full mt-3 text-sm text-[var(--muted)] hover:text-[var(--primary)] underline"
            >
              {showKeyboard
                ? t("ಕೀಬೋರ್ಡ್ ಮರೆಮಾಡಿ", "Hide Keyboard Reference")
                : t("ಕನ್ನಡ ಕೀಬೋರ್ಡ್ ನೋಡಿ", "Show Kannada Keyboard Reference")}
            </button>

            {showKeyboard && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="text-xs font-bold text-center text-gray-500 mb-3 uppercase tracking-wider">
                  {t("ಕನ್ನಡ ಕೀಬೋರ್ಡ್ ಲೇಔಟ್ (ಉಲ್ಲೇಖ)", "Kannada Keyboard Layout (Reference)")}
                </h4>
                <div className="space-y-2">
                  {kannadaKeyboardRows.map((row, ri) => (
                    <div key={ri} className="flex justify-center gap-1">
                      {row.map((key, ki) => (
                        <div
                          key={ki}
                          className="w-9 h-9 flex items-center justify-center bg-white border border-gray-300 rounded-md text-sm font-mono shadow-xs"
                        >
                          {key}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-3">
                  {t(
                    "ನಿಮ್ಮ ಫೋನ್ ಅಥವಾ ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಕನ್ನಡ ಕೀಬೋರ್ಡ್ (Nudi / Inscript / GBoard) ಸಕ್ರಿಯಗೊಳಿಸಿ",
                    "Enable Kannada keyboard (Nudi / Inscript / GBoard) on your phone or computer",
                  )}
                </p>
              </div>
            )}

            {/* FDA/SDA info box */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-bold text-sm text-blue-800 mb-2">
                {t("📋 FDA/SDA ಟೈಪಿಂಗ್ ಪರೀಕ್ಷೆ ಮಾಹಿತಿ", "📋 FDA/SDA Typing Test Info")}
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>
                  •{" "}
                  {t(
                    "FDA ಪರೀಕ್ಷೆಗೆ ಕನಿಷ್ಠ 25 WPM ಕನ್ನಡ ಟೈಪಿಂಗ್ ವೇಗ ಬೇಕು",
                    "FDA exam requires minimum 25 WPM Kannada typing speed",
                  )}
                </li>
                <li>
                  •{" "}
                  {t(
                    "SDA ಪರೀಕ್ಷೆಗೆ ಕನಿಷ್ಠ 20 WPM ಕನ್ನಡ ಟೈಪಿಂಗ್ ವೇಗ ಬೇಕು",
                    "SDA exam requires minimum 20 WPM Kannada typing speed",
                  )}
                </li>
                <li>
                  •{" "}
                  {t(
                    "ನಿಖರತೆ (Accuracy) 90% ಕ್ಕಿಂತ ಹೆಚ್ಚಿರಬೇಕು",
                    "Accuracy should be above 90%",
                  )}
                </li>
                <li>
                  •{" "}
                  {t(
                    "ಪ್ರತಿ ದಿನ 15-20 ನಿಮಿಷ ಅಭ್ಯಾಸ ಮಾಡಿ",
                    "Practice 15-20 minutes every day",
                  )}
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* --- RUNNING STATE: Active Typing Test --- */}
        {testState === "running" && currentPassage && (
          <div className="space-y-4">
            {/* Stats bar */}
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white border border-[var(--border)] rounded-xl p-3 text-center shadow-xs">
                <div className="text-xs text-[var(--muted)] uppercase tracking-wider">
                  {t("ಸಮಯ", "Time")}
                </div>
                <div className="text-xl font-bold text-[var(--foreground)] tabular-nums mt-1">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>
              <div className="bg-white border border-[var(--border)] rounded-xl p-3 text-center shadow-xs">
                <div className="text-xs text-[var(--muted)] uppercase tracking-wider">WPM</div>
                <div className="text-xl font-bold text-blue-600 tabular-nums mt-1">{wpm}</div>
              </div>
              <div className="bg-white border border-[var(--border)] rounded-xl p-3 text-center shadow-xs">
                <div className="text-xs text-[var(--muted)] uppercase tracking-wider">
                  {t("ನಿಖರತೆ", "Accuracy")}
                </div>
                <div
                  className={`text-xl font-bold tabular-nums mt-1 ${
                    accuracy >= 90 ? "text-green-600" : accuracy >= 70 ? "text-orange-500" : "text-red-500"
                  }`}
                >
                  {accuracy}%
                </div>
              </div>
              <div className="bg-white border border-[var(--border)] rounded-xl p-3 text-center shadow-xs">
                <div className="text-xs text-[var(--muted)] uppercase tracking-wider">
                  {t("ಪ್ರಗತಿ", "Progress")}
                </div>
                <div className="text-xl font-bold text-purple-600 tabular-nums mt-1">
                  {currentPassage.text.length > 0
                    ? Math.min(100, Math.round((typedText.length / currentPassage.text.length) * 100))
                    : 0}
                  %
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (typedText.length / currentPassage.text.length) * 100)}%`,
                }}
              />
            </div>

            {/* Passage card */}
            <div className="kq-card p-5 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
                  {t(currentPassage.categoryKn, currentPassage.categoryEn)}
                </span>
                <span className="text-xs text-[var(--muted)]">
                  {t(currentPassage.titleKn, currentPassage.titleEn)}
                </span>
              </div>

              {/* Reference text with character highlighting */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 min-h-[80px]">
                {renderPassageText()}
              </div>

              {/* Input textarea */}
              <textarea
                ref={textareaRef}
                value={typedText}
                onChange={handleInput}
                className="w-full p-4 border-2 border-blue-300 rounded-xl text-lg font-serif focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 min-h-[120px] resize-none bg-blue-50/30"
                placeholder={t("ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ...", "Start typing here...")}
                dir="ltr"
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>

            {/* Cancel button */}
            <button
              onClick={resetTest}
              className="w-full text-sm text-[var(--muted)] hover:text-red-500 py-2"
            >
              {t("ಪರೀಕ್ಷೆ ರದ್ದುಮಾಡಿ ✕", "Cancel Test ✕")}
            </button>
          </div>
        )}

        {/* --- FINISHED STATE: Results --- */}
        {testState === "finished" && currentPassage && (
          <div className="kq-card p-6 md:p-10 rounded-2xl border border-[var(--border)] bg-white shadow-xs">
            {/* Grade */}
            {(() => {
              const { grade, emoji, colorClass } = getGrade(wpm, accuracy);
              return (
                <div className="text-center mb-6">
                  <div className="text-5xl mb-2">{emoji}</div>
                  <div className={`text-4xl font-extrabold ${colorClass}`}>{t("ಗ್ರೇಡ್", "Grade")}: {grade}</div>
                </div>
              );
            })()}

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                <div className="text-xs text-blue-600 font-bold uppercase">{t("ವೇಗ", "Speed")}</div>
                <div className="text-3xl font-extrabold text-blue-700 mt-1">{wpm}</div>
                <div className="text-xs text-blue-500">WPM</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200">
                <div className="text-xs text-green-600 font-bold uppercase">{t("ನಿಖರತೆ", "Accuracy")}</div>
                <div className="text-3xl font-extrabold text-green-700 mt-1">{accuracy}%</div>
                <div className="text-xs text-green-500">
                  {correctKeystrokes}/{totalKeystrokes} {t("ಅಕ್ಷರಗಳು", "chars")}
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
                <div className="text-xs text-purple-600 font-bold uppercase">{t("ಸಮಯ", "Time")}</div>
                <div className="text-3xl font-extrabold text-purple-700 mt-1">{formatTime(elapsedSeconds)}</div>
                <div className="text-xs text-purple-500">{t("ನಿಮಿಷಗಳು", "minutes")}</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
                <div className="text-xs text-orange-600 font-bold uppercase">{t("ಅತ್ಯುತ್ತಮ", "Best")}</div>
                <div className="text-3xl font-extrabold text-orange-700 mt-1">{bestWpm}</div>
                <div className="text-xs text-orange-500">WPM</div>
              </div>
            </div>

            {/* FDA/SDA eligibility */}
            {(() => {
              const status = getFdaSdaStatus(wpm, accuracy);
              return (
                <div
                  className={`p-4 rounded-xl border text-center text-sm font-bold mb-6 ${
                    status.pass
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-orange-50 border-orange-200 text-orange-700"
                  }`}
                >
                  {t(status.messageKn, status.messageEn)}
                </div>
              );
            })()}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={startTest}
                className="flex-1 bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-xl transition-colors shadow-sm"
              >
                {t("ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ➔", "Try Again ➔")}
              </button>
              <button
                onClick={() => {
                  const nextDiff =
                    difficulty === "easy" ? "medium" : difficulty === "medium" ? "hard" : "hard";
                  setDifficulty(nextDiff);
                  resetTest();
                }}
                className="flex-1 bg-white border-2 border-[var(--primary)] text-[var(--primary)] font-bold text-sm uppercase tracking-wider px-6 py-3 rounded-xl transition-colors hover:bg-[var(--primary)]/5"
              >
                {difficulty !== "hard"
                  ? t("ಮುಂದಿನ ಮಟ್ಟ ➔", "Next Level ➔")
                  : t("ಮೊದಲಿನಿಂದ ➔", "Start Over ➔")}
              </button>
            </div>
          </div>
        )}

        {/* --- SEO Content Section (always visible below) --- */}
        <div className="mt-10 kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-xs">
          <h2 className="font-serif text-xl md:text-2xl font-extrabold text-[var(--primary)] mb-4">
            {t("ಕನ್ನಡ ಟೈಪಿಂಗ್ ಅಭ್ಯಾಸ — ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ", "Kannada Typing Practice — Complete Guide")}
          </h2>
          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-[var(--foreground)] space-y-4">
            {locale === "kn" ? (
              <>
                <p>
                  ಕರ್ನಾಟಕ ಸರ್ಕಾರದ FDA (First Division Assistant) ಮತ್ತು SDA (Second Division Assistant) ಹುದ್ದೆಗಳಿಗೆ
                  ಕನ್ನಡ ಟೈಪಿಂಗ್ ಪರೀಕ್ಷೆಯು ಕಡ್ಡಾಯವಾಗಿದೆ. FDA ಗೆ ನಿಮಿಷಕ್ಕೆ 25 ಪದಗಳ ವೇಗ ಮತ್ತು SDA ಗೆ ನಿಮಿಷಕ್ಕೆ 20 ಪದಗಳ
                  ವೇಗವನ್ನು ಹೊಂದಿರಬೇಕು.
                </p>
                <h3 className="font-bold text-base">ಕನ್ನಡ ಟೈಪಿಂಗ್ ವೇಗ ಹೆಚ್ಚಿಸುವ ಸಲಹೆಗಳು</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>ಪ್ರತಿ ದಿನ ಕನಿಷ್ಠ 15 ರಿಂದ 20 ನಿಮಿಷ ಅಭ್ಯಾಸ ಮಾಡಿ</li>
                  <li>ಮೊದಲು ನಿಖರತೆ ಸಾಧಿಸಿ ನಂತರ ವೇಗ ಹೆಚ್ಚಿಸಿ</li>
                  <li>Nudi ಅಥವಾ Inscript ಕೀಬೋರ್ಡ್ ಲೇಔಟ್ ಕಲಿಯಿರಿ</li>
                  <li>ಸುಲಭ ಮಟ್ಟದಿಂದ ಪ್ರಾರಂಭಿಸಿ ನಿಧಾನವಾಗಿ ಕಠಿಣ ಮಟ್ಟಕ್ಕೆ ಹೋಗಿ</li>
                  <li>ಕೀಬೋರ್ಡ್ ನೋಡದೆ ಟೈಪ್ ಮಾಡಲು ಕಲಿಯಿರಿ</li>
                </ul>
                <h3 className="font-bold text-base">ಕನ್ನಡ ಕೀಬೋರ್ಡ್ ಸೆಟಪ್</h3>
                <p>
                  ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ Nudi ಅಥವಾ Inscript ಕೀಬೋರ್ಡ್ ಬಳಸಬಹುದು. ಮೊಬೈಲ್‌ನಲ್ಲಿ Google Gboard ಅಥವಾ
                  SwiftKey ಕೀಬೋರ್ಡ್‌ನಲ್ಲಿ ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಸೇರಿಸಿ ಬಳಸಬಹುದು.
                </p>
              </>
            ) : (
              <>
                <p>
                  Kannada typing is mandatory for Karnataka government FDA (First Division Assistant) and SDA (Second
                  Division Assistant) posts. FDA requires 25 WPM and SDA requires 20 WPM typing speed in Kannada.
                </p>
                <h3 className="font-bold text-base">Tips to Improve Kannada Typing Speed</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Practice at least 15-20 minutes every day</li>
                  <li>Focus on accuracy first, then increase speed</li>
                  <li>Learn the Nudi or Inscript keyboard layout</li>
                  <li>Start with easy level and gradually move to hard</li>
                  <li>Learn to type without looking at the keyboard</li>
                </ul>
                <h3 className="font-bold text-base">Setting Up Kannada Keyboard</h3>
                <p>
                  On desktop, you can use Nudi or Inscript keyboard layouts. On mobile, add Kannada language in Google
                  Gboard or SwiftKey keyboard settings.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
