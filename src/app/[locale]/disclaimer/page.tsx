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
    title: lang === "kn" ? "ಹಕ್ಕುತ್ಯಾಗ ಮತ್ತು ನ್ಯಾಯಯುತ ಬಳಕೆ | Disclaimer" : "Disclaimer & Fair Use Notice",
    description: "Legal disclaimer and fair use notice for news content shared on KannadaQuiz.",
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
    <article className="kq-container max-w-3xl py-10">
      <h1 className="font-serif text-3xl font-bold text-[var(--primary)] mb-6">
        {locale === "kn" ? "ಹಕ್ಕುತ್ಯಾಗ ಮತ್ತು ನ್ಯಾಯಯುತ ಬಳಕೆ ತಿಳುವಳಿಕೆ" : "Disclaimer & Fair Use Notice"}
      </h1>

      <div className="kq-card p-6 md:p-8 space-y-6 text-sm md:text-base leading-7 text-[var(--muted)]">
        {locale === "kn" ? (
          <>
            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">1. ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಮಾಹಿತಿ ಉದ್ದೇಶ ಮಾತ್ರ</h2>
              <p>
                ಕನ್ನಡಕ್ವಿಜ್ (KannadaQuiz) ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ನೀಡಲಾದ ಎಲ್ಲಾ ಮಾಹಿತಿಗಳು ಮತ್ತು ಸುದ್ದಿಗಳು ಕೇವಲ ಶೈಕ್ಷಣಿಕ ಹಾಗೂ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ತಯಾರಿ (KPSC, PSI, FDA, SDA, TET ಇತ್ಯಾದಿ) ಉದ್ದೇಶಗಳಿಗಾಗಿ ಮಾತ್ರ ಇವೆ. ನಾವು ಯಾವುದೇ ಸರ್ಕಾರಿ ಸಂಸ್ಥೆ ಅಥವಾ ಮೂಲ ಸುದ್ದಿ ಸಂಸ್ಥೆಯನ್ನು ಪ್ರತಿನಿಧಿಸುವುದಿಲ್ಲ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">2. ನ್ಯಾಯಯುತ ಬಳಕೆ ಹಕ್ಕುತ್ಯಾಗ (Fair Use Disclaimer)</h2>
              <p>
                ನಮ್ಮ ಪೋರ್ಟಲ್ ಅಂತರರಾಷ್ಟ್ರೀಯ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಮೂಲಗಳಿಂದ (ಉದಾ. BBC, CNN, Al Jazeera) ಸುದ್ದಿಗಳ ಮುಖ್ಯಾಂಶಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ, ಅವುಗಳನ್ನು ಕನ್ನಡ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಕಲಿಯಲು ಅನುಕೂಲವಾಗುವಂತೆ ಅನುವಾದಿಸುತ್ತದೆ ಮತ್ತು ಸಾರಾಂಶಗೊಳಿಸುತ್ತದೆ. ಈ ಕಾರ್ಯವನ್ನು ಭಾರತೀಯ ಕೃತಿಸ್ವಾಮ್ಯ ಕಾಯ್ದೆ 1957 ರ ಸೆಕ್ಷನ್ 52 (Section 52 of the Copyright Act, 1957) ಅಡಿಯಲ್ಲಿ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳ ವರದಿಗಾರಿಕೆ ಹಾಗೂ ವೈಯಕ್ತಿಕ ಅಧ್ಯಯನಕ್ಕಾಗಿ "ನ್ಯಾಯಯುತ ವ್ಯವಹಾರ" (Fair Dealing) ಅನ್ವಯ ಮಾಡಲಾಗುತ್ತದೆ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">3. ಮೂಲ ಮಾಲೀಕತ್ವ ಮತ್ತು ಗೌರವ ಸೂಚನೆ</h2>
              <p>
                ಎಲ್ಲಾ ಮೂಲ ಲೇಖನಗಳು, ಲೋಗೋಗಳು ಮತ್ತು ಟ್ರೇಡ್‌ಮಾರ್ಕ್‌ಗಳು ಆಯಾ ಸುದ್ದಿ ಪ್ರಕಾಶಕರಿಗೆ ಸೇರಿರುತ್ತವೆ. ನಾವು ಯಾವಾಗಲೂ ಮೂಲ ಸುದ್ದಿಯ ಮೂಲ ಹೆಸರು ಮತ್ತು ಲಿಂಕ್ ಅನ್ನು ಪ್ರತಿ ಲೇಖನದ ಕೊನೆಯಲ್ಲಿ ಒದಗಿಸುತ್ತೇವೆ. ಮೂಲ ಸುದ್ದಿ ಸಂಸ್ಥೆಗಳು ತಮ್ಮ ವಿಷಯವನ್ನು ನಮ್ಮ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಿಂದ ತೆಗೆದುಹಾಕಲು ಬಯಸಿದರೆ, ಅವರು ನಮಗೆ ಇಮೇಲ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಬಹುದು (ನಮ್ಮ ನಿಯಮಗಳನ್ನು ನೋಡಿ) ಮತ್ತು ನಾವು ಅದನ್ನು ತಕ್ಷಣವೇ ಗೌರವಿಸುತ್ತೇವೆ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">4. ಹೊಣೆಗಾರಿಕೆಯ ಮಿತಿ</h2>
              <p>
                ಯಾಂತ್ರಿಕ ಅನುವಾದ ಅಥವಾ ತಾಂತ್ರಿಕ ಕಾರಣಗಳಿಂದಾಗಿ ಲೇಖನಗಳಲ್ಲಿ ಸಣ್ಣಪುಟ್ಟ ದೋಷಗಳು ಉಂಟಾಗಬಹುದು. ನಾವು ಒದಗಿಸುವ ಮಾಹಿತಿಯ ಸಂಪೂರ್ಣ ನಿಖರತೆಗೆ ನಾವು ಜವಾಬ್ದಾರರಾಗಿರುವುದಿಲ್ಲ. ಅಭ್ಯರ್ಥಿಗಳು ಕೊನೆಯದಾಗಿ ಅಧಿಕೃತ ಮೂಲಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ವಿನಂತಿಸಲಾಗಿದೆ.
              </p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">1. Educational & Informational Purpose Only</h2>
              <p>
                All content, news articles, and study material published on KannadaQuiz are strictly for educational and exam preparation purposes. We do not represent any government department or official news agency.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">2. Fair Use / Fair Dealing Disclaimer</h2>
              <p>
                This website contains summaries and translations of news articles from international and domestic agencies (such as BBC, CNN, etc.) to help Kannada-medium students prepare for competitive exams. This acts under the **Fair Use** doctrine (and **Section 52 of the Indian Copyright Act, 1957** regarding Fair Dealing for private study, criticism, review, and reporting of current events). We do not claim ownership of the original text.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">3. Intellectual Property & Attribution</h2>
              <p>
                All rights, copyrights, and trademarks belong to their respective original publishers. KannadaQuiz provides clean attribution by clearly stating the source name and providing a link to the original article for every post. If you are a copyright owner and wish to request removal of your feed content, please email us directly, and we will process the request immediately.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-lg font-bold text-[var(--primary)]">4. Limitation of Liability</h2>
              <p>
                While we strive to ensure translations are contextually accurate using advanced AI (Gemini), translation errors can sometimes occur. KannadaQuiz does not guarantee the 100% accuracy, completeness, or reliability of any translated information. Users should verify official notifications for critical deadlines and job requirements.
              </p>
            </section>
          </>
        )}
      </div>
    </article>
  );
}
