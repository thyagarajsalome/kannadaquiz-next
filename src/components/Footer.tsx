import type { Locale } from "@/lib/locales";
import Link from "next/link";
import { version } from "../../package.json";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--primary)] text-white">
      <div className="kq-container grid gap-4 py-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-serif text-xl font-bold">KannadaQuiz</p>
          <p className="mt-1 max-w-2xl text-sm text-white/75">
            {locale === "kn"
              ? "ಕನ್ನಡ ಓದುಗರಿಗೆ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ತಯಾರಿ, ಉದ್ಯೋಗ ಮಾಹಿತಿ, ಮತ್ತು ರಸಪ್ರಶ್ನೆಗಳನ್ನು ಒದಗಿಸುವ ಶೈಕ್ಷಣಿಕ ವೇದಿಕೆ."
              : "An educational platform providing competitive exam prep, job updates, and quizzes for Kannada readers."}
          </p>
          <p className="mt-2.5 text-xs text-white/50">
            {locale === "kn" ? "ಸಂಪರ್ಕ ಮತ್ತು ಬೆಂಬಲ: " : "Contact & Support: "}
            <a href="mailto:kannadaquiz.support@gmail.com" className="hover:underline text-white/50">
              kannadaquiz.support@gmail.com
            </a>
          </p>
        </div>
        <div className="flex flex-col md:items-end gap-2 shrink-0">
          <div className="flex flex-wrap gap-4 text-xs text-white/80">
            <Link href={`/${locale}/about`} className="hover:text-white hover:underline">
              {locale === "kn" ? "ನಮ್ಮ ಬಗ್ಗೆ (About)" : "About Us"}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-white hover:underline">
              {locale === "kn" ? "ಸಂಪರ್ಕಿಸಿ (Contact)" : "Contact Us"}
            </Link>
            <Link href={`/${locale}/disclaimer`} className="hover:text-white hover:underline">
              {locale === "kn" ? "ಹಕ್ಕುತ್ಯಾಗ (Disclaimer)" : "Disclaimer"}
            </Link>
            <Link href={`/${locale}/privacy`} className="hover:text-white hover:underline">
              {locale === "kn" ? "ಗೌಪ್ಯತಾ ನೀತಿ (Privacy)" : "Privacy Policy"}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-white hover:underline">
              {locale === "kn" ? "ನಿಯಮಗಳು (Terms)" : "Terms & Conditions"}
            </Link>
          </div>
          <div className="flex items-center gap-2 md:justify-end">
            <p className="text-sm text-white/60">© 2026 KannadaQuiz</p>
            <span className="text-[10px] text-white/40 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10 select-none">v{version}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
