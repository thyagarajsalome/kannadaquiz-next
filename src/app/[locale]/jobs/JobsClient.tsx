"use client";

import { useState } from "react";
import Link from "next/link";
import { type Locale } from "@/lib/locales";

interface PublicJob {
  id: string;
  titleKn?: string;
  titleEn?: string;
  descKn?: string;
  descEn?: string;
  organization?: string;
  deadline?: string;
  link?: string;
  source?: string;
  date?: string;
  slug?: string;
  status?: string;
}

export function JobsClient({ locale, jobs }: { locale: Locale; jobs: PublicJob[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter(job => {
    const searchLower = searchTerm.toLowerCase();
    const title = locale === "kn" ? job.titleKn : job.titleEn;
    const desc = locale === "kn" ? job.descKn : job.descEn;
    const org = job.organization || "";
    return (
      (title && title.toLowerCase().includes(searchLower)) ||
      (desc && desc.toLowerCase().includes(searchLower)) ||
      org.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-[var(--surface-soft)] min-h-screen pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 px-4 shadow-md">
        <div className="kq-container text-center max-w-3xl mx-auto">
          <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase px-3 py-1 rounded-full tracking-wider mb-4 border border-white/10">
            {locale === "kn" ? "ಸರ್ಕಾರಿ ಉದ್ಯೋಗ ಮಾಹಿತಿ" : "Govt Jobs Portal"}
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-black mb-4 leading-tight">
            {locale === "kn" ? "ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಉದ್ಯೋಗಗಳ ನೇಮಕಾತಿ" : "Karnataka Government Job Recruitments"}
          </h1>
          <p className="text-blue-100 text-base md:text-lg">
            {locale === "kn" ? "ಇತ್ತೀಚಿನ ಸರ್ಕಾರಿ ಉದ್ಯೋಗಗಳು, ಖಾಲಿ ಹುದ್ದೆಗಳು ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ದಿನಾಂಕಗಳ ವಿವರವನ್ನು ಇಲ್ಲಿ ಪಡೆಯಿರಿ. (ಮಾಹಿತಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನವೀಕರಿಸಲ್ಪಡುತ್ತದೆ)" : "Find the latest government job vacancies, recruitments, and deadlines here. (Automatically synced with official sources)"}
          </p>
        </div>
      </div>

      <div className="kq-container mt-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[var(--border)] mb-8 flex items-center gap-3">
            <svg className="w-6 h-6 text-[var(--muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder={locale === "kn" ? "ಉದ್ಯೋಗ ಹುಡುಕಿ (ಉದಾ: ಪೊಲೀಸ್, KPSC)..." : "Search jobs (e.g. Police, KPSC)..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-base outline-none bg-transparent"
            />
          </div>

          {/* Job List */}
          <div className="flex flex-col gap-5">
            {filteredJobs.length === 0 ? (
              <div className="bg-white p-10 rounded-xl border border-[var(--border)] text-center shadow-sm">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="font-serif text-xl font-bold text-gray-700 mb-2">
                  {locale === "kn" ? "ಯಾವುದೇ ಉದ್ಯೋಗಗಳು ಲಭ್ಯವಿಲ್ಲ" : "No jobs found"}
                </h3>
                <p className="text-gray-500">
                  {locale === "kn" ? "ನೀವು ಹುಡುಕುತ್ತಿರುವ ಉದ್ಯೋಗ ಪ್ರಸ್ತುತ ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ." : "The job you are searching for is not currently in the list."}
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row">
                  <div className="p-6 flex-1 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-[var(--secondary)]">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded border border-blue-200">
                        {job.organization || "Govt"}
                      </span>
                      {job.date && <span className="text-[var(--muted)]">• Published: {job.date}</span>}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[var(--primary)] mb-2 leading-snug">
                      {locale === "kn" ? job.titleKn : job.titleEn}
                    </h3>
                    <p className="text-[var(--muted)] text-sm mb-4 line-clamp-3">
                      {locale === "kn" ? job.descKn : job.descEn}
                    </p>
                    
                    <div className="flex items-center gap-6 mt-auto text-sm">
                      <div className="flex items-center gap-1.5 text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-md border border-rose-100">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {locale === "kn" ? "ಕೊನೆಯ ದಿನಾಂಕ:" : "Deadline:"} {job.deadline || (locale === "kn" ? "ತಿಳಿದಿಲ್ಲ" : "N/A")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border-t md:border-t-0 md:border-l border-[var(--border)] p-6 md:w-64 flex flex-col items-center justify-center gap-3">
                    {job.link ? (
                      <a 
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center bg-[var(--secondary)] hover:bg-[var(--secondary)]/90 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                      >
                        {locale === "kn" ? "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ / ವಿವರಗಳು" : "Apply / Details"}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <span className="w-full text-center bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded-lg">
                        {locale === "kn" ? "ಲಿಂಕ್ ಲಭ್ಯವಿಲ್ಲ" : "Link Unavailable"}
                      </span>
                    )}
                    <span className="text-[10px] text-[var(--muted)] text-center">
                      {locale === "kn" 
                        ? "* ದಯವಿಟ್ಟು ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ." 
                        : "* Please verify details on the official website."}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
