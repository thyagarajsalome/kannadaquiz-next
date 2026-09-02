"use client";

import { useEffect, useState } from "react";

type SeoPage = {
  slug: string;
  examId: string;
  intentId: string;
  title: { en: string; kn: string };
};

type LinkStatus = {
  url: string;
  status: number | null; // 200, 404, etc.
  loading: boolean;
};

export function SeoDashboard() {
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [links, setLinks] = useState<LinkStatus[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch("/api/seo-pages")
      .then((r) => r.json())
      .then((data: SeoPage[]) => {
        setPages(data || []);
        const allLinks: LinkStatus[] = [];
        (data || []).forEach((p) => {
          allLinks.push({ url: `/kn/exams/${p.slug}`, status: null, loading: false });
          allLinks.push({ url: `/en/exams/${p.slug}`, status: null, loading: false });
        });
        setLinks(allLinks);
      })
      .catch(console.error);
  }, []);

  const runCheck = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);

    const updatedLinks = [...links];
    
    // Batch process to avoid hitting rate limits or overwhelming the browser
    const BATCH_SIZE = 5;
    
    for (let i = 0; i < updatedLinks.length; i += BATCH_SIZE) {
      const batch = updatedLinks.slice(i, i + BATCH_SIZE);
      
      await Promise.all(
        batch.map(async (link, index) => {
          const globalIndex = i + index;
          
          setLinks((prev) => {
            const next = [...prev];
            next[globalIndex] = { ...next[globalIndex], loading: true };
            return next;
          });

          try {
            const res = await fetch(link.url, { method: "HEAD" });
            
            setLinks((prev) => {
              const next = [...prev];
              next[globalIndex] = { ...next[globalIndex], loading: false, status: res.status };
              return next;
            });
          } catch (error) {
            setLinks((prev) => {
              const next = [...prev];
              next[globalIndex] = { ...next[globalIndex], loading: false, status: 0 }; // Network error
              return next;
            });
          }
        })
      );
      
      setProgress(Math.floor(((i + BATCH_SIZE) / updatedLinks.length) * 100));
    }
    
    setProgress(100);
    setIsRunning(false);
  };

  const okCount = links.filter(l => l.status === 200).length;
  const errorCount = links.filter(l => l.status !== null && l.status !== 200).length;
  const pendingCount = links.filter(l => l.status === null).length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">SEO Link Status Dashboard</h2>
          <p className="text-gray-500">Total generated SEO URLs: {links.length}</p>
        </div>
        <button
          onClick={runCheck}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isRunning ? \`Checking (\${progress}%)...\` : "Run Health Check"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded border border-green-200">
          <h3 className="font-bold text-green-800">✅ 200 OK</h3>
          <p className="text-3xl font-black text-green-600">{okCount}</p>
        </div>
        <div className="bg-red-100 p-4 rounded border border-red-200">
          <h3 className="font-bold text-red-800">❌ Errors (404/500)</h3>
          <p className="text-3xl font-black text-red-600">{errorCount}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded border border-gray-200">
          <h3 className="font-bold text-gray-800">⏳ Pending</h3>
          <p className="text-3xl font-black text-gray-600">{pendingCount}</p>
        </div>
      </div>

      <div className="bg-white border rounded shadow-sm max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 border-b">
            <tr>
              <th className="p-3 text-sm font-bold">URL</th>
              <th className="p-3 text-sm font-bold w-32">Status</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-3 font-mono text-sm">
                  <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {link.url}
                  </a>
                </td>
                <td className="p-3">
                  {link.loading ? (
                    <span className="text-yellow-600 font-bold animate-pulse">Checking...</span>
                  ) : link.status === 200 ? (
                    <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-xs">🟩 200 OK</span>
                  ) : link.status === null ? (
                    <span className="text-gray-400 text-xs">-</span>
                  ) : (
                    <span className="text-red-600 font-bold bg-red-100 px-2 py-1 rounded text-xs">🟥 {link.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
