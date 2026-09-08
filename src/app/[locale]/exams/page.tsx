import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locales";
import fs from "fs";
import path from "path";

type SeoPageData = {
  slug: string;
  examId: string;
  intentId: string;
  districtId: string | null;
  title: { en: string; kn: string };
  description: { en: string; kn: string };
};

function getSeoPages(): SeoPageData[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "seo-exams.json");
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error("Error reading seo-exams.json:", error);
    return [];
  }
}

export const revalidate = 86400;

export function generateStaticParams() {
  return [{ locale: "kn" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  if (locale !== "kn") {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }

  return {
    title: "ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿಗಳು 2026 | KPSC, ಪೊಲೀಸ್, FDA, SDA",
    description: "KPSC KAS, ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್, PSI, FDA, SDA, TET ಮತ್ತು ಇತರ ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ಪಠ್ಯಕ್ರಮ, ಅಣಕು ಪರೀಕ್ಷೆಗಳು ಹಾಗೂ ಹಿಂದಿನ ಪ್ರಶ್ನೋತ್ತರಗಳು.",
    alternates: {
      canonical: "https://kannadaquiz.in/kn/exams",
    },
    openGraph: {
      title: "ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿಗಳು 2026",
      description: "KPSC KAS, ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್, PSI, FDA, SDA, TET ಪರೀಕ್ಷೆಗಳ ಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ.",
      url: "https://kannadaquiz.in/kn/exams",
      siteName: "KannadaQuiz",
      locale: "kn_IN",
      type: "website",
    },
  };
}

export default async function ExamsHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  if (locale !== "kn") {
    notFound();
  }

  const pages = getSeoPages();

  // Group pages by exam
  const examGroups: Record<string, SeoPageData[]> = {};
  pages.forEach((p) => {
    if (!examGroups[p.examId]) {
      examGroups[p.examId] = [];
    }
    examGroups[p.examId].push(p);
  });

  const examNames: Record<string, string> = {
    "kpsc-kas": "KPSC KAS ಪರೀಕ್ಷೆ",
    "police-constable": "ಕರ್ನಾಟಕ ಪೊಲೀಸ್ ಕಾನ್‌ಸ್ಟೇಬಲ್",
    "psi": "ಪೊಲೀಸ್ ಸಬ್-ಇನ್‌ಸ್ಪೆಕ್ಟರ್ (PSI)",
    "fda": "ಪ್ರಥಮ ದರ್ಜೆ ಸಹಾಯಕ (FDA)",
    "sda": "ದ್ವಿತೀಯ ದರ್ಜೆ ಸಹಾಯಕ (SDA)",
    "tet": "ಕರ್ನಾಟಕ ಶಿಕ್ಷಕರ ಅರ್ಹತಾ ಪರೀಕ್ಷೆ (KARTET)",
    "pdo": "ಪಂಚಾಯತ್ ಅಭಿವೃದ್ಧಿ ಅಧಿಕಾರಿ (PDO)",
    "vao": "ಗ್ರಾಮ ಆಡಳಿತ ಅಧಿಕಾರಿ (VAO)",
    "ssc-kannada": "SSC ಪರೀಕ್ಷೆಗಳು (ಕನ್ನಡ ಮಾಧ್ಯಮ)",
    "rrb-kannada": "ರೈಲ್ವೆ RRB ಪರೀಕ್ಷೆಗಳು (ಕನ್ನಡ)",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "ಮುಖಪುಟ",
        "item": "https://kannadaquiz.in/kn"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿಗಳು",
        "item": "https://kannadaquiz.in/kn/exams"
      }
    ]
  };

  return (
    <div className="bg-[var(--background)] min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] py-3">
        <div className="kq-container">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--muted)] flex items-center gap-2">
            <Link href="/kn" className="hover:text-[var(--primary)] transition-colors">
              ಮುಖಪುಟ
            </Link>
            <span>›</span>
            <span className="text-[var(--foreground)] font-semibold">
              ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿಗಳು
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[var(--primary)] text-white py-12 md:py-16 border-b border-[var(--border)]">
        <div className="kq-container max-w-4xl">
          <span className="inline-block bg-[var(--secondary)] text-white text-[10px] font-black uppercase px-3 py-1 rounded tracking-widest mb-3">
            ಎಲ್ಲಾ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳು
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-extrabold leading-tight">
            ಕರ್ನಾಟಕ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿಗಳು 2026
          </h1>
          <p className="mt-4 text-white/85 text-base md:text-lg leading-relaxed">
            KPSC KAS, ಪೊಲೀಸ್, FDA, SDA, TET ಹಾಗೂ ಇತರ ಪ್ರಮುಖ ನೇಮಕಾತಿ ಪರೀಕ್ಷೆಗಳ ಪಠ್ಯಕ್ರಮ, ಹಿಂದಿನ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆಗಳು, ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳು ಮತ್ತು ಜಿಲ್ಲಾವಾರು ಉದ್ಯೋಗ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ.
          </p>
        </div>
      </div>

      {/* Main Content: Directory Grid */}
      <div className="kq-container mt-10">
        <div className="space-y-10">
          {Object.entries(examGroups).map(([examId, examPages]) => {
            const displayName = examNames[examId] || examId.toUpperCase();
            return (
              <div key={examId} className="kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)]">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-6">
                  <h2 className="font-serif text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
                    <span>📚</span> {displayName}
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-[var(--surface-soft)] text-[var(--secondary)] rounded-full">
                    {examPages.length} ಮಾರ್ಗದರ್ಶಿಗಳು
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {examPages.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/kn/exams/${page.slug}`}
                      className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--secondary)] hover:shadow-sm transition-all group block"
                    >
                      <h3 className="text-sm font-bold text-[var(--foreground)] group-hover:text-[var(--secondary)] line-clamp-2 leading-snug mb-1">
                        {page.title.kn}
                      </h3>
                      <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                        {page.description.kn}
                      </p>
                      <span className="inline-block mt-2 text-[11px] font-semibold text-[var(--secondary)]">
                        ವಿವರ ನೋಡಿ ➔
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
