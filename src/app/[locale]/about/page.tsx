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

      <div className="kq-card p-6 md:p-8 space-y-6 text-sm md:text-base leading-relaxed text-[var(--muted)]">
        {locale === "kn" ? (
          <>
            <p>
              <strong>KannadaQuiz</strong> ಕನ್ನಡಿಗರಿಗಾಗಿ ವಿಶೇಷವಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಪ್ರಮುಖ ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಮಾಹಿತಿ ವೇದಿಕೆಯಾಗಿದೆ. ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ (KPSC, UPSC, SSC, ಬ್ಯಾಂಕಿಂಗ್) ತಯಾರಿ ನಡೆಸುತ್ತಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಉತ್ತಮ ಗುಣಮಟ್ಟದ ರಸಪ್ರಶ್ನೆಗಳು (Quizzes) ಮತ್ತು ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳನ್ನು ಒದಗಿಸುವುದು ನಮ್ಮ ಪ್ರಮುಖ ಉದ್ದೇಶವಾಗಿದೆ.
            </p>
            <p>
              ಉದ್ಯೋಗ ಆಕಾಂಕ್ಷಿಗಳಿಗೆ ಸರ್ಕಾರಿ ಉದ್ಯೋಗದ ಅಧಿಸೂಚನೆಗಳು, ಶಿಕ್ಷಣ ಮಾರ್ಗದರ್ಶನ, ಮತ್ತು ವಿವಿಧ ಕ್ಷೇತ್ರಗಳ ಸುದ್ದಿಗಳನ್ನು ಒಂದೇ ಸೂರಿನಡಿ ನಾವು ನೀಡುತ್ತೇವೆ. ಕನ್ನಡಿಗರ ಜ್ಞಾನ ವಿಕಾಸಕ್ಕಾಗಿ ಸಮಗ್ರ ಮಾಹಿತಿ ಒದಗಿಸಲು ನಮ್ಮ ತಂಡ ಸದಾ ಶ್ರಮಿಸುತ್ತಿದೆ.
            </p>
            <p>
              <strong>ನಮ್ಮ ಧ್ಯೇಯ:</strong> ಕನ್ನಡಿಗರಿಗೆ ಸುಲಭವಾಗಿ ಮತ್ತು ಉಚಿತವಾಗಿ ಡಿಜಿಟಲ್ ಶಿಕ್ಷಣ ಮತ್ತು ಮಾಹಿತಿಯನ್ನು ತಲುಪಿಸುವುದು.
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>KannadaQuiz</strong> is a premier educational and informational platform designed specifically for the people of Karnataka. Our primary goal is to provide high-quality quizzes and current affairs updates for students preparing for competitive exams like KPSC, UPSC, SSC, and Banking.
            </p>
            <p>
              We also serve as a one-stop destination for government job notifications, educational guidance, and latest news across various categories. Our team is dedicated to empowering the Kannada-speaking community with accessible and accurate digital information.
            </p>
            <p>
              <strong>Our Mission:</strong> To make digital education and crucial information easily and freely accessible to everyone.
            </p>
          </>
        )}
      </div>
    </article>
  );
}
