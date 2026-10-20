import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { isLocale, type Locale } from "@/lib/locales";
import { type SolvedPaperData } from "@/components/papers/SolvedPaperViewer";

export const revalidate = 86400;

function getAllPapers(): SolvedPaperData[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "previous-papers.json");
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return [];
  }
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
        ? "ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು | KPSC, KSP, FDA, SDA Solved Papers"
        : "Karnataka Competitive Exams Solved Previous Question Papers | KPSC, KSP, FDA, SDA",
    description:
      locale === "kn"
        ? "KPSC KAS, ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್, PSI, FDA, SDA ಪರೀಕ್ಷೆಗಳ ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು, ಅಧಿಕೃತ ಕೀ ಉತ್ತರಗಳು ಮತ್ತು ವಿವರಣೆಗಳು. ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಉಚಿತವಾಗಿ ಅಭ್ಯಾಸ ಮಾಡಿ."
        : "Official solved previous year question papers for KPSC KAS, Police Constable, PSI, FDA, and SDA exams with Kannada explanations.",
    alternates: {
      canonical: `/${locale}/papers`,
      languages: {
        kn: "/kn/papers",
        en: "/en/papers",
      },
    },
  };
}

export default async function PapersIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const papers = getAllPapers();

  return (
    <div className="bg-[var(--background)] min-h-screen py-8 md:py-12">
      <div className="kq-container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-amber-200 mb-3">
            <span>📚</span>
            <span>{locale === "kn" ? "ಅಧಿಕೃತ ಪ್ರಶ್ನೋತ್ತರಗಳು" : "Solved Question Papers"}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[var(--primary)] leading-tight">
            {locale === "kn"
              ? "ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು (Solved Papers)"
              : "Previous Year Question Papers (Solved with Explanations)"}
          </h1>
          <p className="text-[var(--muted)] text-sm md:text-base mt-3 max-w-2xl mx-auto">
            {locale === "kn"
              ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಪರೀಕ್ಷೆಗಳ ಅಧಿಕೃತ ಪ್ರಶ್ನೆಗಳು, ವಿವರಣಾತ್ಮಕ ಕೀ ಉತ್ತರಗಳು ಮತ್ತು ಉಚಿತ ಮಾಕ್ ಟೆಸ್ಟ್. ಕೇವಲ PDF ಡೌನ್‌ಲೋಡ್ ಅಲ್ಲದೇ ವೆಬ್‌ನಲ್ಲೇ ಆನ್‌ಲೈನ್ ಸಾಲ್ವ್ ಮಾಡಿ."
              : "Practice real past exam papers interactively with step-by-step explanations in Kannada and English."}
          </p>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {papers.map((paper) => (
            <Link
              key={paper.slug}
              href={`/${locale}/papers/${paper.slug}`}
              className="group kq-card p-6 rounded-2xl border border-[var(--border)] bg-white shadow-xs hover:shadow-md hover:border-[var(--secondary)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                    {locale === "kn" ? paper.examNameKn : paper.examNameEn}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {paper.year}
                  </span>
                </div>
                <h2 className="font-serif text-lg font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors leading-snug mb-2">
                  {locale === "kn" ? paper.paperTitleKn : paper.paperTitleEn}
                </h2>
                <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed mb-4">
                  {locale === "kn" ? paper.metaDescriptionKn : paper.metaDescriptionEn}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--border)] text-xs font-bold text-[var(--secondary)]">
                <span>{paper.totalQuestions} {locale === "kn" ? "ಪ್ರಶ್ನೆಗಳು & ವಿವರಣೆ" : "Questions & Explanations"}</span>
                <span className="group-hover:translate-x-1 transition-transform">ಪತ್ರಿಕೆ ಬಿಡಿಸಿ ➔</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="p-6 md:p-8 rounded-2xl bg-amber-50/60 border border-amber-200">
          <h3 className="font-serif text-lg font-bold text-amber-950 mb-2">
            {locale === "kn"
              ? "ಹಿಂದಿನ ವರ್ಷದ ಪತ್ರಿಕೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡುವುದು ಏಕೆ ಮುಖ್ಯ?"
              : "Why practicing previous year question papers is crucial?"}
          </h3>
          <ul className="text-xs md:text-sm text-amber-900 space-y-2 list-disc pl-5 leading-relaxed">
            <li>
              {locale === "kn"
                ? "ಪರೀಕ್ಷಾ ಮಾದರಿ, ಪ್ರಶ್ನೆಗಳ ಕಾಠಿಣ್ಯತೆ ಮತ್ತು ಅಂಕಗಳ ಹಂಚಿಕೆಯನ್ನು ನಿಖರವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬಹುದು."
                : "Understand exam patterns, question difficulty levels, and syllabus weightage."}
            </li>
            <li>
              {locale === "kn"
                ? "ಪ್ರತಿ ವರ್ಷ ಸುಮಾರು 20-30% ಪ್ರಶ್ನೆಗಳು ಅಥವಾ ಅದೇ ಪರಿಕಲ್ಪನೆಗಳು (Concepts) ಪುನರಾವರ್ತನೆಯಾಗುತ್ತವೆ."
                : "20-30% of core concepts repeat across consecutive examination cycles."}
            </li>
            <li>
              {locale === "kn"
                ? "ಪ್ರತಿ ಪ್ರಶ್ನೆಗೂ ನೀಡಿರುವ ವಿವರಣೆಯನ್ನು ಓದುವುದರಿಂದ ಸಂಬಂಧಿತ ವಿಷಯಗಳ ಸಮಗ್ರ ಅಧ್ಯಯನವಾಗುತ್ತದೆ."
                : "Detailed explanations give 360-degree clarity on surrounding GK and subject facts."}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
