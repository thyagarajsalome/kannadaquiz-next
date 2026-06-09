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
        ? "KPSC PSI ಪಠ್ಯಕ್ರಮ 2026 | ಪೊಲೀಸ್ ಸಬ್-ಇನ್ಸ್‌ಪೆಕ್ಟರ್ ಪರೀಕ್ಷಾ ವಿಧಾನ"
        : "KPSC PSI Syllabus 2026 | Police Sub-Inspector Exam Pattern Guide",
    description:
      locale === "kn"
        ? "ಕರ್ನಾಟಕ ಪೊಲೀಸ್ ಸಬ್-ಇನ್ಸ್‌ಪೆಕ್ಟರ್ (PSI) ಪರೀಕ್ಷೆಯ ಪಠ್ಯಕ್ರಮ, ಪತ್ರಿಕೆ-1 (ಪ್ರಬಂಧ, ಭಾಷಾಂತರ) ಮತ್ತು ಪತ್ರಿಕೆ-2 ರ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ."
        : "Download the latest exam pattern and detailed syllabus for KPSC Police Sub-Inspector (PSI) recruitment. Includes physical test standards and written exam details.",
    keywords:
      locale === "kn"
        ? ["KPSC PSI ಪಠ್ಯಕ್ರಮ", "PSI ಸಿಲಬಸ್ 2026", "ಪೊಲೀಸ್ ಸಬ್ ಇನ್ಸ್ಪೆಕ್ಟರ್ ಸಿಲಬಸ್", "PSI ಪರೀಕ್ಷಾ ವಿಧಾನ"]
        : ["KPSC PSI Syllabus", "Police Sub-Inspector Syllabus", "Karnataka PSI Exam Pattern"],
    alternates: {
      canonical: `/${locale}/syllabus/psi`,
      languages: {
        kn: "/kn/syllabus/psi",
        en: "/en/syllabus/psi",
      },
    },
  };
}

export default async function PsiSyllabusPage({
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
      title: "KPSC PSI (Police Sub-Inspector) Exam Syllabus",
      subtitle: "Detailed Exam Pattern, Physical Tests, Written Papers, and Mark Distribution",
      backLink: "Back to Syllabus Hub",
      physicalHeader: "1. Physical Standard (PST) & Endurance Test (ET)",
      physicalText: "Candidates must qualify in the physical endurance and standard tests before attending the written examination. These tests are qualifying in nature.",
      physicalDetails: [
        { test: "Endurance Test (Men)", standard: "1600 Meters Run in 6.5 Mins | Long Jump: 3.80 Meters | High Jump: 1.20 Meters | Shot Put (7.26kg): 5.60 Meters" },
        { test: "Endurance Test (Women/Ex-Servicemen)", standard: "400 Meters Run in 2 Mins | Long Jump: 2.50 Meters | High Jump: 0.90 Meters | Shot Put (4kg): 3.75 Meters" },
        { test: "Physical Standards (Men)", standard: "Height: Min 168 cm | Chest: 86 cm (fully expanded with minimum 5 cm expansion)" },
        { test: "Physical Standards (Women)", standard: "Height: Min 157 cm | Weight: Min 45 kg" }
      ],
      writtenHeader: "2. Written Examination Pattern",
      writtenIntro: "The written exam consists of two papers conducted on the same day. Paper 1 is descriptive, and Paper 2 is objective (MCQs).",
      paperTable: {
        paper: "Paper",
        type: "Test Type & Subjects",
        marks: "Max Marks",
        duration: "Duration"
      },
      papers: [
        {
          num: "Paper 1",
          subject: "Descriptive Paper (Essay writing in English/Kannada - 20 Marks, Translation from English to Kannada and vice-versa - 20 Marks, Precis Writing - 10 Marks).",
          marks: "50 Marks",
          duration: "1.5 Hours"
        },
        {
          num: "Paper 2",
          subject: "Objective Paper (150 Multiple Choice Questions covering Mental Ability, General Science, Indian Geography, Indian History, Indian Constitution, and Current Affairs).",
          marks: "150 Marks",
          duration: "1.5 Hours"
        }
      ],
      detailedSyllabusHeader: "3. Detailed Section-wise Syllabus",
      sections: [
        {
          name: "Paper 1: Descriptive Syllabus Details",
          topics: [
            "Essay Writing: Topics of current socio-economic issues, environment, science, technology, and administration in Karnataka/India.",
            "Translation: Translating a passage from English to Kannada, and translating another passage from Kannada to English.",
            "Precis Writing: Summarizing a given long passage in clean, concise sentences in either Kannada or English (1/3rd of original length)."
          ]
        },
        {
          name: "Paper 2: General Knowledge & mental Ability",
          topics: [
            "Current affairs (National and State news, awards, sports, international agreements).",
            "Indian Constitution (Preamble, Directive Principles, Parliamentary system, amendments).",
            "Indian History (Ancient, Medieval, Modern period, and freedom struggle with special focus on Karnataka dynasties).",
            "Indian Geography (Rivers, climate, physical features, wildlife sanctuaries).",
            "General Science (Everyday science, technology, defense achievements).",
            "Mental Ability & Aptitude (Blood relations, coding-decoding, number series, direction tests)."
          ]
        }
      ],
      strategyHeader: "💡 PSI 2026 Preparation Tips",
      strategies: [
        "Consistent Physical Prep: Do not leave physical standard training for the last minute. Maintain physical fitness daily alongside studies.",
        "Translation Practice: Spend 30 minutes daily translating paragraphs between Kannada and English, as this is where many aspirants struggle to score in Paper 1.",
        "Solve Previous Papers: Bubble and solve previous years' PSI Paper 2 questions under strict 90-minute time limits.",
        "Focus on Mental Ability: Mental ability carries about 15-20 questions in Paper 2; secure full marks here through regular practice."
      ]
    },
    kn: {
      title: "KPSC PSI (ಪೊಲೀಸ್ ಸಬ್-ಇನ್ಸ್‌ಪೆಕ್ಟರ್) ಪರೀಕ್ಷಾ ಪಠ್ಯಕ್ರಮ",
      subtitle: "ದೈಹಿಕ ಪರೀಕ್ಷೆಗಳು, ಲಿಖಿತ ಪತ್ರಿಕೆಗಳು ಮತ್ತು ಅಂಕಗಳ ಹಂಚಿಕೆಯ ಸಮಗ್ರ ವಿವರ",
      backLink: "ಪಠ್ಯಕ್ರಮ ಮುಖಪುಟಕ್ಕೆ",
      physicalHeader: "1. ದೈಹಿಕ ದಕ್ಷತೆ (ET) ಮತ್ತು ದೇಹದಾರ್ಢ್ಯತೆ ಪರೀಕ್ಷೆ (PST)",
      physicalText: "ಅಭ್ಯರ್ಥಿಗಳು ಲಿಖಿತ ಪರೀಕ್ಷೆಗೆ ಹಾಜರಾಗುವ ಮುನ್ನ ಕಡ್ಡಾಯವಾಗಿ ದೈಹಿಕ ಪರೀಕ್ಷೆಗಳಲ್ಲಿ ಉತ್ತೀರ್ಣರಾಗಬೇಕು. ಈ ಪರೀಕ್ಷೆಗಳು ಕೇವಲ ಅರ್ಹತಾ ಸ್ವರೂಪದ್ದಾಗಿರುತ್ತವೆ.",
      physicalDetails: [
        { test: "ದೈಹಿಕ ದಕ್ಷತೆ ಪರೀಕ್ಷೆ (ಪುರುಷರು)", standard: "1600 ಮೀಟರ್ ಓಟ: 6.5 ನಿಮಿಷಗಳಲ್ಲಿ | ಉದ್ದ ಜಿಗಿತ: 3.80 ಮೀಟರ್ | ಎತ್ತರ ಜಿಗಿತ: 1.20 ಮೀಟರ್ | ಗುಂಡು ಎಸೆಯುವಿಕೆ (7.26 ಕೆಜಿ): 5.60 ಮೀಟರ್" },
        { test: "ದೈಹಿಕ ದಕ್ಷತೆ ಪರೀಕ್ಷೆ (ಮಹಿಳೆಯರು/ಮಾಜಿ ಸೈನಿಕರು)", standard: "400 ಮೀಟರ್ ಓಟ: 2 ನಿಮಿಷಗಳಲ್ಲಿ | ಉದ್ದ ಜಿಗಿತ: 2.50 ಮೀಟರ್ | ಎತ್ತರ ಜಿಗಿತ: 0.90 ಮೀಟರ್ | ಗುಂಡು ಎಸೆಯುವಿಕೆ (4 ಕೆಜಿ): 3.75 ಮೀಟರ್" },
        { test: "ದೇಹದಾರ್ಢ್ಯತೆ ಮಾನದಂಡ (ಪುರುಷರು)", standard: "ಎತ್ತರ: ಕನಿಷ್ಠ 168 ಸೆಂ.ಮೀ | ಎದೆ ಸುತ್ತಳತೆ: 86 ಸೆಂ.ಮೀ (ಕನಿಷ್ಠ 5 ಸೆಂ.ಮೀ ವಿಸ್ತರಣೆಯೊಂದಿಗೆ)" },
        { test: "ದೇಹದಾರ್ಢ್ಯತೆ ಮಾನದಂಡ (ಮಹಿಳೆಯರು)", standard: "ಎತ್ತರ: ಕನಿಷ್ಠ 157 ಸೆಂ.ಮೀ | ತೂಕ: ಕನಿಷ್ಠ 45 ಕೆಜಿ" }
      ],
      writtenHeader: "2. ಲಿಖಿತ ಪರೀಕ್ಷಾ ವಿಧಾನ",
      writtenIntro: "ಲಿಖಿತ ಪರೀಕ್ಷೆಯು ಒಂದೇ ದಿನ ನಡೆಯುವ ಎರಡು ಪತ್ರಿಕೆಗಳನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ. ಪತ್ರಿಕೆ 1 ವಿವರಣಾತ್ಮಕವಾಗಿದ್ದು, ಪತ್ರಿಕೆ 2 ವಸ್ತುನಿಷ್ಠ ಮಾದರಿಯದ್ದಾಗಿರುತ್ತದೆ (MCQ).",
      paperTable: {
        paper: "ಪತ್ರಿಕೆ",
        type: "ಪರೀಕ್ಷಾ ಮಾದರಿ ಮತ್ತು ವಿಷಯಗಳು",
        marks: "ಗರಿಷ್ಠ ಅಂಕಗಳು",
        duration: "ಅವಧಿ"
      },
      papers: [
        {
          num: "ಪತ್ರಿಕೆ 1",
          subject: "ವಿವರಣಾತ್ಮಕ ಪತ್ರಿಕೆ (ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಪ್ರಬಂಧ ಬರವಣಿಗೆ - 20 ಅಂಕಗಳು, ಕನ್ನಡದಿಂದ ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಿಂದ ಕನ್ನಡ ಭಾಷಾಂತರ - 20 ಅಂಕಗಳು, ಸಂಕ್ಷಿಪ್ತ ಬರಹ - 10 ಅಂಕಗಳು).",
          marks: "50 ಅಂಕಗಳು",
          duration: "1.5 ಗಂಟೆಗಳು"
        },
        {
          num: "ಪತ್ರಿಕೆ 2",
          subject: "ವಸ್ತುನಿಷ್ಠ ಪತ್ರಿಕೆ (ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಮತ್ತು ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯದ 150 ಬಹು ಆಯ್ಕೆ ಪ್ರಶ್ನೆಗಳು - MCQs).",
          marks: "150 ಅಂಕಗಳು",
          duration: "1.5 ಗಂಟೆಗಳು"
        }
      ],
      detailedSyllabusHeader: "3. ವಿವರವಾದ ಪಠ್ಯಕ್ರಮ ಮಾಹಿತಿ",
      sections: [
        {
          name: "ಪತ್ರಿಕೆ 1: ವಿವರಣಾತ್ಮಕ ಸಿಲಬಸ್ ವಿವರಗಳು",
          topics: [
            "ಪ್ರಬಂಧ ಬರವಣಿಗೆ: ಕರ್ನಾಟಕ/ಭಾರತದ ಪ್ರಸ್ತುತ ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಸವಾಲುಗಳು, ಪರಿಸರ, ವಿಜ್ಞಾನ, ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಆಡಳಿತ ಸುಧಾರಣೆಗಳ ಮೇಲಿನ ಪ್ರಬಂಧ.",
            "ಭಾಷಾಂತರ: ಇಂಗ್ಲಿಷ್‌ನಿಂದ ಕನ್ನಡಕ್ಕೆ ಮತ್ತು ಕನ್ನಡದಿಂದ ಇಂಗ್ಲಿಷ್‌ಗೆ ತಲಾ ಒಂದು ಪ್ಯಾರಾಗ್ರಾಫ್ ಭಾಷಾಂತರಿಸುವುದು.",
            "ಸಂಕ್ಷಿಪ್ತ ಬರಹ: ಕೊಟ್ಟಿರುವ ದೊಡ್ಡ ಪ್ಯಾರಾಗ್ರಾಫ್ ಅನ್ನು ಅದರ ಮೂರನೇ ಒಂದು ಭಾಗಕ್ಕೆ (1/3) ಕುಗ್ಗಿಸಿ ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಅರ್ಥಬದ್ಧವಾಗಿ ಬರೆಯುವುದು."
          ]
        },
        {
          name: "ಪತ್ರಿಕೆ 2: ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಮತ್ತು ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ",
          topics: [
            "ಪ್ರಚಲಿತ ವಿದ್ಯಾಮಾನಗಳು (ರಾಷ್ಟ್ರೀಯ, ಅಂತರರಾಷ್ಟ್ರೀಯ ಮತ್ತು ರಾಜ್ಯ ಮಟ್ಟದ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು, ಕ್ರೀಡೆಗಳು, ಪ್ರಶಸ್ತಿಗಳು).",
            "ಭಾರತ ಸಂವಿಧಾನ (ಪೀಠಿಕೆ, ಮೂಲಭೂತ ಹಕ್ಕುಗಳು, ಸಂಸದೀಯ ವ್ಯವಸ್ಥೆ, ತಿದ್ದುಪಡಿಗಳು).",
            "ಭಾರತದ ಇತಿಹಾಸ (ಪ್ರಾಚೀನ, ಮಧ್ಯಕಾಲೀನ ಮತ್ತು ಆಧುನಿಕ ಭಾರತದ ಇತಿಹಾಸ ಹಾಗೂ ಸ್ವಾತಂತ್ರ್ಯ ಚಳುವಳಿ).",
            "ಭೂಗೋಳಶಾಸ್ತ್ರ (ಭಾರತ ಮತ್ತು ಕರ್ನಾಟಕದ ನೈಸರ್ಗಿಕ ಲಕ್ಷಣಗಳು, ಹವಾಮಾನ, ಪ್ರಸಿದ್ಧ ವನ್ಯಜೀವಿ ಧಾಮಗಳು).",
            "ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ (ದೈನಂದಿನ ವಿಜ್ಞಾನ, ರಕ್ಷಣೆ, ಬಾಹ್ಯಾಕಾಶ ಕ್ಷೇತ್ರಗಳ ಸಂಶೋಧನೆಗಳು).",
            "ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ (ರಕ್ತಸಂಬಂಧಗಳು, ಕೋಡಿಂಗ್-ಡಿಕೋಡಿಂಗ್, ಸಂಖ್ಯಾ ಸರಣಿ, ದಿಕ್ಕಿನ ಪರೀಕ್ಷೆಗಳು)."
          ]
        }
      ],
      strategyHeader: "💡 PSI 2026 ಸಿದ್ಧತಾ ತಂತ್ರಗಳು",
      strategies: [
        "ದೈಹಿಕ ತರಬೇತಿ ನಿರಂತರವಾಗಿರಲಿ: ದೈಹಿಕ ಸಾಮರ್ಥ್ಯ ಪರೀಕ್ಷೆಯನ್ನು ಕೊನೆಯ ಕ್ಷಣಕ್ಕೆ ತಳ್ಳಬೇಡಿ. ಪ್ರತಿದಿನ ಓದಿನ ಜೊತೆಗೆ ಓಟ, ಉದ್ದ ಜಿಗಿತ ಅಭ್ಯಾಸ ಮಾಡಿ.",
        "ಭಾಷಾಂತರ ಅಭ್ಯಾಸ: ದಿನಕ್ಕೆ ಕನಿಷ್ಠ 30 ನಿಮಿಷ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ನಡುವೆ ಪ್ಯಾರಾಗ್ರಾಫ್ ಭಾಷಾಂತರ ಮಾಡುವುದನ್ನು ರೂಢಿಸಿಕೊಳ್ಳಿ, ಇದರಿಂದ ಪತ್ರಿಕೆ 1 ರಲ್ಲಿ ಹೆಚ್ಚು ಅಂಕ ಪಡೆಯಬಹುದು.",
        "ಹಳೆಯ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳನ್ನು ಬಿಡಿಸಿ: ಹಳೆಯ ಪರೀಕ್ಷಾ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳನ್ನು ತಲಾ 90 ನಿಮಿಷಗಳ ನಿಗದಿತ ಸಮಯದಲ್ಲಿ ಬಿಡಿಸಿ ಸಮಯ ನಿರ್ವಹಣೆ ಕಲಿಯಿರಿ.",
        "ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ ಅಭ್ಯಾಸ: ಪತ್ರಿಕೆ 2 ರಲ್ಲಿ ಸುಮಾರು 15 ರಿಂದ 20 ಪ್ರಶ್ನೆಗಳು ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯದ ಮೇಲೆ ಬರುತ್ತವೆ. ನಿಯಮಿತ ಅಭ್ಯಾಸದಿಂದ ಈ ಅಂಕಗಳನ್ನು ಸುಲಭವಾಗಿ ಗಳಿಸಬಹುದು."
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
          <span className="bg-orange-100 text-orange-850 px-3 py-1 rounded text-xs font-extrabold uppercase tracking-wide">
            KPSC Police Jobs
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold mt-3 text-slate-900 leading-tight">
            {current.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {current.subtitle}
          </p>
        </div>

        {/* 1. Physical Test */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
            {current.physicalHeader}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {current.physicalText}
          </p>
          <div className="space-y-3">
            {current.physicalDetails.map((pd, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex flex-col md:flex-row justify-between gap-1">
                <span className="font-bold text-slate-800 md:w-1/3 shrink-0">{pd.test}</span>
                <span className="text-slate-600 leading-relaxed">{pd.standard}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Written Exam Pattern */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 mb-8 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
            {current.writtenHeader}
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            {current.writtenIntro}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
                  <th className="py-3 px-4 w-24">{current.paperTable.paper}</th>
                  <th className="py-3 px-4">{current.paperTable.type}</th>
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
            <span className="w-1.5 h-6 bg-orange-500 rounded-full inline-block"></span>
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
                <span className="text-orange-400 font-extrabold">✔</span>
                <span>{strategy}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
