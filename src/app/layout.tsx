import type { Metadata } from "next";
import { Noto_Sans_Kannada, Public_Sans, Source_Serif_4 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

const notoKannada = Noto_Sans_Kannada({
  variable: "--font-noto-kannada",
  subsets: ["kannada"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kannadaquiz.in"),
  title: {
    default: "KannadaQuiz - Karnataka Exam Preparation",
    template: "%s | KannadaQuiz",
  },
  description:
    "Kannada and English quiz practice, current affairs, job alerts, and study material for Karnataka competitive exams.",
  verification: {
    google: "of_pRvg6YQBwtKsdlZhbUOEOOn24aY4eUfvzr0AtpRo",
  },
  other: {
    "google-adsense-account": "ca-pub-1813097110898475",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "KannadaQuiz - Karnataka Exam Preparation",
    description:
      "Fast bilingual exam preparation portal for KPSC, PSI, FDA-SDA, TET, Bank, SSC, and general knowledge.",
    url: "https://kannadaquiz.in",
    siteName: "KannadaQuiz",
    locale: "kn_IN",
    type: "website",
  },
};

const gaId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Z9CE3G37M9";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="kn"
      className={`${publicSans.variable} ${sourceSerif.variable} ${notoKannada.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script 
          id="adsense-script"
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1813097110898475" 
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {children}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
