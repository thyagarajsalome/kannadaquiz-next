import type { Locale } from "@/lib/locales";

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--primary)] text-white">
      <div className="kq-container grid gap-4 py-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-serif text-xl font-bold">KannadaQuiz</p>
          <p className="mt-1 max-w-2xl text-sm text-white/75">
            {locale === "kn"
              ? "ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಿಗಾಗಿ ವೇಗವಾದ, ಓದಲು ಸುಲಭವಾದ ಅಭ್ಯಾಸ ವೇದಿಕೆ."
              : "Fast, readable preparation for Karnataka competitive exams."}
          </p>
        </div>
        <p className="text-sm text-white/70">© 2026 KannadaQuiz</p>
      </div>
    </footer>
  );
}
