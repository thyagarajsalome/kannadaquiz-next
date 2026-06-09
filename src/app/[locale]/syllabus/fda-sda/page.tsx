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
        ? "KEA FDA & SDA ಪಠ್ಯಕ್ರಮ 2026 | ಸಹಾಯಕ ಹುದ್ದೆಗಳ ಪರೀಕ್ಷಾ ವಿಧಾನ"
        : "KEA FDA & SDA Syllabus 2026 | Assistants Exam Pattern Guide",
    description:
      locale === "kn"
        ? "ಕರ್ನಾಟಕ ಪ್ರಥಮ ದರ್ಜೆ ಸಹಾಯಕಿ (FDA) ಮತ್ತು ದ್ವಿತೀಯ ದರ್ಜೆ ಸಹಾಯಕಿ (SDA) ಹುದ್ದೆಗಳ ನೂತನ ಪಠ್ಯಕ್ರಮ, ಪತ್ರಿಕೆಗಳು ಮತ್ತು ಅಂಕಗಳ ಹಂಚಿಕೆ."
        : "Complete exam pattern and detailed syllabus for KEA First Division Assistant (FDA) and Second Division Assistant (SDA) recruitment.",
    keywords:
      locale === "kn"
        ? ["KEA FDA ಪಠ್ಯಕ್ರಮ", "SDA ಸಿಲಬಸ್ 2026", "ಎಫ್‌ಡಿಎ ಎಸ್‌ಡಿಎ ಪರೀಕ್ಷಾ ವಿವರ", "FDA SDA ಸಿಲಬಸ್"]
        : ["KEA FDA Syllabus", "SDA Syllabus", "FDA SDA Exam Pattern Karnataka"],
    alternates: {
      canonical: `/${locale}/syllabus/fda-sda`,
      languages: {
        kn: "/kn/syllabus/fda-sda",
        en: "/en/syllabus/fda-sda",
      },
    },
  };
}

export default async function FdaSdaSyllabusPage({
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
      title: "KEA FDA & SDA Assistants Exam Syllabus",
      subtitle: "Detailed Syllabus and Marking Scheme for Group-C Assistant Vacancies",
      backLink: "Back to Syllabus Hub",
      structureHeader: "1. FDA / SDA Written Examination Scheme",
      structureText: "The recruitment process consists of three written papers (OMR based). Paper 1 is a compulsory Kannada test for candidates who haven't studied Kannada in school.",
      paperTable: {
        paper: "Paper",
        subject: "Subject / Exam Focus",
        marks: "Max Marks",
        duration: "Duration"
      },
      papers: [
        {
          num: "Paper 1",
          subject: "Compulsory Kannada Language (Descriptive test of 10th standard level. Mandatory to pass with min 50 marks).",
          marks: "150 Marks",
          duration: "2 Hours"
        },
        {
          num: "Paper 2",
          subject: "General Kannada OR General English (Candidates select one. Tests vocabulary, grammar, translation, and sentence structure).",
          marks: "100 Marks",
          duration: "1.5 Hours"
        },
        {
          num: "Paper 3",
          subject: "General Knowledge (Indian polity, geography, history, general science, economics, current affairs, and mental ability).",
          marks: "100 Marks",
          duration: "1.5 Hours"
        }
      ],
      detailedSyllabusHeader: "2. Detailed Paper Syllabus",
      sections: [
        {
          name: "Paper 2: General Kannada Syllabus",
          topics: [
            "Kannada Grammar: Sandhi, Samasa, Kriya, Vibhakti, Tatsama-Tadbhava, Jodu-pada.",
            "Vocabulary: Idioms, proverbs, spelling errors, vocabulary correction.",
            "Passage Reading: Answering questions based on a given Kannada passage.",
            "Words & Meanings: Synonyms, antonyms, and context usage of words."
          ]
        },
        {
          name: "Paper 2: General English Syllabus",
          topics: [
            "English Grammar: Tenses, Prepositions, Conjunctions, Active-Passive Voice, Direct-Indirect Speech.",
            "Vocabulary: Synonyms, Antonyms, Idioms & Phrases, Homophones.",
            "Reading Comprehension: Answering questions based on passages.",
            "Sentence Correction: Spotting errors, spelling corrections, rearranging sentences."
          ]
        },
        {
          name: "Paper 3: General Knowledge Syllabus",
          topics: [
            "Indian Constitution & Polity: Salient features, fundamental rights, central & state legislatures, local governments.",
            "Indian & Karnataka History: Important dynasties (Maurya, Gupta, Kadamba, Vijayanagar), freedom struggle, post-independence India.",
            "Indian & Karnataka Geography: Landforms, rivers, agriculture, soils, climates, mineral resources.",
            "General Science: Chemistry, physics, biology in daily application, environmental science, and basic computers.",
            "Current Affairs: Key developments in sports, science, technology, government schemes, summits, and national importance events."
          ]
        }
      ],
      strategyHeader: "💡 FDA & SDA Prep Strategies",
      strategies: [
        "Select Language Smartly: Spend time on Paper 2. General Kannada/English is highly scoring and directly determines your rank.",
        "Solve Previous Papers: KEA repeats several questions in GK and grammar papers. Practicing the last 5 years' papers is crucial.",
        "Study Karnataka Govt Schemes: Keep a list of all current state guarantee schemes, budget announcements, and rural development plans.",
        "Daily Current Affairs: Dedicate 20 minutes to read daily national and state news summaries to cover GK Paper current events."
      ]
    },
    kn: {
      title: "KEA FDA ಮತ್ತು SDA ಸಹಾಯಕ ಪರೀಕ್ಷಾ ಪಠ್ಯಕ್ರಮ",
      subtitle: "ಗ್ರೂಪ್-ಸಿ ಸಹಾಯಕ ಹುದ್ದೆಗಳ ಲಿಖಿತ ಪರೀಕ್ಷೆಯ ವಿವರವಾದ ಪಠ್ಯಕ್ರಮ ಮತ್ತು ಅಂಕಗಳ ಹಂಚಿಕೆ",
      backLink: "ಪಠ್ಯಕ್ರಮ ಮುಖಪುಟಕ್ಕೆ",
      structureHeader: "1. FDA / SDA ಲಿಖಿತ ಪರೀಕ್ಷಾ ವಿಧಾನ",
      structureText: "ನೇಮಕಾತಿ ಪ್ರಕ್ರಿಯೆಯು OMR ಆಧಾರಿತ ಮೂರು ಪತ್ರಿಕೆಗಳನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ. ಕನ್ನಡ ಮಾಧ್ಯಮದಲ್ಲಿ ಓದದ ಅಭ್ಯರ್ಥಿಗಳಿಗೆ ಪತ್ರಿಕೆ 1 ಕಡ್ಡಾಯ ಕನ್ನಡ ಪರೀಕ್ಷೆಯಾಗಿರುತ್ತದೆ.",
      paperTable: {
        paper: "ಪತ್ರಿಕೆ",
        subject: "ವಿಷಯಗಳು / ಪರೀಕ್ಷಾ ವಿವರಣೆ",
        marks: "ಗರಿಷ್ಠ ಅಂಕಗಳು",
        duration: "ಅವಧಿ"
      },
      papers: [
        {
          num: "ಪತ್ರಿಕೆ 1",
          subject: "ಕಡ್ಡಾಯ ಕನ್ನಡ ಭಾಷೆ (ಎಸ್.ಎಸ್.ಎಲ್.ಸಿ ಮಟ್ಟದ ಭಾಷಾ ಜ್ಞಾನ ಪರೀಕ್ಷೆ. ಉತ್ತೀರ್ಣರಾಗಲು ಕನಿಷ್ಠ 50 ಅಂಕಗಳನ್ನು ಪಡೆಯುವುದು ಕಡ್ಡಾಯ).",
          marks: "150 ಅಂಕಗಳು",
          duration: "2 ಗಂಟೆಗಳು"
        },
        {
          num: "ಪತ್ರಿಕೆ 2",
          subject: "ಸಾಮಾನ್ಯ ಕನ್ನಡ ಅಥವಾ ಸಾಮಾನ್ಯ ಇಂಗ್ಲಿಷ್ (ಅಭ್ಯರ್ಥಿಗಳು ಒಂದನ್ನು ಆರಿಸಿಕೊಳ್ಳಬೇಕು. ವ್ಯಾಕರಣ, ಶಬ್ದಕೋಶ, ಭಾಷಾಂತರ ಸಾಮರ್ಥ್ಯ ಪರೀಕ್ಷೆ).",
          marks: "100 ಅಂಕಗಳು",
          duration: "1.5 ಗಂಟೆಗಳು"
        },
        {
          num: "ಪತ್ರಿಕೆ 3",
          subject: "ಸಾಮಾನ್ಯ ಜ್ಞಾನ (ಸಂವಿಧಾನ, ಭೂಗೋಳ, ಇತಿಹಾಸ, ವಿಜ್ಞಾನ, ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು, ಅರ್ಥಶಾಸ್ತ್ರ ಮತ್ತು ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ).",
          marks: "100 ಅಂಕಗಳು",
          duration: "1.5 ಗಂಟೆಗಳು"
        }
      ],
      detailedSyllabusHeader: "2. ವಿವರವಾದ ಪತ್ರಿಕೆಗಳ ಸಿಲಬಸ್",
      sections: [
        {
          name: "ಪತ್ರಿಕೆ 2: ಸಾಮಾನ್ಯ ಕನ್ನಡ ಪಠ್ಯಕ್ರಮ",
          topics: [
            "ಕನ್ನಡ ವ್ಯಾಕರಣ: ಸಂಧಿ, ಸಮಾಸ, ಕ್ರಿಯಾಪದ, ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು, ತತ್ಸಮ-ತದ್ಭವ, ಜೋಡುನುಡಿ.",
            "ಶಬ್ದಕೋಶ: ಗಾದೆ ಮಾತುಗಳು, ನುಡಿಗಟ್ಟುಗಳು, ತಪ್ಪು ಪದಗಳ ತಿದ್ದುಪಡಿ, ಶಬ್ದಗಳ ಸೂಕ್ತ ಬಳಕೆ.",
            "ಗ್ರಹಿಕೆ (Comprehension): ನೀಡಲಾದ ಕನ್ನಡ ಗದ್ಯಭಾಗವನ್ನು ಓದಿ ಕೇಳಲಾದ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸುವುದು.",
            "ಪದಗಳ ಅರ್ಥ: ಸಮಾನಾರ್ಥಕ ಪದಗಳು, ವಿರುದ್ಧಾರ್ಥಕ ಪದಗಳು, ನಾನಾರ್ಥಗಳು."
          ]
        },
        {
          name: "ಪತ್ರಿಕೆ 2: ಸಾಮಾನ್ಯ ಇಂಗ್ಲಿಷ್ ಪಠ್ಯಕ್ರಮ",
          topics: [
            "ಇಂಗ್ಲಿಷ್ ವ್ಯಾಕರಣ: Tenses, Prepositions, Conjunctions, Active-Passive Voice, Direct-Indirect Speech.",
            "ಶಬ್ದಕೋಶ: Synonyms, Antonyms, Idioms & Phrases, Homophones.",
            "ಗ್ರಹಿಕೆ: ನೀಡಲಾದ ಇಂಗ್ಲಿಷ್ ಗದ್ಯ ಭಾಗವನ್ನು ಓದಿ ಕೇಳಲಾದ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸುವುದು.",
            "ವಾಕ್ಯ ದೋಷ ತಿದ್ದುಪಡಿ: Spotting errors, spelling corrections, rearranging sentences."
          ]
        },
        {
          name: "ಪತ್ರಿಕೆ 3: ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಪಠ್ಯಕ್ರಮ",
          topics: [
            "ಭಾರತ ಸಂವಿಧಾನ ಮತ್ತು ರಾಜಕೀಯ: ಪ್ರಮುಖ ಲಕ್ಷಣಗಳು, ಮೂಲಭೂತ ಹಕ್ಕುಗಳು, ಸಂಸತ್ ಮತ್ತು ರಾಜ್ಯ ಶಾಸಕಾಂಗಗಳು, ಸ್ಥಳೀಯ ಸರ್ಕಾರಗಳು.",
            "ಭಾರತ ಮತ್ತು ಕರ್ನಾಟಕದ ಇತಿಹಾಸ: ಪ್ರಮುಖ ರಾಜವಂಶಗಳು (ಮೌರ್ಯ, ಗುಪ್ತ, ಕದಂಬ, ವಿಜಯನಗರ), ಸ್ವಾತಂತ್ರ್ಯ ಸಂಗ್ರಾಮ, ಸ್ವಾತಂತ್ರ್ಯೋತ್ತರ ಭಾರತ.",
            "ಭೂಗೋಳಶಾಸ್ತ್ರ: ಭಾರತ ಮತ್ತು ಕರ್ನಾಟಕದ ಪ್ರಾಕೃತಿಕ ಲಕ್ಷಣಗಳು, ನದಿಗಳು, ಕೃಷಿ, ಮಣ್ಣು, ಹವಾಮಾನ, ಖನಿಜ ಸಂಪನ್ಮೂಲಗಳು.",
            "ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ: ರಸಾಯನಶಾಸ್ತ್ರ, ಭೌತಶಾಸ್ತ್ರ, ಜೀವವಿಜ್ಞಾನದ ದೈನಂದಿನ ಅನ್ವಯಗಳು, ಪರಿಸರ ವಿಜ್ಞಾನ ಮತ್ತು ಮೂಲಭೂತ ಕಂಪ್ಯೂಟರ್ ಜ್ಞಾನ.",
            "ಪ್ರಚಲಿತ ವಿದ್ಯಾಮಾನಗಳು: ಕ್ರೀಡೆ, ವಿಜ್ಞಾನ, ತಂತ್ರಜ್ಞಾನ, ಸರ್ಕಾರದ ಪ್ರಮುಖ ಯೋಜನೆಗಳು, ಶೃಂಗಸಭೆಗಳು ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಪ್ರಾಮುಖ್ಯತೆಯ ವಿದ್ಯಮಾನಗಳು."
          ]
        }
      ],
      strategyHeader: "💡 FDA & SDA ಪರೀಕ್ಷಾ ಸಿದ್ಧತಾ ತಂತ್ರಗಳು",
      strategies: [
        "ಭಾಷಾ ಪತ್ರಿಕೆ ನಿರ್ಣಾಯಕ: ಪತ್ರಿಕೆ 2 ರ ಸಾಮಾನ್ಯ ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್ ಮೇಲೆ ಹೆಚ್ಚು ಗಮನಹರಿಸಿ. ಈ ಪತ್ರಿಕೆಯಲ್ಲಿ ಹೆಚ್ಚು ಅಂಕ ಗಳಿಸುವುದು ನಿಮ್ಮ ರ‍್ಯಾಂಕ್ ನಿರ್ಧರಿಸುತ್ತದೆ.",
        "ಹಳೆಯ ಪತ್ರಿಕೆಗಳನ್ನು ಬಿಡಿಸಿ: KEA ವ್ಯಾಕರಣ ಮತ್ತು ಜಿ.ಕೆ ಪರೀಕ್ಷೆಗಳಲ್ಲಿ ಹಿಂದಿನ ಪ್ರಶ್ನೆಗಳನ್ನು ಪುನರಾವರ್ತಿಸುತ್ತದೆ. ಕೊನೆಯ 5 ವರ್ಷಗಳ ಪತ್ರಿಕೆಗಳ ಅಭ್ಯಾಸ ಬಹಳ ಮುಖ್ಯ.",
        "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಅಧ್ಯಯನ: ರಾಜ್ಯದ ಗ್ಯಾರಂಟಿ ಯೋಜನೆಗಳು, ಬಜೆಟ್ ಘೋಷಣೆಗಳು ಮತ್ತು ಗ್ರಾಮೀಣಾಭಿವೃದ್ಧಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ನಿಖರ ಮಾಹಿತಿ ಹೊಂದಿರಿ.",
        "ಪ್ರತಿದಿನದ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನ: ಜಿ.ಕೆ ಪತ್ರಿಕೆಗಾಗಿ ದಿನನಿತ್ಯದ ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ರಾಜ್ಯ ಮಟ್ಟದ ಪ್ರಮುಖ ವಿದ್ಯಮಾನಗಳ ಸಾರಾಂಶವನ್ನು ಕನಿಷ್ಠ 20 ನಿಮಿಷಗಳ ಕಾಲ ಓದಿ."
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
          <span className="bg-rose-100 text-rose-850 px-3 py-1 rounded text-xs font-extrabold uppercase tracking-wide">
            KEA Assistants Recruitment
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold mt-3 text-slate-900 leading-tight">
            {current.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {current.subtitle}
          </p>
        </div>

        {/* 1. Written Scheme */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-rose-500 rounded-full inline-block"></span>
            {current.structureHeader}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {current.structureText}
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

        {/* 2. Detailed Syllabus */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-rose-500 rounded-full inline-block"></span>
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

        {/* 3. Prep Strategy */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
          <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
            {current.strategyHeader}
          </h3>
          <ul className="space-y-3.5 text-xs text-slate-200 leading-relaxed">
            {current.strategies.map((strategy, sIdx) => (
              <li key={sIdx} className="flex gap-2">
                <span className="text-rose-400 font-extrabold">✔</span>
                <span>{strategy}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
