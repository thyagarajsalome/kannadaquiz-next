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
    title: lang === "kn" ? "ಗೌಪ್ಯತಾ ನೀತಿ | Privacy Policy" : "Privacy Policy",
    description: "Privacy policy for users visiting the KannadaQuiz portal.",
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return (
    <article className="kq-container max-w-3xl py-10">
      <h1 className="font-serif text-3xl font-bold text-[var(--primary)] mb-6">
        {locale === "kn" ? "ಗೌಪ್ಯತಾ ನೀತಿ" : "Privacy Policy"}
      </h1>

      <div className="kq-card p-6 md:p-8 space-y-6 text-sm md:text-base leading-7 text-[var(--muted)]">
        {locale === "kn" ? (
          <>
            <p className="font-medium text-[var(--primary)]">ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ: ಜೂನ್ ೨೦೨೬</p>
            
            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">೧. ನಾವು ಸಂಗ್ರಹಿಸುವ ಮಾಹಿತಿ</h2>
              <p>
                ಕನ್ನಡಕ್ವಿಜ್ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡುವ ಬಳಕೆದಾರರಿಂದ ನಾವು ಯಾವುದೇ ಅತಿಯಾದ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ. ಆದರೆ ಕ್ವಿಜ್ ಪ್ರಗತಿ ಅಥವಾ ವೆಬ್‌ಸೈಟ್ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಉತ್ತಮಗೊಳಿಸಲು ಬ್ರೌಸರ್ ಕುಕೀಸ್ (Cookies) ಮತ್ತು ಅನಾಮಧೇಯ ಲಾಗ್ ಡೇಟಾವನ್ನು ಬಳಸಬಹುದು.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">೨. ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಸೇವೆಗಳು (Third-Party Services)</h2>
              <p>
                ನಮ್ಮ ಮೊಬೈಲ್ ಅಪ್ಲಿಕೇಶನ್ ಲಿಂಕ್‌ಗಳು ಅಥವಾ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ನಾವು ಗೂಗಲ್ ಫೈರ್‌ಬೇಸ್ (Firebase) ಹಾಗೂ ಗೂಗಲ್ ಅನಾಲಿಟಿಕ್ಸ್ ಅನ್ನು ಬಳಸಬಹುದು. ಈ ಸೇವೆಗಳು ತಮ್ಮದೇ ಆದ ಗೌಪ್ಯತಾ ನೀತಿಗಳನ್ನು ಹೊಂದಿರುತ್ತವೆ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">೩. ಡೇಟಾ ಸುರಕ್ಷತೆ</h2>
              <p>
                ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಡೇಟಾದ ಸುರಕ್ಷತೆ ನಮಗೆ ಅತ್ಯಂತ ಮುಖ್ಯವಾಗಿದೆ. ನಾವು ಯಾವುದೇ ಡೇಟಾವನ್ನು ತೃತೀಯ ಸಂಸ್ಥೆಗಳಿಗೆ ಮಾರಾಟ ಮಾಡುವುದಿಲ್ಲ ಅಥವಾ ಹಂಚಿಕೊಳ್ಳುವುದಿಲ್ಲ.
              </p>
            </section>
          </>
        ) : (
          <>
            <p className="font-medium text-[var(--primary)]">Last Updated: June 2026</p>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">1. Information We Collect</h2>
              <p>
                We value your privacy. KannadaQuiz collects minimal information necessary to serve you, such as anonymous analytics data, cookies to remember your site preferences (like locale settings), and standard browser logs. If you register an account, we store your profile email and basic quiz results securely in Firebase.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">2. Third-Party Services</h2>
              <p>
                We may use Google Analytics or Firebase to monitor traffic and enhance site speed. These platforms collect standard hardware/software parameters under their respective privacy policies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">3. Security of Data</h2>
              <p>
                We implement commercial-grade encryption (HTTPS/SSL) to protect your transaction and quiz history. We do not sell or lease user information to third-party advertisers.
              </p>
            </section>
          </>
        )}
      </div>
    </article>
  );
}
