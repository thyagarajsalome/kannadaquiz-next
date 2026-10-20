import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locales";
import { AgeCalculatorPlayer } from "@/components/tools/AgeCalculatorPlayer";

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
        ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಉದ್ಯೋಗಗಳ ವಯಸ್ಸು ಕ್ಯಾಲ್ಕುಲೇಟರ್ 2026 | KPSC, KSP, KEA ಅರ್ಹತೆ"
        : "Karnataka Govt Exams Age Calculator 2026 | KPSC, KSP, KEA Eligibility",
    description:
      locale === "kn"
        ? "ಉಚಿತ ಆನ್‌ಲೈನ್ ವಯಸ್ಸು ಕ್ಯಾಲ್ಕುಲೇಟರ್. KPSC KAS, ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್, PSI, FDA, SDA, PDO ಪರೀಕ್ಷೆಗಳಿಗೆ ನಿಮ್ಮ ಜನ್ಮ ದಿನಾಂಕದ ಆಧಾರದ ಮೇಲೆ ವಯಸ್ಸಿನ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ."
        : "Free Karnataka Govt Exams Age Calculator. Check your exact eligibility for KPSC KAS, Police Constable, PSI, FDA, SDA, and PDO recruitments based on your DOB.",
    keywords:
      locale === "kn"
        ? [
            "ಕರ್ನಾಟಕ ವಯಸ್ಸು ಕ್ಯಾಲ್ಕುಲೇಟರ್",
            "KPSC ವಯೋಮಿತಿ ಅರ್ಹತೆ",
            "ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್ ವಯಸ್ಸು",
            "PSI ವಯೋಮಿತಿ 2026",
            "FDA SDA ವಯಸ್ಸಿನ ನಿಯಮಗಳು",
            "Karnataka Govt Job Age Calculator",
            "KEA VAO Age limit",
          ]
        : [
            "Karnataka govt exam age calculator",
            "KPSC age eligibility calculator",
            "KSP police constable age limit",
            "PSI age relaxation Karnataka",
            "FDA SDA age limit 2026",
          ],
    alternates: {
      canonical: `/${locale}/tools/age-calculator`,
      languages: {
        kn: "/kn/tools/age-calculator",
        en: "/en/tools/age-calculator",
      },
    },
    openGraph: {
      title:
        locale === "kn"
          ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳ ವಯಸ್ಸು ಕ್ಯಾಲ್ಕುಲೇಟರ್ — ಉಚಿತ ಆನ್‌ಲೈನ್ ಟೂಲ್"
          : "Karnataka Govt Exams Age Calculator — Free Online Eligibility Tool",
      description:
        locale === "kn"
          ? "ನಿಮ್ಮ ಹುಟ್ಟಿದ ದಿನಾಂಕ ನಮೂದಿಸಿ KPSC, ಪೊಲೀಸ್ ಮತ್ತು KEA ಪರೀಕ್ಷೆಗಳಿಗೆ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ."
          : "Enter your DOB to check eligibility across KPSC, KSP and KEA exams.",
      url: `https://kannadaquiz.in/${locale}/tools/age-calculator`,
      siteName: "KannadaQuiz",
      locale: locale === "kn" ? "kn_IN" : "en_US",
      type: "website",
    },
  };
}

export default async function AgeCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name:
      locale === "kn"
        ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳ ವಯಸ್ಸು ಕ್ಯಾಲ್ಕುಲೇಟರ್"
        : "Karnataka Govt Exams Age Calculator",
    description:
      locale === "kn"
        ? "ಕರ್ನಾಟಕ KPSC, ಪೊಲೀಸ್, KEA ಪರೀಕ್ಷೆಗಳ ವಯಸ್ಸಿನ ಅರ್ಹತೆ ಪರಿಶೀಲನಾ ಟೂಲ್"
        : "Free age eligibility calculator for Karnataka competitive examinations",
    url: `https://kannadaquiz.in/${locale}/tools/age-calculator`,
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
      <AgeCalculatorPlayer locale={locale as Locale} />
    </>
  );
}
