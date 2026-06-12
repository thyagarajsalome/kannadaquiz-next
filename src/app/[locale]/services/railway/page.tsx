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
    keywords:
      lang === "kn"
        ? [
            "ರೈಲ್ವೆ ಟಿಕೆಟ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್", "ಐಆರ್‌ಸಿಟಿಸಿ ಮರುಪಾವತಿ ನಿಯಮಗಳು", "ಟಿಕೆಟ್ ರದ್ದತಿ ಶುಲ್ಕ",
            "ತತ್ಕಾಲ್ ಟಿಕೆಟ್ ಕ್ಯಾನ್ಸಲೇಶನ್", "ವೇಟಿಂಗ್ ಲಿಸ್ಟ್ ಮರುಪಾವತಿ ಶುಲ್ಕ", "ರೈಲ್ವೆ ರೀಫಂಡ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್"
          ]
        : [
            "Railway Refund Calculator", "IRCTC Cancellation Rules", "Train Ticket Cancellation Charges",
            "Tatkal Ticket Refund Policy", "Waitlist Ticket Cancellation Charges", "Railway Refund Amount Calculator"
          ],
    alternates: {
      canonical: `/${lang}/services/railway`,
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
