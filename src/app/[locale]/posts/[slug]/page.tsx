import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicPostBySlug } from "@/lib/public-content";

export const revalidate = 300;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const post = await getPublicPostBySlug(locale, slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
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
  const post = await getPublicPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="kq-container max-w-3xl py-10">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
        {post.category} • {post.date}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-[var(--primary)]">
        {post.title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{post.excerpt}</p>
      {post.featuredImageUrl ? (
        <img
          src={post.featuredImageUrl}
          alt={post.title}
          className="mt-6 w-full max-h-[400px] object-cover rounded-lg shadow-sm border border-[var(--border)]"
        />
      ) : null}
      <div className="mt-8 kq-card p-5 text-base leading-8 text-[var(--foreground)]">
        {post.body.split("\n").map((paragraph) => (
          <p key={paragraph} className="mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
        {post.sourceUrl ? (
          <div className="mt-6 border-t border-[var(--border)] pt-4 text-right">
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--secondary)] hover:underline"
            >
              {locale === "kn" ? "ಮೂಲ ಲೇಖನ ಓದಿ ➔" : "Read Original Article ➔"}
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}
