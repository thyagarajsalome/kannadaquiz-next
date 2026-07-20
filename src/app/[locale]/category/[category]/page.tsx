import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/locales";
import { getPublicPostsByCategory } from "@/lib/public-content";
import { CategoryFilterList } from "@/components/CategoryFilterList";

export const revalidate = 300;

export function generateStaticParams() {
  const categories = ["karnataka", "national", "international", "jobs", "agriculture", "education", "schemes", "tourism", "sports", "technology", "movies"];
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
  technology: { kn: "ಕಂಪ್ಯೂಟರ್ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ", en: "Computer & Technology" },
  movies: { kn: "ಚಲನಚಿತ್ರ ಸುದ್ದಿ", en: "Movies & Cinema" },
  general: { kn: "ಸಾಮಾನ್ಯ ಸುದ್ದಿ", en: "General News" }
};

const categorySynonyms: Record<string, string> = {
  kpsc: "jobs",
  job: "jobs",
  exam: "jobs",
  career: "jobs",
  krishi: "agriculture",
  farm: "agriculture",
  college: "education",
  guide: "education",
  yojane: "schemes",
  heritage: "tourism",
  itihasa: "tourism",
  culture: "tourism",
  game: "sports",
  kriide: "sports",
  tech: "technology",
  computer: "technology",
  ai: "technology",
  intelligence: "technology",
  movie: "movies",
  cinema: "movies",
  film: "movies",
  sandalwood: "movies",
  bollywood: "movies",
  hollywood: "movies"
};

export function resolveCategoryKey(category: string): string {
  const catKey = category.toLowerCase().trim();
  
  if (categoryTranslations[catKey]) {
    return catKey;
  }

  if (categorySynonyms[catKey]) {
    return categorySynonyms[catKey];
  }

  const synonyms = Object.keys(categorySynonyms);
  for (const syn of synonyms) {
    if (catKey.includes(syn)) {
      return categorySynonyms[syn];
    }
  }

  const baseKeys = Object.keys(categoryTranslations);
  for (const base of baseKeys) {
    if (catKey.includes(base)) {
      return base;
    }
  }

  return "general";
}

function getLocalizedCategory(categoryKey: string, locale: string): string {
  const resolvedKey = resolveCategoryKey(categoryKey);
  return categoryTranslations[resolvedKey]?.[locale] || categoryKey;
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
    technology: {
      kn: ["ಕಂಪ್ಯೂಟರ್ ತಂತ್ರಜ್ಞಾನ", "ಆರ್ಟಿಫಿಶಿಯಲ್ ಇಂಟೆಲಿಜೆನ್ಸ್", "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ", "ಸೈಬರ್ ಸೆಕ್ಯುರಿಟಿ", "ಸಾಫ್ಟ್‌ವೇರ್", "ತಂತ್ರಜ್ಞಾನ ಸುದ್ದಿ"],
      en: ["Computer Technology", "Artificial Intelligence", "AI News", "Cybersecurity", "Software Development", "Tech News"]
    },
    general: {
      kn: ["ಸಾಮಾನ್ಯ ಸುದ್ದಿ", "ಕನ್ನಡ ಕ್ವಿಜ್", "ಕನ್ನಡ ವಾರ್ತೆಗಳು", "ಸಾಮಾನ್ಯ ಜ್ಞಾನ"],
      en: ["General News", "Kannada Quiz Portal", "Kannada News Summaries", "GK and Quizzes"]
    }
  };

  const matchedKey = resolveCategoryKey(category);

  return {
    title: locale === "kn" 
      ? `KannadaQuiz - ${catTitle} | ಇತ್ತೀಚಿನ ಮುಖ್ಯಾಂಶಗಳು ಮತ್ತು ಸರಳ ಸಾರಾಂಶ`
      : `KannadaQuiz - ${catTitle} | Latest Headlines & News Summaries`,
    description: locale === "kn"
      ? `ಕನ್ನಡದಲ್ಲೇ ಓದಿ: ${catTitle} ಕುರಿತಾದ ಪ್ರಮುಖ ವಿಶ್ಲೇಷಣೆಗಳು, ಮುಖ್ಯಾಂಶಗಳು ಮತ್ತು ಸರಳ ಸುದ್ದಿ ಸಾರಾಂಶಗಳು.`
      : `Read in English & Kannada: Latest news summaries, exam-focused updates, and analysis on ${catTitle}.`,
    keywords: keywordsMap[matchedKey]?.[locale] || [],
    alternates: {
      canonical: `/${locale}/category/${category}`,
      languages: {
        kn: `/kn/category/${category}`,
        en: `/en/category/${category}`,
      },
    },
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

  const resolvedCategory = resolveCategoryKey(category);
  const posts = await getPublicPostsByCategory(locale, resolvedCategory, 30);

  const catTitle = getLocalizedCategory(resolvedCategory, locale);

  return (
    <section className="kq-container py-10" id="category-section">
      <div className="flex items-center gap-2 border-b-2 border-[var(--secondary)] pb-2 mb-6">
        <span className="w-3 h-6 bg-[var(--secondary)] inline-block"></span>
        <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">
          {catTitle}
        </h1>
      </div>

      <CategoryFilterList initialPosts={posts} locale={locale} categoryKey={category} />
    </section>
  );
}
