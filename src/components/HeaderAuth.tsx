"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import Link from "next/link";
import type { Locale } from "@/lib/locales";

export function HeaderAuth({ locale }: { locale: Locale }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

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
          onClick={() => firebaseAuth && signOut(firebaseAuth)}
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
