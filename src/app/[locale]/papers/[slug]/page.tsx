import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import { isLocale, type Locale } from "@/lib/locales";
import { SolvedPaperViewer, type SolvedPaperData } from "@/components/papers/SolvedPaperViewer";

export const revalidate = 86400; // Cache 24 hours

function getAllPapers(): SolvedPaperData[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "previous-papers.json");
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return [];
  }
}

export function generateStaticParams() {
  const papers = getAllPapers();
  const params: { locale: string; slug: string }[] = [];
  ["kn", "en"].forEach((locale) => {
    papers.forEach((p) => {
      params.push({ locale, slug: p.slug });
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  const papers = getAllPapers();
  const paper = papers.find((p) => p.slug === slug);
  if (!paper) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }

  const title = locale === "kn" ? paper.paperTitleKn : paper.paperTitleEn;
  const description = locale === "kn" ? paper.metaDescriptionKn : paper.metaDescriptionEn;

  return {
    title: `${title} | KannadaQuiz`,
    description,
    keywords: [
      paper.examNameEn,
      paper.examNameKn,
      `${paper.examNameKn} ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ`,
      `${paper.year} solved question paper`,
      "KPSC previous year paper Kannada",
      "KSP police constable key answers",
      "FDA SDA Kannada paper",
    ],
    alternates: {
      canonical: `/${locale}/papers/${slug}`,
      languages: {
        kn: `/kn/papers/${slug}`,
        en: `/en/papers/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://kannadaquiz.in/${locale}/papers/${slug}`,
      siteName: "KannadaQuiz",
      locale: locale === "kn" ? "kn_IN" : "en_US",
      type: "article",
    },
  };
}

export default async function SolvedPaperPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  const papers = getAllPapers();
  const paper = papers.find((p) => p.slug === slug);
  if (!paper) {
    notFound();
  }

  // Schema.org Quiz + QA Page Structured Data for Rich Snippets on Google
  const quizSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: locale === "kn" ? paper.paperTitleKn : paper.paperTitleEn,
    description: locale === "kn" ? paper.metaDescriptionKn : paper.metaDescriptionEn,
    educationalLevel: "Competitive Examination",
    inLanguage: locale === "kn" ? "kn" : "en",
    hasPart: paper.questions.map((q) => ({
      "@type": "Question",
      name: locale === "kn" ? q.questionKn : q.questionEn,
      suggestedAnswer: (locale === "kn" ? q.optionsKn : q.optionsEn).map((opt) => ({
        "@type": "Answer",
        text: opt,
      })),
      acceptedAnswer: {
        "@type": "Answer",
        text: (locale === "kn" ? q.optionsKn : q.optionsEn)[q.correctIndex],
        comment: {
          "@type": "Comment",
          text: locale === "kn" ? q.explanationKn : q.explanationEn,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizSchema) }}
      />
      <SolvedPaperViewer paper={paper} locale={locale} />
    </>
  );
}
