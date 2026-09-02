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
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">4. ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಸೇವೆಗಳು ಮತ್ತು ಜಾಹೀರಾತುಗಳು (Third-Party Services & Advertising)</h2>
              <p>
                ನಾವು ವೆಬ್‌ಸೈಟ್ ಟ್ರಾಫಿಕ್ ವಿಶ್ಲೇಷಣೆಗಾಗಿ <strong>Google Analytics</strong> ಮತ್ತು ದೃಢೀಕರಣ/ಡೇಟಾಬೇಸ್‌ಗಾಗಿ <strong>Google Firebase</strong> ಅನ್ನು ಬಳಸುತ್ತೇವೆ. ಜೊತೆಗೆ, ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಜಾಹೀರಾತುಗಳನ್ನು ಪ್ರದರ್ಶಿಸಲು <strong>Google AdSense</strong> ಅನ್ನು ಬಳಸುತ್ತೇವೆ.
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Google ಸೇರಿದಂತೆ ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಮಾರಾಟಗಾರರು (Third-party vendors), ಬಳಕೆದಾರರು ನಮ್ಮ ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ಇತರ ವೆಬ್‌ಸೈಟ್‌ಗಳಿಗೆ ನೀಡಿದ ಹಿಂದಿನ ಭೇಟಿಗಳ ಆಧಾರದ ಮೇಲೆ ಜಾಹೀರಾತುಗಳನ್ನು ಪ್ರದರ್ಶಿಸಲು ಕುಕೀಗಳನ್ನು (Cookies) ಬಳಸುತ್ತಾರೆ.</li>
                <li>ಜಾಹೀರಾತು ಕುಕೀಗಳ ಬಳಕೆಯು Google ಮತ್ತು ಅದರ ಪಾಲುದಾರರಿಗೆ ಬಳಕೆದಾರರ ಆಸಕ್ತಿಗಳಿಗೆ ಅನುಗುಣವಾಗಿ (Personalized ads) ಜಾಹೀರಾತುಗಳನ್ನು ತೋರಿಸಲು ಅನುವು ಮಾಡಿಕೊಡುತ್ತದೆ.</li>
                <li>ಬಳಕೆದಾರರು <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[var(--secondary)] hover:underline">Ads Settings</a> ಗೆ ಭೇಟಿ ನೀಡುವ ಮೂಲಕ ವೈಯಕ್ತೀಕರಿಸಿದ ಜಾಹೀರಾತುಗಳಿಂದ (Personalized advertising) ಹೊರಗುಳಿಯಬಹುದು, ಅಥವಾ <a href="http://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[var(--secondary)] hover:underline">www.aboutads.info</a> ಗೆ ಭೇಟಿ ನೀಡುವ ಮೂಲಕ ಮೂರನೇ ವ್ಯಕ್ತಿಯ ಕುಕೀಗಳನ್ನು ನಿರ್ಬಂಧಿಸಬಹುದು.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">5. ನಿಮ್ಮ ಹಕ್ಕುಗಳು ಮತ್ತು ಡೇಟಾ ಅಳಿಸುವಿಕೆ (Data Deletion Rights)</h2>
              <p>
                ನಿಮ್ಮ ಖಾತೆ ಮತ್ತು ಡೇಟಾವನ್ನು ನಮ್ಮ ಸಿಸ್ಟಮ್‌ನಿಂದ ಸಂಪೂರ್ಣವಾಗಿ ಅಳಿಸಲು ನೀವು ಹಕ್ಕನ್ನು ಹೊಂದಿದ್ದೀರಿ. ಡಿಜಿಟಲ್ ವೈಯಕ್ತಿಕ ಡೇಟಾ ಸಂರಕ್ಷಣಾ ಕಾಯ್ದೆ (DPDP Act, India) ಅನ್ವಯ, ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲು ಅಥವಾ ಅಳಿಸಲು ನೀವು <strong>kannadaquiz.support@gmail.com</strong> ಗೆ ಇಮೇಲ್ ಮಾಡಬಹುದು. ನಿಮ್ಮ ಕೋರಿಕೆಯ ಮೇರೆಗೆ ನಾವು ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಶಾಶ್ವತವಾಗಿ ತೆಗೆದುಹಾಕುತ್ತೇವೆ.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">6. ಡೇಟಾ ಸುರಕ್ಷತೆ (Data Security)</h2>
              <p>
                ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ರಕ್ಷಿಸಲು ನಾವು ವಾಣಿಜ್ಯ-ಮಟ್ಟದ ಭದ್ರತಾ ಕ್ರಮಗಳನ್ನು (SSL/HTTPS, Firebase Security Rules) ಅಳವಡಿಸಿಕೊಂಡಿದ್ದೇವೆ. ಆದಾಗ್ಯೂ, ಇಂಟರ್ನೆಟ್ ಮೂಲಕ ನಡೆಯುವ ಯಾವುದೇ ಡೇಟಾ ವರ್ಗಾವಣೆಯು 100% ಸುರಕ್ಷಿತವಾಗಿರುವುದಿಲ್ಲ ಎಂಬುದನ್ನು ದಯವಿಟ್ಟು ಗಮನಿಸಿ.
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
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">4. Third-Party Services & Advertising</h2>
              <p>
                We use <strong>Google Analytics</strong> to analyze website traffic and <strong>Google Firebase</strong> for database and authentication services. Additionally, we use <strong>Google AdSense</strong> to display advertisements on our website.
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
                <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
                <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[var(--secondary)] hover:underline">Ads Settings</a>, or by visiting <a href="http://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[var(--secondary)] hover:underline">www.aboutads.info</a> to opt out of a third-party vendor's use of cookies for personalized advertising.</li>
              </ul>
              <p className="mt-4">
                <strong>We do not sell, rent, or trade your personal information</strong> (such as email addresses) to third-party marketers or advertisers under any circumstances.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">5. Your Data Rights & Deletion (DPDP Compliance)</h2>
              <p>
                In accordance with global standards and India's Digital Personal Data Protection (DPDP) Act, you have the right to access, rectify, or erase your personal data. If you wish to delete your account and all associated data from our servers, you can request account deletion by emailing us at <strong>kannadaquiz.support@gmail.com</strong>. We will process your request promptly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[var(--primary)]">6. Data Security</h2>
              <p>
                The security of your data is important to us. We implement robust, commercially acceptable security protocols including HTTPS encryption and strict Firebase Security Rules. However, please remember that no method of transmission over the Internet is 100% secure, and we cannot guarantee its absolute security.
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
