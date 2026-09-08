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
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading seo-exams.json:", error);
    return [];
  }
}

// Generate static routes for all Kannada exam pages
export function generateStaticParams() {
  const pages = getSeoPages();
  return pages.map((page) => ({ locale: "kn", slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  
  if (locale !== "kn") {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }

  const pages = getSeoPages();
  const pageData = pages.find(p => p.slug === slug);
  
  if (!pageData) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }
  
  return {
    title: pageData.title.kn,
    description: pageData.description.kn,
    alternates: {
      canonical: `https://kannadaquiz.in/kn/exams/${slug}`,
    },
    openGraph: {
      title: pageData.title.kn,
      description: pageData.description.kn,
      url: `https://kannadaquiz.in/kn/exams/${slug}`,
      siteName: "KannadaQuiz",
      locale: "kn_IN",
      type: "article",
    },
  };
}

export default async function ExamSeoPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  
  if (locale !== "kn") {
    notFound();
  }

  const pages = getSeoPages();
  const pageData = pages.find(p => p.slug === slug);
  
  if (!pageData) {
    notFound();
  }

  // Find related exams for internal crawl linking
  const relatedExams = pages
    .filter(p => p.slug !== slug && (p.examId === pageData.examId || p.intentId === pageData.intentId))
    .slice(0, 6);

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
        "name": "ಪರೀಕ್ಷೆಗಳು",
        "item": "https://kannadaquiz.in/kn/exams"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": pageData.title.kn,
        "item": `https://kannadaquiz.in/kn/exams/${slug}`
      }
    ]
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `${pageData.title.kn} ತಯಾರಿ ಹೇಗೆ ಪ್ರಾರಂಭಿಸುವುದು?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ಮೊದಲು ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ, ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ ಮತ್ತು ಕನ್ನಡಕ್ವಿಜ್ ನಲ್ಲಿ ಲಭ್ಯವಿರುವ ಉಚಿತ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ತೆಗೆದುಕೊಳ್ಳಿ."
        }
      },
      {
        "@type": "Question",
        "name": "ಈ ಪರೀಕ್ಷೆಗೆ ಉಚಿತ ಅಣಕು ಪರೀಕ್ಷೆಗಳು (Mock Tests) ಲಭ್ಯವಿದೆಯೇ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ಹೌದು, ಕನ್ನಡಕ್ವಿಜ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಲ್ಲಿ ವಿಷಯವಾರು ಉಚಿತ ರಸಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಹಿಂದಿನ ಪ್ರಶ್ನೆಗಳ ಆಧಾರಿತ ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು ಲಭ್ಯವಿವೆ."
        }
      }
    ]
  };

  return (
    <div className="bg-[var(--background)] min-h-screen pb-16">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] py-3">
        <div className="kq-container">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--muted)] flex items-center gap-2 flex-wrap">
            <Link href="/kn" className="hover:text-[var(--primary)] transition-colors">
              ಮುಖಪುಟ
            </Link>
            <span>›</span>
            <Link href="/kn/exams" className="hover:text-[var(--primary)] transition-colors">
              ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿಗಳು
            </Link>
            <span>›</span>
            <span className="text-[var(--foreground)] font-semibold truncate max-w-xs md:max-w-md">
              {pageData.title.kn}
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-[var(--primary)] text-white py-10 md:py-16 border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="max-w-4xl">
            <span className="inline-block bg-[var(--secondary)] text-white text-[10px] font-black uppercase px-3 py-1 rounded tracking-widest mb-3">
              ಪರೀಕ್ಷಾ ಮಾಹಿತಿ 2026
            </span>
            <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              {pageData.title.kn}
            </h1>
            <p className="mt-4 text-white/85 text-base md:text-lg font-medium leading-relaxed max-w-3xl">
              {pageData.description.kn}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="kq-container mt-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            <div className="kq-card p-6 md:p-8">
              <h2 className="font-serif text-2xl font-bold text-[var(--primary)] border-b border-[var(--border)] pb-3 mb-5">
                ಸಂಪೂರ್ಣ ತಯಾರಿ ಮಾಹಿತಿ & ವಿವರಣೆ
              </h2>
              
              <div className="prose prose-slate max-w-none text-[var(--foreground)] leading-relaxed space-y-4">
                <p>
                  ನೀವು <strong>{pageData.title.kn}</strong> ಗಾಗಿ ಹುಡುಕುತ್ತಿದ್ದೀರಾ? ಕರ್ನಾಟಕದ ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ತಯಾರಿಗೆ ಅಗತ್ಯವಿರುವ ನಿಖರ ಮತ್ತು ನವೀಕೃತ ಮಾಹಿತಿಯನ್ನು ನಾವು ಇಲ್ಲಿ ಒದಗಿಸುತ್ತೇವೆ. ನಮ್ಮ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಲ್ಲಿ ಉಚಿತ ರಸಪ್ರಶ್ನೆಗಳು, ಪಠ್ಯಕ್ರಮ, ಹಿಂದಿನ ಪ್ರಶ್ನೋತ್ತರಗಳು ಮತ್ತು ದಿನನಿತ್ಯದ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು ಲಭ್ಯವಿವೆ.
                </p>
                
                <h3 className="text-xl font-bold text-[var(--primary)] pt-4">
                  ಈ ಮಾರ್ಗದರ್ಶಿಯ ಪ್ರಮುಖ ಅಂಶಗಳು:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--muted)]">
                  <li><strong>ಪರೀಕ್ಷಾ ಮಾದರಿ:</strong> ಪರೀಕ್ಷೆಯ ನಿಖರವಾದ ಪ್ರಶ್ನೆ ಪತ್ರಿಕೆ ಮಾದರಿ ಮತ್ತು ಅಂಕ ಹಂಚಿಕೆ ತಿಳಿಯಿರಿ.</li>
                  <li><strong>ಸಮಯ ನಿರ್ವಹಣೆ:</strong> ನಿಗದಿತ ಸಮಯದಲ್ಲಿ ನಿಖರವಾಗಿ ಉತ್ತರಿಸುವ ತಂತ್ರಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ.</li>
                  <li><strong>ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆಗಳು:</strong> ಪುನರಾವರ್ತಿತ ಪ್ರಶ್ನೆಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ ಹೆಚ್ಚು ಅಂಕ ಗಳಿಸಿ.</li>
                </ul>

                <h3 className="text-xl font-bold text-[var(--primary)] pt-4">
                  ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQ):
                </h3>
                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-[var(--surface-soft)] rounded-xl border border-[var(--border)]">
                    <h4 className="font-bold text-sm text-[var(--foreground)] mb-1">
                      {pageData.title.kn} ತಯಾರಿ ಹೇಗೆ ಪ್ರಾರಂಭಿಸುವುದು?
                    </h4>
                    <p className="text-xs text-[var(--muted)]">
                      ಮೊದಲು ಅಧಿಕೃತ ಪಠ್ಯಕ್ರಮವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ, ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ ಮತ್ತು ಕನ್ನಡಕ್ವಿಜ್ ನಲ್ಲಿ ಲಭ್ಯವಿರುವ ಉಚಿತ ಮಾಕ್ ಟೆಸ್ಟ್‌ಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ತೆಗೆದುಕೊಳ್ಳಿ.
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--surface-soft)] rounded-xl border border-[var(--border)]">
                    <h4 className="font-bold text-sm text-[var(--foreground)] mb-1">
                      ಈ ಪರೀಕ್ಷೆಗೆ ಉಚಿತ ಅಣಕು ಪರೀಕ್ಷೆಗಳು (Mock Tests) ಲಭ್ಯವಿದೆಯೇ?
                    </h4>
                    <p className="text-xs text-[var(--muted)]">
                      ಹೌದು, ಕನ್ನಡಕ್ವಿಜ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ನಲ್ಲಿ ವಿಷಯವಾರು ಉಚಿತ ರಸಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಹಿಂದಿನ ಪ್ರಶ್ನೆಗಳ ಆಧಾರಿತ ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು ಲಭ್ಯವಿವೆ.
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                  <h4 className="font-bold text-amber-900 text-lg mb-2">
                    ನಿಮ್ಮ ಪರೀಕ್ಷಾ ಜ್ಞಾನವನ್ನು ಪರೀಕ್ಷಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?
                  </h4>
                  <p className="text-amber-800 mb-4 text-sm">
                    ಉಚಿತ ಆನ್‌ಲೈನ್ ರಸಪ್ರಶ್ನೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ ಮತ್ತು ನಿಮ್ಮ ಸ್ಕೋರ್ ತಿಳಿಯಿರಿ.
                  </p>
                  <Link 
                    href="/kn/quizzes"
                    className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-colors text-sm"
                  >
                    ಉಚಿತ ಮಾಕ್ ಟೆಸ್ಟ್ ಪ್ರಾರಂಭಿಸಿ ➔
                  </Link>
                </div>
              </div>
            </div>

            {/* Internal Linking: Related Exam Guides */}
            {relatedExams.length > 0 && (
              <div className="kq-card p-6 md:p-8">
                <h3 className="font-serif text-xl font-bold text-[var(--primary)] border-b border-[var(--border)] pb-3 mb-4">
                  ಸಂಬಂಧಿತ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿಗಳು
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {relatedExams.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/kn/exams/${related.slug}`}
                      className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--secondary)] hover:bg-[var(--surface-soft)] transition-colors group block"
                    >
                      <span className="text-xs font-semibold text-[var(--foreground)] group-hover:text-[var(--secondary)] line-clamp-2">
                        {related.title.kn}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="kq-card p-6">
              <h3 className="font-serif text-lg font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-4">
                ಉಪಯುಕ್ತ ಲಿಂಕ್‌ಗಳು
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/kn/exams" className="text-[var(--secondary)] hover:underline font-medium text-sm flex items-center gap-2">
                    <span>➔</span> ಎಲ್ಲಾ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿಗಳು
                  </Link>
                </li>
                <li>
                  <Link href="/kn/syllabus" className="text-[var(--secondary)] hover:underline font-medium text-sm flex items-center gap-2">
                    <span>➔</span> ಪರೀಕ್ಷಾ ಪಠ್ಯಕ್ರಮಗಳು
                  </Link>
                </li>
                <li>
                  <Link href="/kn/category/jobs" className="text-[var(--secondary)] hover:underline font-medium text-sm flex items-center gap-2">
                    <span>➔</span> ಇತ್ತೀಚಿನ ಉದ್ಯೋಗ ಮಾಹಿತಿ
                  </Link>
                </li>
                <li>
                  <Link href="/kn/category/current-affairs" className="text-[var(--secondary)] hover:underline font-medium text-sm flex items-center gap-2">
                    <span>➔</span> ದಿನನಿತ್ಯದ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು
                  </Link>
                </li>
              </ul>
            </div>

            <div className="kq-card p-6 bg-[var(--surface-soft)]">
              <h3 className="font-bold text-[var(--primary)] mb-2">
                ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಲಾಗಿನ್ ಆಗಿ
              </h3>
              <p className="text-xs text-[var(--muted)] mb-4">
                ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಮತ್ತು ಹೆಚ್ಚಿನ ಉಚಿತ ಸ್ಟಡಿ ಮೆಟೀರಿಯಲ್ಸ್ ಪಡೆಯಲು ಖಾತೆಯನ್ನು ರಚಿಸಿ.
              </p>
              <Link href="/kn/login" className="block text-center w-full bg-[var(--primary)] hover:opacity-90 text-white font-bold py-2 rounded transition-colors text-sm">
                ಲಾಗಿನ್ / ರಿಜಿಸ್ಟರ್
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
