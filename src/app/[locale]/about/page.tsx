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
    title: lang === "kn" ? "ನಮ್ಮ ಬಗ್ಗೆ | About Us" : "About Us",
    description: "Learn more about KannadaQuiz, our mission, and our platform.",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return (
    <article className="kq-container max-w-4xl py-10">
      <h1 className="font-serif text-3xl font-bold text-[var(--primary)] mb-8">
        {locale === "kn" ? "ನಮ್ಮ ಬಗ್ಗೆ (About Us)" : "About Us"}
      </h1>

      <div className="kq-card p-6 md:p-8 space-y-8 text-sm md:text-base leading-relaxed text-[var(--muted)]">
        {/* Intro */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--primary)] border-b pb-2">{locale === "kn" ? "ಕನ್ನಡಕ್ವಿಜ್ ಗೆ ಸ್ವಾಗತ" : "Welcome to KannadaQuiz"}</h2>
          {locale === "kn" ? (
            <>
              <p>
                <strong>KannadaQuiz</strong> ಕನ್ನಡಿಗರಿಗಾಗಿ ವಿಶೇಷವಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಪ್ರಮುಖ ಶೈಕ್ಷಣಿಕ, ಉದ್ಯೋಗ ಮತ್ತು ಮಾಹಿತಿ ವೇದಿಕೆಯಾಗಿದೆ. ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ (KPSC, UPSC, SSC, ಬ್ಯಾಂಕಿಂಗ್) ತಯಾರಿ ನಡೆಸುತ್ತಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಮತ್ತು ಉದ್ಯೋಗ ಆಕಾಂಕ್ಷಿಗಳಿಗೆ ನಿಖರವಾದ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸುವುದು ನಮ್ಮ ಪ್ರಮುಖ ಉದ್ದೇಶವಾಗಿದೆ.
              </p>
              <p>
                ನಮ್ಮ ಪೋರ್ಟಲ್ ಕೇವಲ ಪರೀಕ್ಷಾ ತಯಾರಿಗಷ್ಟೇ ಸೀಮಿತವಾಗಿಲ್ಲ; ಇದು ಕರ್ನಾಟಕದ ಸಮಗ್ರ ಸುದ್ದಿಗಳು, ಕೃಷಿ ಮಾಹಿತಿ, ಅನಿವಾಸಿ ಭಾರತೀಯರ (NRI/Expat) ಮಾರ್ಗದರ್ಶಿ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸುವ ಕೇಂದ್ರವಾಗಿದೆ.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>KannadaQuiz</strong> is a premier educational, employment, and informational platform designed specifically for the people of Karnataka and the global Kannada-speaking diaspora. Our primary goal is to provide accurate and reliable information for students preparing for competitive exams (KPSC, UPSC, SSC, Banking) and job seekers.
              </p>
              <p>
                Our portal is not limited to just exam preparation; it is a comprehensive hub providing Karnataka news, agriculture updates, NRI/Expat guides, and information on vital government schemes.
              </p>
            </>
          )}
        </section>

        {/* Mission & Vision */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--primary)] border-b pb-2">{locale === "kn" ? "ನಮ್ಮ ಧ್ಯೇಯ ಮತ್ತು ಗುರಿ" : "Our Mission & Vision"}</h2>
          <ul className="list-disc pl-5 space-y-2">
            {locale === "kn" ? (
              <>
                <li><strong>ಧ್ಯೇಯ:</strong> ಪ್ರತಿಯೊಬ್ಬ ಕನ್ನಡಿಗನಿಗೂ ಉಚಿತವಾಗಿ, ಸುಲಭವಾಗಿ ಮತ್ತು ವೇಗವಾಗಿ ಡಿಜಿಟಲ್ ಶಿಕ್ಷಣ ಮತ್ತು ಉದ್ಯೋಗದ ಮಾಹಿತಿಯನ್ನು ತಲುಪಿಸುವುದು.</li>
                <li><strong>ಗುರಿ:</strong> ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳಲ್ಲಿ ಕನ್ನಡಿಗರು ಹೆಚ್ಚು ಯಶಸ್ಸು ಸಾಧಿಸಲು ನೆರವಾಗುವ ಅತ್ಯುತ್ತಮ ಜ್ಞಾನ ಭಂಡಾರವಾಗಿ ಹೊರಹೊಮ್ಮುವುದು ಮತ್ತು ಅನಿವಾಸಿ ಕನ್ನಡಿಗರನ್ನು ತಾಯ್ನಾಡಿನೊಂದಿಗೆ ಬೆಸೆಯುವುದು.</li>
              </>
            ) : (
              <>
                <li><strong>Mission:</strong> To make digital education, exam resources, and job information freely and quickly accessible to every Kannadiga.</li>
                <li><strong>Vision:</strong> To emerge as the ultimate knowledge repository helping candidates succeed in competitive exams, while keeping the global Kannada diaspora strongly connected to their homeland.</li>
              </>
            )}
          </ul>
        </section>

        {/* What we offer */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--primary)] border-b pb-2">{locale === "kn" ? "ನಾವು ಏನು ಒದಗಿಸುತ್ತೇವೆ?" : "What We Offer"}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[var(--surface-soft)] p-4 rounded-lg">
              <h3 className="font-bold text-[var(--secondary)] mb-2">{locale === "kn" ? "ರಸಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಅಧ್ಯಯನ" : "Quizzes & Study Material"}</h3>
              <p className="text-sm">{locale === "kn" ? "KPSC, PSI, FDA/SDA ಪರೀಕ್ಷೆಗಳಿಗೆ ಉಪಯುಕ್ತವಾದ ದೈನಂದಿನ ರಸಪ್ರಶ್ನೆಗಳು, ಸಾಮಾನ್ಯ ಜ್ಞಾನ ಮತ್ತು ಪಠ್ಯಕ್ರಮ." : "Daily quizzes, GK, and syllabus resources tailored for KPSC, PSI, and FDA/SDA exams."}</p>
            </div>
            <div className="bg-[var(--surface-soft)] p-4 rounded-lg">
              <h3 className="font-bold text-[var(--secondary)] mb-2">{locale === "kn" ? "ಉದ್ಯೋಗ ಅಲರ್ಟ್ಸ್" : "Job Alerts"}</h3>
              <p className="text-sm">{locale === "kn" ? "ಸರ್ಕಾರಿ, ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಖಾಸಗಿ ವಲಯದ ಇತ್ತೀಚಿನ ಉದ್ಯೋಗ ಅಧಿಸೂಚನೆಗಳು." : "Latest recruitment notifications across government, banking, and private sectors."}</p>
            </div>
            <div className="bg-[var(--surface-soft)] p-4 rounded-lg">
              <h3 className="font-bold text-[var(--secondary)] mb-2">{locale === "kn" ? "ಶಿಕ್ಷಣ ಮತ್ತು ಕರಿಯರ್ ಗೈಡ್" : "Education & Career Guide"}</h3>
              <p className="text-sm">{locale === "kn" ? "ವಿವಿಧ ಕೋರ್ಸ್‌ಗಳು, ಟಾಪ್ ಕಾಲೇಜುಗಳು ಮತ್ತು ಕರಿಯರ್ ಆಯ್ಕೆಗಳ ಬಗ್ಗೆ ವಿವರವಾದ ಮಾರ್ಗದರ್ಶನ." : "Detailed guidance on various courses, top colleges, and future career prospects."}</p>
            </div>
            <div className="bg-[var(--surface-soft)] p-4 rounded-lg">
              <h3 className="font-bold text-[var(--secondary)] mb-2">{locale === "kn" ? "ಅನಿವಾಸಿ ಕನ್ನಡಿಗರ ಕೇಂದ್ರ" : "NRI / Expat Hub"}</h3>
              <p className="text-sm">{locale === "kn" ? "ವಿದೇಶದಲ್ಲಿರುವ ಕನ್ನಡಿಗರಿಗಾಗಿ ವೀಸಾ, ಕರೆನ್ಸಿ, ಮತ್ತು ತಾಯ್ನಾಡಿನ ಹೂಡಿಕೆಗಳ ಬಗ್ಗೆ ವಿಶೇಷ ಲೇಖನಗಳು." : "Specialized articles covering visa updates, currency trends, and homeland investments for global Kannadigas."}</p>
            </div>
          </div>
        </section>

        {/* Editorial & Trust */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-[var(--primary)] border-b pb-2">{locale === "kn" ? "ನಮ್ಮ ಸಂಪಾದಕೀಯ ನೀತಿ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹತೆ" : "Editorial Policy & Trust (E-E-A-T)"}</h2>
          {locale === "kn" ? (
            <>
              <p>ನಾವು ಪ್ರಕಟಿಸುವ ಪ್ರತಿಯೊಂದು ಉದ್ಯೋಗ ಅಧಿಸೂಚನೆ, ಪರೀಕ್ಷಾ ಮಾಹಿತಿ ಮತ್ತು ಸುದ್ದಿಯನ್ನು ಅಧಿಕೃತ ಮೂಲಗಳಿಂದ (ಉದಾಹರಣೆಗೆ: KPSC, KEA, ಮತ್ತು ಇತರ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್‌ಗಳು) ಎಚ್ಚರಿಕೆಯಿಂದ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.</p>
              <p>ನಮ್ಮ ಬಳಕೆದಾರರಿಗೆ ತಪ್ಪು ಮಾಹಿತಿ ಹೋಗಬಾರದು ಎಂಬುದು ನಮ್ಮ ಕಟ್ಟುನಿಟ್ಟಿನ ನಿಯಮ. ಯಾವುದೇ ಬದಲಾವಣೆಗಳಾದಲ್ಲಿ ನಾವು ಲೇಖನಗಳನ್ನು ಕಾಲಕಾಲಕ್ಕೆ ಅಪ್ಡೇಟ್ ಮಾಡುತ್ತೇವೆ.</p>
            </>
          ) : (
            <>
              <p>Every job notification, exam update, and news article we publish is carefully verified against official sources (e.g., KPSC, KEA, and official government portals) before reaching our audience.</p>
              <p>We strictly adhere to a zero-misinformation policy. Our dedicated editorial team ensures that content is continuously updated to reflect the most current and accurate information available.</p>
            </>
          )}
        </section>

        {/* Contact info */}
        <section className="space-y-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <h2 className="text-xl font-bold text-[var(--primary)]">{locale === "kn" ? "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ" : "Contact Us"}</h2>
          <p>
            {locale === "kn" 
              ? "ನಿಮ್ಮ ಅನಿಸಿಕೆ, ಸಲಹೆಗಳು ಅಥವಾ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿದ್ದರೆ ದಯವಿಟ್ಟು ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ. ನಿಮ್ಮ ಪ್ರತಿಯೊಂದು ಪ್ರತಿಕ್ರಿಯೆ ನಮಗೆ ಮೌಲ್ಯಯುತವಾಗಿದೆ." 
              : "If you have any feedback, suggestions, or queries, please don't hesitate to reach out. We value every piece of feedback from our community."}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <svg className="w-5 h-5 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <a href="mailto:kannadaquiz.support@gmail.com" className="font-medium text-[var(--primary)] hover:underline">kannadaquiz.support@gmail.com</a>
          </div>
        </section>
      </div>
    </article>
  );
}
