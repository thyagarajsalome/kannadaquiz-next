"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { firebaseAuth, firestore, hasFirebaseConfig } from "@/lib/firebase";
import { firestoreCollections } from "@/lib/firestore-schema";

type ContentKind = "posts" | "jobs" | "currentAffairs";

type PublishedItem = {
  id: string;
  title: string;
  slug?: string;
  locale?: string;
  status?: string;
};

const kindLabels: Record<ContentKind, string> = {
  posts: "Article",
  jobs: "Job alert",
  currentAffairs: "Current affair",
};

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!firebaseAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kind, setKind] = useState<ContentKind>("posts");
  const [locale, setLocale] = useState<"kn" | "en">("kn");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [organization, setOrganization] = useState("");
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<PublishedItem[]>([]);
  const [saving, setSaving] = useState(false);

  const canUseFirebase = hasFirebaseConfig && firebaseAuth && firestore;

  useEffect(() => {
    if (!firebaseAuth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      void loadItems(kind);
    }
  }, [kind, user]);

  const generatedSlug = useMemo(
    () =>
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 90),
    [title],
  );

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firebaseAuth) {
      setMessage("Firebase environment variables are not configured yet.");
      return;
    }

    try {
      await setPersistence(firebaseAuth, browserLocalPersistence);
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      setPassword("");
      setMessage("");
    } catch (error) {
      setMessage(readFirebaseError(error));
    }
  }

  async function loadItems(nextKind: ContentKind) {
    if (!firestore) {
      return;
    }

    try {
      const docsQuery = query(collection(firestore, firestoreCollections[nextKind]), limit(25));
      const snapshot = await getDocs(docsQuery);
      const nextItems = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: String(data.title ?? data.headline ?? "Untitled"),
            slug: typeof data.slug === "string" ? data.slug : undefined,
            locale: typeof data.locale === "string" ? data.locale : undefined,
            status: typeof data.status === "string" ? data.status : undefined,
            updatedAt:
              typeof data.updatedAt === "string"
                ? data.updatedAt
                : typeof data.updatedAt?.toDate === "function"
                  ? data.updatedAt.toDate().toISOString()
                  : "",
          };
        })
        .filter((item) => item.status === "published")
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
        .slice(0, 10);

      setItems(nextItems);
    } catch (error) {
      setMessage(readFirebaseError(error));
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firestore) {
      setMessage("Firestore is not configured yet.");
      return;
    }

    const finalSlug = slug.trim() || generatedSlug;
    const base = {
      locale,
      title: title.trim(),
      slug: finalSlug,
      status: "published",
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    setSaving(true);

    try {
      if (kind === "posts") {
        await addDoc(collection(firestore, firestoreCollections.posts), {
          ...base,
          excerpt: excerpt.trim(),
          body: body.trim(),
          category: "General",
        });
      }

      if (kind === "jobs") {
        await addDoc(collection(firestore, firestoreCollections.jobs), {
          ...base,
          organization: organization.trim(),
          deadline: deadline.trim(),
          body: body.trim(),
        });
      }

      if (kind === "currentAffairs") {
        await addDoc(collection(firestore, firestoreCollections.currentAffairs), {
          locale,
          headline: title.trim(),
          status: "published",
          publishedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setTitle("");
      setSlug("");
      setExcerpt("");
      setBody("");
      setOrganization("");
      setDeadline("");
      setMessage(`${kindLabels[kind]} saved to Firestore.`);
      await loadItems(kind);
    } catch (error) {
      setMessage(readFirebaseError(error));
    } finally {
      setSaving(false);
    }
  }

  if (!authReady) {
    return <AdminFrame>Loading admin...</AdminFrame>;
  }

  if (!canUseFirebase) {
    return (
      <AdminFrame>
        <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">Admin setup needed</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">
          Add the Firebase web app values to Firebase App Hosting environment variables and to
          `.env.local` for local development.
        </p>
      </AdminFrame>
    );
  }

  if (!user) {
    return (
      <AdminFrame>
        <form onSubmit={handleLogin} className="kq-card max-w-md p-6">
          <h1 className="font-serif text-3xl font-bold text-[var(--primary)]">Admin login</h1>
          <label className="mt-5 block text-sm font-bold text-[var(--primary)]">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              required
            />
          </label>
          <label className="mt-4 block text-sm font-bold text-[var(--primary)]">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              required
            />
          </label>
          <button className="mt-5 rounded-md bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white">
            Sign in
          </button>
          {message ? <p className="mt-3 text-sm text-[var(--secondary)]">{message}</p> : null}
        </form>
      </AdminFrame>
    );
  }

  return (
    <AdminFrame>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[var(--secondary)]">KannadaQuiz</p>
          <h1 className="font-serif text-4xl font-bold text-[var(--primary)]">Content admin</h1>
        </div>
        <button
          onClick={() => firebaseAuth && signOut(firebaseAuth)}
          className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-bold"
        >
          Sign out
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <form onSubmit={handleCreate} className="kq-card p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-bold">
              Type
              <select
                value={kind}
                onChange={(event) => setKind(event.target.value as ContentKind)}
                className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              >
                <option value="posts">Article</option>
                <option value="jobs">Job alert</option>
                <option value="currentAffairs">Current affair</option>
              </select>
            </label>
            <label className="block text-sm font-bold">
              Language
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value as "kn" | "en")}
                className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              >
                <option value="kn">Kannada</option>
                <option value="en">English</option>
              </select>
            </label>
            <label className="block text-sm font-bold">
              Slug
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                placeholder={generatedSlug}
                className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-bold">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
              required
            />
          </label>

          {kind === "posts" ? (
            <label className="mt-4 block text-sm font-bold">
              SEO excerpt
              <textarea
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                className="mt-2 min-h-24 w-full rounded-md border border-[var(--border)] px-3 py-2"
              />
            </label>
          ) : null}

          {kind === "jobs" ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-bold">
                Organization
                <input
                  value={organization}
                  onChange={(event) => setOrganization(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
                />
              </label>
              <label className="block text-sm font-bold">
                Deadline
                <input
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2"
                />
              </label>
            </div>
          ) : null}

          {kind !== "currentAffairs" ? (
            <label className="mt-4 block text-sm font-bold">
              Body
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="mt-2 min-h-44 w-full rounded-md border border-[var(--border)] px-3 py-2"
              />
            </label>
          ) : null}

          <button className="mt-5 rounded-md bg-[var(--secondary)] px-5 py-3 text-sm font-bold text-white">
            {saving ? "Saving..." : "Save published content"}
          </button>
          {message ? <p className="mt-3 text-sm font-semibold text-[var(--primary)]">{message}</p> : null}
        </form>

        <aside className="kq-card p-5">
          <h2 className="font-serif text-2xl font-bold text-[var(--primary)]">Latest published</h2>
          <div className="mt-4 grid gap-3">
            {items.length ? (
              items.map((item) => (
                <article key={item.id} className="rounded-md border border-[var(--border)] p-3">
                  <p className="font-bold text-[var(--primary)]">{item.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {item.locale ?? "n/a"} {item.slug ? `• ${item.slug}` : ""}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm leading-6 text-[var(--muted)]">No published records found.</p>
            )}
          </div>
        </aside>
      </div>
    </AdminFrame>
  );
}

function AdminFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="kq-container py-8">{children}</div>
    </main>
  );
}

function readFirebaseError(error: unknown) {
  if (typeof error === "object" && error && "code" in error && "message" in error) {
    const code = String((error as { code?: unknown }).code ?? "unknown");
    const message = String((error as { message?: unknown }).message ?? "Unknown Firebase error");
    return `${code}: ${message}`;
  }

  return "Unexpected error while saving to Firestore.";
}
