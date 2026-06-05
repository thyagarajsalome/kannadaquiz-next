const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Setup local environment parsing from .env.local
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
const slug = "modern-home-design-tips-ai-decorator";

async function run() {
  console.log("Publishing Home Design and Planning evergreen articles...");

  // Delete existing posts with this slug to overwrite
  const existing = await db.collection("posts").where("slug", "==", slug).get();
  if (!existing.empty) {
    console.log(`[Delete] Deleting existing guide for slug: "${slug}" to overwrite...`);
    for (const doc of existing.docs) {
      await db.collection("posts").doc(doc.id).delete();
    }
  }

  // Save Kannada Post
  const postKn = {
    locale: "kn",
    title: "ಆಧುನಿಕ ಮನೆ ವಿನ್ಯಾಸ ಮತ್ತು ಯೋಜನೆ: HDE ಮತ್ತು AI ಹೋಮ್ ಡೆಕೋರೇಟರ್‌ನೊಂದಿಗೆ ಸುಲಭ ಗೃಹ ವಿನ್ಯಾಸ",
    slug: slug,
    excerpt: "ನಿಮ್ಮ ಕನಸಿನ ಮನೆಯನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸುವುದು ಈಗ ಸುಲಭ. ಆಧುನಿಕ ಗೃಹ ವಿನ್ಯಾಸದ ಸಲಹೆಗಳು ಹಾಗೂ HDE ಮತ್ತು AI ಹೋಮ್ ಡೆಕೋರೇಟರ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳ ಬಳಕೆಯನ್ನು ಇಲ್ಲಿ ತಿಳಿಯಿರಿ.",
    body: `ಮನೆಯನ್ನು ನಿರ್ಮಿಸುವುದು ಅಥವಾ ನವೀಕರಿಸುವುದು ಪ್ರತಿಯೊಬ್ಬರ ಜೀವನದ ಪ್ರಮುಖ ಯೋಜನೆಯಾಗಿದೆ. ಆಧುನಿಕ ವಾಸ್ತುಶಿಲ್ಪವು ವಿಶಾಲವಾದ ಸ್ಥಳಾವಕಾಶ, ನೈಸರ್ಗಿಕ ಬೆಳಕು ಮತ್ತು ಉಪಯುಕ್ತ ವಿನ್ಯಾಸಗಳಿಗೆ ಹೆಚ್ಚಿನ ಆದ್ಯತೆ ನೀಡುತ್ತದೆ. ನಿಮ್ಮ ಅವಶ್ಯಕತೆಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ಮನೆಯ ನಕ್ಷೆ ಮತ್ತು ವಿನ್ಯಾಸವನ್ನು ಮೊದಲೇ ಯೋಜಿಸುವುದರಿಂದ ನಿರ್ಮಾಣದ ಸಮಯದಲ್ಲಿ ಉಂಟಾಗುವ ಗೊಂದಲಗಳನ್ನು ತಪ್ಪಿಸಬಹುದು.\n\nಪರಿಪೂರ್ಣ ಗೃಹ ವಿನ್ಯಾಸದ ಕಲ್ಪನೆಗಳಿಗಾಗಿ ಹೋಮ್ ಡಿಸೈನ್ ಇಂಗ್ಲಿಷ್ (HDE) ಅತ್ಯುತ್ತಮ ವೇದಿಕೆಯಾಗಿದೆ. ಇದು ವಿವಿಧ ಗಾತ್ರದ ಮನೆಗಳಿಗೆ ಹೊಂದುವ ನಕ್ಷೆಗಳು, ಒಳಾಂಗಣ ವಿನ್ಯಾಸಗಳು ಮತ್ತು ಮುಂಭಾಗದ ವಿನ್ಯಾಸಗಳ (Elevation) ದೊಡ್ಡ ಸಂಗ್ರಹವನ್ನು ಹೊಂದಿದೆ. ಇದರೊಂದಿಗೆ, ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ AI ಹೋಮ್ ಡೆಕೋರೇಟರ್ (AI Homedecorator) ಉಪಕರಣವು ನಿಮ್ಮ ಕೋಣೆಯ ಬಣ್ಣಗಳು, ಪೀಠೋಪಕರಣಗಳ ಜೋಡಣೆ ಮತ್ತು ಒಟ್ಟಾರೆ ಅಲಂಕಾರವನ್ನು ತಕ್ಷಣವೇ ಕಲ್ಪಿಸಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.\n\nHDE ಮತ್ತು AI ಹೋಮ್ ಡೆಕೋರೇಟರ್ ಬಳಸಿಕೊಂಡು ನಿಮ್ಮ ಕನಸಿನ ಮನೆಯನ್ನು ನೀವು ಇಷ್ಟಪಡುವ ಶೈಲಿಯಲ್ಲಿ ವಿನ್ಯಾಸಗೊಳಿಸಬಹುದು. ಇಂದೇ https://homedesignenglish.com/app ಮೂಲಕ ಅಧಿಕೃತ ಅಪ್ಲಿಕೇಶನ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ ಮತ್ತು ನಿಮ್ಮ ಕನಸಿನ ಗೃಹ ವಿನ್ಯಾಸದ ಪ್ರಯಾಣವನ್ನು ಪ್ರಾರಂಭಿಸಿ.`,
    category: "Home Design",
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
    title: "Modern Home Design and Planning Tips: How HDE and AI Homedecorator Make it Easy",
    slug: slug,
    excerpt: "Planning your dream home can be challenging. Discover essential tips for modern home design and how HDE and AI Homedecorator apps simplify the entire process.",
    body: `Building or renovating a home requires careful planning and creative inspiration. Today, modern architecture focuses on open space, natural lighting, and smart, functional layouts. Whether you are planning a cozy apartment or a spacious villa, having the right design reference is crucial to avoiding expensive mistakes during construction.\n\nFor those looking for premium inspiration, the Home Design English (HDE) platform is a fantastic resource. It offers a wide array of design ideas, floor plans, and layout styles tailored to various home sizes. Additionally, the AI Homedecorator tool takes design a step further by using artificial intelligence to visualize room concepts, color schemes, and furniture arrangements instantly.\n\nUsing these tools, you can experiment with different aesthetics, from contemporary minimalist to classic traditional, before talking to a contractor. Best of all, you can access these features on the go. Start planning your dream space today by downloading the app at https://homedesignenglish.com/app and transform your home design ideas into reality.`,
    category: "Home Design",
    status: "published",
    publishedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    sourceName: "KannadaQuiz Editorial"
  };
  const refEn = await db.collection("posts").add(postEn);
  console.log(`  -> Published English! (ID: ${refEn.id})`);

  console.log("Publishing complete!");
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
