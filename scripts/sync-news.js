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
  console.error("Error: Please download your Firebase Service Account private key JSON file,");
  console.error("rename it to 'service-account.json', and place it in the project root directory.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const parser = new Parser({
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  }
});

const FEEDS = [
  { name: "BBC News World", url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "CNN World News", url: "http://rss.cnn.com/rss/edition_world.rss" },
  { name: "Deutsche Welle (DW)", url: "https://rss.dw.com/rdf/rss-en-top" },
  { name: "NPR World News", url: "https://feeds.npr.org/1004/rss.xml" },
  { name: "Al Jazeera World", url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { name: "Times of India International", url: "https://timesofindia.indiatimes.com/rssfeeds/296589292.xml" }
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
  
  const systemPrompt = `You are a professional educational news writer for Kannada competitive exam preparation portals.
Translate and rewrite the following English news article info into high-quality, professional Kannada.
Rules:
1. Translate contextually and write in a natural Kannada journalistic tone (similar to Prajavani or Vijay Karnataka).
2. Keep all names, dates, numbers, salaries, vacancies, and technical exam details 100% accurate. Do not alter facts.
3. Organize the body text cleanly into distinct paragraphs.
4. Categorize it appropriately (e.g. 'KPSC', 'Jobs', 'Current Affairs', 'Karnataka', 'National', or 'International').
5. Respond ONLY with a valid JSON object matching the requested schema. Do not add markdown wrapping or text before/after.`;

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
          title: { type: "STRING", description: "The translated and rewritten title in Kannada." },
          excerpt: { type: "STRING", description: "A clean 1-2 sentence summary of the news in Kannada." },
          body: { type: "STRING", description: "The full news article body rewritten in Kannada, formatted with newline breaks between paragraphs." },
          category: { type: "STRING", description: "Category name e.g. KPSC, Jobs, Current Affairs, Karnataka, National, International." }
        },
        required: ["title", "excerpt", "body", "category"]
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

// 5. Main sync execution loop
async function runSync() {
  console.log("Starting KannadaQuiz RSS Feed Sync...");
  
  for (const feed of FEEDS) {
    console.log(`\nFetching RSS Feed: ${feed.name} (${feed.url})...`);
    try {
      const feedData = await parser.parseURL(feed.url);
      console.log(`Found ${feedData.items.length} items in feed.`);

      // Take the top 3 newest articles per feed execution to conserve API quota
      const itemsToProcess = feedData.items.slice(0, 3);

      for (const item of itemsToProcess) {
        const originalTitle = item.title;
        const originalDescription = item.contentSnippet || item.content || item.description || "";
        const sourceUrl = item.link || "";

        if (!originalTitle) continue;

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
          
          // Save to Firestore as PUBLISHED directly
          const newPost = {
            locale: "kn",
            title: translated.title.trim(),
            slug: slug,
            excerpt: translated.excerpt.trim(),
            body: translated.body.trim(),
            category: translated.category || "General",
            status: "published", // Published directly for 100% automation
            publishedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            sourceUrl: sourceUrl,
            sourceName: feed.name
          };

          const docRef = await db.collection("posts").add(newPost);
          console.log(`[Success] Published live! (ID: ${docRef.id}) -> ${translated.title}`);

          // Wait 5 seconds between translations to respect Gemini Free Tier RPM limits
          await sleep(5000);
        } catch (err) {
          console.error(`[Error] Failed to process item: ${err.message}`);
          if (err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED")) {
            console.warn("\n[Quota Warning] Gemini API quota limit reached (Rate limit or Daily limit).");
            console.warn("Stopping execution now to avoid spamming. Execution will resume in the next cron run.");
            process.exit(0);
          }
        }
      }
    } catch (err) {
      console.error(`[Error] Failed to fetch feed ${feed.name}: ${err.message}`);
    }
  }

  console.log("\nSync process completed successfully!");
}

runSync();
