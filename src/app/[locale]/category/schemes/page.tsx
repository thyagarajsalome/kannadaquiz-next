import type { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { isLocale, type Locale } from "@/lib/locales";

export const revalidate = 86400;

interface SchemeItem {
  id: string;
  nameKn: string;
  nameEn: string;
  taglineKn: string;
  taglineEn: string;
  benefitKn: string;
  benefitEn: string;
  departmentKn: string;
  departmentEn: string;
  eligibilityKn: string[];
  eligibilityEn: string[];
  documentsKn: string[];
  documentsEn: string[];
  howToApplyKn: string[];
  howToApplyEn: string[];
  statusCheckKn: string;
}

function getSchemes(): SchemeItem[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "karnataka-schemes.json");
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return {
    title:
      locale === "kn"
        ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪ್ರಮುಖ ಗ್ಯಾರಂಟಿ ಯೋಜನೆಗಳು 2026 | ಗೃಹಲಕ್ಷ್ಮಿ, ಯುವನಿಧಿ, ಗೃಹಜ್ಯೋತಿ, ಶಕ್ತಿ, ಅನ್ನಭಾಗ್ಯ"
        : "Karnataka Government Guarantee Schemes 2026 | Gruha Lakshmi, Yuva Nidhi, Gruha Jyothi, Shakti",
    description:
      locale === "kn"
        ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ 5 ಗ್ಯಾರಂಟಿ ಯೋಜನೆಗಳ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ: ಅರ್ಹತೆ, ಅಗತ್ಯ ದಾಖಲೆಗಳು, ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ ಮತ್ತು DBT ಹಣ ಜಮೆ ಸ್ಟೇಟಸ್ ಪರಿಶೀಲನೆ."
        : "Complete guide to Karnataka 5 Guarantee Schemes: Gruha Lakshmi, Yuva Nidhi, Shakti, Gruha Jyothi, and Anna Bhagya. Check eligibility, required documents, and application steps.",
    keywords: [
      "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
      "ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆ ಅರ್ಜಿ",
      "ಯುವನಿಧಿ ಯೋಜನೆ ಅರ್ಹತೆ",
      "ಗೃಹಜ್ಯೋತಿ ಉಚಿತ ವಿದ್ಯುತ್",
      "ಶಕ್ತಿ ಯೋಜನೆ ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಬಸ್",
      "ಅನ್ನಭಾಗ್ಯ DBT ಹಣ",
      "Karnataka Guarantee Schemes 2026",
      "Seva Sindhu guarantee schemes",
    ],
    alternates: {
      canonical: `/${locale}/category/schemes`,
      languages: {
        kn: "/kn/category/schemes",
        en: "/en/category/schemes",
      },
    },
    openGraph: {
      title:
        locale === "kn"
          ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ 5 ಗ್ಯಾರಂಟಿ ಯೋಜನೆಗಳ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ"
          : "Karnataka Govt 5 Guarantee Schemes Complete Guide",
      description:
        locale === "kn"
          ? "ಅರ್ಹತೆ, ದಾಖಲೆಗಳು, ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಮತ್ತು ಡಿಬಿಟಿ ಸ್ಟೇಟಸ್ ಪರಿಶೀಲನೆ."
          : "Detailed eligibility criteria, documents, and application steps.",
      url: `https://kannadaquiz.in/${locale}/category/schemes`,
      siteName: "KannadaQuiz",
      locale: locale === "kn" ? "kn_IN" : "en_US",
      type: "website",
    },
  };
}

export default async function SchemesCategoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const schemes = getSchemes();

  // Structured Data for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: schemes.map((s) => ({
      "@type": "Question",
      name:
        locale === "kn"
          ? `${s.nameKn} ಗೆ ಯಾರು ಅರ್ಹರು ಮತ್ತು ಹೇಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವುದು?`
          : `Who is eligible for ${s.nameEn} and how to apply?`,
      acceptedAnswer: {
        "@type": "Answer",
        text:
          locale === "kn"
            ? `${s.taglineKn}. ಅಗತ್ಯ ದಾಖಲೆಗಳು: ${s.documentsKn.join(", ")}. ಅರ್ಜಿ ವಿಧಾನ: ${s.howToApplyKn.join(" ")}`
            : `${s.taglineEn}. Required documents: ${s.documentsEn.join(", ")}. How to apply: ${s.howToApplyEn.join(" ")}`,
      },
    })),
  };

  return (
    <div className="bg-[var(--background)] min-h-screen py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="kq-container max-w-4xl">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--muted)] flex items-center gap-2 mb-6">
          <Link href={`/${locale}`} className="hover:text-[var(--primary)]">
            {locale === "kn" ? "ಮುಖಪುಟ" : "Home"}
          </Link>
          <span>›</span>
          <span className="text-[var(--foreground)] font-semibold">
            {locale === "kn" ? "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು" : "Government Schemes"}
          </span>
        </nav>

        {/* Header Banner */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-emerald-200 mb-3">
            <span>🏛️</span>
            <span>{locale === "kn" ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಸೇವೆಗಳು" : "Karnataka Citizen Schemes"}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold text-[var(--primary)] leading-tight">
            {locale === "kn"
              ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಪ್ರಮುಖ ಗ್ಯಾರಂಟಿ ಯೋಜನೆಗಳು 2026"
              : "Karnataka Government Guarantee Schemes 2026"}
          </h1>
          <p className="text-[var(--muted)] text-sm md:text-base mt-3 max-w-2xl mx-auto leading-relaxed">
            {locale === "kn"
              ? "ಗೃಹಲಕ್ಷ್ಮಿ, ಯುವನಿಧಿ, ಗೃಹಜ್ಯೋತಿ, ಶಕ್ತಿ ಮತ್ತು ಅನ್ನಭಾಗ್ಯ ಯೋಜನೆಗಳ ಸಂಪೂರ್ಣ ಅಧಿಕೃತ ಮಾರ್ಗದರ್ಶಿ. ಅರ್ಹತೆಯ ನಿಯಮಗಳು, ಬೇಕಾಗುವ ದಾಖಲೆಗಳು ಮತ್ತು ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಸರಳ ವಿಧಾನ ಇಲ್ಲಿದೆ."
              : "Official guide to Karnataka's 5 Guarantee Schemes: eligibility guidelines, required documents, application process, and DBT status verification."}
          </p>
        </header>

        {/* Quick Nav Anchor Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {schemes.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-xs font-bold px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-all shadow-2xs"
            >
              {locale === "kn" ? s.nameKn.split(" (")[0] : s.nameEn}
            </a>
          ))}
        </div>

        {/* Schemes Detailed Cards */}
        <div className="space-y-8">
          {schemes.map((scheme, idx) => (
            <article
              key={scheme.id}
              id={scheme.id}
              className="kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-xs scroll-mt-20"
            >
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-4 mb-5">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--secondary)]">
                    #{idx + 1} {locale === "kn" ? scheme.departmentKn : scheme.departmentEn}
                  </span>
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--primary)] mt-0.5">
                    {locale === "kn" ? scheme.nameKn : scheme.nameEn}
                  </h2>
                </div>
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold">
                  {locale === "kn" ? scheme.benefitKn : scheme.benefitEn}
                </div>
              </div>

              {/* Tagline */}
              <div className="p-3.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs md:text-sm font-semibold text-[var(--foreground)] mb-6">
                💡 {locale === "kn" ? scheme.taglineKn : scheme.taglineEn}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Eligibility */}
                <div>
                  <h3 className="font-serif text-sm font-bold text-[var(--primary)] mb-2.5 flex items-center gap-1.5">
                    <span>✅</span>
                    <span>{locale === "kn" ? "ಅರ್ಹತೆಯ ನಿಯಮಗಳು (Eligibility)" : "Eligibility Criteria"}</span>
                  </h3>
                  <ul className="text-xs leading-relaxed text-[var(--muted)] space-y-1.5 list-disc pl-4">
                    {(locale === "kn" ? scheme.eligibilityKn : scheme.eligibilityEn).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="font-serif text-sm font-bold text-[var(--primary)] mb-2.5 flex items-center gap-1.5">
                    <span>📄</span>
                    <span>{locale === "kn" ? "ಅಗತ್ಯ ದಾಖಲೆಗಳು (Documents)" : "Required Documents"}</span>
                  </h3>
                  <ul className="text-xs leading-relaxed text-[var(--muted)] space-y-1.5 list-disc pl-4">
                    {(locale === "kn" ? scheme.documentsKn : scheme.documentsEn).map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* How to Apply */}
              <div className="mt-6 pt-5 border-t border-[var(--border)]">
                <h3 className="font-serif text-sm font-bold text-[var(--primary)] mb-2.5 flex items-center gap-1.5">
                  <span>📱</span>
                  <span>{locale === "kn" ? "ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ (How to Apply)" : "How to Apply"}</span>
                </h3>
                <div className="space-y-1.5 text-xs text-[var(--muted)] leading-relaxed">
                  {(locale === "kn" ? scheme.howToApplyKn : scheme.howToApplyEn).map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-bold text-[var(--secondary)]">{i + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Check Note */}
              <div className="mt-4 p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-blue-900 flex items-center justify-between flex-wrap gap-2">
                <span>
                  <strong>{locale === "kn" ? "ಸ್ಟೇಟಸ್ ಚೆಕ್: " : "Status Check: "}</strong>
                  {scheme.statusCheckKn}
                </span>
                <a
                  href="https://sevasindhugs.karnataka.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-700 hover:underline"
                >
                  Seva Sindhu Portal ➔
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Footer Guidance Card */}
        <div className="mt-12 kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] bg-white shadow-xs">
          <h3 className="font-serif text-lg font-bold text-[var(--primary)] mb-3">
            {locale === "kn" ? "ಪ್ರಮುಖ ಎಚ್ಚರಿಕೆ ಮತ್ತು ಸೂಚನೆಗಳು" : "Important Citizen Advisory"}
          </h3>
          <p className="text-xs leading-relaxed text-[var(--muted)] mb-4">
            {locale === "kn"
              ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಯಾವುದೇ ಗ್ಯಾರಂಟಿ ಯೋಜನೆಗಳಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಮಧ್ಯವರ್ತಿಗಳಿಗೆ ಹಣ ನೀಡಬೇಡಿ. ಸೇವಾ ಸಿಂಧು, ಗ್ರಾಮ ಒನ್, ಕರ್ನಾಟಕ ಒನ್ ಮತ್ತು ಬೆಂಗಳೂರು ಒನ್ ಕೇಂದ್ರಗಳಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಸಂಪೂರ್ಣ ಉಚಿತವಾಗಿರುತ್ತದೆ. ಯಾವುದೇ ಸಹಾಯವಾಣಿಗೆ 1902 ಕರೆ ಮಾಡಬಹುದು."
              : "Do not pay any fee to middlemen for enrolling in Karnataka Guarantee Schemes. Registration at Seva Sindhu, Grama One, and Karnataka One centers is completely free. For citizen grievance, contact official helpline 1902."}
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <Link
              href={`/${locale}/tools/age-calculator`}
              className="px-4 py-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold hover:bg-blue-100 transition-all"
            >
              🎯 {locale === "kn" ? "ಸರ್ಕಾರಿ ಹುದ್ದೆಗಳ ವಯಸ್ಸು ಕ್ಯಾಲ್ಕುಲೇಟರ್" : "Govt Job Age Calculator"}
            </Link>
            <Link
              href={`/${locale}/papers`}
              className="px-4 py-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold hover:bg-amber-100 transition-all"
            >
              📚 {locale === "kn" ? "ಹಿಂದಿನ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು" : "Previous Year Papers"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
