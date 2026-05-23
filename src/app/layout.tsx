import type { Metadata } from "next";
import { Noto_Sans_Kannada, Public_Sans, Source_Serif_4 } from "next/font/google";
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
  alternates: {
    canonical: "/kn",
    languages: {
      kn: "/kn",
      en: "/en",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
