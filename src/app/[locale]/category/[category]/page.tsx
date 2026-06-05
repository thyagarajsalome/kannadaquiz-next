import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/locales";
import { getPublicPosts } from "@/lib/public-content";

export const revalidate = 300;

export function generateStaticParams() {
  const categories = ["karnataka", "national", "international", "jobs", "agriculture", "education", "schemes", "tourism", "sports", "home-design"];
  const params: { locale: string; category: string }[] = [];
  
  // Create paths for both locales and all standard categories
  ["kn", "en"].forEach((locale) => {
    categories.forEach((category) => {
      params.push({ locale, category });
    });
  });
  
  return params;
}

const categoryTranslations: Record<string, Record<string, string>> = {
  karnataka: { kn: "ಕರ್ನಾಟಕ ಸುದ್ದಿ", en: "Karnataka News" },
  national: { kn: "ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "National News" },
  international: { kn: "ಅಂತರರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "International News" },
  jobs: { kn: "ಉದ್ಯೋಗ ಮಾಹಿತಿ", en: "Jobs & Careers" },
  agriculture: { kn: "ಕೃಷಿ ಮಾಹಿತಿ", en: "Agriculture Info" },
  education: { kn: "ಶಿಕ್ಷಣ ಮತ್ತು ಕಾಲೇಜು ಮಾರ್ಗದರ್ಶಿಗಳು", en: "Education & College Guide" },
  schemes: { kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", en: "Government Schemes" },
  tourism: { kn: "ಇತಿಹಾಸ ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮ", en: "Heritage & Tourism" },
  sports: { kn: "ಕ್ರೀಡಾ ಸುದ್ದಿ", en: "Sports News" },
  "home-design": { kn: "ಮನೆ ವಿನ್ಯಾಸ ಮತ್ತು ಯೋಜನೆ", en: "Home Design & Planning" },
  general: { kn: "ಸಾಮಾನ್ಯ ಸುದ್ದಿ", en: "General News" }
};

function getLocalizedCategory(categoryKey: string, locale: string): string {
  return categoryTranslations[categoryKey]?.[locale] || categoryKey;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, category } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const catTitle = getLocalizedCategory(category, locale);

  const keywordsMap: Record<string, Record<Locale, string[]>> = {
    karnataka: {
      kn: ["ಕರ್ನಾಟಕ ಸುದ್ದಿ", "ಬೆಂಗಳೂರು ಸುದ್ದಿ", "ಹವಾಮಾನ ವರದಿ", "ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆ", "ಕರ್ನಾಟಕ ರಾಜಕೀಯ", "ಕನ್ನಡ ವಾರ್ತೆ"],
      en: ["Karnataka News", "Bengaluru News", "Karnataka Rains", "Govt Schemes", "Karnataka Politics"]
    },
    national: {
      kn: ["ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", "ಭಾರತದ ಪ್ರಧಾನಿ", "ದೆಹಲಿ ಅಪ್ಡೇಟ್ಸ್", "ಭಾರತ ಸರ್ಕಾರ", "ದೇಶ ವಿದೇಶ", "ಲೋಕಸಭೆ"],
      en: ["National News India", "Indian Politics", "New Delhi Updates", "Govt of India", "National Events"]
    },
    international: {
      kn: ["ಅಂತರರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", "ಜಾಗತಿಕ ವಿದ್ಯಮಾನಗಳು", "ಅಮೆರಿಕ ಚುನಾವಣೆ", "ವಿಶ್ವ ಸಂಸ್ಥೆ", "ಜಾಗತಿಕ ಯುದ್ಧ", "ರಷ್ಯಾ ಉಕ್ರೇನ್"],
      en: ["International News", "World News Summaries", "Global Affairs", "US Politics", "World Conflicts"]
    },
    jobs: {
      kn: ["ಉದ್ಯೋಗ ಮಾಹಿತಿ", "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಕೆಲಸಗಳು", "ಕೆಪಿಎಸ್‌ಸಿ ನೇಮಕಾತಿ", "ಕೆಇಎ ಫಲಿತಾಂಶ", "ನೇಮಕಾತಿ ಅಧಿಸೂಚನೆ", "ಉದ್ಯೋಗ ವಾರ್ತೆ"],
      en: ["Govt Jobs Karnataka", "KPSC Recruitment 2026", "KEA Exam Results", "Job Vacancies", "Recruitment Notification"]
    },
    agriculture: {
      kn: ["ಕೃಷಿ ಮಾಹಿತಿ", "ಕರ್ನಾಟಕ ಕೃಷಿ", "ರೈತರ ಸುದ್ದಿ", "ಕೃಷಿ ಇಲಾಖೆ"],
      en: ["Agriculture Info", "Karnataka Farmers News", "Krishi News", "Agriculture Department"]
    },
    education: {
      kn: ["ಶಿಕ್ಷಣ ಮಾಹಿತಿ", "ಕಾಲೇಜು ಮಾರ್ಗದರ್ಶಿ", "ಪ್ರವೇಶ ವಿವರಗಳು", "ಬೆಂಗಳೂರು ಕಾಲೇಜುಗಳು"],
      en: ["Education Guide", "College Guide Bengaluru", "Admissions Guide 2026", "Top Colleges Karnataka"]
    },
    schemes: {
      kn: ["ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಯೋಜನೆ", "ಉಚಿತ ಯೋಜನೆಗಳು", "ಅರ್ಜಿ ಸಲ್ಲಿಕೆ"],
      en: ["Government Schemes", "Karnataka Govt Schemes", "Gruha Lakshmi Schemes", "Scheme Applications"]
    },
    tourism: {
      kn: ["ಇತಿಹಾಸ", "ಕರ್ನಾಟಕ ಪ್ರವಾಸೋದ್ಯಮ", "ಹಂಪಿ ಇತಿಹಾಸ", "ಮೈಸೂರು ಅರಮನೆ", "ಕನ್ನಡ ಸಂಸ್ಕೃತಿ"],
      en: ["Karnataka Tourism", "Historical Places Karnataka", "Hampi History", "Mysore Palace", "Karnataka Culture"]
    },
    sports: {
      kn: ["ಕ್ರೀಡಾ ಸುದ್ದಿ", "ಕ್ರಿಕೆಟ್ ಅಪ್ಡೇಟ್ಸ್", "ಐಪಿಎಲ್ ಸುದ್ದಿ", "ಕ್ರೀಡೆ"],
      en: ["Sports News India", "Cricket Updates", "IPL Highlights", "Sports Events"]
    },
    "home-design": {
      kn: ["ಮನೆ ವಿನ್ಯಾಸ", "ಗೃಹ ವಿನ್ಯಾಸ ಸಲಹೆಗಳು", "HDE ಆಪ್", "ಮನೆಯ ನಕ್ಷೆ", "AI ಹೋಮ್ ಡೆಕೋರೇಟರ್"],
      en: ["Home Design Tips", "House Planning Ideas", "HDE App", "AI Homedecorator", "Modern House Plans"]
    },
    general: {
      kn: ["ಸಾಮಾನ್ಯ ಸುದ್ದಿ", "ಕನ್ನಡ ಕ್ವಿಜ್", "ಕನ್ನಡ ವಾರ್ತೆಗಳು", "ಸಾಮಾನ್ಯ ಜ್ಞಾನ"],
      en: ["General News", "Kannada Quiz Portal", "Kannada News Summaries", "GK and Quizzes"]
    }
  };

  const catKey = category.toLowerCase();
  const matchedKey = catKey.includes("karnataka") ? "karnataka" :
                     catKey.includes("international") ? "international" :
                     catKey.includes("national") ? "national" :
                     (catKey.includes("job") || catKey.includes("kpsc") || catKey.includes("exam") || catKey.includes("career")) ? "jobs" :
                     (catKey.includes("agriculture") || catKey.includes("krishi") || catKey.includes("farm")) ? "agriculture" :
                     (catKey.includes("college") || catKey.includes("guide") || catKey.includes("education")) ? "education" :
                     (catKey.includes("scheme") || catKey.includes("yojane")) ? "schemes" :
                     (catKey.includes("tourism") || catKey.includes("heritage") || catKey.includes("itihasa") || catKey.includes("culture")) ? "tourism" :
                     (catKey.includes("sport") || catKey.includes("game") || catKey.includes("kriide")) ? "sports" :
                     (catKey.includes("home") || catKey.includes("design") || catKey.includes("decor")) ? "home-design" : "general";

  return {
    title: locale === "kn" 
      ? `KannadaQuiz - ${catTitle} | ಇತ್ತೀಚಿನ ಮುಖ್ಯಾಂಶಗಳು ಮತ್ತು ಸರಳ ಸಾರಾಂಶ`
      : `KannadaQuiz - ${catTitle} | Latest Headlines & News Summaries`,
    description: locale === "kn"
      ? `ಕನ್ನಡದಲ್ಲೇ ಓದಿ: ${catTitle} ಕುರಿತಾದ ಪ್ರಮುಖ ವಿಶ್ಲೇಷಣೆಗಳು, ಮುಖ್ಯಾಂಶಗಳು ಮತ್ತು ಸರಳ ಸುದ್ದಿ ಸಾರಾಂಶಗಳು.`
      : `Read in English & Kannada: Latest news summaries, exam-focused updates, and analysis on ${catTitle}.`,
    keywords: keywordsMap[matchedKey]?.[locale] || [],
  };
}

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale: rawLocale, category } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

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
    if (c.includes("home") || c.includes("design") || c.includes("decor")) return "home-design";
    return "general";
  };

  const allPosts = await getPublicPosts(locale, 100);
  const posts = allPosts.filter((post) => getCategoryKey(post.category) === category);

  const catTitle = getLocalizedCategory(category, locale);

  return (
    <section className="kq-container py-10">
      <div className="flex items-center gap-2 border-b-2 border-[var(--secondary)] pb-2 mb-6">
        <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
        <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">
          {catTitle}
        </h1>
      </div>

      {posts.length === 0 ? (
        <div className="kq-card p-10 text-center text-[var(--muted)] opacity-70">
          {locale === "kn"
            ? "ಈ ವರ್ಗದಲ್ಲಿ ಪ್ರಸ್ತುತ ಯಾವುದೇ ಸುದ್ದಿಗಳು ಲಭ್ಯವಿಲ್ಲ."
            : "No news articles available in this category yet."}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {posts.map((post) => (
            <div key={post.slug} className="kq-card p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                  <span>{getSourceName(post)}</span>
                  <span>•</span>
                  <time>{post.date}</time>
                </div>
                <Link href={`/${locale}/posts/${post.slug}`} className="group">
                  <h2 className="mt-2 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)]">
                <Link href={`/${locale}/posts/${post.slug}`} className="text-xs font-bold text-[var(--secondary)] hover:underline">
                  {locale === "kn" ? "ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ➔" : "Read More ➔"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
