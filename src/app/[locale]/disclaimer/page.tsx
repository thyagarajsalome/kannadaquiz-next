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
    title: lang === "kn" ? "ಹಕ್ಕುತ್ಯಾಗ ಮತ್ತು ನ್ಯಾಯಯುತ ಬಳಕೆ | Disclaimer" : "Disclaimer & Legal Notice",
    description: "Legal disclaimer, terms of use, and fair use notice for KannadaQuiz.",
  };
}

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return (
    <article className="kq-container max-w-4xl py-10">
      <h1 className="font-serif text-3xl font-bold text-[var(--primary)] mb-8">
        {locale === "kn" ? "ಹಕ್ಕುತ್ಯಾಗ ಮತ್ತು ಕಾನೂನು ಸೂಚನೆ (Disclaimer)" : "Disclaimer & Legal Notice"}
      </h1>

      <div className="kq-card p-6 md:p-8 space-y-8 text-sm md:text-base leading-relaxed text-[var(--muted)]">
        {locale === "kn" ? (
          <>
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">1. ಕೇವಲ ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಮಾಹಿತಿ ಉದ್ದೇಶಕ್ಕಾಗಿ (Educational Purposes Only)</h2>
              <p>
                ಕನ್ನಡಕ್ವಿಜ್ (KannadaQuiz.in) ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ನೀಡಲಾದ ಎಲ್ಲಾ ಮಾಹಿತಿಗಳು, ಲೇಖನಗಳು, ಮತ್ತು ರಸಪ್ರಶ್ನೆಗಳು ಕೇವಲ ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ (KPSC, PSI, FDA, SDA, TET ಇತ್ಯಾದಿ) ತಯಾರಿ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಮಾತ್ರ ಇವೆ. ನಾವು ಒದಗಿಸುವ ಮಾಹಿತಿಯು ಅಧಿಕೃತ ಅಥವಾ ಕಾನೂನುಬದ್ಧ ಸಲಹೆಯಲ್ಲ. ಯಾವುದೇ ನಿರ್ಧಾರಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುವ ಮುನ್ನ ಅಭ್ಯರ್ಥಿಗಳು ಸಂಬಂಧಪಟ್ಟ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗಳು ಮತ್ತು ಸರ್ಕಾರಿ ಅಧಿಸೂಚನೆಗಳನ್ನು ಕಡ್ಡಾಯವಾಗಿ ಪರಿಶೀಲಿಸಬೇಕು.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">2. ಸರ್ಕಾರಿ ಅಥವಾ ಅಧಿಕೃತ ಸಂಸ್ಥೆಗಳೊಂದಿಗೆ ಯಾವುದೇ ಸಂಬಂಧವಿಲ್ಲ (No Government Affiliation)</h2>
              <p>
                KannadaQuiz ಒಂದು ಸ್ವತಂತ್ರ ಶೈಕ್ಷಣಿಕ ವೇದಿಕೆಯಾಗಿದೆ. ನಾವು ಯಾವುದೇ ಸರ್ಕಾರಿ ಇಲಾಖೆ, ನೇಮಕಾತಿ ಆಯೋಗ (ಉದಾ: KPSC, KSP, UPSC), ಅಥವಾ ಯಾವುದೇ ಅಧಿಕೃತ ಸುದ್ದಿ ಸಂಸ್ಥೆಗಳನ್ನು ಪ್ರತಿನಿಧಿಸುವುದಿಲ್ಲ ಅಥವಾ ಅವರೊಂದಿಗೆ ಯಾವುದೇ ಅಧಿಕೃತ ಸಂಬಂಧವನ್ನು ಹೊಂದಿಲ್ಲ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">3. ನ್ಯಾಯಯುತ ಬಳಕೆ ಹಕ್ಕುತ್ಯಾಗ (Fair Use / Fair Dealing Disclaimer)</h2>
              <p>
                ನಮ್ಮ ಪೋರ್ಟಲ್ ಅಂತರರಾಷ್ಟ್ರೀಯ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಮೂಲಗಳಿಂದ (ಉದಾ. ಪ್ರಮುಖ ಇಂಗ್ಲಿಷ್/ಕನ್ನಡ ಪತ್ರಿಕೆಗಳು ಮತ್ತು ವೆಬ್‌ಸೈಟ್‌ಗಳು) ಸುದ್ದಿಗಳ ಮುಖ್ಯಾಂಶಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ, ಅವುಗಳನ್ನು ಕನ್ನಡ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಕಲಿಯಲು ಅನುಕೂಲವಾಗುವಂತೆ ಅನುವಾದಿಸುತ್ತದೆ ಮತ್ತು ಸಾರಾಂಶಗೊಳಿಸುತ್ತದೆ. ಈ ಕಾರ್ಯವನ್ನು <strong>ಭಾರತೀಯ ಕೃತಿಸ್ವಾಮ್ಯ ಕಾಯ್ದೆ 1957 ರ ಸೆಕ್ಷನ್ 52 (Section 52 of the Copyright Act, 1957)</strong> ಅಡಿಯಲ್ಲಿ "ನ್ಯಾಯಯುತ ವ್ಯವಹಾರ" (Fair Dealing) — ಶೈಕ್ಷಣಿಕ ಉದ್ದೇಶ, ಪ್ರಸ್ತುತ ವಿದ್ಯಮಾನಗಳ ವರದಿಗಾರಿಕೆ, ಮತ್ತು ವೈಯಕ್ತಿಕ ಅಧ್ಯಯನಕ್ಕಾಗಿ — ಅನ್ವಯ ಮಾಡಲಾಗುತ್ತದೆ. ನಾವು ಯಾವುದೇ ಮೂಲ ಲೇಖನಗಳ ಒಡೆತನವನ್ನು (ownership) ಸಾಧಿಸುವುದಿಲ್ಲ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">4. ಬೌದ್ಧಿಕ ಆಸ್ತಿ ಮತ್ತು ಹಕ್ಕುಸ್ವಾಮ್ಯ (Intellectual Property & Take Down)</h2>
              <p>
                ಎಲ್ಲಾ ಮೂಲ ಲೇಖನಗಳು, ಲೋಗೋಗಳು, ಚಿತ್ರಗಳು ಮತ್ತು ಟ್ರೇಡ್‌ಮಾರ್ಕ್‌ಗಳು ಆಯಾ ಮೂಲ ಮಾಲೀಕರಿಗೆ ಸೇರಿರುತ್ತವೆ. ನಾವು ಯಾವಾಗಲೂ ಮೂಲ ಸುದ್ದಿಯ ಲಿಂಕ್ ಅನ್ನು ಒದಗಿಸುತ್ತೇವೆ. ನೀವು ಕೃತಿಸ್ವಾಮ್ಯ ಮಾಲೀಕರಾಗಿದ್ದು, ನಿಮ್ಮ ಯಾವುದೇ ವಿಷಯವನ್ನು ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪ್ರಕಟಿಸಬಾರದು ಎಂದು ಭಾವಿಸಿದರೆ, ದಯವಿಟ್ಟು ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ (contact@kannadaquiz.in). ಯಾವುದೇ ಕಾನೂನು ಪ್ರಕ್ರಿಯೆಯಿಲ್ಲದೆ ನಾವು ತಕ್ಷಣವೇ ಆ ವಿಷಯವನ್ನು ತೆಗೆದುಹಾಕುತ್ತೇವೆ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">5. ಹೊಣೆಗಾರಿಕೆಯ ಮಿತಿ (Limitation of Liability)</h2>
              <p>
                ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿನ ಮಾಹಿತಿಯ ನಿಖರತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ನಾವು ಎಲ್ಲ ಪ್ರಯತ್ನಗಳನ್ನು ಮಾಡುತ್ತೇವೆ. ಆದರೆ, ಯಾಂತ್ರಿಕ ಅನುವಾದ (AI), ಮುದ್ರಣ ದೋಷಗಳು, ಅಥವಾ ತಾಂತ್ರಿಕ ಕಾರಣಗಳಿಂದಾಗಿ ಮಾಹಿತಿಯಲ್ಲಿ ತಪ್ಪುಗಳಿರಬಹುದು. ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನ ಮಾಹಿತಿಯ ಬಳಕೆಯಿಂದ ಉಂಟಾಗುವ ಯಾವುದೇ ನೇರ, ಪರೋಕ್ಷ, ಪ್ರಾಸಂಗಿಕ ಅಥವಾ ಆರ್ಥಿಕ ನಷ್ಟಗಳಿಗೆ KannadaQuiz, ಅದರ ಮಾಲೀಕರು, ಅಥವಾ ನಿರ್ವಾಹಕರು ಜವಾಬ್ದಾರರಾಗಿರುವುದಿಲ್ಲ. ಮಾಹಿತಿಯ ಬಳಕೆಯು ಸಂಪೂರ್ಣವಾಗಿ ನಿಮ್ಮ ಸ್ವಂತ ಅಪಾಯಕ್ಕೆ (Own Risk) ಒಳಪಟ್ಟಿರುತ್ತದೆ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">6. ಬಾಹ್ಯ ಲಿಂಕ್‌ಗಳು (External Links Disclaimer)</h2>
              <p>
                ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಇತರ ಬಾಹ್ಯ ವೆಬ್‌ಸೈಟ್‌ಗಳ (ಉದಾ: ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಅರ್ಜಿ ಲಿಂಕ್‌ಗಳು, ವಾರ್ತಾ ಮೂಲಗಳು) ಲಿಂಕ್‌ಗಳಿರಬಹುದು. ಆ ಬಾಹ್ಯ ವೆಬ್‌ಸೈಟ್‌ಗಳ ವಿಷಯಗಳು, ಲಭ್ಯತೆ, ಅಥವಾ ಗೌಪ್ಯತಾ ನೀತಿಗಳ ಮೇಲೆ ನಮಗೆ ಯಾವುದೇ ನಿಯಂತ್ರಣವಿರುವುದಿಲ್ಲ ಮತ್ತು ನಾವು ಅವುಗಳಿಗೆ ಜವಾಬ್ದಾರರಾಗಿರುವುದಿಲ್ಲ.
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
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">1. Educational & Informational Purposes Only</h2>
              <p>
                All content, news articles, quizzes, and study material published on KannadaQuiz.in are strictly for educational and competitive exam preparation purposes (KPSC, PSI, FDA, SDA, TET, etc.). The information provided on this website does not constitute official, legal, or professional advice. Users are strongly advised to verify critical information and job notifications from the respective official government websites before making any decisions.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">2. No Government Affiliation</h2>
              <p>
                KannadaQuiz is an independent educational platform. We are <strong>not affiliated, associated, authorized, endorsed by, or in any way officially connected</strong> with any government agency, recruitment commission (e.g., KPSC, KSP, UPSC), or any official news organization.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">3. Fair Use & Fair Dealing Disclaimer</h2>
              <p>
                This website contains summaries, translations, and excerpts of news articles from various international and domestic publishers (such as major newspapers and news agencies) to aid Kannada-medium students in their studies. This use constitutes <strong>Fair Dealing under Section 52 of the Indian Copyright Act, 1957</strong>, which permits limited use of copyrighted material for purposes such as private study, educational use, criticism, review, and reporting of current events without acquiring permission from the rights holders.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">4. Intellectual Property & DMCA / Takedown Policy</h2>
              <p>
                All copyrights, trademarks, logos, and original content belong to their respective owners/publishers. KannadaQuiz does not claim ownership of the original text. We strive to provide proper attribution and back-links to the original sources. 
                <br /><br />
                If you are a copyright owner or an authorized agent and believe that any content on this site infringes upon your copyrights, please contact us immediately at <strong>contact@kannadaquiz.in</strong> with a link to the specific content. We will promptly remove the content in question without requiring formal legal action.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">5. Limitation of Liability ("As Is" Basis)</h2>
              <p>
                The information on KannadaQuiz is provided on an "as is" and "as available" basis. While we endeavor to keep the information up to date and correct (using advanced AI translation), we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the information. In no event will KannadaQuiz, its owners, or administrators be liable for any loss or damage including without limitation, indirect or consequential loss or damage, arising out of, or in connection with, the use of this website.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">6. External Links Disclaimer</h2>
              <p>
                Through this website, you may be able to link to other websites (e.g., official recruitment portals, news sources) which are not under the control of KannadaQuiz. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
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
