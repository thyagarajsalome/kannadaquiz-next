import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/locales";
import { ServicesClient } from "./ServicesClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = isLocale(locale) ? locale : "kn";
  return {
    title:
      lang === "kn"
        ? "ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಸೇವೆಗಳು ಮತ್ತು ಲಿಂಕ್‌ಗಳು | Government Services Directory"
        : "Official Government Services & Directory | KannadaQuiz",
    description:
      lang === "kn"
        ? "ಕೇಂದ್ರ ಹಾಗೂ ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪ್ರಮುಖ ಸೇವೆಗಳಾದ ಆಧಾರ್, ಪ್ಯಾನ್, ಪಡಿತರ ಚೀಟಿ, ಮತದಾರರ ಚೀಟಿ, ಮತ್ತು ಉಚಿತ ವಿಮೆಗಳ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗಳು ಹಾಗೂ ಅರ್ಜಿ ವಿಧಾನ."
        : "A curated list of verified Central and Karnataka State Government services like Aadhaar, PAN, Voter ID, Ration Cards, and public health insurances.",
    keywords:
      lang === "kn"
        ? [
            "ಸರ್ಕಾರಿ ಸೇವೆಗಳು", "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು", "ಆಧಾರ್ ಕಾರ್ಡ್ ಲಿಂಕ್", "ಪಡಿತರ ಚೀಟಿ ಅರ್ಜಿ",
            "ಆರೋಗ್ಯ ಕರ್ನಾಟಕ", "ಯಶಸ್ವಿನಿ ವಿಮೆ", "ಸೇವಾ ಸಿಂಧು", "ವೋಟರ್ ಐಡಿ ತಿದ್ದುಪಡಿ"
          ]
        : [
            "Government Services", "Karnataka Govt Schemes", "Aadhaar Card Update", "Ration Card Application",
            "Ayushman Bharat Karnataka", "Yeshasvini Insurance Scheme", "Seva Sindhu Portal", "Voter ID Correction"
          ],
    alternates: {
      canonical: `/${lang}/services`,
      languages: {
        kn: "/kn/services",
        en: "/en/services",
      },
    },
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return <ServicesClient locale={locale} />;
}
