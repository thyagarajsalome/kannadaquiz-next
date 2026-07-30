import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/locales";
import { EducationClient } from "./EducationClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : "kn";
  return {
    title: lang === "kn" ? "ಶಿಕ್ಷಣ ಮಾರ್ಗದರ್ಶಿ | Education Guide" : "Education Guide | KannadaQuiz",
    description: "Complete guide for school, college, diploma, degrees, and competitive exams.",
  };
}

export default async function EducationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white py-16 px-4 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
            {locale === "kn" ? "ಶಿಕ್ಷಣ ಮತ್ತು ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶಿ" : "Education & Career Guide"}
          </h1>
          <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto">
            {locale === "kn"
              ? "ಶಾಲಾ ಶಿಕ್ಷಣದಿಂದ ಹಿಡಿದು ಉನ್ನತ ಶಿಕ್ಷಣ, ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ವೃತ್ತಿಪರ ಕೋರ್ಸ್‌ಗಳವರೆಗಿನ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ. ನಿಮ್ಮ ಮಕ್ಕಳ ಉಜ್ವಲ ಭವಿಷ್ಯಕ್ಕಾಗಿ ಇದೊಂದು ಸಮಗ್ರ ಮಾರ್ಗದರ್ಶಿ."
              : "A comprehensive guide from school education to higher degrees, competitive exams, and professional courses. The ultimate resource for your child's bright future."}
          </p>
        </div>
      </div>
      <EducationClient locale={locale} />
    </main>
  );
}
