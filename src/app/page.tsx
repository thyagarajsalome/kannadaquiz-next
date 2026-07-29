"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/kn");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 text-slate-800 font-sans text-center">
      <meta httpEquiv="refresh" content="0;url=/kn" />
      <link rel="canonical" href="https://kannadaquiz.in/kn" />
      <div>
        <p className="text-lg font-bold">Redirecting to KannadaQuiz...</p>
        <p className="text-xs text-slate-500 mt-2">
          If you are not redirected automatically, <a href="/kn" className="text-red-600 underline font-bold">click here</a>.
        </p>
      </div>
    </div>
  );
}
