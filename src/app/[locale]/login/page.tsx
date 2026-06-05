"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { firebaseAuth } from "@/lib/firebase";
import { useRouter, useParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale === "en" ? "en" : "kn";

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (!firebaseAuth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        router.push(`/${locale}/profile`);
      }
    });
    return () => unsubscribe();
  }, [router, locale]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!firebaseAuth) {
      setMessage("Authentication is not configured.");
      return;
    }

    setSigning(true);
    setMessage("");

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
        setMessage(locale === "kn" ? "ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚನೆಯಾಗಿದೆ!" : "Account created successfully!");
      } else {
        await signInWithEmailAndPassword(firebaseAuth, email, password);
        setMessage(locale === "kn" ? "ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!" : "Logged in successfully!");
      }
    } catch (error: any) {
      let errorMsg = error?.message || "An unexpected error occurred.";
      if (error?.code === "auth/email-already-in-use") {
        errorMsg = locale === "kn" ? "ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ಬಳಕೆಯಲ್ಲಿದೆ." : "Email already in use.";
      } else if (error?.code === "auth/weak-password") {
        errorMsg = locale === "kn" ? "ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳಿರಬೇಕು." : "Password should be at least 6 characters.";
      } else if (error?.code === "auth/invalid-credential") {
        errorMsg = locale === "kn" ? "ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್." : "Incorrect email or password.";
      }
      setMessage(errorMsg);
    } finally {
      setSigning(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!firebaseAuth) {
      setMessage("Authentication is not configured.");
      return;
    }
    setSigning(true);
    setMessage("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
      setMessage(locale === "kn" ? "ಗೂಗಲ್ ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!" : "Google login successful!");
    } catch (error: any) {
      setMessage(error?.message || "Google Authentication failed.");
    } finally {
      setSigning(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm font-semibold text-[var(--muted)]">
          {locale === "kn" ? "ಲೋಡ್ ಆಗುತ್ತಿದೆ..." : "Loading..."}
        </p>
      </div>
    );
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="kq-card w-full max-w-md p-6 md:p-8 bg-white shadow-sm">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--secondary)]">
            KannadaQuiz
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-[var(--primary)]">
            {isSignUp
              ? locale === "kn"
                ? "ಹೊಸ ಖಾತೆ ರಚಿಸಿ"
                : "Create Account"
              : locale === "kn"
                ? "ಲಾಗಿನ್ ಮಾಡಿ"
                : "Sign In"}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {isSignUp
              ? locale === "kn"
                ? "ನಿಮ್ಮ ಪರೀಕ್ಷಾ ಪ್ರಗತಿಯನ್ನು ಉಳಿಸಲು ಖಾತೆಯನ್ನು ರಚಿಸಿ"
                : "Sign up to save your quiz progress and attempts history"
              : locale === "kn"
                ? "ಅಭ್ಯಾಸ ಮುಂದುವರಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ"
                : "Sign in to resume your competitive exam practice"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-[var(--primary)]">
            {locale === "kn" ? "ಇಮೇಲ್ ವಿಳಾಸ" : "Email Address"}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
              placeholder="name@example.com"
              required
            />
          </label>

          <label className="block text-sm font-bold text-[var(--primary)]">
            {locale === "kn" ? "ಪಾಸ್‌ವರ್ಡ್" : "Password"}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none"
              placeholder="••••••••"
              required
            />
          </label>

          <button
            type="submit"
            disabled={signing}
            className="w-full cursor-pointer rounded-md bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--primary)]/90 disabled:opacity-50"
          >
            {signing
              ? locale === "kn"
                ? "ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ..."
                : "Please wait..."
              : isSignUp
                ? locale === "kn"
                  ? "ಖಾತೆ ರಚಿಸಿ"
                  : "Sign Up"
                : locale === "kn"
                  ? "ಲಾಗಿನ್"
                  : "Sign In"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <span className="w-1/5 border-b border-[var(--border)] lg:w-1/4"></span>
          <span className="text-xs text-center text-[var(--muted)] uppercase">
            {locale === "kn" ? "ಅಥವಾ" : "or"}
          </span>
          <span className="w-1/5 border-b border-[var(--border)] lg:w-1/4"></span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={signing}
          type="button"
          className="mt-4 w-full flex items-center justify-center gap-2 cursor-pointer rounded-md border border-[var(--border)] bg-white px-5 py-3 text-sm font-bold text-[var(--primary)] hover:bg-[var(--surface-soft)] transition disabled:opacity-50"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>
            {locale === "kn" ? "ಗೂಗಲ್ ಲಾಗಿನ್" : "Sign in with Google"}
          </span>
        </button>

        {message ? (
          <p className="mt-4 text-center text-sm font-semibold text-[var(--secondary)]">
            {message}
          </p>
        ) : null}

        <div className="mt-6 text-center text-sm">
          <p className="text-[var(--muted)]">
            {isSignUp
              ? locale === "kn"
                ? "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?"
                : "Already have an account?"
              : locale === "kn"
                ? "ಖಾತೆ ಇಲ್ಲವೇ?"
                : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage("");
              }}
              className="cursor-pointer font-bold text-[var(--secondary)] hover:underline"
            >
              {isSignUp
                ? locale === "kn"
                  ? "ಲಾಗಿನ್ ಮಾಡಿ"
                  : "Sign In"
                : locale === "kn"
                  ? "ಖಾತೆ ತೆರೆಯಿರಿ"
                  : "Create Account"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
