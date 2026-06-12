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
        ? "ಕರ್ನಾಟಕ SSLC ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಪರೀಕ್ಷಾ ಮಾದರಿ 2026 | Class 10 Syllabus KSEAB"
        : "Karnataka SSLC Class 10 Syllabus & Exam Pattern 2026",
    description:
      locale === "kn"
        ? "10ನೇ ತರಗತಿ SSLC ಪರೀಕ್ಷೆಯ ವಿಷಯವಾರು ಸಿಲಬಸ್, ಅಂಕಗಳ ಹಂಚಿಕೆ, ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ವಿನ್ಯಾಸ ಹಾಗೂ ಪಾಸಿಂಗ್ ಪ್ಯಾಕೇಜ್ ಮಾಹಿತಿ."
        : "Get Karnataka Class 10 SSLC subject-wise syllabus details, board exam patterns, grading systems, and study resources.",
    alternates: {
      canonical: `/${locale}/syllabus/sslc`,
      languages: {
        kn: "/kn/syllabus/sslc",
        en: "/en/syllabus/sslc",
      },
    },
  };
}

export default async function SslcSyllabusPage({
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
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white py-12 border-b border-orange-500/20">
        <div className="kq-container max-w-4xl">
          <Link
            href={`/${locale}/syllabus`}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-100 hover:text-white transition-colors mb-3"
          >
            <span>← {isKn ? "ಪಠ್ಯಕ್ರಮಗಳ ಪಟ್ಟಿ" : "Back to Syllabus Hub"}</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
            {isKn ? "ಕರ್ನಾಟಕ 10ನೇ ತರಗತಿ SSLC ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಪರೀಕ್ಷಾ ವಿಧಾನ" : "Karnataka Class 10 SSLC Syllabus & Exam Scheme"}
          </h1>
          <p className="mt-3 text-amber-50/90 text-sm md:text-base max-w-2xl leading-relaxed">
            {isKn
              ? "ಕರ್ನಾಟಕ ಶಾಲಾ ಪರೀಕ್ಷೆ ಮತ್ತು ಮೌಲ್ಯನಿರ್ಣಯ ಮಂಡಳಿ (KSEAB) ನಡೆಸುವ ಎಸ್‌ಎಸ್‌ಎಲ್‌ಸಿ ಬೋರ್ಡ್ ಪರೀಕ್ಷೆಯ ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಅಧ್ಯಯನ ಸಂಪನ್ಮೂಲಗಳ ಮಾರ್ಗದರ್ಶಿ."
              : "Official exam structure, grading criteria, and subject-wise chapter details for Class 10 board exams managed by KSEAB."}
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
                {isKn ? "1. ಪರೀಕ್ಷಾ ವಿಧಾನ ಮತ್ತು ಅಂಕಗಳ ಹಂಚಿಕೆ" : "1. Exam Pattern & Marks Scheme"}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                {isKn
                  ? "SSLC ಪರೀಕ್ಷೆಯು ಒಟ್ಟು 6 ವಿಷಯಗಳನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ: 3 ಭಾಷೆಗಳು ಮತ್ತು 3 ಪ್ರಮುಖ ವಿಷಯಗಳು (ಕೋರ್ ಸಬ್ಜೆಕ್ಟ್ಸ್). ಒಟ್ಟು ಅಂಕಗಳು 625 ಆಗಿರುತ್ತವೆ. ಭಾಷಾ ಪರೀಕ್ಷೆಗಳು 100 ಅಂಕಗಳಿಗೆ ಮತ್ತು ಕೋರ್ ವಿಷಯಗಳು 80 ಅಂಕಗಳ ಲಿಖಿತ ಪರೀಕ್ಷೆ ಹಾಗೂ 20 ಅಂಕಗಳ ಆಂತರಿಕ ಮೌಲ್ಯಮಾಪನವನ್ನು ಹೊಂದಿರುತ್ತವೆ."
                  : "The SSLC exam consists of 6 subjects: 3 languages and 3 core subjects. The total marks are 625. Language papers are evaluated out of 100 marks directly, while Core subjects feature an 80-mark written theory paper and 20 marks for internal school assessment."}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                      <th className="py-2 px-3">{isKn ? "ವಿಷಯ" : "Subject"}</th>
                      <th className="py-2 px-3">{isKn ? "ಲಿಖಿತ ಪರೀಕ್ಷೆ" : "Written Exam"}</th>
                      <th className="py-2 px-3">{isKn ? "ಆಂತರಿಕ ಮೌಲ್ಯಮಾಪನ" : "Internal Assessment"}</th>
                      <th className="py-2 px-3">{isKn ? "ಒಟ್ಟು ಅಂಕಗಳು" : "Total Marks"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    <tr>
                      <td className="py-3 px-3 text-slate-900">{isKn ? "ಪ್ರಥಮ ಭಾಷೆ (First Language)" : "First Language"}</td>
                      <td className="py-3 px-3">100</td>
                      <td className="py-3 px-3">-</td>
                      <td className="py-3 px-3">100</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-slate-900">{isKn ? "ದ್ವಿತೀಯ ಭಾಷೆ (Second Language)" : "Second Language"}</td>
                      <td className="py-3 px-3">80</td>
                      <td className="py-3 px-3">20</td>
                      <td className="py-3 px-3">100</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-slate-900">{isKn ? "ತೃತೀಯ ಭಾಷೆ (Third Language)" : "Third Language"}</td>
                      <td className="py-3 px-3">80</td>
                      <td className="py-3 px-3">20</td>
                      <td className="py-3 px-3">100</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-slate-900 font-bold text-indigo-650">{isKn ? "ಗಣಿತ (Mathematics)" : "Mathematics"}</td>
                      <td className="py-3 px-3">80</td>
                      <td className="py-3 px-3">20</td>
                      <td className="py-3 px-3">100</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-slate-900 font-bold text-indigo-650">{isKn ? "ವಿಜ್ಞಾನ (Science)" : "Science"}</td>
                      <td className="py-3 px-3">80</td>
                      <td className="py-3 px-3">20</td>
                      <td className="py-3 px-3">100</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 text-slate-900 font-bold text-indigo-650">{isKn ? "ಸಮಾಜ ವಿಜ್ಞಾನ (Social Science)" : "Social Science"}</td>
                      <td className="py-3 px-3">80</td>
                      <td className="py-3 px-3">20</td>
                      <td className="py-3 px-3">100</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Core Subject Breakdown */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="font-serif text-xl font-bold text-slate-900 border-b pb-2">
                {isKn ? "2. ಪ್ರಮುಖ ವಿಷಯಗಳ ಪಠ್ಯಕ್ರಮ ವಿವರ" : "2. Core Subjects Syllabus Breakdown"}
              </h2>

              {/* Maths */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {isKn ? "ಗಣಿತ (Mathematics) - 80 ಅಂಕಗಳು" : "Mathematics - 80 Marks"}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 pl-4 leading-relaxed">
                  {isKn
                    ? "ಪ್ರಮುಖ ಘಟಕಗಳು: ಸಮಾಂತರ ಶ್ರೇಢಿಗಳು (Arithmetic Progressions), ತ್ರಿಕೋನಮಿತಿಯ ಪರಿಚಯ (Introduction to Trigonometry), ರಚನೆಗಳು (Constructions), ವರ್ಗ ಸಮೀಕರಣಗಳು (Quadratic Equations), ನಿರ್ದೇಶಾಂಕ ರೇಖಾಗಣಿತ (Coordinate Geometry), ವಾಸ್ತವ ಸಂಖ್ಯೆಗಳು, ಮತ್ತು ಸಂಖ್ಯಾಶಾಸ್ತ್ರ."
                    : "Key Units: Arithmetic Progressions, Introduction to Trigonometry, Geometry & Constructions, Quadratic Equations, Coordinate Geometry, Real Numbers, and Statistics."}
                </p>
              </div>

              {/* Science */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {isKn ? "ವಿಜ್ಞಾನ (Science) - 80 ಅಂಕಗಳು" : "Science - 80 Marks"}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 pl-4 leading-relaxed">
                  {isKn
                    ? "ರಸಾಯನಶಾಸ್ತ್ರ: ರಾಸಾಯನಿಕ ಕ್ರಿಯೆಗಳು ಮತ್ತು ಸಮೀಕರಣಗಳು, ಆಮ್ಲಗಳು, ಪ್ರತ್ಯಾಮ್ಲಗಳು ಮತ್ತು ಲವಣಗಳು, ಲೋಹಗಳು ಮತ್ತು ಅಲೋಹಗಳು. ಜೀವಶಾಸ್ತ್ರ: ಜೈವಿಕ ಕ್ರಿಯೆಗಳು, ನಿಯಂತ್ರಣ ಮತ್ತು ಸಹಭಾಗಿತ್ವ, ಜೀವಕೋಶಗಳು ಹೇಗೆ ಸಂತಾನೋತ್ಪತ್ತಿ ನಡೆಸುತ್ತವೆ. ಭೌತಶಾಸ್ತ್ರ: ಬೆಳಕಿನ ಪ್ರತಿಫಲನ ಮತ್ತು ವಕ್ರೀಭವನ, ವಿದ್ಯುಚ್ಛಕ್ತಿ, ಕಾಂತೀಯ ಪರಿಣಾಮಗಳು."
                    : "Chemistry: Chemical Reactions, Acids, Bases & Salts, Metals & Non-Metals. Biology: Life Processes, Control & Coordination, How do Organisms Reproduce. Physics: Light - Reflection & Refraction, Electricity, Magnetic Effects of Electric Current."}
                </p>
              </div>

              {/* Social */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {isKn ? "ಸಮಾಜ ವಿಜ್ಞಾನ (Social Science) - 80 ಅಂಕಗಳು" : "Social Science - 80 Marks"}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 pl-4 leading-relaxed">
                  {isKn
                    ? "ವಿಭಾಗಗಳು: ಇತಿಹಾಸ (ಭಾರತಕ್ಕೆ ಯುರೋಪಿಯನ್ನರ ಆಗಮನ, ಬ್ರಿಟಿಷ್ ಆಳ್ವಿಕೆಯ ಪರಿಣಾಮಗಳು), ರಾಜ್ಯಶಾಸ್ತ್ರ (ಜಾಗತಿಕ ಸಮಸ್ಯೆಗಳು, ಮಾನವ ಹಕ್ಕುಗಳು), ಭೂಗೋಳಶಾಸ್ತ್ರ (ಭಾರತದ ಮಣ್ಣು, ಅರಣ್ಯ, ನೀರಾವರಿ ಸಂಪನ್ಮೂಸಗಳು), ಅರ್ಥಶಾಸ್ತ್ರ ಮತ್ತು ವ್ಯವಹಾರ ಅಧ್ಯಯನ."
                    : "History: Advent of Europeans to India, Impact of British Rule. Political Science: Global Problems, Human Rights. Geography: India's Soil, Forest, & Water Resources. Economics & Business Studies: Consumer Education, Public Finance."}
                </p>
              </div>
            </section>

            {/* Study Tips & Passing Packages */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-slate-900 border-b pb-2 mb-4">
                {isKn ? "3. ಯಶಸ್ಸಿನ ಸೂತ್ರ ಮತ್ತು ಪಾಸಿಂಗ್ ಪ್ಯಾಕೇಜ್" : "3. Preparation Tips & Passing Packages"}
              </h2>
              <ul className="space-y-3 pl-1 text-xs md:text-sm text-slate-600 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>
                    {isKn
                      ? "ಗಣಿತದಲ್ಲಿ ಪ್ರಮೇಯಗಳು (Theorems) ಮತ್ತು ಗ್ರಾಫ್‌ಗಳು ಪ್ರತಿ ವರ್ಷ ಕಡ್ಡಾಯವಾಗಿ ಬರುವುದರಿಂದ ಇವುಗಳನ್ನು ಪ್ರತಿದಿನ ಅಭ್ಯಾಸ ಮಾಡಿ."
                      : "Theorems (such as Thales and Pythagoras) and Graphical representation carry fixed marks. Practice them daily."}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>
                    {isKn
                      ? "ವಿಜ್ಞಾನದಲ್ಲಿ ಚಿತ್ರಗಳನ್ನು ಬಿಡಿಸುವ ಪ್ರಶ್ನೆಗಳಿಗೆ ಹೆಚ್ಚಿನ ಅಂಕಗಳಿರುತ್ತವೆ (ಮಾನವನ ಮೆದುಳು, ಕಣ್ಣು, ವಿದ್ಯುತ್ ಮೋಟಾರ್)."
                      : "Science diagrams are highly scoring. Focus on labeled sketches like Human Brain, Eye, and Electric Motor."}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>
                    {isKn
                      ? "ಹಳೆಯ 5 ವರ್ಷಗಳ ಬೋರ್ಡ್ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ಬಿಡಿಸುವುದರಿಂದ ಪರೀಕ್ಷಾ ಭಯ ನಿವಾರಣೆಯಾಗುತ್ತದೆ."
                      : "Solving previous 5 years of board question papers is the best way to handle time pressure during final exams."}
                  </span>
                </li>
              </ul>
            </section>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm">
              <h3 className="font-serif text-base font-bold text-amber-400 mb-4 border-b border-slate-800 pb-2">
                {isKn ? "ಉಚಿತ ಡೌನ್‌ಲೋಡ್ಸ್" : "Free Resources"}
              </h3>
              <div className="space-y-3.5 text-xs font-bold">
                <a
                  href="https://kseab.karnataka.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-200 transition-colors"
                >
                  🌐 {isKn ? "KSEAB ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್" : "KSEAB Official Portal"}
                </a>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg">
                  💡 {isKn ? "ಪಾಸಿಂಗ್ ಪ್ಯಾಕೇಜ್ ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ!" : "Passing Packages coming soon!"}
                </div>
              </div>
            </div>

            {/* Social Invite */}
            <div className="bg-emerald-950 text-emerald-100 p-5 rounded-2xl border border-emerald-900/40 shadow-sm">
              <h3 className="font-serif text-base font-bold text-emerald-400 mb-2">
                {isKn ? "SSLC ವಾಟ್ಸಾಪ್ ಕಮ್ಯುನಿಟಿ" : "SSLC WhatsApp Group"}
              </h3>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed mb-4">
                {isKn
                  ? "ನಮ್ಮ ಅಧಿಕೃತ ಸ್ಟಡಿ ಗ್ರೂಪ್ ಸೇರಿಕೊಳ್ಳಿ! ಪ್ರತಿದಿನ ಉಚಿತ ನೋಟ್ಸ್, ಇಂಪಾರ್ಟೆಂಟ್ ಕ್ವಿಜ್‌ಗಳು ಮತ್ತು ಬೋರ್ಡ್ ಎಕ್ಸಾಮ್ ಅಪ್ಡೇಟ್ಸ್ ಪಡೆಯಿರಿ."
                  : "Join our community group to get daily free PDFs, model question papers, and live updates directly on your mobile."}
              </p>
              <a
                href="https://chat.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
              >
                <span>{isKn ? "ವಾಟ್ಸಾಪ್ ಗ್ರೂಪ್ ಸೇರಿ" : "Join WhatsApp Community"}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
