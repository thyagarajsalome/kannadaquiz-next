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


async function getCategories() {
  const db = admin.firestore();
  const snapshot = await db.collection('posts').get();
  const cates = new Set();
  snapshot.docs.forEach(doc => {
    cates.add(doc.data().category);
  });
  console.log(Array.from(cates).join(', '));
}
getCategories().then(() => process.exit(0)).catch(console.error);
