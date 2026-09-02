import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { isLocale, type Locale } from "@/lib/locales";

interface SeoPage {
  slug: string;
  examId: string;
  intentId: string;
  districtId: string | null;
  title: Record<string, string>;
  description: Record<string, string>;
}

// Function to read the local JSON file
function getSeoPages(): SeoPage[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data", "seo-exams.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading seo-exams.json:", error);
    return [];
  }
}

// Generate static routes for all pages
export function generateStaticParams() {
  const pages = getSeoPages();
  const params: { locale: string; slug: string }[] = [];
  
  const locales = ["en", "kn"];
  
  for (const locale of locales) {
    for (const page of pages) {
      params.push({ locale, slug: page.slug });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  
  const pages = getSeoPages();
  const pageData = pages.find(p => p.slug === slug);
  
  if (!pageData) {
    return { title: "Not Found" };
  }
  
  return {
    title: `${pageData.title[locale]} | KannadaQuiz`,
    description: pageData.description[locale],
    alternates: {
      canonical: `/${locale}/exams/${slug}`
    }
  };
}

export default async function ExamSeoPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  
  const pages = getSeoPages();
  const pageData = pages.find(p => p.slug === slug);
  
  if (!pageData) {
    notFound();
  }

  const isKn = locale === "kn";

  return (
    <div className="bg-[var(--background)] min-h-screen pb-16">
      {/* Hero Banner */}
      <div className="bg-[var(--primary)] text-white py-12 md:py-20 border-b border-[var(--border)]">
        <div className="kq-container">
          <div className="max-w-4xl">
            <span className="inline-block bg-[var(--secondary)] text-white text-[10px] font-black uppercase px-3 py-1 rounded tracking-widest mb-4">
              {isKn ? "ಪರೀಕ್ಷಾ ಮಾಹಿತಿ" : "Exam Guide"}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-extrabold leading-tight">
              {pageData.title[locale]}
            </h1>
            <p className="mt-4 text-white/80 text-lg md:text-xl font-medium leading-relaxed max-w-2xl">
              {pageData.description[locale]}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="kq-container mt-10">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2">
            <div className="kq-card p-6 md:p-8">
              <h2 className="font-serif text-2xl font-bold text-[var(--primary)] border-b border-[var(--border)] pb-3 mb-5">
                {isKn ? "ಸಂಪೂರ್ಣ ಮಾಹಿತಿ" : "Complete Information"}
              </h2>
              
              <div className="prose prose-slate max-w-none">
                <p>
                  {isKn 
                    ? `ನೀವು ${pageData.title.kn} ಗಾಗಿ ಹುಡುಕುತ್ತಿದ್ದೀರಾ? ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷೆಗಳ ತಯಾರಿಗೆ ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ಮಾಹಿತಿಯನ್ನು ನಾವು ಇಲ್ಲಿ ಒದಗಿಸುತ್ತೇವೆ. ನಮ್ಮ ವೇದಿಕೆಯು ಉಚಿತ ರಸಪ್ರಶ್ನೆಗಳು, ಸ್ಟಡಿ ಮೆಟೀರಿಯಲ್ಸ್ ಮತ್ತು ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ.`
                    : `Are you looking for ${pageData.title.en}? You have come to the right place. We provide all the necessary resources for competitive exam preparation including free mock tests, study materials, and daily current affairs.`}
                </p>
                
                <h3 className="text-xl font-bold mt-6 mb-3">
                  {isKn ? "ಏಕೆ ಈ ಮಾರ್ಗದರ್ಶಿ ಮುಖ್ಯ?" : "Why is this guide important?"}
                </h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>{isKn ? "ಪರೀಕ್ಷೆಯ ನಿಖರವಾದ ಮಾದರಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು" : "Understand the exact exam pattern"}</li>
                  <li>{isKn ? "ಸಮಯ ನಿರ್ವಹಣೆ ತಂತ್ರಗಳನ್ನು ಕಲಿಯಲು" : "Learn time management strategies"}</li>
                  <li>{isKn ? "ಹಿಂದಿನ ವರ್ಷದ ಪ್ರಶ್ನೆಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲು" : "Analyze previous year questions"}</li>
                </ul>

                <div className="mt-10 bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                  <h4 className="font-bold text-amber-800 text-lg mb-2">
                    {isKn ? "ಸಿದ್ಧರಾಗಿದ್ದೀರಾ?" : "Ready to start?"}
                  </h4>
                  <p className="text-amber-700 mb-4 text-sm">
                    {isKn ? "ನಮ್ಮ ಉಚಿತ ಆನ್‌ಲೈನ್ ರಸಪ್ರಶ್ನೆಗಳನ್ನು ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ." : "Start your preparation with our free online mock tests today."}
                  </p>
                  <Link 
                    href={`/${locale}/quizzes`}
                    className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg shadow-sm transition-colors"
                  >
                    {isKn ? "ಕ್ವಿಜ್ ಪ್ರಾರಂಭಿಸಿ" : "Take a Mock Test"}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="kq-card p-6">
              <h3 className="font-serif text-lg font-bold text-[var(--primary)] border-b border-[var(--border)] pb-2 mb-4">
                {isKn ? "ಉಪಯುಕ್ತ ಲಿಂಕ್‌ಗಳು" : "Quick Links"}
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href={`/${locale}/syllabus`} className="text-[var(--secondary)] hover:underline font-medium text-sm flex items-center gap-2">
                    <span>➔</span> {isKn ? "ಎಲ್ಲಾ ಪರೀಕ್ಷೆಗಳ ಪಠ್ಯಕ್ರಮ" : "All Exam Syllabuses"}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/category/jobs`} className="text-[var(--secondary)] hover:underline font-medium text-sm flex items-center gap-2">
                    <span>➔</span> {isKn ? "ಇತ್ತೀಚಿನ ಉದ್ಯೋಗ ಮಾಹಿತಿ" : "Latest Job Notifications"}
                  </Link>
                </li>
                <li>
                  <Link href={`/${locale}/category/current-affairs`} className="text-[var(--secondary)] hover:underline font-medium text-sm flex items-center gap-2">
                    <span>➔</span> {isKn ? "ದಿನನಿತ್ಯದ ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು" : "Daily Current Affairs"}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="kq-card p-6 bg-[var(--surface-soft)]">
              <h3 className="font-bold text-[var(--primary)] mb-2">
                {isKn ? "ದೈನಂದಿನ ಅಪ್ಡೇಟ್ಸ್ ಪಡೆಯಿರಿ" : "Get Daily Updates"}
              </h3>
              <p className="text-xs text-[var(--muted)] mb-4">
                {isKn ? "ನಮ್ಮ ಟೆಲಿಗ್ರಾಮ್ ಗುಂಪಿಗೆ ಸೇರಿ ಮತ್ತು ಉಚಿತ ಸ್ಟಡಿ ಮೆಟೀರಿಯಲ್ಸ್ ಪಡೆಯಿರಿ." : "Join our Telegram group for daily free study materials and updates."}
              </p>
              <a href="#" className="block text-center w-full bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold py-2 rounded transition-colors text-sm">
                Join Telegram
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
