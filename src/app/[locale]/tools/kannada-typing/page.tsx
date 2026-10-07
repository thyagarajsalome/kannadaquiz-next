import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locales";
import { KannadaTypingPlayer } from "@/components/tools/KannadaTypingPlayer";

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
        ? "ಕನ್ನಡ ಟೈಪಿಂಗ್ ಅಭ್ಯಾಸ | FDA SDA ಟೈಪಿಂಗ್ ಪರೀಕ್ಷೆ | KannadaQuiz"
        : "Kannada Typing Practice | FDA SDA Typing Test | KannadaQuiz",
    description:
      locale === "kn"
        ? "ಉಚಿತ ಕನ್ನಡ ಟೈಪಿಂಗ್ ಅಭ್ಯಾಸ ಟೂಲ್. FDA/SDA ಪರೀಕ್ಷೆಗಾಗಿ ಕನ್ನಡ ಟೈಪಿಂಗ್ ವೇಗ ಮತ್ತು ನಿಖರತೆ ಸುಧಾರಿಸಿ. WPM ಮತ್ತು ನಿಖರತೆ ಟ್ರ್ಯಾಕಿಂಗ್ ಸೌಲಭ್ಯ."
        : "Free Kannada typing practice tool. Improve your Kannada typing speed and accuracy for FDA/SDA competitive exams. Track WPM and accuracy in real-time.",
    keywords:
      locale === "kn"
        ? [
            "ಕನ್ನಡ ಟೈಪಿಂಗ್ ಅಭ್ಯಾಸ",
            "ಕನ್ನಡ ಟೈಪಿಂಗ್ ಟೆಸ್ಟ್",
            "FDA ಟೈಪಿಂಗ್ ಪರೀಕ್ಷೆ",
            "SDA ಟೈಪಿಂಗ್ ಪರೀಕ್ಷೆ",
            "KPSC ಟೈಪಿಂಗ್",
            "ಕನ್ನಡ ಟೈಪಿಂಗ್ ವೇಗ",
            "ಕನ್ನಡ ಟೈಪಿಂಗ್ ಆನ್‌ಲೈನ್",
            "Nudi ಟೈಪಿಂಗ್",
          ]
        : [
            "Kannada typing practice",
            "Kannada typing test",
            "FDA typing test",
            "SDA typing test",
            "KPSC typing",
            "Kannada typing speed",
            "Kannada typing online",
            "Nudi typing practice",
          ],
    alternates: {
      canonical: `/${locale}/tools/kannada-typing`,
      languages: {
        kn: "/kn/tools/kannada-typing",
        en: "/en/tools/kannada-typing",
      },
    },
    openGraph: {
      title:
        locale === "kn"
          ? "ಕನ್ನಡ ಟೈಪಿಂಗ್ ಅಭ್ಯಾಸ — ಉಚಿತ ಆನ್‌ಲೈನ್ ಟೂಲ್"
          : "Kannada Typing Practice — Free Online Tool",
      description:
        locale === "kn"
          ? "FDA/SDA ಪರೀಕ್ಷೆಗಾಗಿ ಕನ್ನಡ ಟೈಪಿಂಗ್ ಅಭ್ಯಾಸ. ಸುಲಭ, ಮಧ್ಯಮ ಮತ್ತು ಕಠಿಣ ಮಟ್ಟಗಳಲ್ಲಿ ಅಭ್ಯಾಸ ಮಾಡಿ."
          : "Practice Kannada typing for FDA/SDA exams. Multiple difficulty levels with real-time WPM and accuracy tracking.",
      url: `https://kannadaquiz.in/${locale}/tools/kannada-typing`,
      siteName: "KannadaQuiz",
      locale: locale === "kn" ? "kn_IN" : "en_US",
      type: "website",
    },
  };
}

export default async function KannadaTypingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  // JSON-LD structured data for the tool
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name:
      locale === "kn"
        ? "ಕನ್ನಡ ಟೈಪಿಂಗ್ ಅಭ್ಯಾಸ"
        : "Kannada Typing Practice",
    description:
      locale === "kn"
        ? "FDA/SDA ಪರೀಕ್ಷೆಗಾಗಿ ಉಚಿತ ಕನ್ನಡ ಟೈಪಿಂಗ್ ಅಭ್ಯಾಸ ಟೂಲ್"
        : "Free Kannada typing practice tool for FDA/SDA exams",
    url: `https://kannadaquiz.in/${locale}/tools/kannada-typing`,
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    inLanguage: locale === "kn" ? "kn" : "en",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KannadaTypingPlayer locale={locale as Locale} />
    </>
  );
}
