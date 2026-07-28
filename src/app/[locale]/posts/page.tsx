import Link from "next/link";
import { isLocale, locales, type Locale } from "@/lib/locales";
import { getPublicPosts } from "@/lib/public-content";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PostsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const rawLocale = resolvedParams.locale;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "kn";

  // Fetch all posts instead of a single post by slug
  const posts = await getPublicPosts(locale);

  return (
    <div className="kq-container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-8">
          {locale === "kn" ? "ಲೇಖನಗಳು" : "Articles"}
        </h1>

        <div className="grid gap-6">
          {posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <Link 
                key={post.slug} 
                href={`/${locale}/posts/${post.slug}`}
                className="block p-6 rounded-xl border border-[var(--border)] hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-bold text-[var(--primary)] mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  {post.excerpt}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-[var(--muted)]">
              {locale === "kn" ? "ಯಾವುದೇ ಲೇಖನಗಳು ಕಂಡುಬಂದಿಲ್ಲ." : "No articles found."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}