"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/locales";
import type { PublicPost } from "@/lib/public-content";

type SubCategoryConfig = {
  key: string;
  label: string;
};

const subCategoriesMap: Record<Locale, SubCategoryConfig[]> = {
  kn: [
    { key: "all", label: "ಎಲ್ಲಾ ತಂತ್ರಜ್ಞಾನ 🖥️" },
    { key: "AI & Future Tech", label: "AI ಮತ್ತು ಭವಿಷ್ಯದ ತಂತ್ರಜ್ಞಾನ 🤖" },
    { key: "Computer Basics", label: "ಕಂಪ್ಯೂಟರ್ ಶಿಕ್ಷಣ 📚" },
    { key: "Cyber Safety", label: "ಸೈಬರ್ ಸುರಕ್ಷತೆ 🔒" },
    { key: "Mobile & Gadgets", label: "ಮೊಬೈಲ್ ಮತ್ತು ಗ್ಯಾಜೆಟ್ಸ್ 📱" },
    { key: "Careers", label: "ಐಟಿ ಉದ್ಯೋಗ ಮಾರ್ಗದರ್ಶಿ 💼" }
  ],
  en: [
    { key: "all", label: "All Tech 🖥️" },
    { key: "AI & Future Tech", label: "AI & Future Tech 🤖" },
    { key: "Computer Basics", label: "Computer Basics 📚" },
    { key: "Cyber Safety", label: "Cyber Safety 🔒" },
    { key: "Mobile & Gadgets", label: "Mobile & Gadgets 📱" },
    { key: "Careers", label: "Careers & Coding 💼" }
  ]
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

export function CategoryFilterList({
  initialPosts,
  locale,
  categoryKey
}: {
  initialPosts: PublicPost[];
  locale: Locale;
  categoryKey: string;
}) {
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const isTech = categoryKey.toLowerCase() === "technology";
  const subCategories = subCategoriesMap[locale] || [];

  const filteredPosts = isTech
    ? initialPosts.filter((post) => {
        if (selectedSubCategory === "all") return true;
        // Case insensitive comparison for robustness
        return (
          post.subCategory?.toLowerCase().trim() ===
          selectedSubCategory.toLowerCase().trim()
        );
      })
    : initialPosts;

  return (
    <div className="w-full">
      {/* Subcategory Filter Chips */}
      {isTech && initialPosts.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8" id="tech-filters" aria-label="Subcategory filters">
          {subCategories.map((sub) => {
            const isActive = selectedSubCategory === sub.key;
            return (
              <button
                key={sub.key}
                onClick={() => setSelectedSubCategory(sub.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 border cursor-pointer ${
                  isActive
                    ? "bg-[var(--secondary)] border-[var(--secondary)] text-white shadow-md shadow-[var(--secondary)]/25"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--primary)] hover:border-[var(--secondary)] hover:bg-[var(--surface-soft)]"
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="kq-card p-12 text-center text-[var(--muted)] opacity-70 border border-dashed border-[var(--border)] rounded-xl">
          <p className="text-base font-medium">
            {locale === "kn"
              ? "ಈ ವರ್ಗದಲ್ಲಿ ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ಲೇಖನಗಳು ಲಭ್ಯವಿಲ್ಲ."
              : "No articles available in this subcategory yet."}
          </p>
          {isTech && selectedSubCategory !== "all" && (
            <button
              onClick={() => setSelectedSubCategory("all")}
              className="mt-4 text-xs font-bold text-[var(--secondary)] hover:underline cursor-pointer"
            >
              {locale === "kn" ? "ಎಲ್ಲಾ ತಂತ್ರಜ್ಞಾನ ಸುದ್ದಿಗಳನ್ನು ನೋಡಿ" : "Show all technology articles"}
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="kq-card p-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 rounded-xl border border-[var(--border)]"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--secondary)]">
                  <span>{getSourceName(post)}</span>
                  <div className="flex items-center gap-1.5">
                    {post.subCategory && isTech && (
                      <span className="bg-[var(--surface-soft)] text-[10px] text-[var(--muted)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                        {
                          subCategories.find((s) => s.key === post.subCategory)
                            ?.label || post.subCategory
                        }
                      </span>
                    )}
                    <span>•</span>
                    <time>{post.date}</time>
                  </div>
                </div>
                <Link href={`/${locale}/posts/${post.slug}`} className="group">
                  <h2 className="mt-2.5 font-serif text-base font-bold text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-2 leading-relaxed">
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-2 text-xs leading-5 text-[var(--muted)] line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <Link
                  href={`/${locale}/posts/${post.slug}`}
                  className="text-xs font-bold text-[var(--secondary)] hover:underline flex items-center gap-1"
                >
                  {locale === "kn" ? "ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ➔" : "Read More ➔"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
