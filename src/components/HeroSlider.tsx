"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { type PublicPost } from "@/lib/public-content";
import { type Locale } from "@/lib/locales";

interface HeroSliderProps {
  posts: PublicPost[];
  locale: Locale;
  readMoreText: string;
}

// Local helper matching page.tsx translations
const categoryTranslations: Record<string, Record<string, string>> = {
  karnataka: { kn: "ಕರ್ನಾಟಕ ಸುದ್ದಿ", en: "Karnataka News" },
  national: { kn: "ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "National News" },
  international: { kn: "ಅಂತರರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ", en: "International News" },
  agriculture: { kn: "ಕೃಷಿ ಮಾಹಿತಿ", en: "Agriculture News" },
  education: { kn: "ಶೈಕ್ಷಣಿಕ", en: "Education" },
  schemes: { kn: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", en: "Govt Schemes" },
  tourism: { kn: "ಇತಿಹಾಸ ಪ್ರವಾಸ", en: "Heritage" },
  sports: { kn: "ಕ್ರೀಡೆ", en: "Sports" },
  technology: { kn: "ತಂತ್ರಜ್ಞಾನ", en: "Tech & AI" },
  movies: { kn: "ಚಲನಚಿತ್ರಗಳು", en: "Movies" },
  general: { kn: "ಸಾಮಾನ್ಯ ಮಾಹಿತಿ", en: "General" }
};

function getLocalizedCategory(category: string, locale: Locale) {
  const norm = category.toLowerCase();
  if (norm.includes("karnataka")) return categoryTranslations.karnataka[locale] || category;
  if (norm.includes("international")) return categoryTranslations.international[locale] || category;
  if (norm.includes("national")) return categoryTranslations.national[locale] || category;
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

function getSourceName(post: PublicPost) {
  if (post.sourceName) return post.sourceName;
  if (!post.sourceUrl) return "";
  try {
    const url = new URL(post.sourceUrl);
    return url.hostname.replace(/^(www\.|feeds\.|rss\.)/, "");
  } catch {
    return "News Source";
  }
}

export function HeroSlider({ posts, locale, readMoreText }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const totalSlides = posts.length;

  // Removed setInterval auto-play to achieve 90+ Lighthouse mobile performance score.
  // The timer causes constant CPU wake-ups and layout shifts which Lighthouse strictly penalizes.

  const changeSlide = (newIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 300); // match duration-300 transition
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % totalSlides;
    changeSlide(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    changeSlide(prevIndex);
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (totalSlides === 0) return null;

  const activePost = posts[currentIndex];

  return (
    <div 
      className="flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--border)] pb-8 lg:pb-0 lg:pr-8 relative select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide Content wrapper with fade transition */}
      <div className={`transition-all duration-300 ease-in-out ${isTransitioning ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0"}`}>
        <div>
          {activePost.featuredImageUrl && (
            <Link href={`/${locale}/posts/${activePost.slug}`} className="block overflow-hidden aspect-[21/9] border-b border-[var(--border)]/45 relative mb-4">
              <Image
                src={activePost.featuredImageUrl}
                alt={activePost.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          )}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--secondary)] mt-2">
            <span className="bg-[var(--secondary)]/10 text-[var(--secondary)] px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-widest mr-1">
              {locale === "kn" ? "ವಿಶೇಷ ಸುದ್ದಿ" : "PINNED"}
            </span>
            <span>{getLocalizedCategory(activePost.category, locale)}</span>
            <span>•</span>
            <span>{getSourceName(activePost)}</span>
            <span>•</span>
            <time>{activePost.date}</time>
          </div>
          <Link href={`/${locale}/posts/${activePost.slug}`} className="group block">
            <h2 className="mt-3 font-serif text-3xl md:text-4xl font-bold leading-tight text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors line-clamp-3">
              {activePost.title}
            </h2>
          </Link>
          <p className="mt-4 text-base leading-7 text-[var(--muted)] line-clamp-4">
            {activePost.excerpt || (activePost.body && activePost.body.substring(0, 180) + "...")}
          </p>
        </div>
        <div className="mt-6">
          <Link
            href={`/${locale}/posts/${activePost.slug}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-[var(--secondary)] hover:underline"
          >
            {readMoreText}
          </Link>
        </div>
      </div>

      {/* Control Dots & Arrow Buttons */}
      {totalSlides > 1 && (
        <div className="mt-8 flex items-center justify-between">
          {/* Progress dots */}
          <div className="flex gap-2">
            {posts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => changeSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? "bg-[var(--secondary)] w-6" : "bg-[var(--border)] hover:bg-[var(--muted)]"}`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Nav arrows */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--secondary)] hover:border-[var(--secondary)] bg-white hover:bg-[var(--surface-soft)] transition-all cursor-pointer shadow-sm"
              title={locale === "kn" ? "ಹಿಂದಿನ ಸುದ್ದಿ" : "Previous"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path>
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--secondary)] hover:border-[var(--secondary)] bg-white hover:bg-[var(--surface-soft)] transition-all cursor-pointer shadow-sm"
              title={locale === "kn" ? "ಮುಂದಿನ ಸುದ್ದಿ" : "Next"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
