"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import Link from "next/link";
import type { Locale } from "@/lib/locales";

export function HeaderAuth({ locale }: { locale: Locale }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const timer = setTimeout(() => {
      Promise.all([
        import("@/lib/firebase"),
        import("firebase/auth"),
      ]).then(([{ firebaseAuth }, { onAuthStateChanged }]) => {
        if (!firebaseAuth) {
          setLoading(false);
          return;
        }
        unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
      }).catch(() => {
        setLoading(false);
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  async function handleLogout() {
    try {
      const [{ firebaseAuth }, { signOut }] = await Promise.all([
        import("@/lib/firebase"),
        import("firebase/auth"),
      ]);
      if (firebaseAuth) {
        await signOut(firebaseAuth);
        setUser(null);
      }
    } catch {}
  }

  if (loading) {
    return <span className="text-sm font-semibold text-[var(--muted)] opacity-50">...</span>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/profile`}
          className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--primary)]"
        >
          {locale === "kn" ? "ಪ್ರೊಫೈಲ್" : "Profile"}
        </Link>
        <button
          onClick={handleLogout}
          className="cursor-pointer text-sm font-semibold text-[var(--secondary)] hover:underline"
        >
          {locale === "kn" ? "ನಿರ್ಗಮಿಸಿ" : "Logout"}
        </button>
      </div>
    );
  }

  return (
    <Link
      href={`/${locale}/login`}
      className="text-sm font-semibold text-[var(--muted)] hover:text-[var(--primary)]"
    >
      {locale === "kn" ? "ಲಾಗಿನ್" : "Login"}
    </Link>
  );
}
