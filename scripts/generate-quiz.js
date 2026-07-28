// Delay helper function
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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
  console.error("Error: Please download your Firebase Service Account private key JSON file,");
  console.error("rename it to 'service-account.json', and place it in the project root directory.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not defined in your .env.local file.");
  process.exit(1);
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 90);
}

async function generateQuizWithGemini(topic, subject, difficulty) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const systemPrompt = `You are an expert exam question designer for Karnataka KPSC, KEA, and banking exams.
Generate a high-quality 10-question multiple-choice practice quiz about the requested topic.
Topic to generate: "${topic}"
Subject category: "${subject}"
Difficulty level: "${difficulty}"

Rules:
1. Generate exactly 10 questions.
2. For each question, provide 4 options, the 0-indexed correct option, and a clear educational explanation of the answer.
3. For the Kannada (kn) version:
   * Write questions, options, and explanations in standard, clear, academic Kannada suitable for state competitive exams.
   * Write all numbers, percentages, and dates in standard English digits/Arabic numerals (e.g., 1947, 50%, 12) rather than Kannada numerals or spelling them out as Kannada words.
   * Keep all exam names, department acronyms, and organizational abbreviations in English capital letters (e.g., write "KEA", "KPSC", "NEET", "CET", "FDA", "SDA", "MBA", "PGCET", "AO", "AAO") rather than transliterating/writing them in Kannada script (e.g., do NOT write "ಕೆಇಎ", "ಕೆಪಿಎಸ್‌ಸಿ", "ನೀಟ್", "ಎಒ", "ಎಎಒ").
4. For the English (en) version:
   * Write clear, professional academic English.
5. Make sure the English and Kannada questions correspond exactly to the same indices (e.g., question 1 in Kannada is the translation of question 1 in English).
6. Generate a title and brief 1-2 sentence description for both language versions of the quiz.
7. Respond ONLY with a valid JSON object matching the requested schema. No markdown wrappers or additional text.`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      }
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          titleKn: { type: "STRING", description: "Bilingual/Kannada title of the quiz." },
          titleEn: { type: "STRING", description: "English title of the quiz." },
          descriptionKn: { type: "STRING", description: "Short description in Kannada." },
          descriptionEn: { type: "STRING", description: "Short description in English." },
          questions: {
            type: "ARRAY",
            description: "List of 10 quiz questions.",
            items: {
              type: "OBJECT",
              properties: {
                questionKn: { type: "STRING", description: "Question text in Kannada." },
                questionEn: { type: "STRING", description: "Question text in English." },
                optionsKn: {
                  type: "ARRAY",
                  description: "4 options in Kannada.",
                  items: { type: "STRING" }
                },
                optionsEn: {
                  type: "ARRAY",
                  description: "4 options in English.",
                  items: { type: "STRING" }
                },
                correctOptionIndex: { type: "INTEGER", description: "Index of correct option (0-3)." },
                explanationKn: { type: "STRING", description: "Explanation in Kannada." },
                explanationEn: { type: "STRING", description: "Explanation in English." }
              },
              required: [
                "questionKn",
                "questionEn",
                "optionsKn",
                "optionsEn",
                "correctOptionIndex",
                "explanationKn",
                "explanationEn"
              ]
            }
          }
        },
        required: ["titleKn", "titleEn", "descriptionKn", "descriptionEn", "questions"]
      }
    }
  };

  console.log(`Contacting Gemini API to generate quiz on "${topic}"...`);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API returned ${response.status}: ${errText}`);
  }

  const result = await response.json();
  const textResponse = result.candidates[0].content.parts[0].text;
  return JSON.parse(textResponse);
}

async function run() {
  const args = process.argv.slice(2);
  const topicArg = args[0] || "";
  const difficultyArg = args[1] || "Medium";

  // Validate topic and maps
  const topicsMap = {
    general: { topic: "General Knowledge (GK) for Karnataka KPSC exams", subject: "General Knowledge" },
    science: { topic: "General Science for KPSC and competitive exams", subject: "Science" },
    technology: { topic: "Science & Technology, Computers, and recent tech innovations", subject: "Technology" },
    maths: { topic: "Quantitative Aptitude, Mental Ability, and logical reasoning", subject: "Mathematics" },
    constitution: { topic: "Indian Constitution, polity, and fundamental rights", subject: "Indian Constitution" },
    history: { topic: "Karnataka History, dynasties, and Indian freedom struggle", subject: "History" }
  };

  const key = topicArg.toLowerCase().trim();
  let selected = topicsMap[key];

  if (!selected) {
    // If not a default key, use the raw topic argument
    if (topicArg) {
      selected = { topic: topicArg, subject: "General" };
    } else {
      // Default to a random one if nothing passed
      const keys = Object.keys(topicsMap);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      selected = topicsMap[randomKey];
      console.log(`No topic specified. Selected random topic: "${randomKey}"`);
    }
  }

  try {
    const quizData = await generateQuizWithGemini(selected.topic, selected.subject, difficultyArg);
    
    if (!quizData.questions || quizData.questions.length === 0) {
      throw new Error("Gemini returned an empty list of questions.");
    }

    const slug = generateSlug(quizData.titleEn || selected.topic);
    
    // Check if slug already exists to prevent duplicate paths
    const existingQuizzes = await db.collection("quizzes")
      .where("slug", "==", slug)
      .limit(1)
      .get();
      
    if (!existingQuizzes.empty) {
      console.warn(`Warning: A quiz with slug "${slug}" already exists. Appending timestamp...`);
    }

    const finalSlug = existingQuizzes.empty ? slug : `${slug}-${Date.now().toString().slice(-4)}`;

    console.log(`\nGenerating Quiz Slug: ${finalSlug}`);

    // 1. Save Kannada Quiz Document
    const quizKn = {
      locale: "kn",
      slug: finalSlug,
      title: quizData.titleKn.trim(),
      description: quizData.descriptionKn.trim(),
      exam: "General",
      subject: selected.subject,
      difficulty: difficultyArg,
      timeLimitSeconds: 600, // 10 minutes
      status: "published",
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    const knRef = await db.collection("quizzes").add(quizKn);
    console.log(`[Success] Created Kannada Quiz Document! ID: ${knRef.id}`);

    // 2. Save English Quiz Document
    const quizEn = {
      locale: "en",
      slug: finalSlug,
      title: quizData.titleEn.trim(),
      description: quizData.descriptionEn.trim(),
      exam: "General",
      subject: selected.subject,
      difficulty: difficultyArg,
      timeLimitSeconds: 600,
      status: "published",
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    const enRef = await db.collection("quizzes").add(quizEn);
    console.log(`[Success] Created English Quiz Document! ID: ${enRef.id}`);

    // 3. Save Questions for Kannada Quiz
    console.log("Writing Kannada Questions to database...");
    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      const questionDoc = {
        quizId: knRef.id,
        question: q.questionKn.trim(),
        options: q.optionsKn.map(o => o.trim()),
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanationKn.trim(),
        sortOrder: i + 1
      };
      await db.collection("quizQuestions").add(questionDoc);
    }
    console.log(`[Success] Saved 10 questions for Kannada Quiz.`);

    // 4. Save Questions for English Quiz
    console.log("Writing English Questions to database...");
    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      const questionDoc = {
        quizId: enRef.id,
        question: q.questionEn.trim(),
        options: q.optionsEn.map(o => o.trim()),
        correctOptionIndex: q.correctOptionIndex,
        explanation: q.explanationEn.trim(),
        sortOrder: i + 1
      };
      await db.collection("quizQuestions").add(questionDoc);
    }
    console.log(`[Success] Saved 10 questions for English Quiz.`);

    console.log(`\nSuccessfully published bilingual quiz: "${quizData.titleEn}"!`);
    process.exit(0);
  } catch (err) {
    console.error(`Execution failed: ${err.message}`);
    process.exit(1);
  }
}

run();
