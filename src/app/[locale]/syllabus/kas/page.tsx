import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locales";

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
        ? "KPSC KAS ಪಠ್ಯಕ್ರಮ 2026 | ಪೂರ್ವಭಾವಿ ಮತ್ತು ಮುಖ್ಯ ಪರೀಕ್ಷಾ ವಿಧಾನ"
        : "KPSC KAS Syllabus 2026 | Prelims & Mains Exam Pattern Guide",
    description:
      locale === "kn"
        ? "KPSC ಗೆಜೆಟೆಡ್ ಪ್ರೊಬೇಷನರ್ಸ್ (KAS) ಪರೀಕ್ಷೆಯ ಹಂತಗಳು, ಪೂರ್ವಭಾವಿ ಮತ್ತು ಮುಖ್ಯ ಪರೀಕ್ಷೆಯ ವಿವರವಾದ ಸಿಲಬಸ್ ವಿವರಗಳು ಇಲ್ಲಿ ಲಭ್ಯವಿದೆ."
        : "Download KPSC Gazetted Probationers (KAS) exam syllabus, pattern, and marking scheme for Prelims, Mains, and Interview stages.",
    keywords:
      locale === "kn"
        ? ["KPSC KAS ಪಠ್ಯಕ್ರಮ", "KAS ಸಿಲಬಸ್ 2026", "ಕರ್ನಾಟಕ ನಾಗರಿಕ ಸೇವೆಗಳು", "KAS ಪೂರ್ವಭಾವಿ ಸಿಲಬಸ್"]
        : ["KPSC KAS Syllabus", "KAS Exam Pattern 2026", "KAS Prelims Mains Syllabus"],
    alternates: {
      canonical: `/${locale}/syllabus/kas`,
      languages: {
        kn: "/kn/syllabus/kas",
        en: "/en/syllabus/kas",
      },
    },
  };
}

export default async function KasSyllabusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;

  const content = {
    en: {
      title: "KPSC KAS (Gazetted Probationers) Exam Syllabus",
      subtitle: "Comprehensive Syllabus for Prelims, Mains, and Interview Stages",
      backLink: "Back to Syllabus Hub",
      overviewHeader: "1. KAS Exam Structure Overview",
      overviewText: "The KPSC KAS exam is conducted in three stages: Prelims (Objective), Mains (Descriptive), and Personality Test (Interview).",
      stages: [
        { name: "Stage 1: Prelims", detail: "2 papers, objective (MCQs), qualifying for Mains. Total 400 marks." },
        { name: "Stage 2: Mains", detail: "7 descriptive written papers, merit-counting. Total 1250 marks." },
        { name: "Stage 3: Interview", detail: "Personality test assessing suitability. Total 120 marks." }
      ],
      prelimsHeader: "2. Prelims Exam Pattern & Syllabus",
      prelimsIntro: "Prelims consists of two papers of 2 hours duration each. There is a negative marking of 0.25 for incorrect answers.",
      prelimsPapers: [
        {
          num: "Paper 1",
          subject: "General Studies (National/International import, History of India, World Geography, Indian Polity, Economy).",
          marks: "200 Marks",
          questions: "100 MCQs"
        },
        {
          num: "Paper 2",
          subject: "General Studies (State importance, Karnataka History, Geography, Economy, Polity, General Science, Mental Ability).",
          marks: "200 Marks",
          questions: "100 MCQs"
        }
      ],
      mainsHeader: "3. Mains Written Exam Pattern (Descriptive)",
      mainsIntro: "Mains consists of 9 papers in total. Paper 1 & 2 are qualifying language papers (English and Kannada). The remaining 7 papers are descriptive and count for final merit.",
      mainsTable: {
        paper: "Paper No.",
        subject: "Mains Subject",
        marks: "Max Marks",
        type: "Evaluation Type"
      },
      mainsPapers: [
        { num: "Paper 1", name: "Kannada Language", marks: "150", type: "Qualifying (Min 35%)" },
        { num: "Paper 2", name: "English Language", marks: "150", type: "Qualifying (Min 35%)" },
        { num: "Paper 3", name: "Essay (Descriptive - 2 essays)", marks: "250", type: "Merit Counting" },
        { num: "Paper 4", name: "General Studies I (History, Geography, Social Structure)", marks: "250", type: "Merit Counting" },
        { num: "Paper 5", name: "General Studies II (Polity, Constitution, Governance, Public Admin)", marks: "250", type: "Merit Counting" },
        { num: "Paper 6", name: "General Studies III (Science, Tech, Economy, Environment)", marks: "250", type: "Merit Counting" },
        { num: "Paper 7", name: "General Studies IV (Ethics, Integrity, Aptitude)", marks: "250", type: "Merit Counting" }
      ],
      strategyHeader: "💡 Success Strategy for KAS",
      strategies: [
        "Master the State History and Geography: At least 40% of questions in Prelims Paper 2 and Mains GS-I relate directly to Karnataka.",
        "Consistently Read Newspapers: Read Prajavani or The Hindu daily to cover state, national, and international current affairs.",
        "Language Papers are Mandatory: Do not ignore Kannada and English language papers. If you fail to get 35% in them, your GS papers will not be evaluated.",
        "Practice Essay Writing: Allocate time to write weekly essays on socio-economic issues of Karnataka, which carries 250 marks."
      ]
    },
    kn: {
      title: "KPSC KAS (ಗೆಜೆಟೆಡ್ ಪ್ರೊಬೇಷನರ್ಸ್) ಪರೀಕ್ಷಾ ಪಠ್ಯಕ್ರಮ",
      subtitle: "ಪೂರ್ವಭಾವಿ, ಮುಖ್ಯ ಪರೀಕ್ಷೆ ಮತ್ತು ಸಂದರ್ಶನ ಹಂತಗಳ ಸಮಗ್ರ ಪಠ್ಯಕ್ರಮ ಮಾರ್ಗದರ್ಶಿ",
      backLink: "ಪಠ್ಯಕ್ರಮ ಮುಖಪುಟಕ್ಕೆ",
      overviewHeader: "1. KAS ಪರೀಕ್ಷಾ ವಿಧಾನದ ಅವಲೋಕನ",
      overviewText: "KPSC KAS ಪರೀಕ್ಷೆಯನ್ನು ಮೂರು ಹಂತಗಳಲ್ಲಿ ನಡೆಸಲಾಗುತ್ತದೆ: ಪೂರ್ವಭಾವಿ ಪರೀಕ್ಷೆ (MCQ), ಮುಖ್ಯ ಪರೀಕ್ಷೆ (ಲಿಖಿತ ಪರೀಕ್ಷೆ) ಮತ್ತು ವ್ಯಕ್ತಿತ್ವ ಪರೀಕ್ಷೆ (ಸಂದರ್ಶನ).",
      stages: [
        { name: "ಹಂತ 1: ಪೂರ್ವಭಾವಿ ಪರೀಕ್ಷೆ", detail: "2 ಪತ್ರಿಕೆಗಳು, ವಸ್ತುನಿಷ್ಠ ಮಾದರಿ (MCQ). ಮುಖ್ಯ ಪರೀಕ್ಷೆಗೆ ಅರ್ಹತೆಗಾಗಿ ಮಾತ್ರ. ಒಟ್ಟು 400 ಅಂಕಗಳು." },
        { name: "ಹಂತ 2: ಮುಖ್ಯ ಪರೀಕ್ಷೆ", detail: "7 ಲಿಖಿತ ಪತ್ರಿಕೆಗಳು (ವಿವರಣಾತ್ಮಕ). ಅಂತಿಮ ಆಯ್ಕೆ ಪಟ್ಟಿಗೆ ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ. ಒಟ್ಟು 1250 ಅಂಕಗಳು." },
        { name: "ಹಂತ 3: ವ್ಯಕ್ತಿತ್ವ ಪರೀಕ್ಷೆ", detail: "ಅಭ್ಯರ್ಥಿಗಳ ಸೂಕ್ತತೆಯನ್ನು ಅಳೆಯುವ ಸಂದರ್ಶನ ಹಂತ. ಒಟ್ಟು 120 ಅಂಕಗಳು." }
      ],
      prelimsHeader: "2. ಪೂರ್ವಭಾವಿ ಪರೀಕ್ಷಾ ವಿಧಾನ ಮತ್ತು ಸಿಲಬಸ್",
      prelimsIntro: "ಪೂರ್ವಭಾವಿ ಪರೀಕ್ಷೆಯು ತಲಾ 2 ಗಂಟೆಗಳ ಎರಡು ಪತ್ರಿಕೆಗಳನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ. ಪ್ರತಿ ತಪ್ಪು ಉತ್ತರಕ್ಕೆ 0.25 ರಷ್ಟು ನೆಗೆಟಿವ್ ಅಂಕಗಳಿರುತ್ತವೆ.",
      prelimsPapers: [
        {
          num: "ಪತ್ರಿಕೆ 1",
          subject: "ಸಾಮಾನ್ಯ ಅಧ್ಯಯನ (ರಾಷ್ಟ್ರೀಯ/ಅಂತರರಾಷ್ಟ್ರೀಯ ಪ್ರಾಮುಖ್ಯತೆ, ಭಾರತದ ಇತಿಹಾಸ, ಜಾಗತಿಕ ಭೂಗೋಳ, ಭಾರತದ ರಾಜಕೀಯ ಮತ್ತು ಆರ್ಥಿಕತೆ).",
          marks: "200 ಅಂಕಗಳು",
          questions: "100 ಪ್ರಶ್ನೆಗಳು"
        },
        {
          num: "ಪತ್ರಿಕೆ 2",
          subject: "ಸಾಮಾನ್ಯ ಅಧ್ಯಯನ (ರಾಜ್ಯ ಮಟ್ಟದ ಮಹತ್ವ, ಕರ್ನಾಟಕ ಇತಿಹಾಸ, ಭೂಗೋಳ, ಆರ್ಥಿಕತೆ, ರಾಜ್ಯ ರಾಜಕೀಯ, ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ ಮತ್ತು ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ).",
          marks: "200 ಅಂಕಗಳು",
          questions: "100 ಪ್ರಶ್ನೆಗಳು"
        }
      ],
      mainsHeader: "3. ಮುಖ್ಯ ಪರೀಕ್ಷೆಯ ವಿಧಾನ (ವಿವರಣಾತ್ಮಕ)",
      mainsIntro: "ಮುಖ್ಯ ಪರೀಕ್ಷೆಯು ಒಟ್ಟು 9 ಪತ್ರಿಕೆಗಳನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ. ಪತ್ರಿಕೆ 1 ಮತ್ತು 2 ಕಡ್ಡಾಯ ಅರ್ಹತಾ ಭಾಷಾ ಪತ್ರಿಕೆಗಳು (ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್). ಉಳಿದ 7 ಪತ್ರಿಕೆಗಳು ಅಂತಿಮ ಆಯ್ಕೆಗೆ ಪರಿಗಣನೆಯಾಗುತ್ತವೆ.",
      mainsTable: {
        paper: "ಪತ್ರಿಕೆ ಸಂಖ್ಯೆ",
        subject: "ಮುಖ್ಯ ಪರೀಕ್ಷೆಯ ವಿಷಯ",
        marks: "ಗರಿಷ್ಠ ಅಂಕಗಳು",
        type: "ಮೌಲ್ಯಮಾಪನ ವಿಧಾನ"
      },
      mainsPapers: [
        { num: "ಪತ್ರಿಕೆ 1", name: "ಕನ್ನಡ ಭಾಷೆ", marks: "150", type: "ಅರ್ಹತಾ ಪತ್ರಿಕೆ (ಕನಿಷ್ಠ 35%)" },
        { num: "ಪತ್ರಿಕೆ 2", name: "ಇಂಗ್ಲಿಷ್ ಭಾಷೆ", marks: "150", type: "ಅರ್ಹತಾ ಪತ್ರಿಕೆ (ಕನಿಷ್ಠ 35%)" },
        { num: "ಪತ್ರಿಕೆ 3", name: "ಪ್ರಬಂಧ (2 ಪ್ರಬಂಧಗಳು)", marks: "250", type: "ಅಂತಿಮ ಆಯ್ಕೆಗೆ ಸೇರ್ಪಡೆ" },
        { num: "ಪತ್ರಿಕೆ 4", name: "ಸಾಮಾನ್ಯ ಅಧ್ಯಯನ I (ಇತಿಹಾಸ, ಭೂಗೋಳ, ಸಾಮಾಜಿಕ ರಚನೆ)", marks: "250", type: "ಅಂತಿಮ ಆಯ್ಕೆಗೆ ಸೇರ್ಪಡೆ" },
        { num: "ಪತ್ರಿಕೆ 5", name: "ಸಾಮಾನ್ಯ ಅಧ್ಯಯನ II (ರಾಜಕೀಯ, ಸಂವಿಧಾನ, ಆಡಳಿತ, ಸಾರ್ವಜನಿಕ ಆಡಳಿತ)", marks: "250", type: "ಅಂತಿಮ ಆಯ್ಕೆಗೆ ಸೇರ್ಪಡೆ" },
        { num: "ಪತ್ರಿಕೆ 6", name: "ಸಾಮಾನ್ಯ ಅಧ್ಯಯನ III (ವಿಜ್ಞಾನ, ತಂತ್ರಜ್ಞಾನ, ಪರಿಸರ, ಆರ್ಥಿಕತೆ)", marks: "250", type: "ಅಂತಿಮ ಆಯ್ಕೆಗೆ ಸೇರ್ಪಡೆ" },
        { num: "ಪತ್ರಿಕೆ 7", name: "ಸಾಮಾನ್ಯ ಅಧ್ಯಯನ IV (ನೀತಿಶಾಸ್ತ್ರ, ಪ್ರಾಮಾಣಿಕತೆ, ನಡವಳಿಕೆ)", marks: "250", type: "ಅಂತಿಮ ಆಯ್ಕೆಗೆ ಸೇರ್ಪಡೆ" }
      ],
      strategyHeader: "💡 KAS ಪರೀಕ್ಷೆಯಲ್ಲಿ ಯಶಸ್ಸು ಪಡೆಯುವ ಸೂತ್ರಗಳು",
      strategies: [
        "ರಾಜ್ಯದ ಇತಿಹಾಸ ಮತ್ತು ಭೂಗೋಳದಲ್ಲಿ ಪ್ರಾವೀಣ್ಯತೆ ಪಡೆಯಿರಿ: ಪೂರ್ವಭಾವಿ ಪರೀಕ್ಷೆಯ 2ನೇ ಪತ್ರಿಕೆ ಮತ್ತು ಮುಖ್ಯ ಪರೀಕ್ಷೆಯ ಜಿಎಸ್-1 ರಲ್ಲಿ ಕನಿಷ್ಠ 40% ಪ್ರಶ್ನೆಗಳು ಕರ್ನಾಟಕಕ್ಕೆ ಸಂಬಂಧಿಸಿರುತ್ತವೆ.",
        "ನಿಯಮಿತ ದಿನಪತ್ರಿಕೆ ಓದುವಿಕೆ: ರಾಜ್ಯ, ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ಅಂತರರಾಷ್ಟ್ರೀಯ ವಿದ್ಯಮಾನಗಳನ್ನು ಕವರ್ ಮಾಡಲು ದಿನವೂ 'ಪ್ರಜಾವಾಣಿ' ಅಥವಾ 'ದ ಹಿಂದು' ಪತ್ರಿಕೆಗಳನ್ನು ಓದಿ.",
        "ಭಾಷಾ ಪತ್ರಿಕೆಗಳನ್ನು ಕಡೆಗಣಿಸಬೇಡಿ: ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಭಾಷಾ ಪತ್ರಿಕೆಗಳಲ್ಲಿ ಕನಿಷ್ಠ 35% ಅಂಕ ಗಳಿಸದಿದ್ದರೆ ನಿಮ್ಮ ಉಳಿದ ಸಾಮಾನ್ಯ ಅಧ್ಯಯನ ಪತ್ರಿಕೆಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗುವುದಿಲ್ಲ.",
        "ಪ್ರಬಂಧ ಬರವಣಿಗೆ ಅಭ್ಯಾಸ ಮಾಡಿ: 250 ಅಂಕಗಳನ್ನು ಹೊಂದಿರುವ ಪ್ರಬಂಧ ವಿಭಾಗದಲ್ಲಿ ಗರಿಷ್ಠ ಅಂಕ ಗಳಿಸಲು ಕರ್ನಾಟಕದ ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಸಮಸ್ಯೆಗಳ ಮೇಲೆ ವಾರಕ್ಕೊಮ್ಮೆ ಪ್ರಬಂಧಗಳನ್ನು ಬರೆಯಿರಿ."
      ]
    }
  };

  const current = content[locale];

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Back button header */}
      <div className="bg-slate-900 border-b border-slate-800 py-4">
        <div className="kq-container max-w-4xl flex items-center justify-between">
          <Link
            href={`/${locale}/syllabus`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
            </svg>
            {current.backLink}
          </Link>
        </div>
      </div>

      <div className="kq-container mt-10 max-w-4xl">
        {/* Title */}
        <div className="border-b border-slate-200 pb-6 mb-8">
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-xs font-extrabold uppercase tracking-wide">
            KPSC Recruitments
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold mt-3 text-slate-900 leading-tight">
            {current.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {current.subtitle}
          </p>
        </div>

        {/* 1. Structure Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
            {current.overviewHeader}
          </h3>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            {current.overviewText}
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {current.stages.map((stage, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                <span className="text-xs font-bold text-indigo-600">{stage.name}</span>
                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{stage.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Prelims Pattern */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
            {current.prelimsHeader}
          </h3>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            {current.prelimsIntro}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="py-3 px-4 w-28">Paper</th>
                  <th className="py-3 px-4">Syllabus Focus</th>
                  <th className="py-3 px-4 w-28">Max Marks</th>
                  <th className="py-3 px-4 w-28">No. of Questions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {current.prelimsPapers.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 text-slate-600">
                    <td className="py-3.5 px-4 font-bold text-slate-950">{p.num}</td>
                    <td className="py-3.5 px-4 leading-relaxed">{p.subject}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{p.marks}</td>
                    <td className="py-3.5 px-4">{p.questions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Mains Pattern */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
            {current.mainsHeader}
          </h3>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            {current.mainsIntro}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="py-3 px-4 w-28">{current.mainsTable.paper}</th>
                  <th className="py-3 px-4">{current.mainsTable.subject}</th>
                  <th className="py-3 px-4 w-28">{current.mainsTable.marks}</th>
                  <th className="py-3 px-4 w-44">{current.mainsTable.type}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {current.mainsPapers.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 text-slate-600">
                    <td className="py-3 px-4 font-bold text-slate-950">{p.num}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{p.name}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{p.marks}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.type.includes("Qualifying") 
                          ? "bg-slate-100 text-slate-700" 
                          : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      }`}>
                        {p.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Prep Strategy */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
          <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
            {current.strategyHeader}
          </h3>
          <ul className="space-y-3.5 text-xs text-slate-200 leading-relaxed">
            {current.strategies.map((strategy, sIdx) => (
              <li key={sIdx} className="flex gap-2">
                <span className="text-emerald-400 font-extrabold">✔</span>
                <span>{strategy}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
