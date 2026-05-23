import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";

export function generateStaticParams() {
  return locales.flatMap((locale) => posts.map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title[locale],
    description: post.excerpt[locale],
    alternates: {
      canonical: `/${locale}/posts/${post.slug}`,
      languages: {
        kn: `/kn/posts/${post.slug}`,
        en: `/en/posts/${post.slug}`,
      },
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="kq-container max-w-3xl py-10">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
        {post.category} • {post.date}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[var(--primary)]">
        {post.title[locale]}
      </h1>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{post.excerpt[locale]}</p>
      <div className="mt-8 kq-card p-5 text-base leading-8 text-[var(--foreground)]">
        {locale === "kn" ? (
          <p>
            ಈ ಲೇಖನದ ಪೂರ್ಣ ವಿಷಯವನ್ನು ನಂತರ MDX ವಿಷಯ ವ್ಯವಸ್ಥೆಯಿಂದ ತುಂಬಬಹುದು. ಪ್ರಸ್ತುತ ಪುಟವು SEO,
            canonical URL ಮತ್ತು ಭಾಷಾ ಪರ್ಯಾಯಗಳೊಂದಿಗೆ ಸ್ಥಿರವಾಗಿ ರೆಂಡರ್ ಆಗುತ್ತದೆ.
          </p>
        ) : (
          <p>
            Full article content can be connected through the MDX content system next. This page is
            already statically rendered with SEO metadata, canonical URL, and language alternates.
          </p>
        )}
      </div>
    </article>
  );
}
