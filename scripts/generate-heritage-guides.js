const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// 1. Setup local environment parsing from .env.local
function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split(/\r?\n/).forEach((line) => {
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
  console.error("Error: service-account.json not found in root.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not defined in .env.local");
  process.exit(1);
}

const TOPICS = [
  "Hampi: The Golden Era of Vijayanagara Empire - History, Architecture, and Monuments",
  "Mysore Palace & Wodeyar Dynasty: The Royal History of Mysore Kingdom",
  "Hoysala Temples of Belur and Halebidu: History, Sculptures, and UNESCO World Heritage Sites",
  "The Kadamba Dynasty of Banavasi: The Founders of First Kannada Empire"
];

// Helper to format slugs safely
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 90);
}

async function generateGuideWithGemini(topic) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemPrompt = `You are a professional historian and cultural writer specializing in Karnataka's heritage and history for state competitive exams (KPSC).
Write a comprehensive, detailed, high-quality historical/tourist guide for the given topic in BOTH professional Kannada and clean, engaging English.
Rules:
1. For Kannada (kn): Write in a natural Kannada journalistic/educational tone (similar to Prajavani or Vijay Karnataka).
2. For English (en): Write in a professional, clear educational blog style.
3. Include specific historical details (e.g. rulers, years, battles, architectural style, key monuments, and historical significance). In the Kannada translation:
   * Write all numbers, years, percentages, and dates in standard English digits/Arabic numerals (e.g., 1, 2, 3, 1336, 1912) rather than Kannada numerals (೧, ೨, ೩) or spelling them out as Kannada words.
   * Keep all technical or commonly known terms in English capital letters if relevant, but prioritize natural historical Kannada. Keep abbreviations in English.
4. Do NOT use raw HTML tags (like <ul>, <li>, <b>, <strong>) in the body. Instead, organize the text using clean paragraphs separated by double newlines (\\n\\n), and use simple plain text bullet points (starting with '• ') for list items. Make each paragraph a comfortable, medium length (3-4 sentences maximum).
5. Organize the body text cleanly into multiple detailed paragraphs with bullet points. Provide lots of details and content (make the body long and informative, at least 4-5 paragraphs).
6. Respond ONLY with a valid JSON object matching the requested schema. Do not add markdown wrapping or text before/after.`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nTopic: ${topic}` }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          kn: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING", description: "The Kannada title." },
              excerpt: { type: "STRING", description: "A brief 2-sentence summary in Kannada." },
              body: { type: "STRING", description: "The extensive full guide body in Kannada with paragraph breaks." }
            },
            required: ["title", "excerpt", "body"]
          },
          en: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING", description: "The English title." },
              excerpt: { type: "STRING", description: "A brief 2-sentence summary in English." },
              body: { type: "STRING", description: "The extensive full guide body in English with paragraph breaks." }
            },
            required: ["title", "excerpt", "body"]
          },
          category: { type: "STRING", description: "Must be 'Heritage & Tourism'" }
        },
        required: ["kn", "en", "category"]
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

async function run() {
  console.log(`Starting generation of ${TOPICS.length} heritage guides...`);
  
  for (const topic of TOPICS) {
    const slug = generateSlug(topic.split(":")[0]); // Use first part for clean slug
    
    // Delete existing posts with this slug to overwrite
    const existing = await db.collection("posts").where("slug", "==", slug).get();
    if (!existing.empty) {
      console.log(`[Delete] Deleting existing guide for slug: "${slug}" to overwrite...`);
      for (const doc of existing.docs) {
        await db.collection("posts").doc(doc.id).delete();
      }
    }
    
    console.log(`[Generating] Heritage Guide for: "${topic}"...`);
    try {
      const guide = await generateGuideWithGemini(topic);
      
      // Save Kannada Post
      const postKn = {
        locale: "kn",
        title: guide.kn.title.trim(),
        slug: slug,
        excerpt: guide.kn.excerpt.trim(),
        body: guide.kn.body.trim(),
        category: "Heritage & Tourism",
        status: "published",
        publishedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        sourceName: "KannadaQuiz Editorial"
      };
      const refKn = await db.collection("posts").add(postKn);
      console.log(`  -> Published Kannada! (ID: ${refKn.id})`);
      
      // Save English Post
      const postEn = {
        locale: "en",
        title: guide.en.title.trim(),
        slug: slug,
        excerpt: guide.en.excerpt.trim(),
        body: guide.en.body.trim(),
        category: "Heritage & Tourism",
        status: "published",
        publishedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        sourceName: "KannadaQuiz Editorial"
      };
      const refEn = await db.collection("posts").add(postEn);
      console.log(`  -> Published English! (ID: ${refEn.id})`);
      
      // Wait to respect rate limits
      await sleep(4000);
    } catch (err) {
      console.error(`[Error] Failed to generate heritage guide for "${topic}": ${err.message}`);
    }
  }
  
  console.log("Heritage guides generation complete!");
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
