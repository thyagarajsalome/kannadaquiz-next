import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, locales, type Locale } from "@/lib/locales";

// Update every 1 hour to keep currency rates fresh without hitting rate limits
export const revalidate = 3600;

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
        ? "ಅನಿವಾಸಿ ಕನ್ನಡಿಗರ ಮಾರ್ಗದರ್ಶಿ - ಲೈವ್ ಕರೆನ್ಸಿ, OCI, NRE & ವೀಸಾ ಮಾಹಿತಿ | NRI Guide"
        : "NRI Expat Guide - Live Currency Rates, OCI, NRE & Visa Info | KannadaQuiz",
    description:
      lang === "kn"
        ? "ಅಮೆರಿಕ, ಯುಕೆ, ಯುಎಇ, ಆಸ್ಟ್ರೇಲಿಯಾದಲ್ಲಿರುವ ಕನ್ನಡಿಗರಿಗಾಗಿ ಲೈವ್ ವಿನಿಮಯ ದರಗಳು, OCI ಕಾರ್ಡ್ ನವೀಕರಣ, NRE/NRO ಖಾತೆಗಳು ಮತ್ತು ಪಾಸ್‌ಪೋರ್ಟ್ ಸೇವೆಗಳ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ."
        : "Evergreen guide for Non-Resident Indians (NRIs) and Kannada expats. Live INR exchange rates, OCI card rules, NRE vs NRO accounts, and passport renewal guide.",
    keywords:
      lang === "kn"
        ? [
            "ಅನಿವಾಸಿ ಕನ್ನಡಿಗರು", "ಲೈವ್ ಕರೆನ್ಸಿ ದರ", "ಡಾಲರ್ ಬೆಲೆ", "OCI ಕಾರ್ಡ್", "NRE ಖಾತೆ",
            "NRI ಹೂಡಿಕೆ", "ಬೆಂಗಳೂರು ರಿಯಲ್ ಎಸ್ಟೇಟ್", "ಭಾರತೀಯ ರಾಯಭಾರ ಕಚೇರಿ"
          ]
        : [
            "NRI Guide", "Live Currency to INR", "USD to INR today", "OCI Card application",
            "NRE vs NRO account", "NRI Real Estate Bangalore", "Indian Embassy Passport Renewal"
          ],
    alternates: {
      canonical: `/${lang}/expat-guide`,
      languages: {
        kn: "/kn/expat-guide",
        en: "/en/expat-guide",
      },
    },
  };
}

// Fetch live currency rates from a free public API
async function getLiveExchangeRates() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const data = await res.json();
    return data.rates;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    return null;
  }
}

export default async function ExpatGuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  
  const rates = await getLiveExchangeRates();
  const inrBase = rates ? rates.INR : 83.5; // Fallback if API fails

  // Calculate specific common currencies to INR
  const usdToInr = inrBase.toFixed(2);
  const aedToInr = rates ? (inrBase / rates.AED).toFixed(2) : "22.75";
  const gbpToInr = rates ? (inrBase / rates.GBP).toFixed(2) : "105.20";
  const eurToInr = rates ? (inrBase / rates.EUR).toFixed(2) : "89.50";
  const audToInr = rates ? (inrBase / rates.AUD).toFixed(2) : "54.30";
  const cadToInr = rates ? (inrBase / rates.CAD).toFixed(2) : "61.20";

  return (
    <section className="kq-container py-10">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <span className="inline-block bg-[var(--secondary)] text-white text-[10px] md:text-xs font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-sm mb-4">
          {locale === "kn" ? "ಅನಿವಾಸಿ ಕನ್ನಡಿಗರ ಮಾಹಿತಿಕೇಂದ್ರ" : "NRI & EXPAT HUB"}
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[var(--primary)] leading-tight mb-4">
          {locale === "kn" ? "ಅನಿವಾಸಿ ಕನ್ನಡಿಗರ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ" : "The Essential NRI Guide"}
        </h1>
        <p className="text-[var(--muted)] text-base md:text-lg max-w-2xl font-medium">
          {locale === "kn" 
            ? "ಲೈವ್ ಕರೆನ್ಸಿ ವಿನಿಮಯ ದರಗಳು, OCI ಕಾರ್ಡ್ ನಿಯಮಗಳು, ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಅಧಿಕೃತ ಸೇವೆಗಳ ಕುರಿತಾದ ನಿರಂತರ ಮಾಹಿತಿಗಳು." 
            : "Live exchange rates, OCI rules, banking, and official resources updated automatically for global Kannadigas."}
        </p>
      </div>

      {/* Live Currency Dashboard */}
      <div className="bg-gradient-to-br from-slate-900 to-[#1e293b] rounded-2xl p-6 md:p-8 shadow-lg mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-white">
              {locale === "kn" ? "ಲೈವ್ ಕರೆನ್ಸಿ ದರಗಳು (Live Rates)" : "Live Currency Exchange to INR"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
              {locale === "kn" ? "ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ" : "AUTO-UPDATED"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { flag: "🇺🇸", code: "USD", rate: usdToInr, name: "US Dollar" },
            { flag: "🇦🇪", code: "AED", rate: aedToInr, name: "UAE Dirham" },
            { flag: "🇬🇧", code: "GBP", rate: gbpToInr, name: "British Pound" },
            { flag: "🇪🇺", code: "EUR", rate: eurToInr, name: "Euro" },
            { flag: "🇦🇺", code: "AUD", rate: audToInr, name: "Aus Dollar" },
            { flag: "🇨🇦", code: "CAD", rate: cadToInr, name: "Can Dollar" },
          ].map((currency) => (
            <div key={currency.code} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
              <span className="text-2xl mb-2">{currency.flag}</span>
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">1 {currency.code}</span>
              <span className="text-2xl font-black text-white">₹{currency.rate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Evergreen Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left/Main Column: Problem Solving Guides */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: NRE vs NRO */}
          <div className="kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="text-3xl">🏦</span>
              {locale === "kn" ? "NRE ಮತ್ತು NRO ಖಾತೆಗಳ ನಡುವಿನ ವ್ಯತ್ಯಾಸ" : "NRE vs NRO Accounts: Explained"}
            </h3>
            <div className="prose prose-sm md:prose-base max-w-none text-[var(--foreground)] leading-relaxed">
              {locale === "kn" ? (
                <>
                  <p>ವಿದೇಶದಲ್ಲಿ ನೆಲೆಸಿರುವ ಭಾರತೀಯರಿಗೆ ಭಾರತದಲ್ಲಿ ಹಣಕಾಸು ನಿರ್ವಹಣೆ ಮಾಡಲು ಎರಡು ಮುಖ್ಯ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳಿವೆ. ಸರಿಯಾದ ಖಾತೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡುವುದು ತೆರಿಗೆ ಉಳಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 font-medium">
                    <li><strong>NRE (Non-Resident External):</strong> ವಿದೇಶದಲ್ಲಿ ಗಳಿಸಿದ ಹಣವನ್ನು ಭಾರತಕ್ಕೆ ಕಳುಹಿಸಲು ಈ ಖಾತೆ ಬಳಸಲಾಗುತ್ತದೆ. ಇದರಲ್ಲಿ ಗಳಿಸುವ ಬಡ್ಡಿಯ ಮೇಲೆ <strong>ಭಾರತದಲ್ಲಿ ಯಾವುದೇ ತೆರಿಗೆ ಇರುವುದಿಲ್ಲ (Tax Free)</strong>. ನೀವು ಈ ಹಣವನ್ನು ಮರಳಿ ವಿದೇಶಕ್ಕೆ ಸುಲಭವಾಗಿ ವರ್ಗಾಯಿಸಬಹುದು (Repatriable).</li>
                    <li><strong>NRO (Non-Resident Ordinary):</strong> ಭಾರತದಲ್ಲಿ ಹುಟ್ಟುವ ಆದಾಯವನ್ನು (ಉದಾಹರಣೆಗೆ: ಬಾಡಿಗೆ, ಪಿಂಚಣಿ, ಲಾಭಾಂಶ) ಜಮಾ ಮಾಡಲು ಈ ಖಾತೆ ಕಡ್ಡಾಯ. ಈ ಖಾತೆಯ ಬಡ್ಡಿಯ ಮೇಲೆ ಭಾರತದಲ್ಲಿ <strong>TDS ಕಡಿತವಾಗುತ್ತದೆ (30%)</strong>. ಈ ಹಣವನ್ನು ವಿದೇಶಕ್ಕೆ ವರ್ಗಾಯಿಸಲು ಮಿತಿಗಳಿವೆ (ವರ್ಷಕ್ಕೆ $1 Million).</li>
                  </ul>
                  <p className="mt-4 text-[var(--muted)] text-sm">💡 <strong>ಉಪಯುಕ್ತ ಸಲಹೆ:</strong> ನೀವು ಎಫ್‌ಸಿಎನ್‌ಆರ್ (FCNR) ಖಾತೆಗಳನ್ನು ತೆರೆದರೆ ಡಾಲರ್/ಪೌಂಡ್/ಯುರೋ ಕರೆನ್ಸಿಯಲ್ಲೇ ಹಣವನ್ನು ಉಳಿತಾಯ ಮಾಡಬಹುದು, ಇದರಿಂದ ಕರೆನ್ಸಿ ವಿನಿಮಯ ನಷ್ಟ ತಪ್ಪಿಸಬಹುದು.</p>
                </>
              ) : (
                <>
                  <p>Managing finances in India from abroad requires specific bank accounts. Choosing the correct account type is critical for tax optimization and repatriation.</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 font-medium">
                    <li><strong>NRE (Non-Resident External):</strong> Used for parking your foreign earnings in India. The interest earned on an NRE account is <strong>completely tax-free in India</strong>. The principal and interest are completely repatriable (can be freely sent back abroad).</li>
                    <li><strong>NRO (Non-Resident Ordinary):</strong> Mandatory for managing income earned within India (e.g., rent, pension, dividends). Interest earned on NRO accounts is <strong>subject to a 30% TDS</strong> in India. Repatriation is limited to $1 Million USD per financial year with proper CA certification.</li>
                  </ul>
                  <p className="mt-4 text-[var(--muted)] text-sm">💡 <strong>Pro Tip:</strong> Consider FCNR (Foreign Currency Non-Resident) deposits if you want to save your money in USD/GBP/EUR to avoid exchange rate fluctuations.</p>
                </>
              )}
            </div>
          </div>

          {/* Section 2: OCI Card */}
          <div className="kq-card p-6 md:p-8 rounded-2xl border border-[var(--border)] shadow-sm">
            <h3 className="font-serif text-2xl font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
              <span className="text-3xl">🛂</span>
              {locale === "kn" ? "OCI ಕಾರ್ಡ್ (Overseas Citizen of India)" : "OCI Card Guidelines"}
            </h3>
            <div className="prose prose-sm md:prose-base max-w-none text-[var(--foreground)] leading-relaxed">
              {locale === "kn" ? (
                <>
                  <p>ವಿದೇಶಿ ಪೌರತ್ವ ಪಡೆದ ಭಾರತೀಯ ಮೂಲದವರಿಗೆ ಭಾರತಕ್ಕೆ ಜೀವಿತಾವಧಿ ವೀಸಾ-ಮುಕ್ತ ಪ್ರವೇಶ ಪಡೆಯಲು OCI ಕಾರ್ಡ್ ಅತ್ಯಗತ್ಯ. 2021 ರ ಹೊಸ ನಿಯಮಗಳ ಪ್ರಕಾರ ಕೆಲವು ಪ್ರಮುಖ ಬದಲಾವಣೆಗಳಾಗಿವೆ:</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 font-medium">
                    <li><strong>ನವೀಕರಣ (Renewal):</strong> ನೀವು 20 ವರ್ಷ ತುಂಬಿದಾಗ ಹೊಸ ಪಾಸ್‌ಪೋರ್ಟ್ ಪಡೆದರೆ <strong>ಒಮ್ಮೆ ಮಾತ್ರ</strong> OCI ಕಾರ್ಡ್ ಅನ್ನು ಮರು-ವಿತರಣೆ ಮಾಡಿಸಬೇಕು.</li>
                    <li><strong>ಆನ್‌ಲೈನ್ ಅಪ್‌ಡೇಟ್:</strong> 20 ವರ್ಷದವರೆಗೆ ಮತ್ತು 50 ವರ್ಷದ ನಂತರ ಹೊಸ ಪಾಸ್‌ಪೋರ್ಟ್ ಪಡೆದಾಗ, OCI ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಉಚಿತವಾಗಿ ಹೊಸ ಪಾಸ್‌ಪೋರ್ಟ್ ವಿವರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡುವುದು ಕಡ್ಡಾಯ. (ಹೊಸ ಕಾರ್ಡ್ ಪಡೆಯುವ ಅಗತ್ಯವಿಲ್ಲ).</li>
                    <li><strong>ಹಕ್ಕುಗಳು:</strong> ಕೃಷಿ ಜಮೀನು (Agricultural Land) ಮತ್ತು ತೋಟದ ಮನೆಗಳನ್ನು ಹೊರತುಪಡಿಸಿ, ವಾಣಿಜ್ಯ ಮತ್ತು ವಸತಿ ಆಸ್ತಿಗಳನ್ನು ಖರೀದಿಸಲು OCI ಕಾರ್ಡ್ ದಾರರಿಗೆ ಸಂಪೂರ್ಣ ಹಕ್ಕಿದೆ.</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>The OCI (Overseas Citizen of India) card grants lifelong visa-free entry to India. Following the 2021 rule updates, the renewal process has been heavily simplified:</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2 font-medium">
                    <li><strong>Renewal Rules:</strong> Re-issuance of an OCI card is now required <strong>only once</strong> when a new passport is issued after completing 20 years of age.</li>
                    <li><strong>Free Online Update:</strong> For new passports issued before age 20 or after age 50, you simply need to upload a copy of the new passport and a recent photo on the OCI portal for free. No new physical card is issued.</li>
                    <li><strong>Property Rights:</strong> OCI holders have parity with NRIs regarding the purchase of residential and commercial real estate, but <strong>cannot</strong> purchase agricultural land, plantation property, or farmhouses in India.</li>
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
              {locale === "kn" ? "ಅಧಿಕೃತ ಲಿಂಕ್‌ಗಳು (Official Links)" : "Official Resources"}
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="https://ociservices.gov.in/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-white border border-[var(--border)] hover:border-[var(--secondary)] transition-colors group">
                  <span className="font-bold text-sm text-[var(--primary)] group-hover:text-[var(--secondary)] block mb-1">OCI Services Portal</span>
                  <span className="text-xs text-[var(--muted)]">Ministry of Home Affairs Govt of India</span>
                </a>
              </li>
              <li>
                <a href="https://portal2.passportindia.gov.in/AppOnlineProject/welcomeLink" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-white border border-[var(--border)] hover:border-[var(--secondary)] transition-colors group">
                  <span className="font-bold text-sm text-[var(--primary)] group-hover:text-[var(--secondary)] block mb-1">NRI Passport Services</span>
                  <span className="text-xs text-[var(--muted)]">Passport Seva Online Portal</span>
                </a>
              </li>
              <li>
                <a href="https://www.incometax.gov.in/iec/foportal/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-white border border-[var(--border)] hover:border-[var(--secondary)] transition-colors group">
                  <span className="font-bold text-sm text-[var(--primary)] group-hover:text-[var(--secondary)] block mb-1">Income Tax Portal (PAN)</span>
                  <span className="text-xs text-[var(--muted)]">Link Aadhaar-PAN / File ITR</span>
                </a>
              </li>
              <li>
                <a href="https://evisa.gov.in/" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-white border border-[var(--border)] hover:border-[var(--secondary)] transition-colors group">
                  <span className="font-bold text-sm text-[var(--primary)] group-hover:text-[var(--secondary)] block mb-1">Indian e-Visa Official</span>
                  <span className="text-xs text-[var(--muted)]">For foreign passport holders visiting India</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="kq-card p-6 rounded-2xl border-l-4 border-[var(--secondary)] shadow-sm bg-white">
            <h4 className="font-bold text-[var(--primary)] mb-2">
              {locale === "kn" ? "PAN-Aadhaar ಲಿಂಕ್ ವಿನಾಯಿತಿ" : "PAN-Aadhaar Link Exemption"}
            </h4>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              {locale === "kn" 
                ? "ನಿಯಮಗಳ ಪ್ರಕಾರ, NRIs ಮತ್ತು OCI ಕಾರ್ಡ್ ಹೊಂದಿರುವವರಿಗೆ ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಮತ್ತು ಆಧಾರ್ ಲಿಂಕ್ ಮಾಡುವುದು ಕಡ್ಡಾಯವಲ್ಲ. ಆದರೆ, ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಅಥವಾ ಆದಾಯ ತೆರಿಗೆ ಇಲಾಖೆಯಲ್ಲಿ ನಿಮ್ಮ NRI ಸ್ಟೇಟಸ್ ಅನ್ನು ಅಪ್‌ಡೇಟ್ ಮಾಡುವುದು ಮುಖ್ಯ."
                : "NRIs and OCI holders are strictly exempt from linking their PAN card with Aadhaar. However, you must ensure your residential status is correctly updated as 'Non-Resident' with your banks and the Income Tax department to avoid PAN deactivation."}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
