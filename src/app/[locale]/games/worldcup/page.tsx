import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/locales";
import { WorldCupClient } from "./WorldCupClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : "kn";

  return {
    title:
      lang === "kn"
        ? "ಫಿಫಾ ವಿಶ್ವಕಪ್ ೨೦೨೬ ಹಬ್ - ಪ್ರೆಡಿಕ್ಟರ್ ಮತ್ತು ಕ್ವಿಜ್ | FIFA World Cup 2026"
        : "FIFA World Cup 2026 Hub - Match Predictor & Quizzes | KannadaQuiz",
    description:
      lang === "kn"
        ? "ಫಿಫಾ ವಿಶ್ವಕಪ್ ೨೦೨೬ ರ ಇಂದಿನ ಪಂದ್ಯಗಳ ವಿಜೇತರನ್ನು ಪ್ರೆಡಿಕ್ಟ್ ಮಾಡಿ, ಸ್ನೇಹಿತರಿಗೆ ಸವಾಲು ಹಾಕಿ ಮತ್ತು ರೋಮಾಂಚಕ ಫುಟ್‌ಬಾಲ್ ಕ್ವಿಜ್ ಆಡಿ."
        : "Predict the winner of today's FIFA World Cup 2026 matches, check IST match schedules, and play interactive football trivia quizzes in Kannada.",
  };
}

export default async function WorldCupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return <WorldCupClient locale={locale} />;
}
