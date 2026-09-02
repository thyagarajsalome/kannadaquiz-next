import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteText } from "@/data/content";
import { HeroSlider } from "@/components/HeroSlider";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicCurrentAffairs, getPublicPosts, getPublicQuizzes, getPublicPostsByCategory, getPublicPostBySlug, getPublicFeaturedPosts, type PublicPost } from "@/lib/public-content";

export const revalidate = 86400; // Aggressive 1-hour cache to save Firestore reads

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// DEVELOPER FEATURE: Pin/Feature custom articles of your choice onto the Homepage!
// Simply copy and paste the Firestore article slugs into this array to highlight them.
const FEATURED_POST_SLUGS: Record<Locale, string[]> = {
  kn: [
    "house-construction-cost-estimation-guide-kannada", // Selected article 1
    "ind-vs-afg-versatile-kl-rahul-key-to-indias-2027-odi-world-cup-plans---the-times-of-india" // Selected article 2
  ],
  en: [
    "how-trumps-white-house-ballroom-plan-has-doubled-in-size-and-cost-over-a-year", // Selected article 1
    "ind-vs-afg-versatile-kl-rahul-key-to-indias-2027-odi-world-cup-plans---the-times-of-india" // Selected article 2
  ]
};

const trendingTopics: Record<string, { name: string; url: string }[]> = {
  kn: [
    { name: "ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆ ಕ್ವಿಜ್", url: "/kn/quizzes" },
    { name: "ಉದ್ಯೋಗ ಮಾಹಿತಿ", url: "/kn/category/jobs" },
    { name: "ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು", url: "/kn/category/current-affairs" },
    { name: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", url: "/kn/category/schemes" },
    { name: "ಪರೀಕ್ಷಾ ಪಠ್ಯಕ್ರಮ", url: "/kn/syllabus" },
    
  ],
  en: [
    { name: "Competitive Exam Quizzes", url: "/en/quizzes" },
    { name: "Government Jobs", url: "/en/category/jobs" },
    { name: "Current Affairs", url: "/en/category/current-affairs" },
    { name: "Government Schemes", url: "/en/category/schemes" },
    { name: "Exam Syllabus", url: "/en/syllabus" },
    
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
        ? "ಕನ್ನಡ ಓದುಗರಿಗೆ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ತಯಾರಿ, ರಸಪ್ರಶ್ನೆಗಳು, ಕರ್ನಾಟಕ ಇತಿಹಾಸ, ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಉಪಯುಕ್ತ ಮಾಹಿತಿ ಮುಖ್ಯಾಂಶಗಳು."
        : "Free competitive exam preparation, quizzes, Karnataka history, technology, and useful resources for Kannada readers.",
    keywords:
      lang === "kn"
        ? [
            "ಕನ್ನಡ ರಸಪ್ರಶ್ನೆ", "ಕರ್ನಾಟಕ ಇತಿಹಾಸ", "ಮನೆ ವಿನ್ಯಾಸ", "ಕನ್ನಡ ಸಿನಿಮಾ",
            "ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು", "ಕಂಪ್ಯೂಟರ್ ಶಿಕ್ಷಣ", "ಕೃಷಿ ಮಾಹಿತಿ", "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು"
          ]
        : [
            "Kannada Quiz", "Karnataka History", "Home Design", "Kannada Movies",
            "GK Questions", "Computer Education", "Agriculture News", "Government Schemes"
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
  technology: { kn: "ಕಂಪ್ಯೂಟರ್ & ತಂತ್ರಜ್ಞಾನ", en: "Computer & Tech" },
  movies: { kn: "ಚಲನಚಿತ್ರ ಸುದ್ದಿ", en: "Movies & Cinema" },
  "home-design": { kn: "ಮನೆ ವಿನ್ಯಾಸ ಮತ್ತು ರಿಯಲ್ ಎಸ್ಟೇಟ್", en: "Home Design & Real Estate" },
  general: { kn: "ಸಾಮಾನ್ಯ ಸುದ್ದಿ", en: "General News" }
};

function getLocalizedCategory(category: string, locale: string): string {
  const norm = category.toLowerCase();
  if (norm.includes("karnataka")) return categoryTranslations.karnataka[locale] || category;
  if (norm.includes("international")) return categoryTranslations.international[locale] || category;
  if (norm.includes("national")) return categoryTranslations.national[locale] || category;
  if (norm.includes("movie") || norm.includes("cinema") || norm.includes("film") || norm.includes("sandalwood")) {
    return categoryTranslations.movies[locale] || category;
  }
  if (norm.includes("home") || norm.includes("design") || norm.includes("interior") || norm.includes("plan") || norm.includes("real estate") || norm.includes("estate") || norm.includes("promotion")) {
    return categoryTranslations["home-design"][locale] || category;
  }
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
  if (norm.includes("technology") || norm.includes("tech") || norm.includes("computer") || norm.includes("ai") || norm.includes("intelligence")) {
    return categoryTranslations.technology[locale] || category;
  }
  return categoryTranslations.general[locale] || category;
}

const sectionTitles: Record<string, Record<Locale, string>> = {
  breaking: { kn: "ಮುಖ್ಯಾಂಶಗಳು", en: "Breaking News" },
  recent: { kn: "ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳು", en: "Recent News" },
  karnataka: { kn: "ಕರ್ನಾಟಕ ಸುದ್ದಿ", en: "Karnataka News" },
  quizzes: { kn: "ದಿನನಿತ್ಯದ ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಮತ್ತು ರಸಪ್ರಶ್ನೆಗಳು", en: "General Knowledge & Quizzes" },
  readMore: { kn: "ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ➔", en: "Read More ➔" },
  latestAffairs: { kn: "ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು", en: "Current Affairs" },
  agriculture: { kn: "ಕೃಷಿ ಮತ್ತು ಕೃಷಿ ಪರೀಕ್ಷೆಗಳ ಮಾಹಿತಿ", en: "Agriculture & Krishi News" },
  education: { kn: "ಶಿಕ್ಷಣ ಮತ್ತು ಕಾಲೇಜು ಮಾರ್ಗದರ್ಶಿಗಳು", en: "College & Education Guides" },
  schemes: { kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಅಪ್ಡೇಟ್ಸ್", en: "Government Schemes & Updates" },
  tourism: { kn: "ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮ", en: "Karnataka Heritage & Tourism" },
  sports: { kn: "ಕ್ರೀಡಾ ಸುದ್ದಿ ಮತ್ತು ಅಪ್ಡೇಟ್ಸ್", en: "Sports News & Updates" },
  technology: { kn: "ಕಂಪ್ಯೂಟರ್ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ (Technology & AI)", en: "Computer & Technology (AI)" },
  movies: { kn: "ಚಲನಚಿತ್ರ ಸುದ್ದಿ ಮತ್ತು ಸಿನಿಮಾ", en: "Movies & Cinema Updates" },
  "home-design": { kn: "ಮನೆ ವಿನ್ಯಾಸ ಮತ್ತು ಗೃಹಾಲಂಕಾರ", en: "Home Design & Interior Trends" },
  international: { kn: "ಅಂತರರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ ಮುಖ್ಯಾಂಶಗಳು", en: "International News Highlights" },
};

const categoriesInfo = [
  {
    key: "quizzes",
    kn: "ರಸಪ್ರಶ್ನೆಗಳು",
    en: "Quizzes",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
    color: "text-rose-755 bg-rose-50 hover:bg-rose-100 hover:border-rose-300",
    url: "quizzes"
  },
  {
    key: "syllabus",
    kn: "ಪಠ್ಯಕ್ರಮ",
    en: "Syllabus",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />`,
    color: "text-cyan-755 bg-cyan-50 hover:bg-cyan-100 hover:border-cyan-300",
    url: "syllabus"
  },
  {
    key: "technology",
    kn: "ತಂತ್ರಜ್ಞಾನ",
    en: "Tech & AI",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`,
    color: "text-blue-755 bg-blue-50 hover:bg-blue-100 hover:border-blue-300",
    url: "category/technology"
  },

  
  {
    key: "education",
    kn: "ಶೈಕ್ಷಣಿಕ ಮಾರ್ಗದರ್ಶಿ",
    en: "Education Guide",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 14v6a3 3 0 003 3h10a3 3 0 003-3v-6" />`,
    color: "text-purple-755 bg-purple-50 hover:bg-purple-100 hover:border-purple-300",
    url: "education"
  },
  {
    key: "jobs",
    kn: "ಉದ್ಯೋಗಗಳು",
    en: "Jobs",
    icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`,
    color: "text-slate-700 bg-slate-50 hover:bg-slate-100 hover:border-slate-300",
    url: "category/jobs"
  },
  
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

interface PostGridCardProps {
  post: PublicPost;
  locale: Locale;
  readMoreText: string;
}

function PostGridCard({ post, locale, readMoreText }: PostGridCardProps) {
  return (
    <div className="kq-card overflow-hidden flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-xl border border-[var(--border)]">
      <div>
        {post.featuredImageUrl && (
          <Link href={`/${locale}/posts/${post.slug}`} prefetch={false} className="block overflow-hidden aspect-video border-b border-[var(--border)]/40 hover:opacity-95 transition-opacity relative">
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
          </Link>
        )}
        <div className="p-4 pb-0">
          <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
            <span>{getSourceName(post)}</span>
            <span>•</span>
            <time>{post.date}</time>
          </div>
          <Link href={`/${locale}/posts/${post.slug}`} prefetch={false} className="group">
            <h4 className="mt-2.5 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2 leading-relaxed">
              {post.title}
            </h4>
          </Link>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
            {post.excerpt}
          </p>
        </div>
      </div>
      <div className="mt-4 p-4 pt-3 border-t border-[var(--border)]">
        <Link href={`/${locale}/posts/${post.slug}`} prefetch={false} className="text-xs font-bold text-[var(--secondary)] hover:underline">
          {readMoreText}
        </Link>
      </div>
    </div>
  );
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const text = siteText[locale];
  
  const [currentAffairs, posts, quizzes, technologyPosts, dbFeaturedPosts] = await Promise.all([
    getPublicCurrentAffairs(locale, 8),
    getPublicPosts(locale, 45),
    getPublicQuizzes(locale, 4),
    getPublicPostsByCategory(locale, "technology", 3),
    getPublicFeaturedPosts(locale, 5),
  ]);

  // 1. Find all manually featured posts from our database (where isFeatured === true)
  const manuallyFeatured = dbFeaturedPosts;

  // 2. Select featured posts (manually featured takes priority, fallback to latest standard posts if none or only 1 is selected)
  let featuredPosts: PublicPost[] = [...manuallyFeatured];

  if (featuredPosts.length < 4) {
    const remainingCount = 4 - featuredPosts.length;
    const featuredSlugsSet = new Set(featuredPosts.map(p => p.slug));
    const latestFallback = posts
      .filter(p => !featuredSlugsSet.has(p.slug))
      .slice(0, remainingCount);
    featuredPosts = [...featuredPosts, ...latestFallback];
  }

  // Cleanly limit to exactly 4 featured posts
  featuredPosts = featuredPosts.slice(0, 4);

  const featuredSlugsSet = new Set(featuredPosts.map(p => p.slug));
  const standardPosts = posts.filter(p => !featuredSlugsSet.has(p.slug));

  const heroPosts = standardPosts.slice(0, 3); // Top 3 standard posts for the hero slider
  const heroPost = heroPosts[0] || null;
  const recentHeadlines = standardPosts.slice(3, 7); // Next 4 for recent headlines

  // ... (getCategoryKey remains the same) ...

  const getCategoryKey = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("karnataka")) return "karnataka";
    if (c.includes("international")) return "international";
    if (c.includes("agriculture") || c.includes("krishi") || c.includes("farm")) return "agriculture";
    if (c.includes("college") || c.includes("guide") || c.includes("education")) return "education";
    if (c.includes("scheme") || c.includes("yojane")) return "schemes";
    if (c.includes("tourism") || c.includes("heritage") || c.includes("itihasa") || c.includes("culture")) return "tourism";
    if (c.includes("sport") || c.includes("game") || c.includes("kriide")) return "sports";
    if (c.includes("technology") || c.includes("tech") || c.includes("computer") || c.includes("ai") || c.includes("intelligence")) return "technology";
    if (c.includes("movie") || c.includes("cinema") || c.includes("film") || c.includes("sandalwood")) return "movies";
    if (c.includes("home") || c.includes("design") || c.includes("interior") || c.includes("plan") || c.includes("real estate") || c.includes("estate") || c.includes("promotion")) return "home-design";
    return "general";
  };

  // 3. Track all posts displayed in the top folds to guarantee absolute zero repetition on the homepage
  const displayedSlugsSet = new Set<string>();
  featuredPosts.forEach(p => displayedSlugsSet.add(p.slug));
  heroPosts.forEach(p => displayedSlugsSet.add(p.slug));
  recentHeadlines.forEach(p => displayedSlugsSet.add(p.slug));

  // Exclude already displayed posts from bottom categorized rows
  const remainingPostsForCategories = posts.filter(p => !displayedSlugsSet.has(p.slug));

  const karnatakaPosts: any[] = [];
  const internationalPosts: any[] = [];
  const agriculturePosts: any[] = [];
  const educationPosts = remainingPostsForCategories.filter(p => getCategoryKey(p.category) === "education").slice(0, 3);
  const schemesPosts: any[] = [];
  const tourismPosts: any[] = [];
  const sportsPosts: any[] = [];
  const moviesPosts: any[] = [];
  const homeDesignPosts: any[] = [];
  const cleanTechnologyPosts: any[] = [];

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
                  href={`/${locale}/syllabus`}
                  className="bg-white/10 hover:bg-white/20 text-white text-center font-bold px-8 py-4 rounded-xl border border-white/20 transition-all duration-300 text-base whitespace-nowrap select-none flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {locale === "kn" ? "ಪಠ್ಯಕ್ರಮ ಮಾಹಿತಿ" : "Exam Syllabus"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Stats Bar */}
      <div className="py-4 bg-white border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 md:gap-20 text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-[var(--secondary)]">100+</span>
              <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mt-1">{locale === 'kn' ? 'ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು' : 'Practice Questions'}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-[var(--secondary)]">10+</span>
              <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mt-1">{locale === 'kn' ? 'ವಿಷಯವಾರು ರಸಪ್ರಶ್ನೆಗಳು' : 'Subject Quizzes'}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-[var(--secondary)]">Daily</span>
              <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mt-1">{locale === 'kn' ? 'ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು' : 'Current Affairs'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1d. Browse by Category Grid Section */}
      <section className="py-10 bg-[var(--surface-soft)] border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="flex items-center gap-2 border-b-2 border-[var(--secondary)] pb-2 mb-6">
            <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
            <h3 className="font-serif text-2xl font-bold text-[var(--primary)]">
              {locale === "kn" ? "ವರ್ಗಾವಾರು ಸುದ್ದಿ ಓದಿ (Explore Categories)" : "Explore by Category"}
            </h3>
          </div>
 
          <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {categoriesInfo.map((cat) => (
              <Link
                key={cat.key}
                href={cat.url ? `/${locale}/${cat.url}` : `/${locale}/category/${cat.key}`}
                className={`kq-card p-4 sm:p-5 flex items-center gap-4 transition-all duration-300 border border-[var(--border)]/60 hover:shadow-md hover:border-[var(--secondary)]/50 rounded-2xl group ${cat.color}`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex shrink-0 items-center justify-center bg-white border border-[var(--border)]/30 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: cat.icon }} />
                </div>
                <div className="flex-1">
                  <span className="text-base sm:text-lg font-bold block text-[var(--primary)] leading-tight">
                    {locale === "kn" ? cat.kn : cat.en}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 1e. Pinned/Featured Articles Section (Developer Feature) */}
      {featuredPosts.length > 0 && (
        <section className="py-8 bg-gradient-to-b from-white to-[var(--surface-soft)] border-b border-[var(--border)]">
          <div className="kq-container">
            {/* Header */}
            <div className="flex items-center gap-2 border-b-2 border-[var(--secondary)] pb-2 mb-6">
              <svg className="w-6 h-6 text-[var(--secondary)] shrink-0 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <h3 className="font-serif text-2xl font-black text-[var(--primary)]">
                {locale === "kn" ? "ವೇದಿಕೆಯ ಆಯ್ದ ಪ್ರಮುಖ ಲೇಖನಗಳು (Highlights)" : "Featured Highlights"}
              </h3>
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredPosts.map((post) => (
                <div 
                  key={post.slug}
                  className="group relative overflow-hidden bg-white border border-[var(--border)] hover:border-[var(--secondary)] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"></div>
                  
                  <div>
                    {post.featuredImageUrl && (
                      <Link href={`/${locale}/posts/${post.slug}`} className="block overflow-hidden aspect-[21/9] border-b border-[var(--border)]/45 relative">
                        <Image
                          src={post.featuredImageUrl}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                      </Link>
                    )}
                    
                    <div className="p-5 md:p-6 pb-0">
                      <div className="flex items-center flex-wrap gap-2 text-xs font-extrabold uppercase tracking-wider text-[var(--secondary)]">
                        <span>{getLocalizedCategory(post.category, locale)}</span>
                        <span>•</span>
                        <span>{getSourceName(post)}</span>
                        <span>•</span>
                        <time>{post.date}</time>
                      </div>
                      
                      <Link href={`/${locale}/posts/${post.slug}`} className="block mt-2">
                        <h4 className="font-serif text-xl font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h4>
                      </Link>
                      
                      <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] line-clamp-3">
                        {post.excerpt || post.body}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 md:p-6 pt-4 border-t border-[var(--border)]/60 bg-[var(--surface-soft)]/20 mt-4">
                    <Link 
                      href={`/${locale}/posts/${post.slug}`} 
                      className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[var(--secondary)] hover:underline"
                    >
                      <span>{sectionTitles.readMore[locale]}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
 
      

      {/* 2. Daily Challenge */}
      <section className="py-8 bg-white border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 shrink-0 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-inner">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 mb-1 block">
                  {locale === 'kn' ? 'ಇಂದಿನ ಸವಾಲು' : 'Challenge of the Day'}
                </span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-800">
                  {locale === 'kn' ? '10 ಪ್ರಶ್ನೆಗಳ ಮಿಶ್ರ ರಸಪ್ರಶ್ನೆ' : '10-Question Mixed Mock Test'}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {locale === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಿ. ಪ್ರತಿದಿನ ಹೊಸ ಪ್ರಶ್ನೆಗಳು!' : 'Test your general knowledge. Fresh questions every 24 hours!'}
                </p>
              </div>
            </div>
            <Link
              href={`/${locale}/quizzes`}
              className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-wider text-sm px-8 py-3.5 rounded-xl transition-colors shadow-md hover:shadow-lg"
            >
              {locale === 'kn' ? 'ಸವಾಲು ಸ್ವೀಕರಿಸಿ ➔' : 'Start Challenge ➔'}
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Featured Quizzes */}
      <section className="py-10 bg-[var(--surface-soft)] border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="w-full">
            {/* Featured Quizzes */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--primary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)]">
                  {sectionTitles.quizzes[locale]}
                </h3>
                <Link href={`/${locale}/quizzes`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
                  {locale === "kn" ? "ಎಲ್ಲಾ ಕ್ವಿಜ್‌ಗಳು ➔" : "View All Quizzes ➔"}
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {quizzes.length === 0 ? (
                  <div className="kq-card p-6 col-span-full text-center text-[var(--muted)]">
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
                  <PostGridCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    readMoreText={sectionTitles.readMore[locale]}
                  />
                ))}
              </div>
            </div>
          )}          {/* International News Section */}
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
                  <PostGridCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    readMoreText={sectionTitles.readMore[locale]}
                  />
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
                  <PostGridCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    readMoreText={sectionTitles.readMore[locale]}
                  />
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
                  <PostGridCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    readMoreText={sectionTitles.readMore[locale]}
                  />
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
                  <PostGridCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    readMoreText={sectionTitles.readMore[locale]}
                  />
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
                  <PostGridCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    readMoreText={sectionTitles.readMore[locale]}
                  />
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
                  <PostGridCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    readMoreText={sectionTitles.readMore[locale]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Computer & Technology Section */}
          {cleanTechnologyPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                  {sectionTitles.technology[locale]}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {cleanTechnologyPosts.map((post) => (
                  <PostGridCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    readMoreText={sectionTitles.readMore[locale]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Movies & Cinema Section */}
          {moviesPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                  {sectionTitles.movies[locale]}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {moviesPosts.map((post) => (
                  <PostGridCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    readMoreText={sectionTitles.readMore[locale]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Home Design & Interior Decor Section */}
          {homeDesignPosts.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--secondary)] pb-2 mb-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                  <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
                  {sectionTitles["home-design"][locale]}
                </h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {homeDesignPosts.map((post) => (
                  <PostGridCard
                    key={post.slug}
                    post={post}
                    locale={locale}
                    readMoreText={sectionTitles.readMore[locale]}
                  />
                ))}
              </div>
            </div>
          )}

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
