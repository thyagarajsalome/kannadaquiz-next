import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicJobs } from "@/lib/public-content";
import { JobsClient } from "./JobsClient";

export const revalidate = 86400;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : "kn";

  return {
    title: lang === "kn" 
      ? "ಸರ್ಕಾರಿ ಉದ್ಯೋಗಗಳು ಮತ್ತು ನೇಮಕಾತಿ | Government Jobs in Karnataka" 
      : "Karnataka Government Jobs & Recruitments | KannadaQuiz",
    description: lang === "kn"
      ? "ಕರ್ನಾಟಕ ಮತ್ತು ಕೇಂದ್ರ ಸರ್ಕಾರದ ಇತ್ತೀಚಿನ ಉದ್ಯೋಗ ಅವಕಾಶಗಳು, KPSC, ಪೊಲೀಸ್, ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಇತರ ಖಾಲಿ ಹುದ್ದೆಗಳ ಮಾಹಿತಿ."
      : "Latest government job opportunities in Karnataka and Central Govt, including KPSC, Police, Banking, and other vacancies.",
    alternates: {
      canonical: `/${lang}/jobs`,
      languages: {
        kn: "/kn/jobs",
        en: "/en/jobs",
      },
    },
  };
}

export default async function JobsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  
  const jobs = await getPublicJobs(locale, 120);

  return <JobsClient locale={locale} jobs={jobs} />;
}
