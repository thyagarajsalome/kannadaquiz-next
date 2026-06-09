import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locales";
import { GadheGamePlayer } from "@/components/games/GadheGamePlayer";

export const revalidate = 86400; // Cache for 24 hours

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return {
    title:
      locale === "kn"
        ? "ಗಾದೆ ಮಾತು ಜೋಡಿಸಿ | ಕನ್ನಡ ಆಟಗಳು | KannadaQuiz Games"
        : "Kannada Proverb Jumble Game | Learn Kannada | KannadaQuiz",
    description:
      locale === "kn"
        ? "ಕನ್ನಡ ಗಾದೆ ಮಾತುಗಳನ್ನು ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಜೋಡಿಸುವ ಉಚಿತ ಆಟ. ನಿಮ್ಮ ಮೆದುಳಿಗೆ ಕೆಲಸ ನೀಡಿ ಮತ್ತು ಸ್ನೇಹಿತರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ."
        : "Play the Kannada Proverb Jumble game. Arrange scrambled words to form famous Kannada proverbs and challenge your friends.",
    keywords:
      locale === "kn"
        ? ["ಕನ್ನಡ ಆಟಗಳು", "ಗಾದೆ ಮಾತು ಪಝಲ್", "ಕನ್ನಡ ವರ್ಡ್ ಗೇಮ್", "KPSC ಕನ್ನಡ ಗೇಮ್"]
        : ["Kannada Word Games", "Kannada Puzzle", "Kannada Proverb Game", "KPSC Kannada grammar"],
    alternates: {
      canonical: `/${locale}/games/gadhe`,
      languages: {
        kn: "/kn/games/gadhe",
        en: "/en/games/gadhe",
      },
    },
  };
}

export default async function GadheGamePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  return <GadheGamePlayer locale={locale as Locale} />;
}
