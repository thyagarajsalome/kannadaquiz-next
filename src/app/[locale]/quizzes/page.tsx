import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteText } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicQuizzes, type PublicQuiz } from "@/lib/public-content";

export const revalidate = 60;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : "kn";

  const title =
    lang === "kn"
      ? "ಕನ್ನಡ ರಸಪ್ರಶ್ನೆಗಳು - KPSC, Police, FDA, SDA ಪರೀಕ್ಷಾ ತಯಾರಿ | KannadaQuiz"
      : "Karnataka Competitive Exam Quizzes - KPSC, Police, FDA, SDA | KannadaQuiz";

  const description =
    lang === "kn"
      ? "KPSC KAS, ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್, PSI, FDA, SDA, ಮತ್ತು ಸಾಮಾನ್ಯ ಜ್ಞಾನಕ್ಕಾಗಿ ಉಚಿತ ಕನ್ನಡ ಆನ್‌ಲೈನ್ ಮಾಕ್ ಟೆಸ್ಟ್ ಮತ್ತು ವಿಷಯವಾರು ರಸಪ್ರಶ್ನೆಗಳು."
      : "Free online quizzes and practice mock tests for Karnataka competitive exams including KPSC, Police, FDA, SDA, and general knowledge.";

  return {
    title,
    description,
    keywords: [
      "ಕನ್ನಡ ಕ್ವಿಜ್",
      "KPSC quiz Kannada",
      "Karnataka Police mock test",
      "Kannada GK quiz",
      "FDA SDA practice test",
      "General science quiz Kannada",
    ],
    alternates: {
      canonical: `https://kannadaquiz.in/${lang}/quizzes`,
      languages: {
        kn: "https://kannadaquiz.in/kn/quizzes",
        en: "https://kannadaquiz.in/en/quizzes",
      },
    },
    openGraph: {
      title,
      description,
      url: `https://kannadaquiz.in/${lang}/quizzes`,
      siteName: "KannadaQuiz",
      images: [
        {
          url: "https://kannadaquiz.in/images/quizzes/general.webp",
          width: 800,
          height: 600,
          alt: "Kannada Quizzes",
        },
      ],
    },
  };
}

type QuizCategoryDefinition = {
  id: string;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  icon: string;
  badgeBg: string;
  matches: (quiz: PublicQuiz) => boolean;
};

const quizCategoryDefinitions: QuizCategoryDefinition[] = [
  {
    id: "gk-history",
    title: {
      kn: "ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಮತ್ತು ಇತಿಹಾಸ",
      en: "General Knowledge & History",
    },
    subtitle: {
      kn: "ಕರ್ನಾಟಕ ಇತಿಹಾಸ, ಭಾರತೀಯ ಪರಂಪರೆ, ಸಂವಿಧಾನ, ರಾಜವಂಶಗಳು ಮತ್ತು ಜಾಗತಿಕ ಭೂಗೋಳದ ಅಭ್ಯಾಸ ರಸಪ್ರಶ್ನೆಗಳು.",
      en: "Karnataka history, Indian heritage, constitution, dynasties, and world geography practice quizzes.",
    },
    icon: "🏛️",
    badgeBg: "bg-amber-100 text-amber-900 border border-amber-200",
    matches: (q) => {
      const s = `${q.slug} ${q.subject} ${q.title} ${q.exam}`.toLowerCase();
      return (
        s.includes("general-knowledge") ||
        s.includes("general knowledge") ||
        s.includes("history") ||
        s.includes("ಇತಿಹಾಸ") ||
        s.includes("ಸಾಮಾನ್ಯ ಜ್ಞಾನ") ||
        s.includes("constitution") ||
        s.includes("ಸಂವಿಧಾನ") ||
        s.includes("world") ||
        s.includes("geography") ||
        s.includes("ಭೂಗೋಳ")
      );
    },
  },
  {
    id: "science-tech",
    title: {
      kn: "ವಿಜ್ಞಾನ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ",
      en: "Science & Technology",
    },
    subtitle: {
      kn: "ಸಾಮಾನ್ಯ ವಿಜ್ಞಾನ, ಕಂಪ್ಯೂಟರ್ ಜ್ಞಾನ, ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಮತ್ತು ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನ ರಸಪ್ರಶ್ನೆಗಳು.",
      en: "General science, computer literacy, artificial intelligence, and modern technology quizzes.",
    },
    icon: "🔬",
    badgeBg: "bg-blue-100 text-blue-900 border border-blue-200",
    matches: (q) => {
      const s = `${q.slug} ${q.subject} ${q.title} ${q.exam}`.toLowerCase();
      return (
        s.includes("science") ||
        s.includes("ವಿಜ್ಞಾನ") ||
        s.includes("computer") ||
        s.includes("ಕಂಪ್ಯೂಟರ್") ||
        s.includes("artificial") ||
        s.includes("ai") ||
        s.includes("ಬುದ್ಧಿಮತ್ತೆ") ||
        s.includes("technology") ||
        s.includes("ತಂತ್ರಜ್ಞಾನ")
      );
    },
  },
  {
    id: "math-aptitude",
    title: {
      kn: "ಗಣಿತ ಮತ್ತು ಬೌದ್ಧಿಕ ಸಾಮರ್ಥ್ಯ",
      en: "Mathematics & Mental Ability",
    },
    subtitle: {
      kn: "ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗಾಗಿ ಗಣಿತ, ತಾರ್ಕಿಕ ತರ್ಕ, ಮಾನಸಿಕ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಆಪ್ಟಿಟ್ಯೂಡ್ ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು.",
      en: "Quantitative aptitude, reasoning, mental ability, and arithmetic practice questions.",
    },
    icon: "📐",
    badgeBg: "bg-emerald-100 text-emerald-900 border border-emerald-200",
    matches: (q) => {
      const s = `${q.slug} ${q.subject} ${q.title} ${q.exam}`.toLowerCase();
      return (
        s.includes("math") ||
        s.includes("ಗಣಿತ") ||
        s.includes("mental") ||
        s.includes("aptitude") ||
        s.includes("reasoning") ||
        s.includes("ಸಾಮರ್ಥ್ಯ") ||
        s.includes("ತಾರ್ಕಿಕ")
      );
    },
  },
  {
    id: "sports-wildlife",
    title: {
      kn: "ಕ್ರೀಡೆ ಮತ್ತು ವನ್ಯಜೀವಿ ಪ್ರಪಂಚ",
      en: "Sports & Wildlife",
    },
    subtitle: {
      kn: "ಕ್ರೀಡಾ ಸಾಧಕರು, ಒಲಿಂಪಿಕ್ಸ್, ನಿಯಮಗಳು, ಪರಿಸರ, ವನ್ಯಜೀವಿಗಳು ಮತ್ತು ಪಕ್ಷಿಧಾಮಗಳ ರಸಪ್ರಶ್ನೆಗಳು.",
      en: "Sports achievers, Olympics records, wildlife conservation, national parks, and animal kingdom.",
    },
    icon: "🏆",
    badgeBg: "bg-orange-100 text-orange-900 border border-orange-200",
    matches: (q) => {
      const s = `${q.slug} ${q.subject} ${q.title} ${q.exam}`.toLowerCase();
      return (
        s.includes("sport") ||
        s.includes("ಕ್ರೀಡೆ") ||
        s.includes("animal") ||
        s.includes("wildlife") ||
        s.includes("bird") ||
        s.includes("ಪ್ರಾಣಿ") ||
        s.includes("ಪಕ್ಷಿ")
      );
    },
  },
  {
    id: "food-health",
    title: {
      kn: "ಆಹಾರ ಮತ್ತು ಆರೋಗ್ಯ ಜ್ಞಾನ",
      en: "Food & Health Nutrition",
    },
    subtitle: {
      kn: "ಆಹಾರ, ಜೀವಸತ್ವಗಳು, ಸಮತೋಲನ ಪೋಷಕಾಂಶಗಳು ಮತ್ತು ದೈನಂದಿನ ಆರೋಗ್ಯ ಮಾಹಿತಿ.",
      en: "Nutrients, vitamins, balanced diet, and health awareness practice questions.",
    },
    icon: "🥗",
    badgeBg: "bg-rose-100 text-rose-900 border border-rose-200",
    matches: (q) => {
      const s = `${q.slug} ${q.subject} ${q.title} ${q.exam}`.toLowerCase();
      return (
        s.includes("food") ||
        s.includes("nutrition") ||
        s.includes("ಆಹಾರ") ||
        s.includes("ಪೋಷಕಾಂಶ") ||
        s.includes("health") ||
        s.includes("ಆರೋಗ್ಯ")
      );
    },
  },
];

export default async function QuizzesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const text = siteText[locale];
  const quizzes = await getPublicQuizzes(locale, 100);

  const pageTitle =
    locale === "kn"
      ? "ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ರಸಪ್ರಶ್ನೆಗಳು"
      : "Karnataka Competitive Exam Quizzes";

  const pageSubtitle =
    locale === "kn"
      ? "KPSC, ಪೊಲೀಸ್, FDA, SDA, ಶಿಕ್ಷಕರ ನೇಮಕಾತಿ ಮತ್ತು ಸರ್ಕಾರಿ ಉದ್ಯೋಗ ಪರೀಕ್ಷೆಗಳಿಗಾಗಿ ವಿಷಯವಾರು ವರ್ಗೀಕರಿಸಿದ ಉಚಿತ ಅಭ್ಯಾಸ ರಸಪ್ರಶ್ನೆಗಳು."
      : "Subject-wise categorized free practice quizzes and mock tests for KPSC, Police, FDA, SDA, and Karnataka state exams.";

  // Group quizzes by category without overlap
  const assignedSlugs = new Set<string>();
  const categorizedGroups = quizCategoryDefinitions
    .map((cat) => {
      const matchedQuizzes = quizzes.filter((q) => {
        if (assignedSlugs.has(q.slug)) return false;
        if (cat.matches(q)) {
          assignedSlugs.add(q.slug);
          return true;
        }
        return false;
      });
      return {
        ...cat,
        quizzes: matchedQuizzes,
      };
    })
    .filter((group) => group.quizzes.length > 0);

  // Collect any remaining uncategorized quizzes
  const uncategorizedQuizzes = quizzes.filter((q) => !assignedSlugs.has(q.slug));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
    description: pageSubtitle,
    itemListElement: quizzes.map((quiz, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Quiz",
        name: quiz.title,
        description: quiz.description,
        url: `https://kannadaquiz.in/${locale}/quizzes/${quiz.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[var(--surface-soft)] to-white border-b border-[var(--border)] py-10 md:py-14">
        <div className="kq-container">
          <div className="max-w-3xl">
            <span className="inline-block bg-[var(--secondary)] text-white text-[10px] md:text-xs font-black uppercase px-3 py-1 rounded-full tracking-widest select-none mb-3">
              {locale === "kn" ? "ವಿಷಯವಾರು ವರ್ಗೀಕರಿಸಿದ ರಸಪ್ರಶ್ನೆಗಳು" : "CATEGORIZED PRACTICE QUIZZES"}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-[var(--primary)] leading-tight">
              {pageTitle}
            </h1>
            <p className="mt-3 text-base md:text-lg text-[var(--muted)] leading-relaxed">
              {pageSubtitle}
            </p>

            {/* Quick Category Jump Pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mr-1">
                {locale === "kn" ? "ವರ್ಗಗಳು:" : "Categories:"}
              </span>
              {categorizedGroups.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white border border-[var(--border)] hover:border-[var(--secondary)] hover:text-[var(--secondary)] shadow-sm hover:shadow transition-all select-none"
                >
                  <span>{group.icon}</span>
                  <span>{group.title[locale]}</span>
                  <span className="bg-[var(--surface-soft)] text-[var(--muted)] px-1.5 py-0.2 rounded-full text-[10px]">
                    {group.quizzes.length}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categorized Quiz Sections */}
      <div className="kq-container py-10 space-y-16">
        {categorizedGroups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-10">
            {/* Category Header */}
            <div className="border-b-2 border-[var(--secondary)] pb-3 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{group.icon}</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--primary)]">
                    {group.title[locale]}
                  </h2>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${group.badgeBg}`}>
                    {group.quizzes.length} {locale === "kn" ? "ಕ್ವಿಜ್‌ಗಳು" : "Quizzes"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--muted)]">{group.subtitle[locale]}</p>
              </div>
            </div>

            {/* Quizzes Grid for this Category */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.quizzes.map((quiz) => (
                <Link
                  key={quiz.slug}
                  href={`/${locale}/quizzes/${quiz.slug}`}
                  className="kq-card group overflow-hidden flex flex-col justify-between hover:border-[var(--secondary)] hover:shadow-lg transition-all duration-300 rounded-2xl border border-[var(--border)] bg-white"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-[var(--border)]/70">
                      <Image
                        src={quiz.featuredImageUrl || "/images/quizzes/general.webp"}
                        alt={quiz.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                        {quiz.difficulty}
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">
                        {quiz.exam && quiz.exam.toLowerCase() !== "general" ? `${quiz.exam} • ` : ""}
                        {quiz.subject}
                      </p>

                      <h3 className="mt-2.5 font-serif text-xl font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors leading-snug line-clamp-2">
                        {quiz.title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] line-clamp-2">
                        {quiz.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-[var(--border)]/60 bg-[var(--surface-soft)]/40 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--muted)] flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-[var(--secondary)]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {quiz.timeLimitMinutes} {text.minutes}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--secondary)] px-4 py-2 text-xs font-black uppercase tracking-wider text-white group-hover:bg-[var(--secondary)]/90 transition-all shadow-sm select-none">
                      {text.quizStart}
                      <span className="group-hover:translate-x-0.5 transition-transform">➔</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* Catch-all Uncategorized Section if any */}
        {uncategorizedQuizzes.length > 0 && (
          <section id="other" className="scroll-mt-10">
            <div className="border-b-2 border-[var(--secondary)] pb-3 mb-6">
              <h2 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                <span>📚</span>
                <span>{locale === "kn" ? "ಇತರ ಅಭ್ಯಾಸ ರಸಪ್ರಶ್ನೆಗಳು" : "Other Practice Quizzes"}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                  {uncategorizedQuizzes.length}
                </span>
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {uncategorizedQuizzes.map((quiz) => (
                <Link
                  key={quiz.slug}
                  href={`/${locale}/quizzes/${quiz.slug}`}
                  className="kq-card group overflow-hidden flex flex-col justify-between hover:border-[var(--secondary)] hover:shadow-lg transition-all duration-300 rounded-2xl border border-[var(--border)] bg-white"
                >
                  <div>
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-[var(--border)]/70">
                      <Image
                        src={quiz.featuredImageUrl || "/images/quizzes/general.webp"}
                        alt={quiz.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                        {quiz.difficulty}
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">
                        {quiz.exam && quiz.exam.toLowerCase() !== "general" ? `${quiz.exam} • ` : ""}
                        {quiz.subject}
                      </p>

                      <h3 className="mt-2.5 font-serif text-xl font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors leading-snug line-clamp-2">
                        {quiz.title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] line-clamp-2">
                        {quiz.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-[var(--border)]/60 bg-[var(--surface-soft)]/40 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--muted)] flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 text-[var(--secondary)]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {quiz.timeLimitMinutes} {text.minutes}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--secondary)] px-4 py-2 text-xs font-black uppercase tracking-wider text-white group-hover:bg-[var(--secondary)]/90 transition-all shadow-sm select-none">
                      {text.quizStart}
                      <span className="group-hover:translate-x-0.5 transition-transform">➔</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
