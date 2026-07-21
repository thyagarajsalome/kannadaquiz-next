import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locales";

export function generateStaticParams() {
  return [];
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  redirect(`/${locale}`);
}
