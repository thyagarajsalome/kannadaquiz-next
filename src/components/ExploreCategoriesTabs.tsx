"use client";

import { useState } from "react";
import Link from "next/link";

type CategoryTabProps = {
  locale: string;
  categoriesInfo: any[];
};

export function ExploreCategoriesTabs({ locale, categoriesInfo }: CategoryTabProps) {
  const [activeTab, setActiveTab] = useState("exams");

  const tabs = [
    { id: "exams", kn: "ðŸ“š ó†²ó†®ó‡ó†¤ó†®ó‡ó†®ó†¥ó†¥ ó†šó†¸ó‡ó†²ó‡ó†·ó‡ó†—ó†ó‡ó†”ó‡", en: "ðŸ“š Exams & Edu", keys: ['quizzes', 'syllabus', 'question-papers', 'study-materials', 'results', 'preparation-guides', 'education', 'jobs'] },
    { id: "news", kn: "ðŸ“° ó†šó‡ó†°ó†®ó‡ó†– ã†¸ã†ã†¦ã†ó†¦ã†¿ã†—ã†³ã†", en: "ðŸ“° News & Updates", keys: ['karnataka', 'international', 'bangalore', 'schemes'] },
    { id: "info", kn: "ðŸŽ¡ ó†®ó†¾ó†¹ó†¿ó†´ó†¿ ã†®ã†§ã†ó†§ã† ó†¸ó‡‡ó†¥ó‡‡ó†·ó†£ó‡", en: "ðŸŽ¡ Info & Services", keys: ['agriculture', 'technology', 'services', 'expat'] },
    { id: "lifestyle", kn: "ðŸŽ¼ ó†œó‡€ó†µó†¸ó†¶ó‡ˆó†¶ó†¿", en: "ðŸŽ¼ Lifestyle", keys: ['movies', 'sports', 'tourism', 'home-design'] }
  ];

  const activeKeys = tabs.find(t => t.id === activeTab)?.keys || [];
  const filteredCategories = categoriesInfo.filter(c => activeKeys.includes(c.key));

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-6 border-b border-[var(--border)] pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-bold text-sm sm:text-base transition-colors ${
              activeTab === tab.id 
                ? "bg-[var(--secondary)] text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {locale === "kn" ? tab.kn : tab.en}
          </button>
        ))}
      </div>

      <div className="grid gap-2.5 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-9 min-h-[150px]">
        {filteredCategories.map((cat) => (
          <Link
            key={cat.key}
            href={cat.url ? `/${locale}/${cat.url}` : `/${locale}/category/${cat.key}`}
            className=pkq-card px-2 py-3 sm:px-3 sm:py-3.5 flex flex-col items-center text-center justify-between transition-all duration-300 border border-[var(--border)]/60 hover:shadow-sm hover:border-[var(--secondary)]/40 rounded-xl group ${cat.color}`}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[var(--border)]/20 shadow-sm group-hover:scale-110 transition-transform duration-300 mb-2">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: cat.icon }} />
            </div>
            <div className="flex-1 flex flex-col justify-center w-full">
              <span className="text-[11px] xs:text-xs md:text-sm font-bold block text-[var(--primary)] leading-tight w-full break-words px-0.5">
                {locale === "kn" ? cat.kn : cat.en}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
