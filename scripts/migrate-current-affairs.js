const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccountPath = path.join(__dirname, "..", "service-account.json");
if (!fs.existsSync(serviceAccountPath)) {
  console.error("service-account.json not found!");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function run() {
  console.log("Starting migration of Current Affairs from 'posts' to 'currentAffairs'...");
  
  // 1. Get all current affairs posts
  const snapshot = await db.collection("posts")
    .where("category", "==", "Current Affairs")
    .get();
    
  console.log(`Found ${snapshot.size} posts in 'posts' with category 'Current Affairs'.`);
  
  // 2. Get existing headlines in currentAffairs to avoid duplicates
  const caSnapshot = await db.collection("currentAffairs").get();
  const existingHeadlines = new Set();
  caSnapshot.docs.forEach(doc => {
    const data = doc.data();
    if (data.headline) {
      existingHeadlines.add(`${data.locale || ""}_${data.headline.trim()}`);
    }
  });
  console.log(`Already have ${existingHeadlines.size} items in 'currentAffairs'.`);

  let migratedCount = 0;
  for (const doc of snapshot.docs) {
    const post = doc.data();
    const headline = post.title ? post.title.trim() : "";
    const locale = post.locale || "";
    
    if (!headline || !locale) continue;
    
    const key = `${locale}_${headline}`;
    if (existingHeadlines.has(key)) {
      console.log(`[Skip] Already exists in currentAffairs: "${headline}"`);
      continue;
    }
    
    console.log(`[Migrating] "${headline}" (${locale})...`);
    
    const newCA = {
      locale: locale,
      headline: headline,
      status: "published",
      publishedAt: post.publishedAt || admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: post.updatedAt || admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection("currentAffairs").add(newCA);
    console.log(`  -> Created currentAffairs document ID: ${docRef.id}`);
    migratedCount++;
  }
  
  console.log(`Migration complete! Successfully migrated ${migratedCount} items.`);
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
