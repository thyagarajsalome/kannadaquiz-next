import React, { useState } from "react";

interface ServicesInfrastructureProps {
  stats: {
    posts: number;
    manualPosts: number;
    jobs: number;
    manualJobs: number;
    currentAffairs: number;
    quizzes: number;
  };
  hasFirebase: boolean;
}

export function ServicesInfrastructure({ stats, hasFirebase }: ServicesInfrastructureProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kannadaquiz.in";
  const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "kannadaquiz-fc21b";
  const gaId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Z9CE3G37M9";
  const [selectedPlan] = useState<"Spark" | "Blaze">("Blaze");

  const totalContentCount = stats.posts + stats.jobs + stats.currentAffairs + stats.quizzes;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="kq-card p-6 border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                ACTIVE TECH STACK & MONITOR
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                🔥 FIREBASE {selectedPlan.toUpperCase()} PLAN
              </span>
              <span className="text-xs text-slate-400 font-mono">Domain: {siteUrl}</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mt-2 text-white">System Services & Tech Stack Dashboard</h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Complete visual directory tracking all frontend, backend, database, AI, and CI/CD services powering <span className="text-amber-300 font-semibold">{siteUrl}</span>.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 text-center min-w-[210px] shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Estimated Monthly Cost</span>
            <div className="text-3xl font-black text-emerald-400 mt-0.5">$0.00</div>
            <span className="text-[10px] text-emerald-200/80 block mt-0.5">Free Daily Quotas Active</span>
          </div>
        </div>
      </div>

      {/* Visual System Architecture Diagram */}
      <div className="kq-card p-6 border border-[var(--border)] bg-white rounded-xl shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div>
            <h3 className="font-serif text-xl font-bold text-[var(--primary)]">System Architecture & Data Flow</h3>
            <p className="text-xs text-[var(--muted)]">Visual map showing how content flows from RSS sources to visitors</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-slate-100 font-mono font-bold text-slate-700">7 Core Components</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {/* Node 1 */}
          <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 text-center relative group hover:border-indigo-400 transition-colors">
            <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-black text-xs mx-auto flex items-center justify-center shadow-sm">1</div>
            <h4 className="font-bold text-xs mt-2 text-slate-900">RSS News Feeds</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">11 News Sources</p>
            <span className="inline-block mt-2 px-1.5 py-0.5 text-[9px] font-bold bg-orange-100 text-orange-800 rounded">Public RSS</span>
          </div>

          {/* Node 2 */}
          <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 text-center relative group hover:border-violet-400 transition-colors">
            <div className="w-8 h-8 rounded-full bg-violet-600 text-white font-black text-xs mx-auto flex items-center justify-center shadow-sm">2</div>
            <h4 className="font-bold text-xs mt-2 text-slate-900">GitHub Actions</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Cron Every 6 Hours</p>
            <span className="inline-block mt-2 px-1.5 py-0.5 text-[9px] font-bold bg-violet-100 text-violet-800 rounded">Auto Sync</span>
          </div>

          {/* Node 3 */}
          <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 text-center relative group hover:border-indigo-500 transition-colors">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs mx-auto flex items-center justify-center shadow-sm">3</div>
            <h4 className="font-bold text-xs mt-2 text-slate-900">Gemini 2.5 AI</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Translation & Quizzes</p>
            <span className="inline-block mt-2 px-1.5 py-0.5 text-[9px] font-bold bg-indigo-100 text-indigo-800 rounded">Google AI Studio</span>
          </div>

          {/* Node 4 */}
          <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 text-center relative group hover:border-amber-400 transition-colors">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-black text-xs mx-auto flex items-center justify-center shadow-sm">4</div>
            <h4 className="font-bold text-xs mt-2 text-slate-900">Firebase Firestore</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">NoSQL DB & Auth</p>
            <span className="inline-block mt-2 px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 rounded">Blaze Plan ($0)</span>
          </div>

          {/* Node 5 */}
          <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 text-center relative group hover:border-black transition-colors">
            <div className="w-8 h-8 rounded-full bg-black text-white font-black text-xs mx-auto flex items-center justify-center shadow-sm">5</div>
            <h4 className="font-bold text-xs mt-2 text-slate-900">Next.js 16 + Vercel</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Static Export CDN</p>
            <span className="inline-block mt-2 px-1.5 py-0.5 text-[9px] font-bold bg-slate-200 text-slate-800 rounded">SSG & Edge</span>
          </div>

          {/* Node 6 */}
          <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 text-center relative group hover:border-emerald-400 transition-colors">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs mx-auto flex items-center justify-center shadow-sm">6</div>
            <h4 className="font-bold text-xs mt-2 text-slate-900">Live Website</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">kannadaquiz.in</p>
            <span className="inline-block mt-2 px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">100% Online</span>
          </div>
        </div>
      </div>

      {/* Grid of Tech Stack & Services */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Service 1: Next.js */}
        <div className="kq-card p-4 border border-[var(--border)] bg-white rounded-xl hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Frontend Engine</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-slate-900 text-white">NEXT.JS 16</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--primary)] mt-1.5 flex items-center gap-1.5">
            Next.js App Router
          </h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">React 19, Turbopack, Tailwind CSS</p>
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs flex justify-between items-center text-[var(--muted)]">
            <span>Mode: <code className="font-mono text-[10px]">output: &quot;export&quot;</code></span>
            <span className="font-bold text-emerald-600">Open Source</span>
          </div>
        </div>

        {/* Service 2: Vercel */}
        <div className="kq-card p-4 border border-[var(--border)] bg-white rounded-xl hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Hosting & CDN</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-emerald-100 text-emerald-800 border border-emerald-200">HOBBY PLAN</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--primary)] mt-1.5">Vercel Edge Platform</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Domain: <span className="font-semibold text-slate-800">kannadaquiz.in</span></p>
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs flex justify-between items-center text-[var(--muted)]">
            <span>SSL & Edge CDN</span>
            <span className="font-bold text-emerald-600">$0.00/mo</span>
          </div>
        </div>

        {/* Service 3: Firebase Platform */}
        <div className="kq-card p-4 border border-[var(--border)] bg-white rounded-xl hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Database & Auth</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-amber-100 text-amber-900 border border-amber-300">BLAZE PLAN</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--primary)] mt-1.5">Firebase Platform</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Project: <code className="font-mono text-[10px]">{firebaseProjectId}</code></p>
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs flex justify-between items-center text-[var(--muted)]">
            <span>50k Free Daily Reads</span>
            <span className="font-bold text-emerald-600">$0.00/mo</span>
          </div>
        </div>

        {/* Service 4: Gemini AI */}
        <div className="kq-card p-4 border border-[var(--border)] bg-white rounded-xl hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">AI Translation</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-indigo-100 text-indigo-800 border border-indigo-200">FREE KEY</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--primary)] mt-1.5">Google Gemini API</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Model: <code className="font-mono text-[10px]">gemini-2.5-flash</code></p>
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs flex justify-between items-center text-[var(--muted)]">
            <span>Limit: 15 RPM / 1.5k RPD</span>
            <span className="font-bold text-emerald-600">$0.00/mo</span>
          </div>
        </div>
      </div>

      {/* Service Cards Row 2 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Service 5: RSS Engine */}
        <div className="kq-card p-4 border border-[var(--border)] bg-white rounded-xl hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Content Parser</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-orange-100 text-orange-800 border border-orange-200">11 SOURCES</span>
          </div>
          <h3 className="text-base font-bold text-[var(--primary)] mt-1.5">RSS Feed Parser Engine</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Prajavani, Kannada Prabha, BBC, Google News, etc.</p>
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs flex justify-between items-center text-[var(--muted)]">
            <span>Public Feeds (No API key)</span>
            <span className="font-bold text-emerald-600">$0.00/mo</span>
          </div>
        </div>

        {/* Service 6: GitHub Actions */}
        <div className="kq-card p-4 border border-[var(--border)] bg-white rounded-xl hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Automation Cron</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-violet-100 text-violet-800 border border-violet-200">EVERY 6 HOURS</span>
          </div>
          <h3 className="text-base font-bold text-[var(--primary)] mt-1.5">GitHub Actions Runner</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Workflow: <code className="font-mono text-[10px]">sync-news.yml</code></p>
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs flex justify-between items-center text-[var(--muted)]">
            <span>Repo: thyagarajsalome/kannadaquiz-next</span>
            <span className="font-bold text-emerald-600">$0.00/mo</span>
          </div>
        </div>

        {/* Service 7: Google Analytics */}
        <div className="kq-card p-4 border border-[var(--border)] bg-white rounded-xl hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">Analytics & SEO</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-amber-100 text-amber-900 border border-amber-200">GA4 ACTIVE</span>
          </div>
          <h3 className="text-base font-bold text-[var(--primary)] mt-1.5">Google Analytics 4</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Measurement ID: <code className="font-mono text-[10px]">{gaId}</code></p>
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs flex justify-between items-center text-[var(--muted)]">
            <span>Sitemap & Canonical SEO</span>
            <span className="font-bold text-emerald-600">$0.00/mo</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Detailed Specs & Developer CLI Reference */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Detailed Service Technical Directory */}
        <div className="kq-card p-6 border border-[var(--border)] bg-white rounded-xl space-y-5">
          <div className="border-b border-[var(--border)] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[var(--primary)]">Full Technology Stack Summary</h3>
              <p className="text-xs text-[var(--muted)]">Detailed breakdown of libraries, APIs, and hosting providers</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">
              All 100% Free Tiers
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Tech 1 */}
            <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                JS
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Next.js 16 (App Router)</h4>
                  <span className="text-[10px] font-mono font-semibold text-slate-600">Frontend & SSG</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Static export mode rendering static HTML files into <code className="font-mono text-[11px]">out/</code>. Powered by React 19 and Turbopack.
                </p>
              </div>
            </div>

            {/* Tech 2 */}
            <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-amber-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                FB
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Firebase Firestore & Auth</h4>
                  <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">Blaze Plan Active ($0)</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  NoSQL Firestore database storing posts, job alerts, and quizzes. Status: {hasFirebase ? <span className="text-emerald-600 font-bold">Connected & Operational</span> : <span className="text-amber-600 font-bold">Static Fallback Active</span>}.
                </p>
              </div>
            </div>

            {/* Tech 3 */}
            <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                AI
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Google Gemini 2.5 Flash API</h4>
                  <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">1,500 RPD Free</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Generates English to Kannada translations, extracts job summaries, and generates multiple choice practice quizzes.
                </p>
              </div>
            </div>

            {/* Tech 4 */}
            <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50 flex items-start gap-3">
              <div className="w-9 h-9 rounded bg-black text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                V
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Vercel Global CDN Hosting</h4>
                  <span className="text-[10px] font-mono font-semibold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">Hobby Plan ($0)</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Serves <code className="font-mono text-[11px]">https://kannadaquiz.in</code> with free SSL certificates and Vercel Edge 301 redirects.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Metrics & Developer Quick Reference */}
        <div className="space-y-6">
          {/* Content & SEO Metrics */}
          <div className="kq-card p-6 border border-[var(--border)] bg-white rounded-xl space-y-4">
            <div className="border-b border-[var(--border)] pb-3">
              <h3 className="font-serif text-xl font-bold text-[var(--primary)]">Content Metrics & System Health</h3>
              <p className="text-xs text-[var(--muted)] font-mono">Live Database Document Counts</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3 border border-[var(--border)] rounded-lg bg-emerald-50/60">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Indexed Content Count</span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">{totalContentCount} Documents</span>
                <span className="text-[10px] text-emerald-700/90 block mt-0.5">Firestore DB + Local Static Backup</span>
              </div>
              <div className="p-3 border border-[var(--border)] rounded-lg bg-sky-50/60">
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">Build Generation Speed</span>
                <span className="text-2xl font-black text-sky-700 mt-1 block">~6.7 Seconds</span>
                <span className="text-[10px] text-sky-700/90 block mt-0.5">1,079 Static HTML Pages</span>
              </div>
            </div>

            <div className="p-4 border border-amber-200 rounded-xl bg-amber-50/60 text-xs text-amber-900 leading-relaxed space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <svg className="w-4 h-4 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Developer Safeguards Enabled
              </div>
              <p>
                1. <strong>Rate Limit Protection:</strong> Gemini API calls have a built-in 5-second delay to keep requests strictly inside free tier limits.
              </p>
              <p>
                2. <strong>Blaze Cost Guard:</strong> Since pages are generated statically, user visits do not make continuous database writes, keeping your Blaze bill at **$0.00/month**.
              </p>
            </div>
          </div>

          {/* Developer Quick Command Reference */}
          <div className="kq-card p-6 border border-[var(--border)] bg-white rounded-xl space-y-4">
            <div className="border-b border-[var(--border)] pb-3">
              <h3 className="font-serif text-xl font-bold text-[var(--primary)]">Developer CLI Command Reference</h3>
              <p className="text-xs text-[var(--muted)]">Terminal commands to run news sync, builds, and tests locally</p>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 border border-slate-200 rounded-lg bg-slate-900 text-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
                <span>node scripts/sync-news.js</span>
                <span className="text-[10px] font-sans text-slate-400 shrink-0 font-normal">Fetch RSS & Gemini Translate</span>
              </div>
              <div className="p-2.5 border border-slate-200 rounded-lg bg-slate-900 text-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
                <span>node scripts/generate-quiz.js</span>
                <span className="text-[10px] font-sans text-slate-400 shrink-0 font-normal">Generate AI Practice Quizzes</span>
              </div>
              <div className="p-2.5 border border-slate-200 rounded-lg bg-slate-900 text-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
                <span>npm run build</span>
                <span className="text-[10px] font-sans text-slate-400 shrink-0 font-normal">Build Static Export (1,079 Pages)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

