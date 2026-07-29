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
    description: "Comprehensive Privacy Policy for users visiting the KannadaQuiz portal.",
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
    <article className="kq-container max-w-4xl py-10">
      <h1 className="font-serif text-3xl font-bold text-[var(--primary)] mb-8">
        {locale === "kn" ? "ಗೌಪ್ಯತಾ ನೀತಿ (Privacy Policy)" : "Privacy Policy"}
      </h1>

      <div className="kq-card p-6 md:p-8 space-y-8 text-sm md:text-base leading-relaxed text-[var(--muted)]">
        {locale === "kn" ? (
          <>
            <p className="font-medium text-[var(--primary)] border-b pb-4">ಕೊನೆಯದಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ: ಜುಲೈ 2026</p>
            
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">1. ನಾವು ಸಂಗ್ರಹಿಸುವ ಮಾಹಿತಿ (Information We Collect)</h2>
              <p>
                <strong>ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ:</strong> ನೀವು ಖಾತೆಯನ್ನು ರಚಿಸಿದಾಗ (ಲಾಗಿನ್), ನಿಮ್ಮ ಹೆಸರು, ಇಮೇಲ್ ವಿಳಾಸ, ಮತ್ತು ಪ್ರೊಫೈಲ್ ಚಿತ್ರವನ್ನು (Google/Firebase ಮೂಲಕ) ನಾವು ಸಂಗ್ರಹಿಸುತ್ತೇವೆ. ನೀವು ಬಿಡಿಸುವ ರಸಪ್ರಶ್ನೆಗಳ ಅಂಕಗಳನ್ನು ನಿಮ್ಮ ಖಾತೆಗೆ ಲಿಂಕ್ ಮಾಡಲಾಗುತ್ತದೆ.<br/>
                <strong>ಸ್ವಯಂಚಾಲಿತ ಮಾಹಿತಿ:</strong> ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಭೇಟಿ ನೀಡಿದಾಗ, ನಿಮ್ಮ IP ವಿಳಾಸ, ಬ್ರೌಸರ್ ಪ್ರಕಾರ, ಭೇಟಿ ನೀಡಿದ ಪುಟಗಳು, ಮತ್ತು ಭೇಟಿಯ ಸಮಯದಂತಹ ಅನಾಮಧೇಯ (Anonymous) ಮಾಹಿತಿಯನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ (Google Analytics ಮೂಲಕ).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">2. ಮಾಹಿತಿಯ ಬಳಕೆ (How We Use Information)</h2>
              <p>
                ನಾವು ಸಂಗ್ರಹಿಸಿದ ಮಾಹಿತಿಯನ್ನು ಈ ಕೆಳಗಿನ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಮಾತ್ರ ಬಳಸುತ್ತೇವೆ:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>ನಿಮಗೆ ವೈಯಕ್ತೀಕರಿಸಿದ ಅನುಭವವನ್ನು ಒದಗಿಸಲು (ಉದಾ: ಲೀಡರ್‌ಬೋರ್ಡ್, ಕ್ವಿಜ್ ಇತಿಹಾಸ).</li>
                <li>ವೆಬ್‌ಸೈಟ್‌ನ ಕಾರ್ಯಕ್ಷಮತೆ ಮತ್ತು ಬಳಕೆದಾರರ ಅನುಭವವನ್ನು ಸುಧಾರಿಸಲು.</li>
                <li>ಭದ್ರತೆ ಮತ್ತು ತಾಂತ್ರಿಕ ಸಮಸ್ಯೆಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲು.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">3. ಕುಕೀಸ್ (Cookies & Tracking)</h2>
              <p>
                ನಿಮ್ಮ ಆದ್ಯತೆಗಳನ್ನು (ಉದಾ: ಭಾಷೆ - ಕನ್ನಡ/English) ನೆನಪಿಟ್ಟುಕೊಳ್ಳಲು ಮತ್ತು ಲಾಗಿನ್ ಸೆಷನ್ ಅನ್ನು ನಿರ್ವಹಿಸಲು ನಾವು ಕುಕೀಗಳನ್ನು ಬಳಸುತ್ತೇವೆ. ನಿಮ್ಮ ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳ ಮೂಲಕ ನೀವು ಕುಕೀಗಳನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಬಹುದು, ಆದರೆ ಇದರಿಂದ ವೆಬ್‌ಸೈಟ್‌ನ ಕೆಲವು ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು ಕಾರ್ಯನಿರ್ವಹಿಸದೇ ಇರಬಹುದು.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">4. ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಸೇವೆಗಳು (Third-Party Services)</h2>
              <p>
                ನಾವು ವೆಬ್‌ಸೈಟ್ ಟ್ರಾಫಿಕ್ ವಿಶ್ಲೇಷಣೆಗಾಗಿ <strong>Google Analytics</strong> ಮತ್ತು ದೃಢೀಕರಣ/ಡೇಟಾಬೇಸ್‌ಗಾಗಿ <strong>Google Firebase</strong> ಅನ್ನು ಬಳಸುತ್ತೇವೆ. ಈ ಪೂರೈಕೆದಾರರು ತಮ್ಮದೇ ಆದ ಗೌಪ್ಯತಾ ನೀತಿಗಳಿಗೆ ಒಳಪಟ್ಟಿರುತ್ತಾರೆ. ನಾವು ಯಾವುದೇ ಕಾರಣಕ್ಕೂ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಡೇಟಾವನ್ನು (ಉದಾ: ಇಮೇಲ್) ಜಾಹೀರಾತುದಾರರಿಗೆ ಅಥವಾ ಮೂರನೇ ವ್ಯಕ್ತಿಗಳಿಗೆ ಮಾರಾಟ ಮಾಡುವುದಿಲ್ಲ ಅಥವಾ ಹಂಚಿಕೊಳ್ಳುವುದಿಲ್ಲ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">5. ನಿಮ್ಮ ಹಕ್ಕುಗಳು ಮತ್ತು ಡೇಟಾ ಅಳಿಸುವಿಕೆ (Data Deletion Rights)</h2>
              <p>
                ನಿಮ್ಮ ಖಾತೆ ಮತ್ತು ಡೇಟಾವನ್ನು ನಮ್ಮ ಸಿಸ್ಟಮ್‌ನಿಂದ ಸಂಪೂರ್ಣವಾಗಿ ಅಳಿಸಲು ನೀವು ಹಕ್ಕನ್ನು ಹೊಂದಿದ್ದೀರಿ. ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ (DPDP Act, India) ಅನ್ವಯ, ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲು ಅಥವಾ ಅಳಿಸಲು ನೀವು <strong>contact@kannadaquiz.in</strong> ಗೆ ಇಮೇಲ್ ಮಾಡಬಹುದು. ನಿಮ್ಮ ಕೋರಿಕೆಯ ಮೇರೆಗೆ ನಾವು ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಶಾಶ್ವತವಾಗಿ ತೆಗೆದುಹಾಕುತ್ತೇವೆ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">6. ಡೇಟಾ ಸುರಕ್ಷತೆ (Data Security)</h2>
              <p>
                ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ರಕ್ಷಿಸಲು ನಾವು ವಾಣಿಜ್ಯ-ಮಟ್ಟದ ಭದ್ರತಾ ಕ್ರಮಗಳನ್ನು (SSL/HTTPS, Firebase Security Rules) ಅಳವಡಿಸಿಕೊಂಡಿದ್ದೇವೆ. ಆದಾಗ್ಯೂ, ಇಂಟರ್ನೆಟ್ ಮೂಲಕ ನಡೆಯುವ ಯಾವುದೇ ಡೇಟಾ ವರ್ಗಾವಣೆಯು 100% ಸುರಕ್ಷಿತವಾಗಿರುವುದಿಲ್ಲ ಎಂಬುದನ್ನು ದಯವಿಟ್ಟು ಗಮನಿಸಿ.
              </p>
            </section>
          </>
        ) : (
          <>
            <p className="font-medium text-[var(--primary)] border-b pb-4">Last Updated: July 2026</p>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">1. Information We Collect</h2>
              <p>
                <strong>Personal Data:</strong> When you register an account, we collect your name, email address, and profile picture (via Google Authentication). We also store your quiz scores and attempt history linked to your account.<br/>
                <strong>Automated Data:</strong> When you visit KannadaQuiz.in, we automatically collect standard anonymous data such as your IP address, browser type, operating system, and pages visited (via analytics tools).
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">2. How We Use Your Information</h2>
              <p>
                We strictly use the collected data for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide and maintain our Service (e.g., managing your login session, generating leaderboards).</li>
                <li>To improve our website functionality and user experience.</li>
                <li>To monitor usage trends and fix technical issues.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">3. Cookies and Tracking Technologies</h2>
              <p>
                We use Cookies to remember your preferences (like your selected language locale) and to maintain your authenticated session. You can instruct your browser to refuse all Cookies; however, if you do not accept Cookies, some parts of our Service may not function properly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">4. Third-Party Services</h2>
              <p>
                We use <strong>Google Analytics</strong> to analyze website traffic and <strong>Google Firebase</strong> for database and authentication services. These third-party service providers have their own privacy policies addressing how they use such information. 
                <br/><br/>
                <strong>We do not sell, rent, or trade your personal information</strong> (such as email addresses) to third-party marketers or advertisers under any circumstances.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">5. Your Data Rights & Deletion (DPDP Compliance)</h2>
              <p>
                In accordance with global standards and India's Digital Personal Data Protection (DPDP) Act, you have the right to access, rectify, or erase your personal data. If you wish to delete your account and all associated data from our servers, you can request account deletion by emailing us at <strong>contact@kannadaquiz.in</strong>. We will process your request promptly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">6. Data Security</h2>
              <p>
                The security of your data is important to us. We implement robust, commercially acceptable security protocols including HTTPS encryption and strict Firebase Security Rules. However, please remember that no method of transmission over the Internet is 100% secure, and we cannot guarantee its absolute security.
              </p>
            </section>
          </>
        )}
      </div>
    </article>
  );
}
