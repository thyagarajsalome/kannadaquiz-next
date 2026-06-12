import type { Metadata } from "next";
import Link from "next/link";
import { siteText } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicCurrentAffairs, getPublicJobs, getPublicPosts, getPublicQuizzes } from "@/lib/public-content";

export const revalidate = 300;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const trendingTopics: Record<string, { name: string; url: string }[]> = {
  kn: [
    { name: "KPSC ನೇಮಕಾತಿ 2026", url: "/kn/category/jobs" },
    { name: "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಕೆಲಸಗಳು", url: "/kn/category/jobs" },
    { name: "KEA ಫಲಿತಾಂಶಗಳು", url: "/kn/category/jobs" },
    { name: "ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆ ಅಪ್ಡೇಟ್ಸ್", url: "/kn/category/karnataka" },
    { name: "ಹವಾಮಾನ ವರದಿ", url: "/kn/category/karnataka" },
    { name: "ದಿನನಿತ್ಯದ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು", url: "/kn/category/national" },
    { name: "ಬ್ಯಾಂಕ್ ಉದ್ಯೋಗಾವಕಾಶಗಳು", url: "/kn/category/jobs" },
    { name: "ಪಿಎಸ್‌ಐ ಪರೀಕ್ಷೆ ವಿವರಗಳು", url: "/kn/category/jobs" }
  ],
  en: [
    { name: "KPSC Recruitment 2026", url: "/en/category/jobs" },
    { name: "Karnataka Govt Jobs", url: "/en/category/jobs" },
    { name: "KEA Exam Results", url: "/en/category/jobs" },
    { name: "Gruha Lakshmi Scheme Updates", url: "/en/category/karnataka" },
    { name: "Weather Warnings", url: "/en/category/karnataka" },
    { name: "Daily Kannada Current Affairs", url: "/en/category/national" },
    { name: "Banking Job Vacancies", url: "/en/category/jobs" },
    { name: "PSI Exam Updates", url: "/en/category/jobs" }
  ]
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : "kn";

  return {
    title:
      lang === "kn"
        ? "KannadaQuiz - ಪ್ರಮುಖ ಜಾಗತಿಕ ಮತ್ತು ಕರ್ನಾಟಕ ಸುದ್ದಿ ಸಾರಾಂಶಗಳು"
        : "KannadaQuiz - Latest Global & Karnataka News Summaries",
    description:
      lang === "kn"
        ? "ಕನ್ನಡ ಓದುಗರಿಗೆ ಸಹಾಯ ಮಾಡಲು ಪ್ರಮುಖ ಅಂತರರಾಷ್ಟ್ರೀಯ, ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ಕರ್ನಾಟಕ ಸುದ್ದಿಗಳ ಮುಖ್ಯಾಂಶಗಳು ಹಾಗೂ ನಿಖರ ಸಾರಾಂಶ ಮಾಹಿತಿ."
        : "Daily summaries and updates of international, national, and Karnataka news to help Kannada readers.",
    keywords:
      lang === "kn"
        ? [
            "ಕನ್ನಡ ರಸಪ್ರಶ್ನೆ", "ಕರ್ನಾಟಕ ಸುದ್ದಿ", "ಸರ್ಕಾರಿ ಕೆಲಸಗಳು", "ಕೆಪಿಎಸ್‌ಸಿ ನೇಮಕಾತಿ",
            "ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು", "ಎಫ್‌ಡಿಎ ಎಸ್‌ಡಿಎ", "ಉದ್ಯೋಗ ಮಾಹಿತಿ", "ಹವಾಮಾನ ವರದಿ", "ಕರ್ನಾಟಕ ಬಜೆಟ್"
          ]
        : [
            "Kannada Quiz", "Karnataka News", "Government Jobs", "KPSC Recruitment",
            "Current Affairs", "FDA SDA Exams", "Job Vacancies Karnataka", "Weather Updates", "KEA Results"
          ],
    alternates: {
      canonical: `/${lang}`,
      languages: {
        kn: "/kn",
        en: "/en",
      },
    },
  };
}

const categoryTranslations: Record<string, Record<string, string>> = {
  karnataka: { kn: "ಕರ್ನಾಟಕ ಸುದ್ದಿ", en: "Karnataka News" },
  national: { kn: "ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "National News" },
  international: { kn: "ಅಂತರರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "International News" },
  jobs: { kn: "ಉದ್ಯೋಗ ಮಾಹಿತಿ", en: "Jobs & Careers" },
  kpsc: { kn: "ಪರೀಕ್ಷಾ ವಿವರಗಳು", en: "Exams & Education" },
  current_affairs: { kn: "ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು", en: "Current Affairs" },
  agriculture: { kn: "ಕೃಷಿ ಮಾಹಿತಿ", en: "Agriculture Info" },
  education: { kn: "ಶಿಕ್ಷಣ ಮತ್ತು ಕಾಲೇಜು ಮಾರ್ಗದರ್ಶಿ", en: "Education & College Guide" },
  general: { kn: "ಸಾಮಾನ್ಯ ಸುದ್ದಿ", en: "General News" }
};

function getLocalizedCategory(category: string, locale: string): string {
  const norm = category.toLowerCase();
  if (norm.includes("karnataka")) return categoryTranslations.karnataka[locale] || category;
  if (norm.includes("international")) return categoryTranslations.international[locale] || category;
  if (norm.includes("national")) return categoryTranslations.national[locale] || category;
  if (norm.includes("job") || norm.includes("kpsc") || norm.includes("exam") || norm.includes("career")) {
    return categoryTranslations.jobs[locale] || category;
  }
  if (norm.includes("affair") || norm.includes("current")) {
    return categoryTranslations.current_affairs[locale] || category;
  }
  if (norm.includes("agriculture") || norm.includes("krishi") || norm.includes("farm")) {
    return categoryTranslations.agriculture[locale] || category;
  }
  if (norm.includes("college") || norm.includes("guide") || norm.includes("education")) {
    return categoryTranslations.education[locale] || category;
  }
  return categoryTranslations.general[locale] || category;
}

const sectionTitles: Record<string, Record<Locale, string>> = {
  breaking: { kn: "ಮುಖ್ಯಾಂಶಗಳು", en: "Breaking News" },
  recent: { kn: "ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳು", en: "Recent News" },
  karnataka: { kn: "ಕರ್ನಾಟಕ ಸುದ್ದಿ", en: "Karnataka News" },
  national: { kn: "ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "National News" },
  international: { kn: "ಅಂತರರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "International News" },
  jobs: { kn: "ಉದ್ಯೋಗ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಮಾಹಿತಿ", en: "Jobs & Career Info" },
  quizzes: { kn: "ದಿನನಿತ್ಯದ ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಮತ್ತು ರಸಪ್ರಶ್ನೆಗಳು", en: "General Knowledge & Quizzes" },
  readMore: { kn: "ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ➔", en: "Read More ➔" },
  latestAffairs: { kn: "ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು", en: "Current Affairs" },
  agriculture: { kn: "ಕೃಷಿ ಮತ್ತು ಕೃಷಿ ಪರೀಕ್ಷೆಗಳ ಮಾಹಿತಿ", en: "Agriculture & Krishi News" },
  education: { kn: "ಶಿಕ್ಷಣ ಮತ್ತು ಕಾಲೇಜು ಮಾರ್ಗದರ್ಶಿಗಳು", en: "College & Education Guides" },
  schemes: { kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಅಪ್ಡೇಟ್ಸ್", en: "Government Schemes & Updates" },
  tourism: { kn: "ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮ", en: "Karnataka Heritage & Tourism" },
  sports: { kn: "ಕ್ರೀಡಾ ಸುದ್ದಿ ಮತ್ತು ಅಪ್ಡೇಟ್ಸ್", en: "Sports News & Updates" },
};

const categoriesInfo = [
  {
    key: "karnataka",
    kn: "ಕರ್ನಾಟಕ",
    en: "Karnataka",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />`,
    color: "text-red-755 bg-red-50 hover:bg-red-100 hover:border-red-300"
  },
  {
    key: "national",
    kn: "ರಾಷ್ಟ್ರೀಯ",
    en: "National",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2 2 0 012 2v2.935M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
    color: "text-sky-755 bg-sky-50 hover:bg-sky-100 hover:border-sky-300"
  },
  {
    key: "international",
    kn: "ಅಂತರರಾಷ್ಟ್ರೀಯ",
    en: "International",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9c1.657 0 3 2.5 3 6s-1.343 6-3 6m0-12c-1.657 0-3 2.5-3 6s1.343 6 3 6" />`,
    color: "text-indigo-755 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300"
  },
  {
    key: "jobs",
    kn: "ಉದ್ಯೋಗಗಳು",
    en: "Jobs",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`,
    color: "text-emerald-755 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300"
  },
  {
    key: "schemes",
    kn: "ಯೋಜನೆಗಳು",
    en: "Schemes",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />`,
    color: "text-amber-755 bg-amber-50 hover:bg-amber-100 hover:border-amber-300"
  },
  {
    key: "agriculture",
    kn: "ಕೃಷಿ",
    en: "Agriculture",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l-.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
    color: "text-teal-755 bg-teal-50 hover:bg-teal-100 hover:border-teal-300"
  },
  {
    key: "education",
    kn: "ಶೈಕ್ಷಣಿಕ",
    en: "Education",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 14v6a3 3 0 003 3h10a3 3 0 003-3v-6" />`,
    color: "text-purple-755 bg-purple-50 hover:bg-purple-100 hover:border-purple-300"
  },
  {
    key: "tourism",
    kn: "ಇತಿಹಾಸ",
    en: "Heritage",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />`,
    color: "text-orange-755 bg-orange-50 hover:bg-orange-100 hover:border-orange-300"
  },
  {
    key: "sports",
    kn: "ಕ್ರೀಡೆ",
    en: "Sports",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
    color: "text-pink-755 bg-pink-50 hover:bg-pink-100 hover:border-pink-300"
  }
];

function getSourceName(post: { sourceUrl?: string; sourceName?: string }) {
  if (post.sourceName) return post.sourceName;
  if (!post.sourceUrl) return "";
  try {
    const url = new URL(post.sourceUrl);
    return url.hostname.replace(/^(www\.|feeds\.|rss\.)/, "");
  } catch {
    return "News Source";
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const text = siteText[locale];
  
  const [currentAffairs, posts, jobs, quizzes] = await Promise.all([
    getPublicCurrentAffairs(locale, 8),
    getPublicPosts(locale, 35),
    getPublicJobs(locale, 4),
    getPublicQuizzes(locale, 4),
  ]);

  const heroPost = posts[0] || null;
  const recentHeadlines = posts.slice(1, 5);

  const getCategoryKey = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("karnataka")) return "karnataka";
    if (c.includes("international")) return "international";
    if (c.includes("national") || c.includes("affair") || c.includes("current") || c.includes("general")) return "national";
    if (c.includes("job") || c.includes("kpsc") || c.includes("exam") || c.includes("career")) return "jobs";
    if (c.includes("agriculture") || c.includes("krishi") || c.includes("farm")) return "agriculture";
    if (c.includes("college") || c.includes("guide") || c.includes("education")) return "education";
    if (c.includes("scheme") || c.includes("yojane")) return "schemes";
    if (c.includes("tourism") || c.includes("heritage") || c.includes("itihasa") || c.includes("culture")) return "tourism";
    if (c.includes("sport") || c.includes("game") || c.includes("kriide")) return "sports";
    return "general";
  };

  const karnatakaPosts = posts.filter(p => getCategoryKey(p.category) === "karnataka").slice(0, 3);
  const nationalPosts = posts.filter(p => getCategoryKey(p.category) === "national").slice(0, 3);
  const internationalPosts = posts.filter(p => getCategoryKey(p.category) === "international").slice(0, 3);
  const jobPosts = posts.filter(p => getCategoryKey(p.category) === "jobs").slice(0, 3);
  const agriculturePosts = posts.filter(p => getCategoryKey(p.category) === "agriculture").slice(0, 3);
  const educationPosts = posts.filter(p => getCategoryKey(p.category) === "education").slice(0, 3);
  const schemesPosts = posts.filter(p => getCategoryKey(p.category) === "schemes").slice(0, 3);
  const tourismPosts = posts.filter(p => getCategoryKey(p.category) === "tourism").slice(0, 3);
  const sportsPosts = posts.filter(p => getCategoryKey(p.category) === "sports").slice(0, 3);

  return (
    <>
      {/* 1. Breaking News Ticker */}
      {posts.length > 0 && (
        <div className="bg-[var(--primary)] text-white text-sm py-2">
          <div className="kq-container flex items-center gap-3">
            <span className="bg-[var(--secondary)] text-white text-xs font-bold uppercase px-2 py-0.5 rounded shrink-0">
              {locale === "kn" ? "ನೇರ ಸುದ್ದಿ" : "BREAKING"}
            </span>
            <div className="flex-1 truncate font-medium">
              <Link href={`/${locale}/posts/${posts[0].slug}`} className="hover:underline">
                {posts[0].title}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 1b. Trending Topics Bar */}
      <div className="bg-white border-b border-[var(--border)] py-3">
        <div className="kq-container flex flex-wrap items-center gap-3 text-xs md:text-sm">
          <span className="font-bold uppercase tracking-wider text-[var(--secondary)] flex items-center gap-1 shrink-0 select-none">
            <svg className="w-4 h-4 text-[var(--secondary)] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            {locale === "kn" ? "ಟ್ರೆಂಡಿಂಗ್:" : "Trending:"}
          </span>
          <div className="flex flex-wrap gap-2 items-center">
            {trendingTopics[locale]?.map((topic) => (
              <Link
                key={topic.name}
                href={topic.url}
                className="bg-[var(--surface-soft)] hover:bg-[var(--secondary)] hover:text-white px-3 py-1 rounded-full font-semibold border border-[var(--border)] text-xs text-[var(--primary)] hover:border-transparent transition-all select-none"
              >
                #{topic.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 1c. Welcome Hero & Quiz CTA Banner */}
      <div className="py-6 bg-[var(--surface-soft)] border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e293b] via-[#131b2e] to-[#0f172a] text-white p-6 md:p-10 shadow-md">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--secondary)]/10 rounded-full -ml-16 -mb-16 pointer-events-none blur-2xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="inline-block bg-[var(--secondary)] text-white text-[10px] md:text-xs font-black uppercase px-3 py-1 rounded-full tracking-widest select-none shadow-sm mb-4">
                  {locale === "kn" ? "ಉಚಿತ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ತಯಾರಿ" : "FREE STATE EXAM PREPARATION"}
                </span>
                <h2 className="font-serif text-2xl md:text-4xl font-extrabold leading-tight text-white tracking-tight">
                  {text.heroTitle}
                </h2>
                <p className="mt-3 text-white/80 text-sm md:text-base leading-relaxed font-normal">
                  {text.heroLead}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full lg:w-auto">
                <Link
                  href={`/${locale}/quizzes`}
                  className="bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white text-center font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 text-base whitespace-nowrap select-none flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l8.904-4.473L21 9l-3.487-3.49-8.7 8.394zM16.5 7.5L18 9"></path>
                  </svg>
                  {text.primaryCta}
                </Link>
                <Link
                  href={`/${locale}/category/jobs`}
                  className="bg-white/10 hover:bg-white/20 text-white text-center font-bold px-8 py-4 rounded-xl border border-white/20 transition-all duration-300 text-base whitespace-nowrap select-none flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .966-.784 1.75-1.75 1.75H5.5a1.75 1.75 0 0 1-1.75-1.75v-4.25m16.5 0a1.75 1.75 0 0 0-1.75-1.75H5.5a1.75 1.75 0 0 0-1.75 1.75m16.5 0V9a1.75 1.75 0 0 0-1.75-1.75H5.5A1.75 1.75 0 0 0 3.75 9v5.15M12 3v9m0 0l-3-3m3 3l3-3"></path>
                  </svg>
                  {locale === "kn" ? "ಉದ್ಯೋಗಾವಕಾಶಗಳು" : "Job Alerts"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1d. Browse by Category Grid Section */}
      <section className="py-8 bg-white border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="flex items-center gap-2 border-b-2 border-[var(--secondary)] pb-2 mb-6">
            <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
            <h3 className="font-serif text-2xl font-bold text-[var(--primary)]">
              {locale === "kn" ? "ವರ್ಗಾವಾರು ಸುದ್ದಿ ಓದಿ (Explore Categories)" : "Explore by Category"}
            </h3>
          </div>
 
          <div className="grid gap-3 grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {categoriesInfo.map((cat) => (
              <Link
                key={cat.key}
                href={`/${locale}/category/${cat.key}`}
                className={`kq-card p-3 flex flex-col items-center text-center justify-between transition-all duration-300 border border-[var(--border)]/60 hover:shadow-sm hover:border-[var(--secondary)]/40 rounded-xl group ${cat.color}`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[var(--border)]/20 shadow-sm group-hover:scale-110 transition-transform duration-300 mb-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: cat.icon }} />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-xs md:text-sm font-bold block text-[var(--primary)] leading-tight">
                    {locale === "kn" ? cat.kn : cat.en}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
 
      {/* 1e. FIFA World Cup 2026 Promo Banner */}
      <section className="py-6 bg-[var(--surface-soft)] border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-900 to-green-950 text-white p-6 shadow-md border border-emerald-700/20">
            {/* Accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl shrink-0 animate-bounce">🏆</span>
                <div>
                  <span className="bg-yellow-500 text-slate-950 text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full select-none shadow-sm mb-1.5 inline-block">
                    {locale === "kn" ? "ವಿಶ್ವಕಪ್ ವಿಶೇಷ" : "WORLD CUP SPECIAL"}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl font-bold text-white leading-tight">
                    {locale === "kn" ? "ಫಿಫಾ ವಿಶ್ವಕಪ್ 2026 ಪ್ರೆಡಿಕ್ಟರ್ ಮತ್ತು ಕ್ವಿಜ್ ಹಬ್!" : "FIFA World Cup 2026 Predictor & Trivia Hub!"}
                  </h3>
                  <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
                    {locale === "kn"
                      ? "ಇಂದಿನ ಪಂದ್ಯಗಳನ್ನು ಪ್ರೆಡಿಕ್ಟ್ ಮಾಡಿ, ನಿಮ್ಮ ಕ್ರೇಜ್ ಶೇರ್ ಮಾಡಿ ಮತ್ತು ಫುಟ್‌ಬಾಲ್ ಜ್ಞಾನ ಪರೀಕ್ಷಿಸಲು ಕ್ವಿಜ್ ಆಡಿ."
                      : "Predict match outcomes, challenge friends, and play soccer trivia to test your football knowledge."}
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/games/worldcup`}
                className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 text-center font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:-translate-y-0.5 text-xs uppercase tracking-wider whitespace-nowrap select-none flex items-center justify-center gap-1.5"
              >
                <span>{locale === "kn" ? "ಈಗಲೇ ಆಡಿ ⚽" : "Play Now ⚽"}</span>
                <svg className="w-4 h-4 shrink-0 text-slate-950" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
 
      {/* 2. Main Headline Hero Section */}
      <section className="py-8 bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Left Column: Big Hero Story */}
            {heroPost ? (
              <div className="flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--border)] pb-8 lg:pb-0 lg:pr-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">
                    <span>{getLocalizedCategory(heroPost.category, locale)}</span>
                    <span>•</span>
                    <span>{getSourceName(heroPost)}</span>
                    <span>•</span>
                    <time>{heroPost.date}</time>
                  </div>
                  <Link href={`/${locale}/posts/${heroPost.slug}`} className="group">
                    <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold leading-tight text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors">
                      {heroPost.title}
                    </h2>
                  </Link>
                  <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                    {heroPost.excerpt}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/${locale}/posts/${heroPost.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-[var(--secondary)] hover:underline"
                  >
                    {sectionTitles.readMore[locale]}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 text-[var(--muted)]">
                {locale === "kn" ? "ಯಾವುದೇ ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ." : "No news available yet."}
              </div>
            )}

            {/* Right Column: Recent Headlining List */}
            <div>
              <h3 className="font-serif text-xl font-bold text-[var(--primary)] border-b-2 border-[var(--secondary)] pb-2 mb-4">
                {sectionTitles.recent[locale]}
              </h3>
              <div className="flex flex-col gap-4">
                {recentHeadlines.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">
                    {locale === "kn" ? "ಯಾವುದೇ ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳಿಲ್ಲ." : "No recent news available."}
                  </p>
                ) : (
                  recentHeadlines.map((post) => (
                    <article key={post.slug} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                        <span>{getLocalizedCategory(post.category, locale)}</span>
                        <span>•</span>
                        <span>{getSourceName(post)}</span>
                      </div>
                      <Link href={`/${locale}/posts/${post.slug}`} className="group">
                        <h4 className="mt-1 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <time className="mt-1 block text-xs text-[var(--muted)]">{post.date}</time>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mid Grid: Quizzes & Current Affairs */}
      <section className="py-10 bg-[var(--background)] border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Left: Featured Quizzes */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--primary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)]">
                  {sectionTitles.quizzes[locale]}
                </h3>
                <Link href={`/${locale}/quizzes`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
                  {locale === "kn" ? "ಎಲ್ಲಾ ಕ್ವಿಜ್‌ಗಳು ➔" : "View All Quizzes ➔"}
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {quizzes.length === 0 ? (
                  <div className="kq-card p-6 col-span-2 text-center text-[var(--muted)]">
                    {locale === "kn" ? "ಯಾವುದೇ ಕ್ವಿಜ್‌ಗಳು ಲಭ್ಯವಿಲ್ಲ." : "No quizzes available yet."}
                  </div>
                ) : (
                  quizzes.map((quiz) => (
                    <div key={quiz.slug} className="kq-card p-5 flex flex-col justify-between hover:shadow-sm transition-shadow">
                      <div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--surface-muted)] text-[var(--muted)] px-2 py-0.5 rounded">
                            {quiz.exam && quiz.exam.toLowerCase() !== "general" ? quiz.exam : quiz.subject}
                          </span>
                          <span className="text-xs text-[var(--muted)]">
                            {quiz.difficulty} • {quiz.timeLimitMinutes} {text.minutes}
                          </span>
                        </div>
                        <h4 className="mt-3 font-serif text-lg font-bold text-[var(--primary)]">
                          {quiz.title}
                        </h4>
                        <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                          {quiz.description}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[var(--border)]">
                        <Link
                          href={`/${locale}/quizzes/${quiz.slug}`}
                          className="w-full block text-center bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white text-xs font-black uppercase py-2.5 rounded-md transition-colors select-none tracking-wider shadow-sm"
                        >
                          {text.quizStart} ➔
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Quick Current Affairs */}
            <aside className="kq-card p-5 bg-white border border-[var(--border)] rounded-lg shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[var(--primary)] border-b-2 border-[var(--secondary)] pb-2 mb-4">
                {sectionTitles.latestAffairs[locale]}
              </h3>
              <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
                {currentAffairs.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">
                    {locale === "kn" ? "ಯಾವುದೇ ಪ್ರಚಲಿತ ಘಟನೆಗಳಿಲ್ಲ." : "No current affairs available yet."}
                  </p>
                ) : (
                  currentAffairs.map((item, idx) => (
                    <article key={idx} className="border-b border-[var(--border)] pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[var(--secondary)]">
                        <span>{locale === "kn" ? "ಅಪ್‌ಡೇಟ್" : "UPDATE"}</span>
                        <time>{item.date}</time>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[var(--muted)] font-medium">
                        {item.headline}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* 3b. Evergreen Government Services Section */}
      <section className="py-10 bg-white border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="flex items-center justify-between border-b-2 border-[var(--primary)] pb-2 mb-6">
            <h3 className="font-serif text-2xl font-bold text-[var(--primary)]">
              {locale === "kn" ? "ಅಗತ್ಯ ಸರ್ಕಾರಿ ಸೇವೆಗಳು (Gov Services)" : "Essential Government Services"}
            </h3>
            <Link href={`/${locale}/services`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
              {locale === "kn" ? "ಎಲ್ಲಾ ಸೇವೆಗಳು ➔" : "View All Services ➔"}
            </Link>
          </div>
 
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Aadhaar */}
            <div className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-all border-l-2 border-l-sky-500">
              <div>
                <h4 className="font-serif text-base font-bold text-[var(--primary)]">
                  {locale === "kn" ? "ಆಧಾರ್ ಕಾರ್ಡ್ ಸೇವೆಗಳು" : "Aadhaar Card Portal"}
                </h4>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                  {locale === "kn"
                    ? "ಆಧಾರ್ ಡೌನ್‌ಲೋಡ್, ವಿಳಾಸ ತಿದ್ದುಪಡಿ, ಮತ್ತು ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಲಿಂಕ್ ಮಾಡುವ ವಿವರಗಳು."
                    : "Download Aadhaar, update address, check linking status, and lock biometrics."}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)]/30">
                <a href="https://myaadhaar.uidai.gov.in/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[var(--secondary)] hover:underline flex items-center gap-1">
                  <span>myaadhaar.uidai.gov.in</span>
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3" />
                  </svg>
                </a>
              </div>
            </div>
 
            {/* Card 2: Ration Card */}
            <div className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-all border-l-2 border-l-emerald-500">
              <div>
                <h4 className="font-serif text-base font-bold text-[var(--primary)]">
                  {locale === "kn" ? "ಪಡಿತರ ಚೀಟಿ (Ration Card)" : "Ration Card (Ahara)"}
                </h4>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                  {locale === "kn"
                    ? "ಹೊಸ ರೇಷನ್ ಕಾರ್ಡ್ ಅರ್ಜಿ, ಸದಸ್ಯರ ಸೇರ್ಪಡೆ, ಮತ್ತು ಅನ್ನಭಾಗ್ಯ ಯೋಜನೆಯ ವಿವರಗಳು."
                    : "Apply for new card, check entitlement status, and edit family member details."}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)]/30">
                <a href="https://ahara.kar.nic.in/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[var(--secondary)] hover:underline flex items-center gap-1">
                  <span>ahara.kar.nic.in</span>
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3" />
                  </svg>
                </a>
              </div>
            </div>
 
            {/* Card 3: Voter ID */}
            <div className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-all border-l-2 border-l-indigo-500">
              <div>
                <h4 className="font-serif text-base font-bold text-[var(--primary)]">
                  {locale === "kn" ? "ಮತದಾರರ ಪಟ್ಟಿ ಮತ್ತು Voter ID" : "Voter Services (ECI)"}
                </h4>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                  {locale === "kn"
                    ? "ಹೊಸ ಮತದಾರರ ನೋಂದಣಿ, ತಿದ್ದುಪಡಿ ಹಾಗೂ ಡಿಜಿಟಲ್ ಇ-ಮತದಾರರ ಪತ್ರ ಡೌನ್‌ಲೋಡ್."
                    : "Register as voter, download e-EPIC card, search voter list and correct details."}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)]/30">
                <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[var(--secondary)] hover:underline flex items-center gap-1">
                  <span>voters.eci.gov.in</span>
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3" />
                  </svg>
                </a>
              </div>
            </div>
 
            {/* Card 4: PAN Card */}
            <div className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-all border-l-2 border-l-orange-500">
              <div>
                <h4 className="font-serif text-base font-bold text-[var(--primary)]">
                  {locale === "kn" ? "ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಸೇವೆಗಳು" : "PAN Card Portal"}
                </h4>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                  {locale === "kn"
                    ? "ಹೊಸ ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಅರ್ಜಿ, ತಿದ್ದುಪಡಿ, ಮತ್ತು ಆಧಾರ್-ಪ್ಯಾನ್ ಲಿಂಕ್ ಮಾಡುವ ಪ್ರಕ್ರಿಯೆ."
                    : "Apply online for new PAN, request card reprint, correct details, and link Aadhaar."}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)]/30">
                <a href="https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[var(--secondary)] hover:underline flex items-center gap-1">
                  <span>nsdl.com / utiitsl.com</span>
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* 4. Categorized News Sections */}
      <section className="py-10 bg-white">
        <div className="kq-container flex flex-col gap-10">
          
          {/* Karnataka News Section */}
          {karnatakaPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                  {sectionTitles.karnataka[locale]}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {karnatakaPosts.map((post) => (
                  <div key={post.slug} className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div>
                      
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                        <span>{getSourceName(post)}</span>
                        <span>•</span>
                        <time>{post.date}</time>
                      </div>
                      <Link href={`/${locale}/posts/${post.slug}`} className="group">
                        <h4 className="mt-2 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <Link href={`/${locale}/posts/${post.slug}`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
                        {sectionTitles.readMore[locale]}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* National News Section */}
          {nationalPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                  {sectionTitles.national[locale]}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {nationalPosts.map((post) => (
                  <div key={post.slug} className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div>
                      
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                        <span>{getSourceName(post)}</span>
                        <span>•</span>
                        <time>{post.date}</time>
                      </div>
                      <Link href={`/${locale}/posts/${post.slug}`} className="group">
                        <h4 className="mt-2 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <Link href={`/${locale}/posts/${post.slug}`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
                        {sectionTitles.readMore[locale]}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* International News Section */}
          {internationalPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                  {sectionTitles.international[locale]}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {internationalPosts.map((post) => (
                  <div key={post.slug} className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div>
                      
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                        <span>{getSourceName(post)}</span>
                        <span>•</span>
                        <time>{post.date}</time>
                      </div>
                      <Link href={`/${locale}/posts/${post.slug}`} className="group">
                        <h4 className="mt-2 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <Link href={`/${locale}/posts/${post.slug}`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
                        {sectionTitles.readMore[locale]}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agriculture News Section */}
          {agriculturePosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                  {sectionTitles.agriculture[locale]}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {agriculturePosts.map((post) => (
                  <div key={post.slug} className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                        <span>{getSourceName(post)}</span>
                        <span>•</span>
                        <time>{post.date}</time>
                      </div>
                      <Link href={`/${locale}/posts/${post.slug}`} className="group">
                        <h4 className="mt-2 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <Link href={`/${locale}/posts/${post.slug}`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
                        {sectionTitles.readMore[locale]}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* College & Education Guides Section */}
          {educationPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                  {sectionTitles.education[locale]}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {educationPosts.map((post) => (
                  <div key={post.slug} className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                        <span>{getSourceName(post)}</span>
                        <span>•</span>
                        <time>{post.date}</time>
                      </div>
                      <Link href={`/${locale}/posts/${post.slug}`} className="group">
                        <h4 className="mt-2 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <Link href={`/${locale}/posts/${post.slug}`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
                        {sectionTitles.readMore[locale]}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Government Schemes Section */}
          {schemesPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                  {sectionTitles.schemes[locale]}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {schemesPosts.map((post) => (
                  <div key={post.slug} className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                        <span>{getSourceName(post)}</span>
                        <span>•</span>
                        <time>{post.date}</time>
                      </div>
                      <Link href={`/${locale}/posts/${post.slug}`} className="group">
                        <h4 className="mt-2 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <Link href={`/${locale}/posts/${post.slug}`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
                        {sectionTitles.readMore[locale]}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Karnataka Heritage & Tourism Section */}
          {tourismPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                  {sectionTitles.tourism[locale]}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {tourismPosts.map((post) => (
                  <div key={post.slug} className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                        <span>{getSourceName(post)}</span>
                        <span>•</span>
                        <time>{post.date}</time>
                      </div>
                      <Link href={`/${locale}/posts/${post.slug}`} className="group">
                        <h4 className="mt-2 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <Link href={`/${locale}/posts/${post.slug}`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
                        {sectionTitles.readMore[locale]}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sports News Section */}
          {sportsPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                  {sectionTitles.sports[locale]}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {sportsPosts.map((post) => (
                  <div key={post.slug} className="kq-card p-4 flex flex-col justify-between hover:shadow-sm transition-shadow">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                        <span>{getSourceName(post)}</span>
                        <span>•</span>
                        <time>{post.date}</time>
                      </div>
                      <Link href={`/${locale}/posts/${post.slug}`} className="group">
                        <h4 className="mt-2 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border)]">
                      <Link href={`/${locale}/posts/${post.slug}`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
                        {sectionTitles.readMore[locale]}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Jobs & Exam Updates Section */}
          <div>
            <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
              <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                {sectionTitles.jobs[locale]}
              </h3>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column: Job Alerts List */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] border-b pb-1 mb-1">
                  {locale === "kn" ? "ಉದ್ಯೋಗಾವಕಾಶಗಳು (Job Alerts)" : "Active Recruitment Alerts"}
                </h4>
                {jobs.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">
                    {locale === "kn" ? "ಯಾವುದೇ ಉದ್ಯೋಗ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ." : "No job alerts available."}
                  </p>
                ) : (
                  jobs.map((job) => (
                    <Link
                      key={job.slug}
                      href={`/${locale}/jobs/${job.slug}`}
                      className="kq-card p-4 flex flex-col justify-between hover:border-[var(--secondary)] transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-[var(--secondary)] uppercase">
                            {job.organization}
                          </span>
                          <h5 className="font-serif text-base font-bold text-[var(--primary)] mt-1">
                            {job.title}
                          </h5>
                        </div>
                        <span className="text-xs text-[var(--secondary)] shrink-0 font-bold">
                          {locale === "kn" ? "ಕೊನೆಯ ದಿನಾಂಕ:" : "Deadline:"} {job.deadline}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Right Column: Career & Exam News articles */}
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)] border-b pb-1 mb-1">
                  {locale === "kn" ? "ಪರೀಕ್ಷಾ ಸುದ್ದಿ ಮತ್ತು ಅಧಿಸೂಚನೆಗಳು" : "Exam News & Notifications"}
                </h4>
                {jobPosts.length === 0 ? (
                  <p className="text-sm text-[var(--muted)]">
                    {locale === "kn" ? "ಯಾವುದೇ ಪರೀಕ್ಷಾ ಲೇಖನಗಳು ಲಭ್ಯವಿಲ್ಲ." : "No exam news available."}
                  </p>
                ) : (
                  jobPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/${locale}/posts/${post.slug}`}
                      className="kq-card p-4 hover:border-[var(--secondary)] transition-colors"
                    >
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--secondary)] uppercase">
                        <span>{getSourceName(post)}</span>
                        <span>•</span>
                        <time>{post.date}</time>
                      </div>
                      <h5 className="font-serif text-base font-bold text-[var(--primary)] mt-1 line-clamp-2">
                        {post.title}
                      </h5>
                      <p className="mt-1 text-xs text-[var(--muted)] line-clamp-2">
                        {post.excerpt}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "KannadaQuiz",
            url: "https://kannadaquiz.in",
            inLanguage: locale === "kn" ? "kn-IN" : "en-IN",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://kannadaquiz.in/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}
