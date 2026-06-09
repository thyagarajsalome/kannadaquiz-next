import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locales";

export const revalidate = 86400; // Cache for 24 hours (rarely changes)

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
        ? "ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ಪಠ್ಯಕ್ರಮ 2026 | KPSC, KEA Syllabus & Pattern"
        : "Karnataka Competitive Exams Syllabus 2026 | KPSC, KEA Prep Guide",
    description:
      locale === "kn"
        ? "KPSC KAS, KEA VAO, FDA, SDA, ಮತ್ತು PSI ಪರೀಕ್ಷೆಗಳ ನೂತನ ಪಠ್ಯಕ್ರಮ, ಅಂಕಗಳ ಹಂಚಿಕೆ ಮತ್ತು ಉಚಿತ ಪ್ರಿಪರೇಷನ್ ಗೈಡ್."
        : "Download the latest syllabus, exam patterns, and mark schemes for KPSC KAS, KEA VAO, FDA, SDA, and Karnataka Police PSI exams.",
    keywords:
      locale === "kn"
        ? [
            "KPSC ಪಠ್ಯಕ್ರಮ", "KEA VAO ಸಿಲಬಸ್", "KAS ಪರೀಕ್ಷಾ ಮಾದರಿ", "FDA SDA ಸಿಲಬಸ್",
            "PSI ಪಠ್ಯಕ್ರಮ 2026", "ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳು", "ಪರೀಕ್ಷಾ ವಿವರ"
          ]
        : [
            "KPSC Syllabus 2026", "KEA VAO Syllabus", "KAS Exam Pattern", "FDA SDA Syllabus",
            "PSI Exam Syllabus", "Karnataka Govt Exam Pattern", "Exams Syllabus Karnataka"
          ],
    alternates: {
      canonical: `/${locale}/syllabus`,
      languages: {
        kn: "/kn/syllabus",
        en: "/en/syllabus",
      },
    },
  };
}

type ExamSyllabusCard = {
  id: string;
  title: string;
  category: string;
  duration: string;
  marks: string;
  description: string;
  kannadaTitle: string;
  kannadaCategory: string;
  kannadaDuration: string;
  kannadaMarks: string;
  kannadaDescription: string;
  path: string;
  color: string;
};

const examsList: ExamSyllabusCard[] = [
  {
    id: "kas",
    title: "KPSC KAS (Karnataka Administrative Service)",
    category: "Gazetted Probationers (Group A & B)",
    duration: "Prelims + Mains + Interview",
    marks: "1450 Marks Total",
    description: "Prepare for Karnataka's highest civil service exam. Get complete details on Prelims General Studies (Paper 1 & 2) and Mains descriptive papers.",
    kannadaTitle: "KPSC KAS (ಕರ್ನಾಟಕ ಆಡಳಿತ ಸೇವೆ)",
    kannadaCategory: "ಗೆಜೆಟೆಡ್ ಪ್ರೊಬೇಷನರ್ಸ್ (ಗ್ರೂಪ್ ಎ ಮತ್ತು ಬಿ)",
    kannadaDuration: "ಪೂರ್ವಭಾವಿ + ಮುಖ್ಯ ಪರೀಕ್ಷೆ + ಸಂದರ್ಶನ",
    kannadaMarks: "ಒಟ್ಟು 1450 ಅಂಕಗಳು",
    kannadaDescription: "ಕರ್ನಾಟಕದ ಅತ್ಯುನ್ನತ ನಾಗರಿಕ ಸೇವಾ ಪರೀಕ್ಷೆಗೆ ಸಿದ್ಧರಾಗಿ. ಪೂರ್ವಭಾವಿ ಪತ್ರಿಕೆ 1 ಮತ್ತು 2 ಹಾಗೂ ಮುಖ್ಯ ಪರೀಕ್ಷೆಯ ವಿವರವಾದ ಪಠ್ಯಕ್ರಮ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ.",
    path: "/syllabus/kas",
    color: "from-blue-500 to-indigo-650",
  },
  {
    id: "vao",
    title: "KEA VAO (Village Administrative Officer)",
    category: "Group C Recruitment",
    duration: "2 Written Papers (OMR based)",
    marks: "200 Marks + Kannada Test",
    description: "Syllabus for the newly introduced VAO recruitment pattern. Contains the compulsory Kannada language test syllabus and GK/General paper details.",
    kannadaTitle: "KEA VAO (ಗ್ರಾಮ ಆಡಳಿತ ಅಧಿಕಾರಿ)",
    kannadaCategory: "ಗ್ರೂಪ್ ಸಿ ನೇಮಕಾತಿ",
    kannadaDuration: "2 ಲಿಖಿತ ಪರೀಕ್ಷೆಗಳು (OMR ಆಧಾರಿತ)",
    kannadaMarks: "200 ಅಂಕಗಳು + ಕಡ್ಡಾಯ ಕನ್ನಡ ಪರೀಕ್ಷೆ",
    kannadaDescription: "ನೂತನ ಗ್ರಾಮ ಆಡಳಿತ ಅಧಿಕಾರಿ ಪರೀಕ್ಷಾ ಮಾದರಿಯ ಪಠ್ಯಕ್ರಮ. ಕಡ್ಡಾಯ ಕನ್ನಡ ಪರೀಕ್ಷೆ ಹಾಗೂ ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಪತ್ರಿಕೆಗಳ ಸಂಪೂರ್ಣ ವಿವರ.",
    path: "/syllabus/vao",
    color: "from-emerald-500 to-teal-650",
  },
  {
    id: "psi",
    title: "KPSC PSI (Police Sub-Inspector)",
    category: "Police Department Group C",
    duration: "2 Papers + Physical Test (PST/ET)",
    marks: "200 Marks Total",
    description: "Syllabus details for PSI. Includes descriptive Paper 1 (Essay writing, translation, summary) and Paper 2 General Studies.",
    kannadaTitle: "KPSC PSI (ಪೊಲೀಸ್ ಸಬ್-ಇನ್ಸ್‌ಪೆಕ್ಟರ್)",
    kannadaCategory: "ಪೊಲೀಸ್ ಇಲಾಖೆ ಗ್ರೂಪ್ ಸಿ",
    kannadaDuration: "2 ಪತ್ರಿಕೆಗಳು + ದೈಹಿಕ ಸಾಮರ್ಥ್ಯ ಪರೀಕ್ಷೆ",
    kannadaMarks: "ಒಟ್ಟು 200 ಅಂಕಗಳು",
    kannadaDescription: "ಪೊಲೀಸ್ ಸಬ್-ಇನ್ಸ್‌ಪೆಕ್ಟರ್ ಪಠ್ಯಕ್ರಮ ವಿವರಣೆ. ಪ್ರಬಂಧ ಬರವಣಿಗೆ, ಭಾಷಾಂತರ ಒಳಗೊಂಡ ಪತ್ರಿಕೆ-1 ಮತ್ತು ಜಿ.ಕೆ ಒಳಗೊಂಡ ಪತ್ರಿಕೆ-2 ರ ವಿವರ.",
    path: "/syllabus/psi",
    color: "from-orange-500 to-amber-650",
  },
  {
    id: "fda-sda",
    title: "KEA FDA & SDA Assistants",
    category: "Group C Non-Technical",
    duration: "Compulsory Papers (OMR)",
    marks: "300 Marks Total",
    description: "Syllabus for First Division Assistant (FDA) and Second Division Assistant (SDA) vacancies. Includes General Studies and General Kannada/English syllabus.",
    kannadaTitle: "KEA FDA ಮತ್ತು SDA ಸಹಾಯಕರು",
    kannadaCategory: "ಗ್ರೂಪ್ ಸಿ ತಾಂತ್ರಿಕೇತರ",
    kannadaDuration: "ಕಡ್ಡಾಯ ಲಿಖಿತ ಪತ್ರಿಕೆಗಳು (OMR)",
    kannadaMarks: "ಒಟ್ಟು 300 ಅಂಕಗಳು",
    kannadaDescription: "ಪ್ರಥಮ ದರ್ಜೆ (FDA) ಮತ್ತು ದ್ವಿತೀಯ ದರ್ಜೆ (SDA) ಸಹಾಯಕ ಹುದ್ದೆಗಳ ಸಿಲಬಸ್. ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಮತ್ತು ಸಾಮಾನ್ಯ ಕನ್ನಡ/ಇಂಗ್ಲಿಷ್ ಪಠ್ಯಕ್ರಮ ಮಾಹಿತಿ.",
    path: "/syllabus/fda-sda",
    color: "from-rose-500 to-pink-650",
  }
];

export default async function SyllabusHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;

  const headerTitle = locale === "kn" ? "ಪರೀಕ್ಷಾ ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಮಾದರಿಗಳು" : "Exam Syllabus & Patterns";
  const headerSubtitle =
    locale === "kn"
      ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಉದ್ಯೋಗ ಪರೀಕ್ಷೆಗಳಿಗೆ ನವೀಕೃತ ವಿವರವಾದ ಸಿಲಬಸ್ ಮತ್ತು ಪರೀಕ್ಷಾ ವಿಧಾನಗಳು"
      : "Latest detailed syllabus, marks weightage, and guidelines for Karnataka civil, police, and non-technical exams.";
  const selectLabel = locale === "kn" ? "ಪರೀಕ್ಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ:" : "Select an Exam:";

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-12 border-b border-indigo-900/40">
        <div className="kq-container text-center max-w-4xl">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {locale === "kn" ? "ಉಚಿತ ಅಧ್ಯಯನ ಸಂಪನ್ಮೂಲಗಳು" : "Free Study Resources"}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mt-4 leading-tight">
            {headerTitle}
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {headerSubtitle}
          </p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="kq-container mt-12 max-w-5xl">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          {selectLabel}
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {examsList.map((exam) => {
            const title = locale === "kn" ? exam.kannadaTitle : exam.title;
            const category = locale === "kn" ? exam.kannadaCategory : exam.category;
            const duration = locale === "kn" ? exam.kannadaDuration : exam.duration;
            const marks = locale === "kn" ? exam.kannadaMarks : exam.marks;
            const description = locale === "kn" ? exam.kannadaDescription : exam.description;
            const viewButtonText = locale === "kn" ? "ಪಠ್ಯಕ್ರಮ ವೀಕ್ಷಿಸಿ ➔" : "View Syllabus ➔";

            return (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-slate-300/80 group"
              >
                {/* Visual Top Colored Bar */}
                <div className={`h-2 bg-gradient-to-r ${exam.color}`}></div>

                <div className="p-6 flex-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                    {category}
                  </span>

                  <h3 className="font-serif text-lg font-bold text-slate-900 mt-3 group-hover:text-indigo-600 transition-colors leading-snug">
                    {title}
                  </h3>

                  <p className="mt-2.5 text-xs text-slate-500 leading-relaxed">
                    {description}
                  </p>

                  {/* Highlights Grid */}
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 11.65a3.75 3.75 0 11-5.3 0 3.75 3.75 0 015.3 0zm0 0a8.25 8.25 0 0113.8 0M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-18 0A2.25 2.25 0 015.25 14.25h13.5A2.25 2.25 0 0121 16.5"></path>
                      </svg>
                      <span className="font-medium truncate">{duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                      <span className="font-medium truncate">{marks}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <Link
                    href={`/${locale}${exam.path}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors select-none"
                  >
                    {viewButtonText}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
