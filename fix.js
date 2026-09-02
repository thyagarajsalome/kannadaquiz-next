const fs = require('fs');
let content = fs.readFileSync('src/app/[locale]/page.tsx', 'utf-8');

const newCategoriesInfo = `const categoriesInfo = [
  {
    key: "quizzes",
    kn: "𛲂ඬ඿෍ຘ෍ඨুಣ ",
    en: "Quizzes",
    icon: \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />`,
    color: "text-rose-755 bg-rose-50 hover:bg-rose-100 hover:border-rose-300",
    url: "quizzes"
  },
  {
    key: "syllabus",
    kn: "প্থ্যক্রা",
    en: "Syllabus",
    icon: \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5C4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />`,
    color: "text-cyan-755 bg-cyan-50 hover:bg-cyan-100 hover:border-cyan-300",
    url: "syllabus"
  },
  {
    key: "technology",
    kn: "তংত्রস्জ्জান",
    en: "Tech & AI",
    icon: \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`,
    color: "text-blue-755 bg-blue-50 hover:bg-blue-100 hover:border-blue-300",
    url: "category/technology"
  },
  {
    key: "question-papers",
    kn: "হিংদিন ন्রস्নে",
    en: "Old Papers",
    icon: \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />`,
    color: "text-orange-755 bg-orange-50 hover:bg-orange-100 hover:border-orange-300",
    url: "category/question-papers"
  },
  {
    key: "study-materials",
    kn: "স्টডিঠাট्স",
    en: "Study Notes",
    icon: \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5C4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />`,
    color: "text-emerald-755 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300",
    url: "category/study-materials"
  },
  {
    key: "results",
    kn: "অলিতাঠস",
    en: "Results",
    icon: \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />`,
    color: "text-teal-755 bg-teal-50 hover:bg-teal-100 hover:border-teal-300",
    url: "category/results"
  },
  {
    key: "preparation-guides",
    kn: "তযিরির ",
    en: "Prep Guides",
    icon: \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />`,
    color: "text-yellow-755 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300",
    url: "category/preparation-guides"
  },
  {
    key: "education",
    kn: "শৱক্ষণিক",
    en: "Education",
    icon: \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 14v6a3 3 0 003 3h10a3 3 0 003-3v-6" />`,
    color: "text-purple-755 bg-purple-50 hover:bg-purple-100 hover:border-purple-300",
    url: "education"
  },
  {
    key: "jobs",
    kn: "উদ্যোগথু",
    en: "Jobs",
    icon: \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />`,
    color: "text-slate-700 bg-slate-50 hover:bg-slate-100 hover:border-slate-300",
    url: "category/jobs"
  },
  {
    key: "agriculture",
    kn: "কৱষিক",
    en: "Agriculture",
    icon: \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.62h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0 />`,
    color: "text-green-751 bg-green-50 hover:bg-green-100 hover:border-green-300",
    url: "category/agriculture"
  }
];`

// Replace categoriesInfo
const startIndex = content.indexOf('const categoriesInfo = [');
const endStr =    'url: "bangalore-guide"\n  }\n];';
const endIndex = content.indexOf(endStr, startIndex) + endStr.length;

content = content.substring(0, startIndex) + newCategoriesInfo + content.substring(endIndex);

fs.writeFileSync('src/app/[locale]/page.tsx', content);
