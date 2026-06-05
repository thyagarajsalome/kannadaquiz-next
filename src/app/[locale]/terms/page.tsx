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
    title: lang === "kn" ? "ಬಳಕೆಯ ನಿಯಮಗಳು | Terms & Conditions" : "Terms & Conditions",
    description: "Terms and conditions governing the use of KannadaQuiz news and quiz portal.",
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return (
    <article className="kq-container max-w-3xl py-10">
      <h1 className="font-serif text-3xl font-bold text-[var(--primary)] mb-6">
        {locale === "kn" ? "ಬಳಕೆಯ ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು" : "Terms & Conditions"}
      </h1>

      <div className="kq-card p-6 md:p-8 space-y-6 text-sm md:text-base leading-7 text-[var(--muted)]">
        {locale === "kn" ? (
          <>
            <p className="font-medium text-[var(--primary)]">ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ: ಜೂನ್ ೨೦೨೬</p>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">೧. ನಿಯಮಗಳ ಒಪ್ಪಿಗೆ</h2>
              <p>
                ಕನ್ನಡಕ್ವಿಜ್ ವೆಬ್‌ಸೈಟ್ ಬಳಸುವ ಮೂಲಕ, ನೀವು ನಮ್ಮ ನಿಯಮಗಳು, ಹಕ್ಕುತ್ಯಾಗಗಳು ಮತ್ತು ಗೌಪ್ಯತಾ ನೀತಿಗಳಿಗೆ ಬದ್ಧರಾಗಿರಲು ಒಪ್ಪುತ್ತೀರಿ. ನೀವು ಈ ನಿಯಮಗಳನ್ನು ಒಪ್ಪದಿದ್ದರೆ, ದಯವಿಟ್ಟು ಸೈಟ್ ಬಳಸಬೇಡಿ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">೨. ಕೃತಿಸ್ವಾಮ್ಯ ಮತ್ತು ವಿಷಯ ತೆಗೆದುಹಾಕುವಿಕೆ ವಿನಂತಿಗಳು (DMCA / Copyright Take-Down)</h2>
              <p>
                ನಾವು ಬೌದ್ಧಿಕ ಆಸ್ತಿ ಹಕ್ಕುಗಳನ್ನು ಗೌರವಿಸುತ್ತೇವೆ. ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಸುದ್ದಿ ಸಂಗ್ರಹಣೆ ಹಾಗೂ ಅನುವಾದವನ್ನು ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ತಯಾರಿಗಾಗಿ ಮಾತ್ರ ಮಾಡುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ಸುದ್ದಿಯ ಕೊನೆಯಲ್ಲಿ ನಾವು ಮೂಲ ಸುದ್ದಿಯ ಲಿಂಕ್ ಅನ್ನು ನೀಡಿರುತ್ತೇವೆ. ಯಾವುದೇ ಸುದ್ದಿ ಮಾಲೀಕರು ತಮ್ಮ ವಿಷಯ ಅಥವಾ ಕೊಂಡಿಗಳನ್ನು ಕನ್ನಡಕ್ವಿಜ್‌ನಿಂದ ತೆಗೆದುಹಾಕಲು ವಿನಂತಿಸುವುದಿದ್ದರೆ, ಅವರು <strong>support@kannadaquiz.in</strong> ಗೆ ಇಮೇಲ್ ಕಳುಹಿಸಬಹುದು. ನಾವು ಅಂತಹ ವಿಷಯವನ್ನು ೨೪ ರಿಂದ ೪೮ ಗಂಟೆಗಳಲ್ಲಿ ತೆಗೆದುಹಾಕುತ್ತೇವೆ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">೩. ಬಳಕೆದಾರರ ನಡವಳಿಕೆ</h2>
              <p>
                ವಾಣಿಜ್ಯ ಉದ್ದೇಶಗಳಿಗಾಗಿ ನಮ್ಮ ಸೈಟ್‌ನಿಂದ ಯಾವುದೇ ವಿಷಯವನ್ನು ನಕಲಿಸುವುದು ಅಥವಾ ಆಟೋಮೇಟೆಡ್ ಬಾಟ್‌ಗಳ ಮೂಲಕ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸುವುದನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">೪. ಕಾನೂನು ವ್ಯಾಪ್ತಿ</h2>
              <p>
                ಈ ನಿಯಮಗಳನ್ನು ಭಾರತೀಯ ಕಾನೂನುಗಳ ಅಡಿಯಲ್ಲಿ ನಿಯಂತ್ರಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ಯಾವುದೇ ಕಾನೂನು ವಿವಾದಗಳಿಗೆ ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ ನ್ಯಾಯಾಲಯಗಳು ಮಾತ್ರ ಸೂಕ್ತ ವ್ಯಾಪ್ತಿಯನ್ನು ಹೊಂದಿರುತ್ತವೆ.
              </p>
            </section>
          </>
        ) : (
          <>
            <p className="font-medium text-[var(--primary)]">Last Updated: June 2026</p>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">1. Acceptance of Terms</h2>
              <p>
                By accessing or using KannadaQuiz, you agree to comply with and be bound by these Terms and Conditions, our Disclaimer, and our Privacy Policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">2. Copyright and Takedown Requests (DMCA / Copyright Complaints)</h2>
              <p>
                We respect intellectual property rights. Since we translate and summarize news from public RSS feeds to aid students, we include active hyperlinks to the original articles. If you are a publisher and wish to request removal of your feed items or link from our site, please send a detailed email to <strong>support@kannadaquiz.in</strong>. We will process and remove the specified content within 24-48 hours.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">3. User Conduct & Prohibitions</h2>
              <p>
                Users agree not to scrape, hotlink, or copy content from KannadaQuiz for commercial reselling. Any attempt to abuse the online quiz engine or submit automated fake responses is strictly prohibited.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">4. Governing Law</h2>
              <p>
                These terms are governed by the laws of India. Any disputes arising from the use of this portal shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
              </p>
            </section>
          </>
        )}
      </div>
    </article>
  );
}
