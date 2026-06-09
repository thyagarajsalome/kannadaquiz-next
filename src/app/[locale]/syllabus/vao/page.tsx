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
        ? "KEA VAO ಪಠ್ಯಕ್ರಮ 2026 | ಗ್ರಾಮ ಆಡಳಿತ ಅಧಿಕಾರಿ ಪರೀಕ್ಷಾ ಮಾದರಿ"
        : "KEA VAO Syllabus 2026 | Village Administrative Officer Exam Pattern",
    description:
      locale === "kn"
        ? "ಕರ್ನಾಟಕ ಗ್ರಾಮ ಆಡಳಿತ ಅಧಿಕಾರಿ (VAO) ನೇಮಕಾತಿ ಪರೀಕ್ಷೆಯ ನೂತನ ಪಠ್ಯಕ್ರಮ, ಪತ್ರಿಕೆ-1 ಮತ್ತು ಪತ್ರಿಕೆ-2 ರ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ."
        : "Complete exam syllabus and marks distribution for KEA Village Administrative Officer (VAO) recruitment. Includes Paper 1 (GK) and Paper 2 (Language).",
    keywords:
      locale === "kn"
        ? ["KEA VAO ಪಠ್ಯಕ್ರಮ", "VAO ಸಿಲಬಸ್ 2026", "ಗ್ರಾಮ ಆಡಳಿತ ಅಧಿಕಾರಿ", "ಕರ್ನಾಟಕ ಗ್ರಾಮ ಲೆಕ್ಕಿಗ ಸಿಲಬಸ್"]
        : ["KEA VAO Syllabus", "Village Administrative Officer Syllabus", "Karnataka VAO Exam Pattern"],
    alternates: {
      canonical: `/${locale}/syllabus/vao`,
      languages: {
        kn: "/kn/syllabus/vao",
        en: "/en/syllabus/vao",
      },
    },
  };
}

export default async function VaoSyllabusPage({
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
      title: "KEA VAO (Village Administrative Officer) Exam Syllabus",
      subtitle: "Detailed Exam Pattern, Marks Distribution, and Preparation Strategy",
      backLink: "Back to Syllabus Hub",
      compulsoryHeader: "1. Compulsory Kannada Language Test",
      compulsoryText: "Before the main competitive exams, all candidates must qualify in the Kannada Language Test conducted by KEA. It is a qualifying test.",
      compulsoryDetail: "Max Marks: 150 | Passing Marks: 50 | Duration: 2 Hours. The marks are not counted for the final merit list, but passing is mandatory.",
      patternHeader: "2. Competitive Exam Pattern (Main Papers)",
      patternIntro: "The main selection is based on OMR-based written exams consisting of two papers:",
      paperTable: {
        paper: "Paper",
        subject: "Subject / Syllabus Topics",
        marks: "Max Marks",
        duration: "Duration"
      },
      papers: [
        {
          num: "Paper 1",
          subject: "General Knowledge (Current affairs, Indian history, Karnataka history, Geography, General science, Constitution of India, mental ability, and social sciences).",
          marks: "100 Marks",
          duration: "2 Hours"
        },
        {
          num: "Paper 2",
          subject: "General Kannada OR General English (Candidates must choose one. Covers grammar, vocabulary, synonyms, antonyms, translation, and sentence correction).",
          marks: "100 Marks",
          duration: "2 Hours"
        }
      ],
      detailedSyllabusHeader: "3. Detailed Section-wise Syllabus",
      sections: [
        {
          name: "General Knowledge (Paper 1)",
          topics: [
            "Current affairs of National and State importance.",
            "Indian Constitution, Preamble, Fundamental Rights, and Directive Principles.",
            "History of India, with special emphasis on the Freedom Struggle and Karnataka History.",
            "Geography of India and Karnataka (Rivers, Soil, climate, forest resources).",
            "General Science (Physics, Chemistry, Biology in daily life).",
            "Mental Ability, Logical Reasoning, and Basic Quantitative Aptitude.",
            "State Government Welfare Schemes and Decentralization in Karnataka."
          ]
        },
        {
          name: "General Kannada (Paper 2 Options)",
          topics: [
            "Kannada Grammar (Sandhi, Samasa, Alankara, Tatsama-Tadbhava).",
            "Vocabulary usage, proverbs, idioms, and phrases (Ghadhe and Shaili).",
            "Comprehension of unseen Kannada passages.",
            "Synonyms (Samanarthaka) and Antonyms (Viruddhartaka).",
            "Spelling correction and sentence structure."
          ]
        },
        {
          name: "General English (Paper 2 Options)",
          topics: [
            "English Grammar (Tenses, Active-Passive voice, Direct-Indirect speech, Prepositions, Articles).",
            "Vocabulary, Synonyms, Antonyms, and One-word substitutions.",
            "Reading Comprehension passages.",
            "Idioms & Phrases, sentence correction and spelling errors."
          ]
        }
      ],
      strategyHeader: "💡 Preparation Strategy for VAO 2026",
      strategies: [
        "Focus on Karnataka GK: Read standard books for Karnataka history and geography as at least 30% of GK questions relate to the state.",
        "Choose your Language Wisely: Select General Kannada or General English for Paper 2 based on your comfort, as this is a high-scoring paper.",
        "Practice Mental Ability Daily: Allocate 30 minutes to solve logical reasoning and aptitude questions to secure full marks in this section.",
        "Take Mock Tests: Regularly practice OMR sheet bubbling and take full-length mock exams to improve speed."
      ]
    },
    kn: {
      title: "KEA VAO (ಗ್ರಾಮ ಆಡಳಿತ ಅಧಿಕಾರಿ) ಪರೀಕ್ಷಾ ಪಠ್ಯಕ್ರಮ",
      subtitle: "ವಿವರವಾದ ಪರೀಕ್ಷಾ ವಿಧಾನ, ಅಂಕಗಳ ವಿಂಗಡಣೆ ಮತ್ತು ಪೂರ್ವಸಿದ್ಧತಾ ತಂತ್ರಗಳು",
      backLink: "ಪಠ್ಯಕ್ರಮ ಮುಖಪುಟಕ್ಕೆ",
      compulsoryHeader: "1. ಕಡ್ಡಾಯ ಕನ್ನಡ ಭಾಷಾ ಪರೀಕ್ಷೆ",
      compulsoryText: "ಮುಖ್ಯ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಿಂತ ಮೊದಲು, ಎಲ್ಲಾ ಅಭ್ಯರ್ಥಿಗಳು KEA ನಡೆಸುವ ಕಡ್ಡಾಯ ಕನ್ನಡ ಭಾಷಾ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಅರ್ಹತೆ ಪಡೆಯಬೇಕು.",
      compulsoryDetail: "ಗರಿಷ್ಠ ಅಂಕಗಳು: 150 | ಅರ್ಹತಾ ಅಂಕಗಳು: 50 | ಅವಧಿ: 2 ಗಂಟೆ. ಈ ಅಂಕಗಳನ್ನು ಅಂತಿಮ ಆಯ್ಕೆ ಪಟ್ಟಿಗೆ ಪರಿಗಣಿಸುವುದಿಲ್ಲ, ಆದರೆ ಇದರಲ್ಲಿ ಉತ್ತೀರ್ಣರಾಗುವುದು ಕಡ್ಡಾಯವಾಗಿದೆ.",
      patternHeader: "2. ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ವಿಧಾನ (ಮುಖ್ಯ ಪತ್ರಿಕೆಗಳು)",
      patternIntro: "ಅಂತಿಮ ಆಯ್ಕೆಯನ್ನು OMR ಆಧಾರಿತ ಲಿಖಿತ ಪರೀಕ್ಷೆಯ ಮೂಲಕ ಮಾಡಲಾಗುತ್ತದೆ, ಇದರಲ್ಲಿ ಎರಡು ಪತ್ರಿಕೆಗಳು ಇರುತ್ತವೆ:",
      paperTable: {
        paper: "ಪತ್ರಿಕೆ",
        subject: "ವಿಷಯಗಳು / ಪಠ್ಯಕ್ರಮದ ವಿವರ",
        marks: "ಗರಿಷ್ಠ ಅಂಕಗಳು",
        duration: "ಅವಧಿ"
      },
      papers: [
        {
          num: "ಪತ್ರಿಕೆ 1",
          subject: "ಸಾಮಾನ್ಯ ಜ್ಞಾನ (ಪ್ರಚಲಿತ ವಿದ್ಯಾಮಾನಗಳು, ಭಾರತೀಯ ಇತಿಹಾಸ, ಕರ್ನಾಟಕದ ಇತಿಹಾಸ, ಭೂಗೋಳಶಾಸ್ತ್ರ, ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ, ಭಾರತದ ಸಂವಿಧಾನ, ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಸಮಾಜ ವಿಜ್ಞಾನ).",
          marks: "100 ಅಂಕಗಳು",
          duration: "2 ಗಂಟೆಗಳು"
        },
        {
          num: "ಪತ್ರಿಕೆ 2",
          subject: "ಸಾಮಾನ್ಯ ಕನ್ನಡ ಅಥವಾ ಸಾಮಾನ್ಯ ಇಂಗ್ಲಿಷ್ (ಅಭ್ಯರ್ಥಿಗಳು ಒಂದನ್ನು ಆರಿಸಿಕೊಳ್ಳಬೇಕು. ವ್ಯಾಕರಣ, ಶಬ್ದಕೋಶ, ಸಮಾನಾರ್ಥಕ-ವಿರುದ್ಧಾರ್ಥಕ ಪದಗಳು, ವಾಕ್ಯ ದೋಷ ತಿದ್ದುಪಡಿ).",
          marks: "100 ಅಂಕಗಳು",
          duration: "2 ಗಂಟೆಗಳು"
        }
      ],
      detailedSyllabusHeader: "3. ವಿವರವಾದ ಪಠ್ಯಕ್ರಮ ಮಾಹಿತಿ",
      sections: [
        {
          name: "ಸಾಮಾನ್ಯ ಜ್ಞಾನ (ಪತ್ರಿಕೆ 1)",
          topics: [
            "ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ರಾಜ್ಯ ಮಟ್ಟದ ಪ್ರಮುಖ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು.",
            "ಭಾರತ ಸಂವಿಧಾನ, ಪೀಠಿಕೆ, ಮೂಲಭೂತ ಹಕ್ಕುಗಳು ಮತ್ತು ಮಾರ್ಗದರ್ಶಕ ತತ್ವಗಳು.",
            "ಭಾರತದ ಇತಿಹಾಸ (ವಿಶೇಷವಾಗಿ ಸ್ವಾತಂತ್ರ್ಯ ಸಂಗ್ರಾಮ ಮತ್ತು ಕರ್ನಾಟಕದ ಇತಿಹಾಸ).",
            "ಭಾರತ ಮತ್ತು ಕರ್ನಾಟಕದ ಭೂಗೋಳಶಾಸ್ತ್ರ (ನದಿಗಳು, ಮಣ್ಣು, ಹವಾಮಾನ, ಅರಣ್ಯಗಳು).",
            "ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ (ದೈನಂದಿನ ಜೀವನದಲ್ಲಿ ಭೌತಶಾಸ್ತ್ರ, ರಸಾಯನಶಾಸ್ತ್ರ, ಜೀವವಿಜ್ಞಾನ).",
            "ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ, ತಾರ್ಕಿಕ ಚಿಂತನೆ ಮತ್ತು ಅಂಕಗಣಿತ.",
            "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪ್ರಮುಖ ಜನಪರ ಯೋಜನೆಗಳು ಮತ್ತು ವಿಕೇಂದ್ರೀಕರಣ."
          ]
        },
        {
          name: "ಸಾಮಾನ್ಯ ಕನ್ನಡ (ಪತ್ರಿಕೆ 2 ಆಯ್ಕೆ)",
          topics: [
            "ಕನ್ನಡ ವ್ಯಾಕರಣ (ಸಂಧಿ, ಸಮಾಸ, ಅಲಂಕಾರ, ತತ್ಸಮ-ತದ್ಭವ, ಲಿಂಗ, ವಚನ).",
            "ಶಬ್ದಕೋಶ ಬಳಕೆ, ಗಾದೆಗಳು, ನುಡಿಗಟ್ಟುಗಳು ಮತ್ತು ಅವುಗಳ ಅರ್ಥಗಳು.",
            "ಅಪರಿಚಿತ ಗದ್ಯ ಭಾಗದ ಗ್ರಹಿಕೆ (Comprehension).",
            "ಸಮಾನಾರ್ಥಕ ಪದಗಳು ಮತ್ತು ವಿರುದ್ಧಾರ್ಥಕ ಪದಗಳು.",
            "ವಾಕ್ಯ ದೋಷಗಳನ್ನು ಸರಿಪಡಿಸುವುದು ಮತ್ತು ಲೇಖನ ಚಿಹ್ನೆಗಳ ಬಳಕೆ."
          ]
        },
        {
          name: "ಸಾಮಾನ್ಯ ಇಂಗ್ಲಿಷ್ (ಪತ್ರಿಕೆ 2 ಆಯ್ಕೆ)",
          topics: [
            "ಇಂಗ್ಲಿಷ್ ವ್ಯಾಕರಣ (Tenses, Active-Passive voice, Direct-Indirect speech, Prepositions).",
            "ಶಬ್ದಕೋಶ, ಸಮಾನಾರ್ಥಕ (Synonyms), ವಿರುದ್ಧಾರ್ಥಕ (Antonyms) ಮತ್ತು ಒನ್-ವರ್ಡ್ ಸಬ್ಸ್ಟಿಟ್ಯೂಷನ್.",
            "ಇಂಗ್ಲಿಷ್ ಗದ್ಯ ಭಾಗದ ಗ್ರಹಿಕೆ ಪ್ಯಾರಾಗ್ರಾಫ್.",
            "ನುಡಿಗಟ್ಟುಗಳು (Idioms & Phrases) ಮತ್ತು ವಾಕ್ಯ ದೋಷಗಳ ತಿದ್ದುಪಡಿ."
          ]
        }
      ],
      strategyHeader: "💡 VAO 2026 ಪರೀಕ್ಷಾ ಸಿದ್ಧತಾ ಸೂತ್ರಗಳು",
      strategies: [
        "ಕರ್ನಾಟಕ ಜಿ.ಕೆಗೆ ಹೆಚ್ಚಿನ ಒತ್ತು ನೀಡಿ: ರಾಜ್ಯದ ಇತಿಹಾಸ ಮತ್ತು ಭೂಗೋಳಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಕನಿಷ್ಠ 30% ಪ್ರಶ್ನೆಗಳು ಇರುವುದರಿಂದ ಕರ್ನಾಟಕಕ್ಕೆ ಹೆಚ್ಚಿನ ಪ್ರಾಮುಖ್ಯತೆ ನೀಡಿ.",
        "ಭಾಷಾ ಪತ್ರಿಕೆಯನ್ನು ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಆಯ್ಕೆ ಮಾಡಿ: ಪತ್ರಿಕೆ 2 ರಲ್ಲಿ ನಿಮ್ಮ ಭಾಷಾ ಪ್ರಾವೀಣ್ಯತೆಗೆ ಅನುಗುಣವಾಗಿ ಸಾಮಾನ್ಯ ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ಇದು ಗರಿಷ್ಠ ಅಂಕ ಗಳಿಸಲು ಸಹಕಾರಿ.",
        "ದಿನನಿತ್ಯ ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ ಅಭ್ಯಾಸ ಮಾಡಿ: ಈ ವಿಭಾಗದಲ್ಲಿ ಪೂರ್ಣ ಅಂಕಗಳನ್ನು ಪಡೆಯಲು ದಿನಕ್ಕೆ ಕನಿಷ್ಠ 30 ನಿಮಿಷಗಳ ಕಾಲ ತಾರ್ಕಿಕ ಮತ್ತು ಗಣಿತದ ಸಮಸ್ಯೆಗಳನ್ನು ಬಿಡಿಸಿ.",
        "ಅಣಕು ಪರೀಕ್ಷೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ: ನಿಯಮಿತವಾಗಿ OMR ಶೀಟ್ ತುಂಬುವುದನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ ಮತ್ತು ಸಮಯ ನಿರ್ವಹಣೆಗಾಗಿ ಪೂರ್ಣ ಪ್ರಮಾಣದ ಅಣಕು ಪರೀಕ್ಷೆಗಳನ್ನು ಬರೆಯಿರಿ."
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
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded text-xs font-extrabold uppercase tracking-wide">
            KEA Recruitments
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold mt-3 text-slate-900 leading-tight">
            {current.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {current.subtitle}
          </p>
        </div>

        {/* 1. Compulsory Kannada */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
            {current.compulsoryHeader}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {current.compulsoryText}
          </p>
          <div className="mt-3 bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-xs text-emerald-800 leading-relaxed font-semibold">
            {current.compulsoryDetail}
          </div>
        </div>

        {/* 2. Main Exam Pattern */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
            {current.patternHeader}
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            {current.patternIntro}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="py-3 px-4 w-24">{current.paperTable.paper}</th>
                  <th className="py-3 px-4">{current.paperTable.subject}</th>
                  <th className="py-3 px-4 w-28">{current.paperTable.marks}</th>
                  <th className="py-3 px-4 w-28">{current.paperTable.duration}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {current.papers.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 text-slate-600">
                    <td className="py-3.5 px-4 font-bold text-slate-950">{p.num}</td>
                    <td className="py-3.5 px-4 leading-relaxed">{p.subject}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{p.marks}</td>
                    <td className="py-3.5 px-4">{p.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Detailed Syllabus */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
            {current.detailedSyllabusHeader}
          </h3>

          <div className="space-y-6">
            {current.sections.map((section, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/50">
                <h4 className="font-serif font-bold text-sm text-slate-950 border-b border-slate-200 pb-2 mb-3">
                  {section.name}
                </h4>
                <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 leading-relaxed">
                  {section.topics.map((topic, tIdx) => (
                    <li key={tIdx} className="pl-1">
                      <span className="relative left-[-2px]">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
