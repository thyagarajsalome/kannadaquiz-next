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
            <p className="font-medium text-[var(--primary)]">ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ: ಜೂನ್ 2026</p>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">1. ನಿಯಮಗಳ ಒಪ್ಪಿಗೆ</h2>
              <p>
                ಕನ್ನಡಕ್ವಿಜ್ ವೆಬ್‌ಸೈಟ್ ಬಳಸುವ ಮೂಲಕ, ನೀವು ನಮ್ಮ ನಿಯಮಗಳು, ಹಕ್ಕುತ್ಯಾಗಗಳು ಮತ್ತು ಗೌಪ್ಯತಾ ನೀತಿಗಳಿಗೆ ಬದ್ಧರಾಗಿರಲು ಒಪ್ಪುತ್ತೀರಿ. ನೀವು ಈ ನಿಯಮಗಳನ್ನು ಒಪ್ಪದಿದ್ದರೆ, ದಯವಿಟ್ಟು ಸೈಟ್ ಬಳಸಬೇಡಿ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">2. ಕೃತಿಸ್ವಾಮ್ಯ ಮತ್ತು ವಿಷಯ ತೆಗೆದುಹಾಕುವಿಕೆ ವಿನಂತಿಗಳು (DMCA / Copyright Take-Down)</h2>
              <p>
                ನಾವು ಬೌದ್ಧಿಕ ಆಸ್ತಿ ಹಕ್ಕುಗಳನ್ನು ಗೌರವಿಸುತ್ತೇವೆ. ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಸುದ್ದಿ ಸಂಗ್ರಹಣೆ ಹಾಗೂ ಅನುವಾದವನ್ನು ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ತಯಾರಿಗಾಗಿ ಮಾತ್ರ ಮಾಡುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ಸುದ್ದಿಯ ಕೊನೆಯಲ್ಲಿ ನಾವು ಮೂಲ ಸುದ್ದಿಯ ಲಿಂಕ್ ಅನ್ನು ನೀಡಿರುತ್ತೇವೆ. ಯಾವುದೇ ಸುದ್ದಿ ಮಾಲೀಕರು ತಮ್ಮ ವಿಷಯ ಅಥವಾ ಕೊಂಡಿಗಳನ್ನು ಕನ್ನಡಕ್ವಿಜ್‌ನಿಂದ ತೆಗೆದುಹಾಕಲು ವಿನಂತಿಸುವುದಿದ್ದರೆ, ಅವರು <strong>support@kannadaquiz.in</strong> ಗೆ ಇಮೇಲ್ ಕಳುಹಿಸಬಹುದು. ನಾವು ಅಂತಹ ವಿಷಯವನ್ನು 24 ರಿಂದ 48 ಗಂಟೆಗಳಲ್ಲಿ ತೆಗೆದುಹಾಕುತ್ತೇವೆ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">3. ಬಳಕೆದಾರರ ನಡವಳಿಕೆ</h2>
              <p>
                ವಾಣಿಜ್ಯ ಉದ್ದೇಶಗಳಿಗಾಗಿ ನಮ್ಮ ಸೈಟ್‌ನಿಂದ ಯಾವುದೇ ವಿಷಯವನ್ನು ನಕಲಿಸುವುದು ಅಥವಾ ಆಟೋಮೇಟೆಡ್ ಬಾಟ್‌ಗಳ ಮೂಲಕ ಮಾಹಿತಿಯನ್ನು ಸಂಗ್ರಹಿಸುವುದನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">4. ಕಾನೂನು ವ್ಯಾಪ್ತಿ</h2>
              <p>
                ಈ ನಿಯಮಗಳನ್ನು ಭಾರತೀಯ ಕಾನೂನುಗಳ ಅಡಿಯಲ್ಲಿ ನಿಯಂತ್ರಿಸಲಾಗುತ್ತದೆ ಮತ್ತು ಯಾವುದೇ ಕಾನೂನು ವಿವಾದಗಳಿಗೆ ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ ನ್ಯಾಯಾಲಯಗಳು ಮಾತ್ರ ಸೂಕ್ತ ವ್ಯಾಪ್ತಿಯನ್ನು ಹೊಂದಿರುತ್ತವೆ.
              </p>
            </section>
          <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">7. ಡೇಟಾ ಸಂಗ್ರಹಣೆ, AI ಬಳಕೆ ಮತ್ತು ನಿಖರತೆ (Data Collection, AI Usage & Accuracy)</h2>
              <p>
                ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಒದಗಿಸಲಾದ ಮಾಹಿತಿಯು ಈಗಾಗಲೇ ಸಾರ್ವಜನಿಕ ಡೊಮೇನ್‌ನಲ್ಲಿ (Public Domain) ಲಭ್ಯವಿರುವ ಡೇಟಾ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ಮೂಲಗಳಿಂದ ಸಂಗ್ರಹಿಸಲ್ಪಟ್ಟಿದೆ. ಮಾಹಿತಿಯನ್ನು ಕಲೆಹಾಕಲು, ಸಂಶೋಧಿಸಲು ಮತ್ತು ಭಾಷಾಂತರಿಸಲು ನಾವು <strong>AI ಸಹಾಯಕ ತಂತ್ರಜ್ಞಾನಗಳನ್ನು (AI Assistants)</strong> ಬಳಸುತ್ತೇವೆ. ತದನಂತರ, ನಮ್ಮ ತಂಡವು ಮಾಹಿತಿಯನ್ನು ವಿವಿಧ ಹಂತಗಳಲ್ಲಿ ಕೈಯಾರೆ ಪರಿಶೀಲಿಸುತ್ತದೆ (Manual Verification).
              </p>
              <p>
                ನಾವು ಸಾಧ್ಯವಾದಷ್ಟು ನಿಖರವಾದ ಮತ್ತು ದೋಷಮುಕ್ತ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಲು ನಮ್ಮ ಅತ್ಯುತ್ತಮ ಪ್ರಯತ್ನ ಮಾಡುತ್ತೇವೆ. ಆದಾಗ್ಯೂ, ಮೂಲತಾಣಗಳಲ್ಲಿನ ಅಪ್‌ಡೇಟ್‌ಗಳ ಕೊರತೆಯಿಂದಾಗಿ ಅಥವಾ ಮಾಹಿತಿಯ ಕೊರತೆಯಿಂದಾಗಿ, ಕೆಲವೊಮ್ಮೆ ಮಾಹಿತಿ ಅಪೂರ್ಣವಾಗಿರಬಹುದು ಅಥವಾ ಬದಲಾಗಬಹುದು. ಆದ್ದರಿಂದ, ಅತ್ಯಂತ ಇತ್ತೀಚಿನ ಮತ್ತು ಅಧಿಕೃತ ಮಾಹಿತಿಗಾಗಿ ಅಭ್ಯರ್ಥಿಗಳು ಯಾವಾಗಲೂ ಸಂಬಂಧಪಟ್ಟ ಇಲಾಖೆಯ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗಳನ್ನೇ ಉಲ್ಲೇಖಿಸಬೇಕು ಎಂದು ನಾವು ವಿನಂತಿಸುತ್ತೇವೆ.
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
          <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">7. Data Collection, AI Usage, & Accuracy</h2>
              <p>
                The information provided on our website is collected from data already available in the public domain and from other credible sources. We utilize <strong>AI assistants and automated tools</strong> to aid in research, data collection, and translation. Following this, our team conducts manual verification at multiple levels to ensure the highest quality possible.
              </p>
              <p>
                While the KannadaQuiz team tries its absolute best to provide accurate and updated information, sometimes due to a lack of full information or delays in updates from the primary sources, the information here might change or appear incomplete. Therefore, for the most recent and authoritative updates, we strongly advise users to always refer to the official websites and government notifications.
              </p>
            </section>
          </>
        )}
      </div>
    </article>
  );
}
