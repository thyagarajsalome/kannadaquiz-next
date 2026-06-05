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
};

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
    if (c.includes("national")) return "national";
    if (c.includes("job") || c.includes("kpsc") || c.includes("exam") || c.includes("career")) return "jobs";
    return "general";
  };

  const karnatakaPosts = posts.filter(p => getCategoryKey(p.category) === "karnataka").slice(0, 3);
  const nationalPosts = posts.filter(p => getCategoryKey(p.category) === "national").slice(0, 3);
  const internationalPosts = posts.filter(p => getCategoryKey(p.category) === "international").slice(0, 3);
  const jobPosts = posts.filter(p => getCategoryKey(p.category) === "jobs").slice(0, 3);

  return (
    <>
      {/* 1. Breaking News Ticker */}
      {posts.length > 0 && (
        <div className="bg-[var(--primary)] text-white text-sm py-2 border-b border-[var(--border)]">
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
                  {heroPost.featuredImageUrl && (
                    <div className="mt-5 overflow-hidden rounded-lg border border-[var(--border)]">
                      <img
                        src={heroPost.featuredImageUrl}
                        alt={heroPost.title}
                        className="w-full max-h-[350px] object-cover hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  )}
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
                            {quiz.exam}
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
                      <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-end">
                        <Link
                          href={`/${locale}/quizzes/${quiz.slug}`}
                          className="bg-[var(--primary)] hover:bg-[var(--secondary)] text-white text-xs font-bold px-3 py-1.5 rounded transition-colors"
                        >
                          {text.quizStart}
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
                      {post.featuredImageUrl && (
                        <div className="mb-3 overflow-hidden rounded border border-[var(--border)]">
                          <img
                            src={post.featuredImageUrl}
                            alt={post.title}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}
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
                      {post.featuredImageUrl && (
                        <div className="mb-3 overflow-hidden rounded border border-[var(--border)]">
                          <img
                            src={post.featuredImageUrl}
                            alt={post.title}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}
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
                      {post.featuredImageUrl && (
                        <div className="mb-3 overflow-hidden rounded border border-[var(--border)]">
                          <img
                            src={post.featuredImageUrl}
                            alt={post.title}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}
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
