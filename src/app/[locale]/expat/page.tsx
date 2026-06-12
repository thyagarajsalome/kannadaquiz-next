import type { Metadata } from "next";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { ExpatGuideClient } from "@/components/ExpatGuideClient";

export const revalidate = 86400; // Cache for 24 hours since guides are static and updated infrequently

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
    title:
      lang === "kn"
        ? "ಅನಿವಾಸಿ ಕನ್ನಡಿಗರ ಮಾರ್ಗದರ್ಶಿ: ಹಣಕಾಸು, ವೀಸಾ ಮತ್ತು ಪ್ರವಾಸ ಮಾಹಿತಿ | KannadaQuiz"
        : "Expat Kannadiga Guide: NRI Finance, Visa & Travel Info | KannadaQuiz",
    description:
      lang === "kn"
        ? "ಅನಿವಾಸಿ ಕನ್ನಡಿಗರಿಗಾಗಿ ಬ್ಯಾಂಕಿಂಗ್ ನಿಯಮಗಳು (NRE/NRO), ಕರ್ನಾಟಕ ಆಸ್ತಿ ಖರೀದಿ ಮಾರ್ಗದರ್ಶಿ ಮತ್ತು ಯುಎಸ್‌ಎ, ಯುಕೆ, ಆಸ್ಟ್ರೇಲಿಯಾ, ಗಲ್ಫ್ ವೀಸಾ ಹಾಗೂ ಸಾರಿಗೆ ಗೈಡ್."
        : "Complete guide for expat Kannadigas: NRI banking (NRE/NRO), property laws (RERA Karnataka), and Visa/Transit guides for USA, UK, Australia, and Gulf.",
    keywords:
      lang === "kn"
        ? [
            "ಅನಿವಾಸಿ ಕನ್ನಡಿಗ", "NRE NRO ಖಾತೆ ವ್ಯತ್ಯಾಸ", "ಕರ್ನಾಟಕ ಆಸ್ತಿ ಖರೀದಿ ನಿಯಮಗಳು",
            "NRI ಆದಾಯ ತೆರಿಗೆ", "ಯುಎಸ್‌ಎ ವೀಸಾ ಗೈಡ್", "ಯುಕೆ ವೀಸಾ ಮಾರ್ಗದರ್ಶಿ", "ದುಬೈ ಮೆಟ್ರೋ ಗೈಡ್"
          ]
        : [
            "Expat Kannadiga", "NRE NRO Account RBI", "RERA Karnataka NRI Property",
            "NRI Income Tax India", "USA Visa Guide", "UK Skilled Worker Visa", "Australia Visa Subclass"
          ],
    alternates: {
      canonical: `/${lang}/expat`,
      languages: {
        kn: "/kn/expat",
        en: "/en/expat",
      },
    },
  };
}

export default async function ExpatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return (
    <main className="min-h-screen bg-[var(--surface-soft)] py-10" id="expat-guide-container">
      <div className="kq-container">
        {/* Page Hero Header */}
        <header className="mb-10 text-center bg-gradient-to-r from-[var(--primary)] to-indigo-950 text-white p-8 rounded-2xl shadow-md border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-indigo-900 to-black pointer-events-none"></div>
          <div className="relative z-10">
            <span className="inline-block bg-[var(--secondary)] text-xs font-extrabold uppercase px-3 py-1 rounded-full mb-3 select-none tracking-wider text-white shadow-sm">
              {locale === "kn" ? "ಅನಿವಾಸಿ ಕನ್ನಡಿಗರ ವೇದಿಕೆ" : "Global Expat Hub"}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-extrabold leading-tight">
              {locale === "kn"
                ? "ಅನಿವಾಸಿ ಮಾರ್ಗದರ್ಶಿ ಮತ್ತು ಸಹಾಯ ಕೇಂದ್ರ"
                : "Expat Guide & Global Info Hub"}
            </h1>
            <p className="mt-3 text-sm md:text-base text-indigo-200/90 max-w-2xl mx-auto font-medium">
              {locale === "kn"
                ? "ಭಾರತದ ಬ್ಯಾಂಕಿಂಗ್ ನಿಯಮಗಳು, ಆಸ್ತಿ ಹೂಡಿಕೆಗಳು ಮತ್ತು ಪ್ರಮುಖ ವಿದೇಶಿ ದೇಶಗಳ ವೀಸಾ ಹಾಗೂ ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆಯ ನಿಖರ ಮಾರ್ಗದರ್ಶಿ."
                : "Trusted financial guides, Indian NRI regulations, and detailed Visa and public transit guidelines for major global destinations."}
            </p>
          </div>
        </header>

        {/* Client-side Tabs and Country Selector */}
        <ExpatGuideClient locale={locale} />
      </div>
    </main>
  );
}
