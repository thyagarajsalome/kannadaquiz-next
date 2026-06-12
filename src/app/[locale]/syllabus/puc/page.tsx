import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/locales";

export const revalidate = 86400; // 24 hours caching

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
        ? "ದ್ವಿತೀಯ ಪಿಯುಸಿ ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಪರೀಕ್ಷಾ ಮಾದರಿ 2026 | 2nd PUC Syllabus KSEAB"
        : "Karnataka 2nd PUC Class 12 Syllabus & Exam Pattern 2026",
    description:
      locale === "kn"
        ? "ದ್ವಿತೀಯ ಪಿಯುಸಿ ವಿಜ್ಞಾನ, ವಾಣಿಜ್ಯ ಮತ್ತು ಕಲಾ ವಿಭಾಗಗಳ ವಿಷಯವಾರು ಸಿಲಬಸ್, ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆ ಹಾಗೂ ಮಾದರಿ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು."
        : "Get Karnataka Class 12 (2nd PUC) Science, Commerce, and Arts stream syllabus, theory/practical marks distribution, and revision guides.",
    alternates: {
      canonical: `/${locale}/syllabus/puc`,
      languages: {
        kn: "/kn/syllabus/puc",
        en: "/en/syllabus/puc",
      },
    },
  };
}

export default async function PucSyllabusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;

  const isKn = locale === "kn";

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-700 text-white py-12 border-b border-fuchsia-500/20">
        <div className="kq-container max-w-4xl">
          <Link
            href={`/${locale}/syllabus`}
            className="inline-flex items-center gap-1 text-xs font-bold text-purple-100 hover:text-white transition-colors mb-3"
          >
            <span>← {isKn ? "ಪಠ್ಯಕ್ರಮಗಳ ಪಟ್ಟಿ" : "Back to Syllabus Hub"}</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
            {isKn ? "ಕರ್ನಾಟಕ ದ್ವಿತೀಯ ಪಿಯುಸಿ ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಪರೀಕ್ಷಾ ವಿಧಾನ" : "Karnataka 2nd PUC Class 12 Syllabus & Exam Scheme"}
          </h1>
          <p className="mt-3 text-purple-50/90 text-sm md:text-base max-w-2xl leading-relaxed">
            {isKn
              ? "ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿ (KSEAB) ನಡೆಸುವ ದ್ವಿತೀಯ ಪಿಯುಸಿ ಬೋರ್ಡ್ ಪರೀಕ್ಷೆಯ ವಿಜ್ಞಾನ, ವಾಣಿಜ್ಯ ಹಾಗೂ ಕಲಾ ವಿಭಾಗಗಳ ಪಠ್ಯಕ್ರಮ ಮಾರ್ಗದರ್ಶಿ."
              : "Comprehensive guide to exam structures, blueprints, laboratory practical weights, and course syllabi for 2nd PUC students under KSEAB."}
          </p>
        </div>
      </div>

      {/* Main Body */}
      <div className="kq-container max-w-4xl mt-10">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Main Content Column */}
          <div className="space-y-8">
            {/* Intro */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-slate-900 border-b pb-2 mb-4">
                {isKn ? "1. ಪರೀಕ್ಷಾ ಮಾದರಿ ವಿವರಣೆ" : "1. Scheme of Evaluation"}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {isKn
                  ? "ದ್ವಿತೀಯ ಪಿಯುಸಿ ಪರೀಕ್ಷೆಯನ್ನು ಪ್ರತಿ ವಿಷಯಕ್ಕೆ ಒಟ್ಟು 100 ಅಂಕಗಳಿಗೆ ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗುತ್ತದೆ. ವಿಜ್ಞಾನ ವಿಭಾಗದ ಪ್ರಮುಖ ವಿಷಯಗಳಿಗೆ (ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಜೀವಶಾಸ್ತ್ರ) 70 ಅಂಕಗಳ ಲಿಖಿತ ಪರೀಕ್ಷೆ ಮತ್ತು 30 ಅಂಕಗಳ ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆ ಇರುತ್ತದೆ. ಇತರ ವಿಷಯಗಳು ಮತ್ತು ಭಾಷೆಗಳಿಗೆ 80 ಅಂಕಗಳ ಲಿಖಿತ ಪರೀಕ್ಷೆ ಹಾಗೂ 20 ಅಂಕಗಳ ಆಂತರಿಕ ಅಂಕಗಳ ಹಂಚಿಕೆ ಇರುತ್ತದೆ."
                  : "Each 2nd PUC subject is evaluated for a total of 100 marks. For Science stream practical subjects (Physics, Chemistry, Biology), there is a 70-mark written theory exam and a 30-mark laboratory practical exam. For non-practical subjects (Commerce, Arts, and Languages), the evaluation is split as an 80-mark written board paper and 20 marks for internal school assessment."}
              </p>
            </section>

            {/* Stream breakdowns */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="font-serif text-xl font-bold text-slate-900 border-b pb-2">
                {isKn ? "2. ವಿಭಾಗವಾರು ಪಠ್ಯಕ್ರಮದ ಮುಖ್ಯಾಂಶಗಳು" : "2. Stream-wise Syllabus Highlights"}
              </h2>

              {/* Science */}
              <div className="space-y-2">
                <h3 className="font-bold text-purple-700 text-sm md:text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  {isKn ? "ವಿಜ್ಞಾನ ವಿಭಾಗ (Science Stream)" : "Science Stream"}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 pl-4 leading-relaxed">
                  {isKn
                    ? "ಭೌತಶಾಸ್ತ್ರ: ಸ್ಥಿತ್ಯುತ್ಪಾದಕ ವಿಭವ ಮತ್ತು ಧಾರಕತೆ, ವಿದ್ಯುತ್ ಪ್ರವಾಹ, ವಿದ್ಯುತ್ಕಾಂತೀಯ ಪ್ರೇರಣೆ. ರಸಾಯನಶಾಸ್ತ್ರ: ದ್ರಾವಣಗಳು, ವಿದ್ಯುದ್ರಸಾಯನಶಾಸ್ತ್ರ, ಸಾವಯವ ರಸಾಯನಶಾಸ್ತ್ರ. ಗಣಿತ: ಕಲನಶಾಸ್ತ್ರ (Calculus), ಸದಿಶ ಬೀಜಗಣಿತ (Vectors), ತ್ರಿವಿಮಿತಿ ರೇಖಾಗಣಿತ."
                    : "Physics: Electrostatic Potential, Current Electricity, Electromagnetic Induction. Chemistry: Solutions, Electrochemistry, Organic Chemistry (Haloalkanes, Phenols, Aldehydes). Mathematics: Calculus (Limits, Derivatives, Integrals), Vector Algebra, 3D Geometry."}
                </p>
              </div>

              {/* Commerce */}
              <div className="space-y-2">
                <h3 className="font-bold text-purple-700 text-sm md:text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  {isKn ? "ವಾಣಿಜ್ಯ ವಿಭಾಗ (Commerce Stream)" : "Commerce Stream"}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 pl-4 leading-relaxed">
                  {isKn
                    ? "ಲೆಕ್ಕಶಾಸ್ತ್ರ (Accountancy): ಪಾಲುದಾರಿಕೆ ಸಂಸ್ಥೆಗಳ ಲೆಕ್ಕಪತ್ರಗಳು, ಕಂಪನಿಗಳ ಹಣಕಾಸು ಹೇಳಿಕೆಗಳ ವಿಶ್ಲೇಷಣೆ. ವ್ಯವಹಾರ ಅಧ್ಯಯನ (Business Studies): ನಿರ್ವಹಣೆಯ ತತ್ವಗಳು, ಯೋಜನೆ, ಸಂಘಟನೆ, ಸಿಬ್ಬಂದಿ ನೇಮಕಾತಿ, ನಿಯಂತ್ರಣ."
                    : "Accountancy: Accounting for Partnership Firms, Analysis of Financial Statements. Business Studies: Principles of Management, Planning, Organizing, Staffing, Directing, Controlling."}
                </p>
              </div>

              {/* Arts */}
              <div className="space-y-2">
                <h3 className="font-bold text-purple-700 text-sm md:text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  {isKn ? "ಕಲಾ ವಿಭಾಗ (Arts Stream)" : "Arts Stream"}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 pl-4 leading-relaxed">
                  {isKn
                    ? "ಇತಿಹಾಸ: ಸಿಂಧೂ ನಾಗರಿಕತೆ, ಮೌರ್ಯ ಮತ್ತು ಗುಪ್ತ ಸಾಮ್ರಾಜ್ಯಗಳು, ವಿಜಯನಗರ ಇತಿಹಾಸ, ಕರ್ನಾಟಕದ ಏಕೀಕರಣ ಚಳುವಳಿ. ರಾಜ್ಯಶಾಸ್ತ್ರ: ಭಾರತದ ಸಂವಿಧಾನ, ಜಾಗತೀಕರಣ, ಪ್ರಾದೇಶಿಕ ಸಹಕಾರ ಸಂಘಟನೆಗಳು."
                    : "History: Indus Valley Civilization, Maurya & Gupta Empires, Vijayanagara Empire, Unification of Karnataka. Political Science: Constitution of India, Globalization, International Organizations."}
                </p>
              </div>
            </section>

            {/* Practical & Internal Assessment Details */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-slate-900 border-b pb-2 mb-4">
                {isKn ? "3. ಪ್ರಾಯೋಗಿಕ ಪರೀಕ್ಷೆ ಮತ್ತು ನಿಯಮಗಳು" : "3. Practicals & Internal Assessment"}
              </h2>
              <div className="text-xs md:text-sm text-slate-600 space-y-3 leading-relaxed">
                <p>
                  {isKn
                    ? "ವಿಜ್ಞಾನ ವಿಷಯಗಳಿಗೆ ಸಂಬಂಧಿಸಿದ 30 ಪ್ರಾಯೋಗಿಕ ಅಂಕಗಳನ್ನು ರೆಕಾರ್ಡ್ ಬುಕ್ ಬರವಣಿಗೆ, ಲ್ಯಾಬ್ ಪ್ರಯೋಗಗಳು ಮತ್ತು ಮೌಖಿಕ ಪರೀಕ್ಷೆ (Viva-voce) ಆಧಾರದ ಮೇಲೆ ನೀಡಲಾಗುತ್ತದೆ."
                    : "For Science subjects, the 30 practical marks are graded based on record book submissions, laboratory experiment executions, and oral viva-voce examinations."}
                </p>
                <p>
                  {isKn
                    ? "ಭಾಷೆಗಳು ಮತ್ತು ವಾಣಿಜ್ಯ ವಿಷಯಗಳಿಗೆ 20 ಆಂತರಿಕ ಅಂಕಗಳನ್ನು ನಿಯೋಜನೆಗಳು (Assignments) ಮತ್ತು ಕಾಲೇಜಿನ ಆಂತರಿಕ ಪರೀಕ್ಷೆಗಳ ಸರಾಸರಿಯನ್ನು ತೆಗೆದುಕೊಂಡು ನಿಗದಿಪಡಿಸಲಾಗುತ್ತದೆ."
                    : "For language and commerce subjects, the 20 internal marks are awarded based on assignments, unit tests, and performance in preparatory exams."}
                </p>
              </div>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm">
              <h3 className="font-serif text-base font-bold text-fuchsia-400 mb-4 border-b border-slate-800 pb-2">
                {isKn ? "ಅಧಿಕೃತ ಲಿಂಕ್‌ಗಳು" : "Official Links"}
              </h3>
              <div className="space-y-3.5 text-xs font-bold">
                <a
                  href="https://kseab.karnataka.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 transition-colors"
                >
                  🌐 {isKn ? "KSEAB ಇಲಾಖೆಯ ವೆಬ್‌ಸೈಟ್" : "KSEAB Official Web Portal"}
                </a>
                <div className="p-3 bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 rounded-lg">
                  📘 {isKn ? "ಪಿಯುಸಿ ಮಾದರಿ ಪತ್ರಿಕೆಗಳು ಶೀಘ್ರದಲ್ಲೇ" : "Model Question Papers coming soon"}
                </div>
              </div>
            </div>

            {/* Social Invite */}
            <div className="bg-indigo-950 text-indigo-100 p-5 rounded-2xl border border-indigo-900/40 shadow-sm">
              <h3 className="font-serif text-base font-bold text-indigo-400 mb-2">
                {isKn ? "PUC ವಾಟ್ಸಾಪ್ ಕಮ್ಯುನಿಟಿ" : "2nd PUC WhatsApp Group"}
              </h3>
              <p className="text-[11px] text-indigo-200/90 leading-relaxed mb-4">
                {isKn
                  ? "ನಮ್ಮ ಪಿಯುಸಿ ಅಧಿಕೃತ ಸ್ಟಡಿ ಗ್ರೂಪ್ ಸೇರಿ! ಇಂಪಾರ್ಟೆಂಟ್ ನೋಟ್ಸ್, ಕಾಮರ್ಸ್/ಸೈನ್ಸ್ ಫಾರ್ಮುಲಾ ಚೀಟ್‌ಗಳು ಮತ್ತು ಬೋರ್ಡ್ ಅಪ್ಡೇಟ್ಸ್ ಪಡೆಯಿರಿ."
                  : "Join our official study community for 2nd PUC updates, commerce ledger guides, physics cheat sheets, and board notifications."}
              </p>
              <a
                href="https://chat.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
              >
                <span>{isKn ? "ವಾಟ್ಸಾಪ್ ಗ್ರೂಪ್ ಸೇರಿ" : "Join WhatsApp Group"}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
