import type { Metadata } from "next";
import Link from "next/link";
import { siteText } from "@/data/content";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicPosts } from "@/lib/public-content";

export const revalidate = 300;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Study Articles",
  description: "Exam-focused study articles for Karnataka competitive exams.",
};

export default async function PostsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";
  const posts = await getPublicPosts(locale);

  return (
    <section className="kq-container py-10">
      <h1 className="font-serif text-4xl font-bold text-[var(--primary)]">
        {siteText[locale].posts}
      </h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.slug} href={`/${locale}/posts/${post.slug}`} className="kq-card p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
              {post.category} • {post.date} {post.sourceName ? `• ${post.sourceName}` : ""}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-[var(--primary)]">
              {post.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
