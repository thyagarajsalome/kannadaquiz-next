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
