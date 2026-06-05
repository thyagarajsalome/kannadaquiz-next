import Link from "next/link";
import { type Locale } from "@/lib/locales";
import { HeaderAuth } from "@/components/HeaderAuth";
import { Logo } from "@/components/Logo";

export function Header({ locale }: { locale: Locale }) {
  return (
    <header className="border-b border-[var(--border)] bg-white">
      <div className="kq-container flex min-h-16 items-center justify-between gap-6">
        <Link href={`/${locale}`} className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--muted)] md:flex">
          <Link
            href={`/${locale}`}
            className="hover:text-[var(--secondary)] flex items-center gap-1 text-[var(--muted)] transition-colors"
            title={locale === "kn" ? "ಮುಖಪುಟ" : "Home"}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
            </svg>
          </Link>
          <Link href={`/${locale}/category/karnataka`}>
            {locale === "kn" ? "ಕರ್ನಾಟಕ ಸುದ್ದಿ" : "Karnataka News"}
          </Link>
          <Link href={`/${locale}/category/national`}>
            {locale === "kn" ? "ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ" : "National News"}
          </Link>
          <Link href={`/${locale}/category/international`}>
            {locale === "kn" ? "ಅಂತರರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ" : "International News"}
          </Link>
          <Link href={`/${locale}/category/jobs`}>
            {locale === "kn" ? "ಉದ್ಯೋಗ ಮಾಹಿತಿ" : "Jobs & Careers"}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <HeaderAuth locale={locale} />
        </div>
      </div>
      
      {/* Mobile Category Scrollbar */}
      <div className="border-t border-[var(--border)] bg-[var(--surface-soft)] md:hidden py-2.5 overflow-x-auto whitespace-nowrap">
        <div className="kq-container flex gap-5 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          <Link href={`/${locale}`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಮುಖಪುಟ" : "Home"}
          </Link>
          <Link href={`/${locale}/category/karnataka`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಕರ್ನಾಟಕ ಸುದ್ದಿ" : "Karnataka"}
          </Link>
          <Link href={`/${locale}/category/national`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ" : "National"}
          </Link>
          <Link href={`/${locale}/category/international`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಅಂತರರಾಷ್ಟ್ರೀಯ" : "International"}
          </Link>
          <Link href={`/${locale}/category/jobs`} className="hover:text-[var(--secondary)]">
            {locale === "kn" ? "ಉದ್ಯೋಗಗಳು" : "Jobs"}
          </Link>
        </div>
      </div>
    </header>
  );
}
