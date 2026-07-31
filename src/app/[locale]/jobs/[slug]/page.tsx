import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/locales";
import { getPublicJobs } from "@/lib/public-content";

export async function generateStaticParams() {
  const knJobs = await getPublicJobs("kn", 20);
  const enJobs = await getPublicJobs("en", 20);
  const knParams = knJobs.map((j) => ({ locale: "kn", slug: j.slug }));
  const enParams = enJobs.map((j) => ({ locale: "en", slug: j.slug }));
  const combined = [...knParams, ...enParams];
  if (combined.length === 0) {
    return [
      { locale: "kn", slug: "default-job" },
      { locale: "en", slug: "default-job" },
    ];
  }
  return combined;
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
