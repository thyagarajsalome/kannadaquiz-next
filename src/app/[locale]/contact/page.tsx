import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : "kn";
  return {
    title: lang === "kn" ? "ಸಂಪರ್ಕಿಸಿ | Contact Us" : "Contact Us",
    description: "Get in touch with the KannadaQuiz team for inquiries, support, or feedback.",
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return (
    <article className="kq-container max-w-4xl py-10">
      <h1 className="font-serif text-3xl font-bold text-[var(--primary)] mb-8">
        {locale === "kn" ? "ಸಂಪರ್ಕಿಸಿ (Contact Us)" : "Contact Us"}
      </h1>

      <div className="kq-card p-6 md:p-8 space-y-6 text-sm md:text-base leading-relaxed text-[var(--muted)]">
        {locale === "kn" ? (
          <>
            <p>
              ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳು, ಪ್ರತಿಕ್ರಿಯೆಗಳು ಅಥವಾ ಯಾವುದೇ ವಿಚಾರಣೆಗಳಿಗಾಗಿ ನೀವು ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು.
            </p>
            <div className="bg-[var(--surface-soft)] p-6 rounded-lg border border-[var(--border)] mt-4">
              <h3 className="font-bold text-[var(--primary)] mb-2">ಇಮೇಲ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಿ:</h3>
              <p className="font-mono text-[var(--secondary)] font-medium text-lg">kannadaquiz.support@gmail.com</p>
            </div>
            <p>
              ಜಾಹೀರಾತು, ಪಾಲುದಾರಿಕೆ, ಅಥವಾ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಸಂಬಂಧಿಸಿದ ತಾಂತ್ರಿಕ ಸಮಸ್ಯೆಗಳಿದ್ದರೂ ದಯವಿಟ್ಟು ಮೇಲಿನ ಇಮೇಲ್ ವಿಳಾಸಕ್ಕೆ ಬರೆಯಿರಿ. ನಾವು ಆದಷ್ಟು ಬೇಗ ನಿಮಗೆ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತೇವೆ.
            </p>
          </>
        ) : (
          <>
            <p>
              We would love to hear from you! If you have any questions, feedback, or inquiries, please feel free to reach out to us.
            </p>
            <div className="bg-[var(--surface-soft)] p-6 rounded-lg border border-[var(--border)] mt-4">
              <h3 className="font-bold text-[var(--primary)] mb-2">Email Us At:</h3>
              <p className="font-mono text-[var(--secondary)] font-medium text-lg">kannadaquiz.support@gmail.com</p>
            </div>
            <p>
              For advertising, partnerships, or reporting technical issues with the website, drop us an email at the address above. We aim to respond to all queries as soon as possible.
            </p>
          </>
        )}
      </div>
    </article>
  );
}
