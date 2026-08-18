const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
const Parser = require("rss-parser");

// 1. Setup local environment parsing from .env.local
function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split(/\r?\n/).forEach((line) => {
      // Ignore comments and empty lines
      if (line.trim().startsWith("#") || !line.trim()) return;
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || "";
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    });
  }
}

loadEnvLocal();

const serviceAccountPath = path.join(__dirname, "..", "service-account.json");
if (!fs.existsSync(serviceAccountPath)) {
  console.error("==========================================================================");
  console.error("Error: service-account.json not found!");
  console.error("Please download your Firebase Service Account private key JSON file,");
  console.error("rename it to 'service-account.json', and place it in the project root.");
  console.error("==========================================================================");
  process.exit(1);
}

let serviceAccount;
try {
  const fileContent = fs.readFileSync(serviceAccountPath, "utf8").trim();
  if (!fileContent) {
    throw new Error("The service-account.json file is empty.");
  }
  serviceAccount = JSON.parse(fileContent);
} catch (err) {
  console.error("==========================================================================");
  console.error("Error: Failed to parse service-account.json!");
  console.error(err.message);
  console.error("Please ensure the FIREBASE_SERVICE_ACCOUNT secret is set correctly in GitHub");
  console.error("and that it contains valid, unmodified JSON contents.");
  console.error("==========================================================================");
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (err) {
  console.error("==========================================================================");
  console.error("Error: Failed to initialize Firebase Admin SDK!");
  console.error(err.message);
  console.error("Please verify that your service account credentials are valid.");
  console.error("==========================================================================");
  process.exit(1);
}

const db = admin.firestore();
const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  }
});

const FEEDS = [
  { name: "Karnataka Jobs", url: "https://news.google.com/rss/search?q=karnataka+jobs+recruitment&hl=en-IN&gl=IN&ceid=IN:en" },
  { name: "Exam Notifications", url: "https://news.google.com/rss/search?q=kpsc+OR+kea+OR+fda+OR+sda+OR+psi+recruitment+exam+karnataka&hl=en-IN&gl=IN&ceid=IN:en" },
  { name: "Current Affairs & GK", url: "https://news.google.com/rss/search?q=daily+current+affairs+for+competitive+exams+india&hl=en-IN&gl=IN&ceid=IN:en" },
  { name: "India National News", url: "https://news.google.com/rss/search?q=india+national+news&hl=en-IN&gl=IN&ceid=IN:en" },
  { name: "CNN World News", url: "http://rss.cnn.com/rss/edition_world.rss" },
  { name: "BBC News World", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "Google News International", url: "https://news.google.com/rss/headlines/section/topic/WORLD?hl=en-IN&gl=IN&ceid=IN:en" },
  { name: "Government Schemes", url: "https://news.google.com/rss/search?q=karnataka+government+schemes+OR+yojana&hl=en-IN&gl=IN&ceid=IN:en" },
  { name: "Sports News", url: "https://news.google.com/rss/search?q=sports+news+india+OR+cricket&hl=en-IN&gl=IN&ceid=IN:en" },
  { name: "Football News", url: "https://news.google.com/rss/search?q=football+news+OR+fifa+OR+uefa+OR+premier+league+OR+isl&hl=en-IN&gl=IN&ceid=IN:en" },
  { name: "Technology & AI News", url: "https://news.google.com/rss/search?q=artificial+intelligence+OR+cybersecurity+OR+software+development+OR+computer+basics+OR+tech+careers&hl=en-IN&gl=IN&ceid=IN:en" }
];

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("\n==========================================================================");
  console.error("Error: GEMINI_API_KEY is not defined.");
  console.error("Please obtain a FREE API key from Google AI Studio (https://aistudio.google.com/)");
  console.error("and add it to your .env.local file as: GEMINI_API_KEY=your_key");
  console.error("==========================================================================\n");
  process.exit(1);
}

// 3. Helper to format slugs safely
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 90);
}

// 4. Gemini Translation integration
async function translateAndRewriteWithGemini(title, summary) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemPrompt = `You are a professional educational news writer and exam analyst for competitive exam portals.
Your task is to translate and rewrite the following English news article info into BOTH high-quality, professional Kannada and clean, engaging English.

CRITICAL RULES TO AVOID AI-GENERATION SIGNS (HUMANIZATION):
1. Avoid all AI cliches and typical patterns. Do NOT use transition words like "Furthermore", "Moreover", "In conclusion", "Testament to", "Crucial role", "Vital importance", "It is important to note", "Not only... but also", "Delve", "Tap into", "Beacon of", "Harness", "Revolutionize".
2. Write in a natural, active, direct journalistic voice with varied sentence structures (some short and punchy, some longer). Write like an experienced human mentor who wants to help students prepare for competitive exams.
3. Keep all names, dates, numbers, salaries, vacancies, and technical details 100% accurate. Do not alter facts.
4. For Kannada (kn): Translate contextually and write in a natural Kannada journalistic tone (similar to Prajavani or Vijay Karnataka).
   * Write all numbers, dates, percentages, vacancies, and statistical figures in standard English digits/Arabic numerals (e.g., 1, 2, 3, 2026, 50%, 56000, 890) rather than Kannada numerals (α│º, α│¿, α│⌐) or spelling them out as Kannada words (e.g., do NOT write "α▓Éα▓╡α▓ñα│ìα▓ñα▓╛α▓░α│ü α▓╕α▓╛α▓╡α▓┐α▓░" or "α▓Äα▓éα▓ƒα│üα▓¿α│éα▓░ α▓ñα│èα▓éα▓¼α▓ñα│ìα▓ñα│ü").
   * Keep all exam names, department acronyms, and organizational abbreviations in English capital letters (e.g., write "KEA", "KPSC", "NEET", "CET", "FDA", "SDA", "MBA", "PGCET", "AO", "AAO") rather than writing them in Kannada script (e.g., do NOT write "α▓òα│åα▓çα▓Ä", "α▓òα│åα▓¬α▓┐α▓Äα▓╕α│ìΓÇîα▓╕α▓┐", "α▓¿α│Çα▓ƒα│ì", "α▓Äα▓Æ", "α▓Äα▓Äα▓Æ").
5. MANDATORY HUMAN-ADDED VALUE SECTIONS:
   Every article's body text MUST be divided into the following structured layout separated by newlines:
   - Paragraph 1: Direct, simple introduction of the news (no fluffy intro).
   - Paragraph 2: Key details, facts, numbers, or terms.
   - Paragraph 3: A dedicated "Exam Insights & GK Analysis" (in English) / "α▓¬α▓░α│Çα▓òα│ìα▓╖α▓╛ α▓ªα│âα▓╖α│ìα▓ƒα▓┐α▓òα│ïα▓¿ α▓«α▓ñα│ìα▓ñα│ü α▓£α▓┐.α▓òα│å α▓╡α▓┐α▓╢α│ìα▓▓α│çα▓╖α▓úα│å" (in Kannada) describing why this news matters for exams (KPSC, KEA, Banking, SSC) and listing static background facts (e.g., parent organization, established year, headquarters). Do NOT write multiple-choice questions inside the body text; instead, output them in the structured "quiz" schema array.
6. Categorize the article appropriately (e.g. 'KPSC', 'Jobs', 'Current Affairs', 'Karnataka', 'National', 'International', 'Agriculture', or 'Technology'). If the category is 'Technology', determine which specific subCategory it fits: 'AI & Future Tech', 'Computer Basics', 'Cyber Safety', 'Mobile & Gadgets', or 'Careers'. For other categories, set subCategory to an empty string.
7. Respond ONLY with a valid JSON object matching the requested schema. Do not add markdown wrapping or text before/after.`;

  const userPrompt = `English Title: ${title}
English Summary/Description: ${summary}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          kn: {
            type: "OBJECT",
            description: "Kannada version details.",
            properties: {
              title: { type: "STRING", description: "The translated and rewritten title in Kannada." },
              excerpt: { type: "STRING", description: "A clean 1-2 sentence summary in Kannada." },
              body: { type: "STRING", description: "The news article body in Kannada. Do not include multiple-choice questions here." },
              quiz: {
                type: "ARRAY",
                description: "Exactly 2-3 multiple choice questions based on the news context in Kannada.",
                items: {
                  type: "OBJECT",
                  properties: {
                    question: { type: "STRING", description: "The question text in Kannada." },
                    options: { 
                      type: "ARRAY", 
                      items: { type: "STRING" },
                      description: "Exactly 4 options in Kannada."
                    },
                    correctOptionIndex: { type: "INTEGER", description: "Correct option index (0-3)." },
                    explanation: { type: "STRING", description: "Brief explanation in Kannada." }
                  },
                  required: ["question", "options", "correctOptionIndex", "explanation"]
                }
              }
            },
            required: ["title", "excerpt", "body", "quiz"]
          },
          en: {
            type: "OBJECT",
            description: "English version details.",
            properties: {
              title: { type: "STRING", description: "The rewritten, clean, professional title in English." },
              excerpt: { type: "STRING", description: "A clean 1-2 sentence summary in English." },
              body: { type: "STRING", description: "The news article body rewritten in English. Do not include multiple-choice questions here." },
              quiz: {
                type: "ARRAY",
                description: "Exactly 2-3 multiple choice questions based on the news context in English.",
                items: {
                  type: "OBJECT",
                  properties: {
                    question: { type: "STRING", description: "The question text in English." },
                    options: { 
                      type: "ARRAY", 
                      items: { type: "STRING" },
                      description: "Exactly 4 options in English."
                    },
                    correctOptionIndex: { type: "INTEGER", description: "Correct option index (0-3)." },
                    explanation: { type: "STRING", description: "Brief explanation in English." }
                  },
                  required: ["question", "options", "correctOptionIndex", "explanation"]
                }
              }
            },
            required: ["title", "excerpt", "body", "quiz"]
          },
          category: { type: "STRING", description: "Category name e.g. KPSC, Jobs, Current Affairs, Karnataka, National, International, Agriculture, Technology." },
          subCategory: { type: "STRING", description: "Subcategory name if category is Technology: AI & Future Tech, Computer Basics, Cyber Safety, Mobile & Gadgets, Careers. Else empty string." }
        },
        required: ["kn", "en", "category", "subCategory"]
      }
    }
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API returned code ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  const textResponse = result.candidates[0].content.parts[0].text;
  return JSON.parse(textResponse);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 5. Main sync execution
async function runSync() {
  console.log("Starting KannadaQuiz RSS Feed Sync...");
  const startTime = Date.now();
  let geminiCalls = 0;
  let feedItemsChecked = 0;
  let postsCreated = 0;
  const errors = [];
  const MAX_GEMINI_CALLS_PER_RUN = 15; // Safeguard to prevent high billing / surprise costs
  
  for (const feed of FEEDS) {
    if (geminiCalls >= MAX_GEMINI_CALLS_PER_RUN) {
      console.log(`\n[Safeguard] Reached maximum Gemini API calls limit (${MAX_GEMINI_CALLS_PER_RUN}) for this run. Exiting to prevent high billing.`);
      break;
    }
    console.log(`\nFetching RSS Feed: ${feed.name} (${feed.url})...`);
    try {
      const feedData = await parser.parseURL(feed.url);
      console.log(`Found ${feedData.items.length} items in feed.`);
      feedItemsChecked += feedData.items.length;
 
      // Scan up to 15 items in the feed to find fresh content, but limit imports per feed to 2 items
      const itemsToProcess = feedData.items.slice(0, 15);
      let feedArticlesImported = 0;
 
      for (const item of itemsToProcess) {
        if (geminiCalls >= MAX_GEMINI_CALLS_PER_RUN) {
          console.log(`\n[Safeguard] Reached maximum Gemini API calls limit (${MAX_GEMINI_CALLS_PER_RUN}) during feed processing. Exiting to prevent high billing.`);
          break;
        }
        if (feedArticlesImported >= 2) {
          console.log(`[Limit] Already imported 2 new articles for feed "${feed.name}" in this run. Moving to next feed.`);
          break;
        }

        // Hard filter for unwanted topics (Pakistan)
        const textToSearch = ((item.title || "") + " " + (item.contentSnippet || "")).toLowerCase();
        if (textToSearch.includes("pakistan") || textToSearch.includes("ಪಾಕಿಸ್ತಾನ")) {
          console.log(`[Filter] Skipping item due to unwanted keyword (Pakistan): ${item.title}`);
          continue;
        }
        const originalTitle = item.title;
        const originalDescription = item.contentSnippet || item.content || item.description || "";
        const sourceUrl = item.link || "";
 
        if (!originalTitle) continue;
 
        // Skip political content related to BJP or the specific blocked link
        const lowerTitle = originalTitle.toLowerCase();
        const lowerDesc = originalDescription.toLowerCase();
        const lowerUrl = sourceUrl.toLowerCase();
        
        const isBjpRelated = lowerTitle.includes("bjp") || 
                            lowerTitle.includes("bharatiya janata party") ||
                            lowerDesc.includes("bjp") ||
                            lowerDesc.includes("bharatiya janata party") ||
                            lowerUrl.includes("bjp");
                            
        const isBlockedLink = lowerUrl.includes("thenewsmill.com/2026/05/karnataka-bjp-chief-calls-state-government-guarantee-schemes-election-gimmicks");
        
        if (isBjpRelated || isBlockedLink) {
          console.log(`[Skip] Blocked political/BJP content: "${originalTitle}"`);
          continue;
        }
 
        // Skip articles older than 24 hours to maintain less content but keep it fresh
        const pubDateStr = item.isoDate || item.pubDate;
        if (pubDateStr) {
          const pubDate = new Date(pubDateStr);
          const now = new Date();
          const ageInHours = (now - pubDate) / (1000 * 60 * 60);
          if (ageInHours > 24) {
            console.log(`[Skip] Too old (${Math.round(ageInHours)} hours): "${originalTitle}"`);
            continue;
          }
        }
 
        const slug = generateSlug(originalTitle);
        if (!slug) continue;
 
        // Check if slug already exists in firestore 'posts' collection
        const existingDocs = await db.collection("posts")
          .where("slug", "==", slug)
          .limit(1)
          .get();
 
        if (!existingDocs.empty) {
          console.log(`[Skip] Already imported: "${originalTitle}"`);
          continue;
        }
 
        console.log(`[Processing] "${originalTitle}"...`);
        try {
          // Translate using Gemini
          const translated = await translateAndRewriteWithGemini(originalTitle, originalDescription);
          geminiCalls++;
          
          const isManual = Math.random() < 0.5; // Randomly classify 50% as Manual (editorial humanized)
          
          // Save Kannada version to Firestore
          const newPostKn = {
            locale: "kn",
            title: translated.kn.title.trim(),
            slug: slug,
            excerpt: translated.kn.excerpt.trim(),
            body: translated.kn.body.trim(),
            category: translated.category || "General",
            subCategory: translated.subCategory || "",
            status: "published",
            publishedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            sourceUrl: sourceUrl,
            sourceName: feed.name,
            isManual: isManual,
            quiz: translated.kn.quiz || []
          };
          const docRefKn = await db.collection("posts").add(newPostKn);
          postsCreated++;
          console.log(`[Success] Published Kannada! (ID: ${docRefKn.id}) -> ${translated.kn.title}`);

          // Save English version to Firestore
          const newPostEn = {
            locale: "en",
            title: translated.en.title.trim(),
            slug: slug,
            excerpt: translated.en.excerpt.trim(),
            body: translated.en.body.trim(),
            category: translated.category || "General",
            subCategory: translated.subCategory || "",
            status: "published",
            publishedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            sourceUrl: sourceUrl,
            sourceName: feed.name,
            isManual: isManual,
            quiz: translated.en.quiz || []
          };
          const docRefEn = await db.collection("posts").add(newPostEn);
          postsCreated++;
          feedArticlesImported++;
          console.log(`[Success] Published English! (ID: ${docRefEn.id}) -> ${translated.en.title}`);

          // If the post is categorized as "Current Affairs" or belongs to the GK feed, save it to the currentAffairs collection too
          const isCA = translated.category === "Current Affairs" || feed.name === "Current Affairs & GK";
          if (isCA) {
            const newCaKn = {
              locale: "kn",
              headline: translated.kn.title.trim(),
              status: "published",
              publishedAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            const caRefKn = await db.collection("currentAffairs").add(newCaKn);
            console.log(`[Success] Published Current Affair Kannada! (ID: ${caRefKn.id})`);

            const newCaEn = {
              locale: "en",
              headline: translated.en.title.trim(),
              status: "published",
              publishedAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            const caRefEn = await db.collection("currentAffairs").add(newCaEn);
            console.log(`[Success] Published Current Affair English! (ID: ${caRefEn.id})`);
          }

          // Wait 5 seconds between translations to respect Gemini Free Tier RPM limits
          await sleep(5000);
        } catch (err) {
          console.error(`[Error] Failed to process item: ${err.message}`);
          errors.push(`${feed.name} - ${originalTitle}: ${err.message}`);
          if (err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED")) {
            console.warn("\n[Quota Warning] Gemini API quota limit reached (Rate limit or Daily limit).");
            console.warn("Stopping execution now to avoid spamming. Execution will resume in the next cron run.");
            break;
          }
        }
      }
    } catch (err) {
      console.error(`[Error] Failed to fetch feed ${feed.name}: ${err.message}`);
      errors.push(`Feed ${feed.name}: ${err.message}`);
    }
  }

  console.log("\nSync process completed!");

  // Save telemetry logs to Firestore
  const durationSeconds = Math.ceil((Date.now() - startTime) / 1000);
  try {
    const logDoc = {
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: errors.length === 0 ? "success" : "error",
      durationSeconds,
      geminiCalls,
      feedItemsChecked,
      postsCreated,
      errorMessage: errors.length > 0 ? errors.join(" | ").slice(0, 800) : null
    };
    const logRef = await db.collection("syncLogs").add(logDoc);
    console.log(`Telemetry logged successfully (Log ID: ${logRef.id})`);
  } catch (logErr) {
    console.error("Failed to write telemetry log to Firestore:", logErr.message);
  }
}

runSync();
