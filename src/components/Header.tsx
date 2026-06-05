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
    </header>
  );
}
