import { redirect } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/locales";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function JobsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  redirect(`/${locale}`);
}
