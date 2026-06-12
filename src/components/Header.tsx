import Link from "next/link";
import { type Locale } from "@/lib/locales";
import { HeaderAuth } from "@/components/HeaderAuth";
import { Logo } from "@/components/Logo";

export function Header({ locale }: { locale: Locale }) {
  return (
    <header className="bg-white md:border-b md:border-[var(--border)]">
      <div className="kq-container flex min-h-16 items-center justify-between gap-6">
        <Link href={`/${locale}`} className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-3 lg:gap-4 xl:gap-6 text-xs lg:text-sm font-semibold text-[var(--muted)] md:flex">
          <Link
            href={`/${locale}`}
            className="hover:text-[var(--secondary)] flex items-center gap-1 text-[var(--muted)] transition-colors whitespace-nowrap"
            title={locale === "kn" ? "ಮುಖಪುಟ" : "Home"}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
            </svg>
          </Link>
          <Link
            href={`/${locale}/quizzes`}
            className="rounded border border-[var(--secondary)] bg-[var(--secondary)] px-3 py-1.5 text-[11px] font-extrabold uppercase text-white hover:bg-[var(--secondary)]/90 hover:border-[var(--secondary)]/90 transition-all shadow-sm select-none whitespace-nowrap"
          >
            {locale === "kn" ? "ಅಭ್ಯಾಸ ಕ್ವಿಜ್‌ಗಳು" : "Practice Quizzes"}
          </Link>
          <Link
            href={`/${locale}/games/gadhe`}
            className="rounded border border-indigo-200 hover:border-indigo-400 bg-indigo-50 px-3 py-1.5 text-[11px] font-extrabold uppercase text-indigo-750 hover:bg-white transition-all shadow-sm select-none whitespace-nowrap"
          >
            {locale === "kn" ? "ಗಾದೆ ಜೋಡಿಸಿ 🧩" : "Proverb Jumble 🧩"}
          </Link>
          <Link
            href={`/${locale}/games/worldcup`}
            className="rounded border border-yellow-250 hover:border-yellow-450 bg-yellow-50 px-3 py-1.5 text-[11px] font-extrabold uppercase text-yellow-900 hover:bg-white transition-all shadow-sm select-none whitespace-nowrap"
          >
            {locale === "kn" ? "ವಿಶ್ವಕಪ್ ⚽" : "World Cup ⚽"}
          </Link>
          <Link href={`/${locale}/category/karnataka`} className="hover:text-[var(--secondary)] transition-colors whitespace-nowrap">
            {locale === "kn" ? "ಕರ್ನಾಟಕ" : "Karnataka"}
          </Link>
          <Link href={`/${locale}/category/national`} className="hover:text-[var(--secondary)] transition-colors whitespace-nowrap">
            {locale === "kn" ? "ರಾಷ್ಟ್ರೀಯ" : "National"}
          </Link>
          <Link href={`/${locale}/category/international`} className="hover:text-[var(--secondary)] transition-colors whitespace-nowrap">
            {locale === "kn" ? "ಅಂತರರಾಷ್ಟ್ರೀಯ" : "International"}
          </Link>
          <Link href={`/${locale}/category/jobs`} className="hover:text-[var(--secondary)] transition-colors whitespace-nowrap">
            {locale === "kn" ? "ಉದ್ಯೋಗಗಳು" : "Jobs"}
          </Link>
          <Link href={`/${locale}/syllabus`} className="hover:text-[var(--secondary)] transition-colors whitespace-nowrap">
            {locale === "kn" ? "ಪಠ್ಯಕ್ರಮ" : "Syllabus"}
          </Link>
          {/* Dropdown Menu for More Categories */}
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-[var(--secondary)] transition-colors font-semibold text-[var(--muted)] py-2 select-none cursor-pointer">
              <span>{locale === "kn" ? "ಇನ್ನಷ್ಟು" : "More"}</span>
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
              </svg>
            </button>
            <div className="absolute left-0 mt-0 hidden group-hover:block bg-white border border-[var(--border)] rounded-lg shadow-lg py-2 min-w-[200px] z-50">
              <Link href={`/${locale}/services`} className="block px-4 py-2 text-sm font-bold text-[var(--secondary)] border-b border-[var(--border)]/30 hover:bg-[var(--surface-soft)] transition-colors">
                {locale === "kn" ? "ಸರ್ಕಾರಿ ಸೇವೆಗಳು 🏛️" : "Gov Services 🏛️"}
              </Link>
              <Link href={`/${locale}/category/technology`} className="block px-4 py-2 text-sm font-bold text-[var(--muted)] hover:text-[var(--secondary)] hover:bg-[var(--surface-soft)] transition-colors">
                {locale === "kn" ? "ಕಂಪ್ಯೂಟರ್ & ತಂತ್ರಜ್ಞಾನ" : "Computer & Tech"}
              </Link>
              <Link href={`/${locale}/category/schemes`} className="block px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--secondary)] hover:bg-[var(--surface-soft)] transition-colors">
                {locale === "kn" ? "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು" : "Government Schemes"}
              </Link>
              <Link href={`/${locale}/category/tourism`} className="block px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--secondary)] hover:bg-[var(--surface-soft)] transition-colors">
                {locale === "kn" ? "ಇತಿಹಾಸ & ಪ್ರವಾಸೋದ್ಯಮ" : "Heritage & Tourism"}
              </Link>
              <Link href={`/${locale}/category/sports`} className="block px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--secondary)] hover:bg-[var(--surface-soft)] transition-colors">
                {locale === "kn" ? "ಕ್ರೀಡೆ" : "Sports"}
              </Link>
              <Link href={`/${locale}/category/agriculture`} className="block px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--secondary)] hover:bg-[var(--surface-soft)] transition-colors">
                {locale === "kn" ? "ಕೃಷಿ" : "Agriculture"}
              </Link>
              <Link href={`/${locale}/category/education`} className="block px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--secondary)] hover:bg-[var(--surface-soft)] transition-colors">
                {locale === "kn" ? "ಶೈಕ್ಷಣಿಕ" : "Education"}
              </Link>
            </div>
          </div>
        </nav>
        <div className="flex items-center gap-4">
          <HeaderAuth locale={locale} />
        </div>
      </div>
      
      {/* Mobile Category Scrollbar */}
      <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] md:hidden py-2.5 overflow-x-auto whitespace-nowrap">
        <div className="kq-container flex gap-5 text-xs font-bold uppercase tracking-wider text-[var(--muted)] items-center">
          <Link href={`/${locale}`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಮುಖಪುಟ" : "Home"}
          </Link>
          <Link
            href={`/${locale}/quizzes`}
            className="bg-[var(--secondary)] text-white px-2 py-0.5 rounded text-[10px] font-extrabold select-none"
          >
            {locale === "kn" ? "ಕ್ವಿಜ್‌ಗಳು" : "Quizzes"}
          </Link>
          <Link href={`/${locale}/syllabus`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಪಠ್ಯಕ್ರಮ" : "Syllabus"}
          </Link>
          <Link href={`/${locale}/games/gadhe`} className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px] font-extrabold select-none">
            {locale === "kn" ? "ಗಾದೆ ಜೋಡಿಸಿ 🧩" : "Proverb Jumble 🧩"}
          </Link>
          <Link href={`/${locale}/games/worldcup`} className="bg-yellow-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black select-none shrink-0">
            {locale === "kn" ? "ವಿಶ್ವಕಪ್ ⚽" : "World Cup ⚽"}
          </Link>
          <Link href={`/${locale}/category/karnataka`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಕರ್ನಾಟಕ" : "Karnataka"}
          </Link>
          <Link href={`/${locale}/category/national`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ರಾಷ್ಟ್ರೀಯ" : "National"}
          </Link>
          <Link href={`/${locale}/category/international`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಅಂತರರಾಷ್ಟ್ರೀಯ" : "International"}
          </Link>
          <Link href={`/${locale}/category/jobs`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಉದ್ಯೋಗಗಳು" : "Jobs"}
          </Link>
          <Link href={`/${locale}/services`} className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-extrabold select-none shrink-0">
            {locale === "kn" ? "ಸೇವೆಗಳು 🏛️" : "Services 🏛️"}
          </Link>
          <Link href={`/${locale}/category/technology`} className="hover:text-[var(--secondary)] shrink-0">
            {locale === "kn" ? "ತಂತ್ರಜ್ಞಾನ" : "Technology"}
          </Link>
          <Link href={`/${locale}/category/schemes`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಯೋಜನೆಗಳು" : "Schemes"}
          </Link>
          <Link href={`/${locale}/category/tourism`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಪ್ರವಾಸೋದ್ಯಮ" : "Tourism"}
          </Link>
          <Link href={`/${locale}/category/sports`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಕ್ರೀಡೆ" : "Sports"}
          </Link>
          <Link href={`/${locale}/category/agriculture`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಕೃಷಿ" : "Krishi"}
          </Link>
          <Link href={`/${locale}/category/education`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಶೈಕ್ಷಣಿಕ" : "Education"}
          </Link>
        </div>
      </div>
    </header>
  );
}
