import React from "react";

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
  const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Configured" : "Default";

  const totalContentCount = stats.posts + stats.jobs + stats.currentAffairs + stats.quizzes;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="kq-card p-6 border border-[var(--border)] bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                100% FREE TIER ACTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">Environment: Developer & Production</span>
            </div>
            <h2 className="font-serif text-2xl font-bold mt-2 text-white">Project Infrastructure & Service Cost Monitor</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time architectural dashboard tracking all active third-party services, APIs, databases, and automated background jobs powering <span className="text-amber-300 font-semibold">{siteUrl}</span>.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/10 text-center min-w-[200px] shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Estimated Monthly Cost</span>
            <div className="text-3xl font-black text-emerald-400 mt-0.5">$0.00</div>
            <span className="text-[10px] text-emerald-200/80 block mt-0.5">Zero Paid Subscriptions</span>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gemini API Card */}
        <div className="kq-card p-4 border border-[var(--border)] bg-white rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">AI Service</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-emerald-100 text-emerald-800 border border-emerald-200">FREE TIER</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--primary)] mt-1.5">Google Gemini API</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Model: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">gemini-2.5-flash</code></p>
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs flex justify-between items-center text-[var(--muted)]">
            <span>Rate Limit: 15 RPM / 1.5k RPD</span>
            <span className="font-bold text-emerald-600">$0.00/mo</span>
          </div>
        </div>

        {/* Firebase Card */}
        <div className="kq-card p-4 border border-[var(--border)] bg-white rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Database & Auth</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-emerald-100 text-emerald-800 border border-emerald-200">SPARK PLAN</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--primary)] mt-1.5">Firebase Platform</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Project: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">{firebaseProjectId}</code></p>
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs flex justify-between items-center text-[var(--muted)]">
            <span>Quota: 50k Reads / 20k Writes/day</span>
            <span className="font-bold text-emerald-600">$0.00/mo</span>
          </div>
        </div>

        {/* RSS Feeds Card */}
        <div className="kq-card p-4 border border-[var(--border)] bg-white rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">News Ingestion</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-sky-100 text-sky-800 border border-sky-200">OPEN RSS</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--primary)] mt-1.5">RSS Parser Engine</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Feeds Active: <span className="font-bold text-[var(--foreground)]">11 Sources</span></p>
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs flex justify-between items-center text-[var(--muted)]">
            <span>Public Feeds (No API key)</span>
            <span className="font-bold text-emerald-600">$0.00/mo</span>
          </div>
        </div>

        {/* Automation Card */}
        <div className="kq-card p-4 border border-[var(--border)] bg-white rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Automation Cron</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded bg-violet-100 text-violet-800 border border-violet-200">SCHEDULED</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--primary)] mt-1.5">GitHub Actions</h3>
          <p className="text-xs text-[var(--muted)] mt-0.5">Interval: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">Every 6 Hours</code></p>
          <div className="mt-3 pt-3 border-t border-[var(--border)] text-xs flex justify-between items-center text-[var(--muted)]">
            <span>Workflow: <code className="font-mono text-[10px]">sync-news.yml</code></span>
            <span className="font-bold text-emerald-600">$0.00/mo</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Service Details & SEO Safety */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Detailed Service Directory */}
        <div className="kq-card p-6 border border-[var(--border)] bg-white rounded-lg space-y-6">
          <div className="border-b border-[var(--border)] pb-3">
            <h3 className="font-serif text-xl font-bold text-[var(--primary)]">Active External Services & APIs</h3>
            <p className="text-xs text-[var(--muted)]">Detailed list of all third-party APIs integrated into the project</p>
          </div>

          <div className="space-y-4">
            {/* Service 1: Gemini */}
            <div className="p-4 border border-[var(--border)] rounded-lg bg-slate-50 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-sm">
                    AI
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--foreground)]">Google Gemini AI API</h4>
                    <span className="text-[11px] text-[var(--muted)]">Translation, Quiz Generation, College & Heritage Guides</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-black rounded bg-emerald-100 text-emerald-800">FREE KEY</span>
              </div>
              <ul className="mt-3 text-xs space-y-1 text-[var(--muted)] list-disc list-inside">
                <li>Primary Model: <code className="font-mono text-[11px]">gemini-2.5-flash</code></li>
                <li>Rate Limit Protection: 5-second delay built between API requests</li>
                <li>Safety Guard: Max 15 API calls per script execution to prevent billing surge</li>
                <li>Location: Configured in <code className="font-mono text-[11px]">.env.local</code> as <code className="font-mono text-[11px]">GEMINI_API_KEY</code></li>
              </ul>
            </div>

            {/* Service 2: Firebase */}
            <div className="p-4 border border-[var(--border)] rounded-lg bg-slate-50 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-amber-500 text-white flex items-center justify-center font-black text-sm">
                    FB
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--foreground)]">Firebase Cloud Infrastructure</h4>
                    <span className="text-[11px] text-[var(--muted)]">Firestore Database, Authentication, Cloud Storage</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-black rounded bg-emerald-100 text-emerald-800">SPARK TIER</span>
              </div>
              <ul className="mt-3 text-xs space-y-1 text-[var(--muted)] list-disc list-inside">
                <li>Firestore Database: 1 GB free storage, 50k reads/day, 20k writes/day</li>
                <li>Authentication: Email/Password admin authentication (50k MAU free)</li>
                <li>Security Rules: Configured in <code className="font-mono text-[11px]">firestore.rules</code> for admin-only writes</li>
                <li>API Key Status: <code className="font-mono text-[11px]">{firebaseApiKey}</code></li>
                <li>Status: {hasFirebase ? <span className="text-emerald-600 font-bold">Connected & Operational</span> : <span className="text-amber-600 font-bold">Fallback Static Mode</span>}</li>
              </ul>
            </div>

            {/* Service 3: RSS Engine */}
            <div className="p-4 border border-[var(--border)] rounded-lg bg-slate-50 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-orange-500 text-white flex items-center justify-center font-black text-sm">
                    RSS
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[var(--foreground)]">RSS Parser Engine & Content Feeds</h4>
                    <span className="text-[11px] text-[var(--muted)]">Prajavani, Kannada Prabha, Google News, BBC, CNN</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-black rounded bg-sky-100 text-sky-800">FREE / PUBLIC</span>
              </div>
              <ul className="mt-3 text-xs space-y-1 text-[var(--muted)] list-disc list-inside">
                <li>Active Sources: 11 curated news & exam notification RSS feeds</li>
                <li>Usage: Automatically parses incoming recruitment alerts and current affairs</li>
                <li>Script: Executed via <code className="font-mono text-[11px]">node scripts/sync-news.js</code></li>
                <li>No subscription, rate limits, or API key needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Safety & Developer Guidelines */}
        <div className="space-y-6">
          {/* SEO Protection Summary */}
          <div className="kq-card p-6 border border-[var(--border)] bg-white rounded-lg space-y-4">
            <div className="border-b border-[var(--border)] pb-3">
              <h3 className="font-serif text-xl font-bold text-[var(--primary)]">SEO & Static Content Protection</h3>
              <p className="text-xs text-[var(--muted)]">Guarantees zero SEO impact even when running on free quotas</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3 border border-[var(--border)] rounded bg-emerald-50/50">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Indexed Content Count</span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">{totalContentCount} Documents</span>
                <span className="text-[10px] text-emerald-600/90 block mt-0.5">Stored in Firestore & static fallback</span>
              </div>
              <div className="p-3 border border-[var(--border)] rounded bg-sky-50/50">
                <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">Static Revalidation Window</span>
                <span className="text-2xl font-black text-sky-700 mt-1 block">300 Seconds</span>
                <span className="text-[10px] text-sky-600/90 block mt-0.5">Next.js Incremental Static Regeneration</span>
              </div>
            </div>

            <div className="p-4 border border-[var(--border)] rounded-lg bg-amber-50/50 text-xs text-amber-900 leading-relaxed space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <svg className="w-4 h-4 text-amber-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Why Free Services Do NOT Hurt Your SEO
              </div>
              <p>
                1. <strong>Content Permanence:</strong> All posts, quizzes, and job notifications previously created are permanently stored. They remain accessible to Googlebot 24/7 even if news sync is paused.
              </p>
              <p>
                2. <strong>Static HTML Serving:</strong> Public pages are pre-rendered statically. Visitors and search engine crawlers get instant HTML responses regardless of API rate limits.
              </p>
              <p>
                3. <strong>Zero Downtime Fallback:</strong> If database quotas are hit, <code className="font-mono text-[11px]">public-content.ts</code> seamlessly serves bundled static content from <code className="font-mono text-[11px]">src/data/content.ts</code>.
              </p>
            </div>
          </div>

          {/* Developer Quick Command Reference */}
          <div className="kq-card p-6 border border-[var(--border)] bg-white rounded-lg space-y-4">
            <div className="border-b border-[var(--border)] pb-3">
              <h3 className="font-serif text-xl font-bold text-[var(--primary)]">Developer Command Cheat-Sheet</h3>
              <p className="text-xs text-[var(--muted)]">Run these commands locally to maintain content & audit services</p>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 border border-[var(--border)] rounded bg-slate-900 text-slate-100 flex items-center justify-between">
                <span>node scripts/sync-news.js</span>
                <span className="text-[10px] font-sans text-slate-400 font-normal">Fetch RSS & Translate with Gemini</span>
              </div>
              <div className="p-2.5 border border-[var(--border)] rounded bg-slate-900 text-slate-100 flex items-center justify-between">
                <span>node scripts/generate-quiz.js</span>
                <span className="text-[10px] font-sans text-slate-400 font-normal">Generate AI Quizzes on Topic</span>
              </div>
              <div className="p-2.5 border border-[var(--border)] rounded bg-slate-900 text-slate-100 flex items-center justify-between">
                <span>node scripts/balance-manual-posts.js</span>
                <span className="text-[10px] font-sans text-slate-400 font-normal">Audit 50/50 Manual Content Balance</span>
              </div>
              <div className="p-2.5 border border-[var(--border)] rounded bg-slate-900 text-slate-100 flex items-center justify-between">
                <span>node scripts/generate-college-guides.js</span>
                <span className="text-[10px] font-sans text-slate-400 font-normal">Build College Preparation Guides</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
