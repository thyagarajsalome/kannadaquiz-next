"use client";

import { useRouter } from "next/navigation";

type CategoryTabProps = {
  locale: string;
  categoriesInfo: any[];
};

export function ExploreCategoriesTabs({ locale, categoriesInfo }: CategoryTabProps) {
  const router = useRouter();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      router.push(val);
    }
  };

  const groupedCategories = [
    { label: locale === "kn" ? "༲್༪༰෍༧༾༤෍༮༕ ༪༰༃༕ཌྷ༷ཆ༗༳༁" : "Exams & Education", keys: ['quizzes', 'syllabus', 'question-papers', 'study-materials', 'results', 'preparation-guides', 'education', 'jobs'] },
    { label: locale === "kn" ? "༪ཌྷ༮༮ཁ༖ ༲࿁༤ཌྷ༤ཱྀ༗༳༁" : "News & Updates", keys: ['karnataka', 'international', 'bangalore', 'schemes'] },
    { label: locale === "kn" ? "༮༾ཱྀ༹༤ཱྀ ༮༤ཌྷ༤ ༲ཇབཆ༗༳༁" : "Info & Services", keys: ['agriculture', 'technology', 'services', 'expat'] },
    { label: locale === "kn" ? "༜࿀༕༨༶࿈༲ཱྀ" : "Lifestyle", keys: ['movies', 'sports', 'tourism', 'home-design'] }
  ];

  return (
    <div className="w-full max-w-md mx-auto mb-10 mt-4">
      <label htmlFor="category-select" className="block text-sm font-medium text-[var(--primary)] mb-2">
        {locale === "kn" ? "༆༯ཌྷ༕ཆ ༮༾༑ཱྀ" : "Select a Category"}
      </label>
      <select 
        id="category-select"
        onChange={handleSelect}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--secondary)] focus:ring-[var(--secondary)] sm:text-lg p-3 bg-white border text-[var(--primary)] font-semibold"
        defaultValue=""
      >
        <option value="" disabled>
          {locale === "kn" ? "-- ༕༰ཌྷ༕ཌྷ༨ཌྷ༩ ༆༯ཌྷ༕ཆ ༮༾༑ཱྀ --" : "-- Select Category --"}
        </option>
        
        {groupedCategories.map(group => (
          <optgroup key={group.label} label={group.label}>
            {categoriesInfo.filter(c => group.keys.includes(c.key)).map(cat => (
              <option key={cat.key} value={cat.url ? `/${locale}/${cat.url}` : `/${locale}/category/${cat.key}`}>
                {locale === "kn" ? cat.kn : cat.en}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
