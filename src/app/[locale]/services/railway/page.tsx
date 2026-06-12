import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/locales";
import { RailwayCalculatorClient } from "@/components/RailwayCalculatorClient";

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
        ? "ರೈಲ್ವೆ ಟಿಕೆಟ್ ಮರುಪಾವತಿ ಮತ್ತು ರದ್ದತಿ ಕ್ಯಾಲ್ಕುಲೇಟರ್ | Indian Railways Refund Calculator"
        : "Indian Railways Ticket Refund & Cancellation Calculator | KannadaQuiz",
    description:
      lang === "kn"
        ? "ಭಾರತೀಯ ರೈಲ್ವೆ ಟಿಕೆಟ್ ರದ್ದತಿ ಶುಲ್ಕಗಳು ಮತ್ತು ಮರುಪಾವತಿ ಮೊತ್ತವನ್ನು ಲೆಕ್ಕಹಾಕಿ. ತತ್ಕಾಲ್ ಮತ್ತು ವೇಟ್‌ಲಿಸ್ಟ್ ನಿಯಮಗಳು."
        : "Calculate Indian Railways ticket cancellation fees and refund amounts. Tatkal, RAC, and Waitlisted ticket rules explained.",
    alternates: {
      canonical: `/services/railway`,
      languages: {
        kn: `/kn/services/railway`,
        en: `/en/services/railway`,
      },
    },
  };
}

export function generateStaticParams() {
  return [{ locale: "kn" }, { locale: "en" }];
}

export default async function RailwayPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return <RailwayCalculatorClient locale={locale} />;
}
