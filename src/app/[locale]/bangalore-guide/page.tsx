import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/lib/locales";

export const revalidate = 86400; // Cache for 24 hours as this is mostly evergreen content

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
        ? "ಬೆಂಗಳೂರು ಮಾರ್ಗದರ್ಶಿ - ನಮ್ಮ ಮೆಟ್ರೋ, ವಸತಿ, ಮತ್ತು ಪ್ರವಾಸಿ ತಾಣಗಳು | Bangalore Guide"
        : "Bangalore City Guide - Relocation, Namma Metro & Tourism | KannadaQuiz",
    description:
      lang === "kn"
        ? "ಬೆಂಗಳೂರಿಗೆ ಹೊಸದಾಗಿ ಬರುವವರಿಗಾಗಿ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ. ನಮ್ಮ ಮೆಟ್ರೋ, ಬಾಡಿಗೆ ಮನೆಗಳು, ಐಟಿ ಪಾರ್ಕ್‌ಗಳು ಮತ್ತು ಅತ್ಯುತ್ತಮ ವೀಕೆಂಡ್ ತಾಣಗಳ ವಿವರ."
        : "The ultimate evergreen guide for visiting or relocating to Bangalore (Bengaluru). Covers Namma Metro routes, best areas to live, IT parks, and top weekend getaways.",
    keywords:
      lang === "kn"
        ? [
            "ಬೆಂಗಳೂರು ಮಾರ್ಗದರ್ಶಿ", "ನಮ್ಮ ಮೆಟ್ರೋ", "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಮನೆ", "ಐಟಿ ಪಾರ್ಕ್",
            "ಬೆಂಗಳೂರು ಪ್ರವಾಸಿ ತಾಣಗಳು", "ಬೆಂಗಳೂರು ವೀಕೆಂಡ್ ಟ್ರಿಪ್", "Bangalore Guide"
          ]
        : [
            "Bangalore City Guide", "Relocate to Bangalore", "Namma Metro Guide", 
            "Best areas to live in Bangalore", "Bangalore IT parks", "Weekend getaways from Bangalore"
          ],
    alternates: {
      canonical: `/${lang}/bangalore-guide`,
      languages: {
        kn: "/kn/bangalore-guide",
        en: "/en/bangalore-guide",
      },
    },
  };
}

export default async function BangaloreGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  return (
    <section className="kq-container py-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <span className="inline-block bg-[var(--secondary)] text-white text-[10px] md:text-xs font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-sm mb-4">
          {locale === "kn" ? "ಬೆಂಗಳೂರು ದರ್ಶನ" : "NAMMA BENGALURU"}
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--primary)] leading-tight mb-4">
          {locale === "kn" ? "ನಮ್ಮ ಬೆಂಗಳೂರು ಮಾರ್ಗದರ್ಶಿ" : "The Ultimate Bangalore Guide"}
        </h1>
        <p className="text-[var(--muted)] text-base md:text-lg max-w-2xl font-medium">
          {locale === "kn" 
            ? "ಬೆಂಗಳೂರಿಗೆ ಹೊಸದಾಗಿ ಬರುವವರಿಗೆ, ಉದ್ಯೋಗ ಅರಸುತ್ತಿರುವವರಿಗೆ ಮತ್ತು ಪ್ರವಾಸಿಗರಿಗೆ ಅತ್ಯಗತ್ಯವಾದ ಸಂಪೂರ್ಣ ಮಾಹಿತಿಕೋಶ." 
            : "The essential handbook for anyone visiting, relocating, or working in the Silicon Valley of India."}
        </p>
      </div>

      {/* SEO Evergreen Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left/Main Column: Extensive Guides */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Relocation & Living */}
          <div className="kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="text-3xl">🏡</span>
              {locale === "kn" ? "ವಸತಿ ಮತ್ತು ಜೀವನ ವೆಚ್ಚ (Relocation)" : "Relocation & Cost of Living"}
            </h3>
            <div className="prose prose-sm md:prose-base max-w-none text-[var(--foreground)] leading-relaxed">
              {locale === "kn" ? (
                <>
                  <p>ಬೆಂಗಳೂರಿನಲ್ಲಿ ಮನೆ ಬಾಡಿಗೆಗೆ ಪಡೆಯುವಾಗ ಮತ್ತು ವಾಸಿಸುವಾಗ ಗಮನಿಸಬೇಕಾದ ಪ್ರಮುಖ ಅಂಶಗಳು:</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 font-medium">
                    <li><strong>ಟಾಪ್ ಏರಿಯಾಗಳು (IT ಉದ್ಯೋಗಿಗಳಿಗೆ):</strong> ವೈಟ್‌ಫೀಲ್ಡ್, ಹೆಚ್.ಎಸ್.ಆರ್ ಲೇಔಟ್, ಇಂದಿರಾನಗರ, ಕೋರಮಂಗಲ ಮತ್ತು ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ. ಇಲ್ಲಿನ ಬಾಡಿಗೆ ವೆಚ್ಚವು 1BHK ಗೆ 15,000 ದಿಂದ 30,000 ವರೆಗೆ ಇರಬಹುದು.</li>
                    <li><strong>10 ತಿಂಗಳ ಠೇವಣಿ (Security Deposit):</strong> ಬೆಂಗಳೂರಿನಲ್ಲಿ ಮನೆ ಬಾಡಿಗೆಗೆ ಪಡೆಯುವಾಗ ಸಾಮಾನ್ಯವಾಗಿ 10 ತಿಂಗಳ ಬಾಡಿಗೆಯನ್ನು ಮುಂಗಡವಾಗಿ (Advance) ನೀಡಬೇಕಾಗುತ್ತದೆ. ಆದರೆ, ಮಾತುಕತೆ ಮೂಲಕ ಇದನ್ನು 5-6 ತಿಂಗಳಿಗೆ ಇಳಿಸಿಕೊಳ್ಳಬಹುದು.</li>
                    <li><strong>ವೆಚ್ಚ:</strong> ಬ್ರೋಕರೇಜ್ (ಒಂದು ತಿಂಗಳ ಬಾಡಿಗೆ), ಮೇಂಟೆನೆನ್ಸ್ ಶುಲ್ಕ ಮತ್ತು ನೀರಿನ ಬಿಲ್ ಬಗ್ಗೆ ಮೊದಲೇ ಒಪ್ಪಂದ ಮಾಡಿಕೊಳ್ಳಿ.</li>
                  </ul>
                  <p className="mt-4 text-[var(--muted)] text-sm">💡 <strong>ಸಲಹೆ:</strong> ಮನೆ ಹುಡುಕಲು NoBroker, Housing.com ಮತ್ತು Facebook ನ Flatmates ಗ್ರೂಪ್‌ಗಳನ್ನು ಬಳಸಿ.</p>
                </>
              ) : (
                <>
                  <p>Moving to Bangalore? Here is what you need to know about finding a home and managing living expenses:</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 font-medium">
                    <li><strong>Best Areas for Techies:</strong> Whitefield, HSR Layout, Indiranagar, Koramangala, and Electronic City are top choices. Rent for a standard 1BHK typically ranges from ₹15,000 to ₹30,000 depending on the locality.</li>
                    <li><strong>The 10-Month Deposit Rule:</strong> Traditionally, landlords in Bangalore ask for a 10-month security deposit. However, with good negotiation, this can often be brought down to 5 or 6 months.</li>
                    <li><strong>Hidden Costs:</strong> Always clarify if maintenance, water charges, and parking are included in your rent before signing the rental agreement.</li>
                  </ul>
                  <p className="mt-4 text-[var(--muted)] text-sm">💡 <strong>Pro Tip:</strong> Use apps like NoBroker, Housing.com, or join 'Flatmates in Bangalore' Facebook groups to find places without paying hefty brokerage fees.</p>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Metro & Transport */}
          <div className="kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="text-3xl">🚇</span>
              {locale === "kn" ? "ನಮ್ಮ ಮೆಟ್ರೋ ಮತ್ತು ಸಾರಿಗೆ" : "Transport & Namma Metro Guide"}
            </h3>
            <div className="prose prose-sm md:prose-base max-w-none text-[var(--foreground)] leading-relaxed">
              {locale === "kn" ? (
                <>
                  <p>ಬೆಂಗಳೂರಿನ ಟ್ರಾಫಿಕ್‌ನಿಂದ ಪಾರಾಗಲು ನಮ್ಮ ಮೆಟ್ರೋ (Namma Metro) ಮತ್ತು ಬಿಎಂಟಿಸಿ ಬಸ್‌ಗಳು ಉತ್ತಮ ಆಯ್ಕೆ.</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 font-medium">
                    <li><strong>ಪರ್ಪಲ್ ಲೈನ್ (Purple Line):</strong> ಚಲ್ಲಘಟ್ಟದಿಂದ ವೈಟ್‌ಫೀಲ್ಡ್ ವರೆಗೆ ಸಂಪರ್ಕ ಕಲ್ಪಿಸುತ್ತದೆ. ಇದು ಪ್ರಮುಖ ಐಟಿ ಕಾರಿಡಾರ್‌ಗಳನ್ನು (ಮೆಜೆಸ್ಟಿಕ್, ಎಂ.ಜಿ ರಸ್ತೆ, ಇಂದಿರಾನಗರ) ಒಳಗೊಂಡಿದೆ.</li>
                    <li><strong>ಗ್ರೀನ್ ಲೈನ್ (Green Line):</strong> ನಾಗಸಂದ್ರದಿಂದ ಸಿಲ್ಕ್ ಇನ್‌ಸ್ಟಿಟ್ಯೂಟ್ ವರೆಗೆ ಸಂಪರ್ಕಿಸುತ್ತದೆ.</li>
                    <li><strong>ಬಿಎಂಟಿಸಿ ವಜ್ರ (BMTC Vajra):</strong> ಹವಾನಿಯಂತ್ರಿತ (AC) ವೋಲ್ವೋ ಬಸ್‌ಗಳು ಐಟಿ ಪಾರ್ಕ್‌ಗಳು ಮತ್ತು ವಿಮಾನ ನಿಲ್ದಾಣಕ್ಕೆ (Vayu Vajra) ನೇರ ಸಂಪರ್ಕ ಒದಗಿಸುತ್ತವೆ.</li>
                  </ul>
                  <p className="mt-4 text-[var(--muted)] text-sm">💡 <strong>ಸಲಹೆ:</strong> ಮೆಟ್ರೋದಲ್ಲಿ 5% ರಿಯಾಯಿತಿ ಮತ್ತು ಸರದಿಯಲ್ಲಿ ನಿಲ್ಲುವುದನ್ನು ತಪ್ಪಿಸಲು 'Namma Metro Smart Card' ಬಳಸಿ. ಆಟೋಗಳಿಗಾಗಿ 'Namma Yatri' ಆಪ್ ಬಳಸುವುದು ಉತ್ತಮ.</p>
                </>
              ) : (
                <>
                  <p>Navigating Bangalore's legendary traffic requires knowing your public transport options, primarily the Metro and BMTC buses.</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 font-medium">
                    <li><strong>Purple Line:</strong> Runs from Challaghatta to Whitefield. This is the busiest line, connecting major hubs like Majestic, MG Road, Indiranagar, and the IT corridor.</li>
                    <li><strong>Green Line:</strong> Connects Nagasandra in the north to Silk Institute in the south, passing through commercial hubs like Yeshwanthpur and Jayanagar.</li>
                    <li><strong>BMTC Vajra Buses:</strong> Air-conditioned Volvo buses that are excellent for airport drops (Vayu Vajra) and daily commutes to IT parks.</li>
                  </ul>
                  <p className="mt-4 text-[var(--muted)] text-sm">💡 <strong>Pro Tip:</strong> Buy a 'Namma Metro Smart Card' to avoid long ticket queues and get a 5% discount on fares. For autos, use the 'Namma Yatri' app for zero-commission rides.</p>
                </>
              )}
            </div>
          </div>

          {/* Section 3: Tourism & Getaways */}
          <div className="kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="text-3xl">🌴</span>
              {locale === "kn" ? "ವೀಕೆಂಡ್ ತಾಣಗಳು (Tourism)" : "Tourism & Weekend Getaways"}
            </h3>
            <div className="prose prose-sm md:prose-base max-w-none text-[var(--foreground)] leading-relaxed">
              {locale === "kn" ? (
                <>
                  <p>ಬೆಂಗಳೂರಿನ ಹವಾಮಾನ ಮತ್ತು ಅದರ ಸುತ್ತಮುತ್ತಲಿನ ಪ್ರಕೃತಿ ಸೌಂದರ್ಯವು ವಾರಾಂತ್ಯದ ಪ್ರವಾಸಗಳಿಗೆ ಹೇಳಿ ಮಾಡಿಸಿದಂತಿದೆ.</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 font-medium">
                    <li><strong>ಬೆಂಗಳೂರಿನ ಒಳಗೆ:</strong> ಲಾಲ್‌ಬಾಗ್, ಕಬ್ಬನ್ ಪಾರ್ಕ್, ವಿಧಾನ ಸೌಧ, ಬೆಂಗಳೂರು ಅರಮನೆ ಮತ್ತು ಇಸ್ಕಾನ್ ದೇವಾಲಯ.</li>
                    <li><strong>100 ಕಿ.ಮೀ ಒಳಗೆ:</strong> ನಂದಿ ಬೆಟ್ಟ (ಸೂರ್ಯೋದಯ ವೀಕ್ಷಣೆಗೆ ಪ್ರಸಿದ್ಧ), ಸಾವನದುರ್ಗ ಬೆಟ್ಟ, ಮತ್ತು ಬನ್ನೇರುಘಟ್ಟ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ.</li>
                    <li><strong>ವಾರಾಂತ್ಯದ ಪ್ರವಾಸಗಳು (Weekend Trips):</strong> ಮೈಸೂರು (ಅರಮನೆ ಮತ್ತು ಚಾಮುಂಡಿ ಬೆಟ್ಟ), ಕೊಡಗು (ಕಾಫಿ ತೋಟಗಳು), ಮತ್ತು ಊಟಿ ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆಗಳು.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>Thanks to its geographic location and excellent weather, Bangalore is the perfect gateway to South India's best tourist spots.</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 font-medium">
                    <li><strong>Inside the City:</strong> Must-visit places include Lalbagh Botanical Garden, Cubbon Park, Vidhana Soudha, Bangalore Palace, and the ISKCON temple.</li>
                    <li><strong>Within 100 km:</strong> Nandi Hills (famous for magical sunrises), Savandurga (for trekking), and Bannerghatta National Park (Safari).</li>
                    <li><strong>Weekend Getaways:</strong> Mysore (Palaces & Heritage), Coorg (Coffee plantations and misty hills), and Ooty are just a few hours' drive away.</li>
                  </ul>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Quick Links & Official Sources */}
        <div className="space-y-6">
          <div className="kq-card p-6 rounded-2xl border border-[var(--border)] shadow-sm bg-[var(--surface-soft)]">
            <h4 className="font-serif text-lg font-bold text-[var(--primary)] mb-4 border-b-2 border-[var(--secondary)] pb-2 inline-block">
              {locale === "kn" ? "ಅಗತ್ಯ ಲಿಂಕ್‌ಗಳು (Essential Links)" : "Essential Resources"}
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="https://english.bmrc.co.in/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-white border border-[var(--border)] hover:border-[var(--secondary)] transition-colors group">
                  <span className="font-bold text-sm text-[var(--primary)] group-hover:text-[var(--secondary)] block mb-1">BMRCL - Namma Metro</span>
                  <span className="text-xs text-[var(--muted)]">Official Timings & Route Maps</span>
                </a>
              </li>
              <li>
                <a href="https://mybmtc.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-white border border-[var(--border)] hover:border-[var(--secondary)] transition-colors group">
                  <span className="font-bold text-sm text-[var(--primary)] group-hover:text-[var(--secondary)] block mb-1">BMTC Bus Portal</span>
                  <span className="text-xs text-[var(--muted)]">Bus routes, passes & schedules</span>
                </a>
              </li>
              <li>
                <a href="https://karnatakatourism.org/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-white border border-[var(--border)] hover:border-[var(--secondary)] transition-colors group">
                  <span className="font-bold text-sm text-[var(--primary)] group-hover:text-[var(--secondary)] block mb-1">Karnataka Tourism</span>
                  <span className="text-xs text-[var(--muted)]">Explore destinations & bookings</span>
                </a>
              </li>
              <li>
                <a href="https://bescom.karnataka.gov.in/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-white border border-[var(--border)] hover:border-[var(--secondary)] transition-colors group">
                  <span className="font-bold text-sm text-[var(--primary)] group-hover:text-[var(--secondary)] block mb-1">BESCOM Electricity</span>
                  <span className="text-xs text-[var(--muted)]">Pay bills & check power cuts</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="kq-card p-6 rounded-2xl border-l-4 border-emerald-500 shadow-sm bg-emerald-50/50">
            <h4 className="font-bold text-emerald-800 mb-2">
              {locale === "kn" ? "ಆಹಾರ ಮತ್ತು ಸಂಸ್ಕೃತಿ" : "Food & Culture"}
            </h4>
            <p className="text-sm text-emerald-700 leading-relaxed">
              {locale === "kn" 
                ? "ಬೆಂಗಳೂರಿನಲ್ಲಿರುವಾಗ ಮಲ್ಲೇಶ್ವರದ 'CTR' ಅಥವಾ ಬಸವನಗುಡಿಯ 'ವಿದ್ಯಾರ್ಥಿ ಭವನ'ದಲ್ಲಿ ಮಸಾಲೆ ದೋಸೆ ತಿನ್ನುವುದನ್ನು ಮರೆಯದಿರಿ. ಐಟಿ ಉದ್ಯೋಗಿಗಳ ಅಚ್ಚುಮೆಚ್ಚಿನ 'ಮೇಘನಾ ಬಿರಿಯಾನಿ' ಕೂಡ ತಪ್ಪಿಸಿಕೊಳ್ಳಬೇಡಿ!"
                : "Don't leave Bangalore without trying the iconic Masala Dosa at 'CTR' in Malleshwaram or 'Vidyarthi Bhavan' in Basavanagudi. And of course, the famous Meghana Foods Biryani!"}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
