import Link from "next/link";
import { oppositeLocale, type Locale } from "@/lib/locales";
import { siteText } from "@/data/content";

export function Header({ locale }: { locale: Locale }) {
  const text = siteText[locale];
  const other = oppositeLocale(locale);

  return (
    <header className="border-b border-[var(--border)] bg-white">
      <div className="kq-container flex min-h-16 items-center justify-between gap-6">
        <Link href={`/${locale}`} className="font-serif text-2xl font-bold text-[var(--primary)]">
          KannadaQuiz
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--muted)] md:flex">
          <Link href={`/${locale}/quizzes`}>{text.nav[0]}</Link>
          <Link href={`/${locale}/posts`}>{text.nav[1]}</Link>
          <Link href={`/${locale}/jobs`}>{text.nav[2]}</Link>
        </nav>
        <Link
          href={`/${other}`}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--primary)]"
        >
          {text.language}
        </Link>
      </div>
    </header>
  );
}
