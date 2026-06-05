const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const serviceAccountPath = path.join(__dirname, "..", "service-account.json");
if (!fs.existsSync(serviceAccountPath)) {
  console.error("Error: service-account.json not found in root.");
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const replacements = [
  { search: /ಕೆಇಎ/g, replace: "KEA" },
  { search: /ಎಎಒ/g, replace: "AAO" }, // Match longer first
  { search: /ಎಒ/g, replace: "AO" },   // Match shorter second
  { search: /ಎAO/g, replace: "AAO" }, // Fix any partial replacements from previous run
  { search: /ಕೆಪಿಎಸ್‌ಸಿ/g, replace: "KPSC" },
  { search: /ಕೆ\.ಪಿ\.ಎಸ್\.ಸಿ/g, replace: "KPSC" },
  { search: /ನೀಟ್/g, replace: "NEET" },
  { search: /ನೀತ್/g, replace: "NEET" }
];

async function run() {
  console.log("Fetching all posts in Firestore...");
  const snapshot = await db.collection("posts").get();
  console.log(`Found ${snapshot.size} total posts.`);
  
  let patchCount = 0;
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    let title = data.title || "";
    let excerpt = data.excerpt || "";
    let body = data.body || "";
    let category = data.category || "";
    
    let modified = false;
    
    replacements.forEach(({ search, replace }) => {
      if (search.test(title)) {
        title = title.replace(search, replace);
        modified = true;
      }
      if (search.test(excerpt)) {
        excerpt = excerpt.replace(search, replace);
        modified = true;
      }
      if (search.test(body)) {
        body = body.replace(search, replace);
        modified = true;
      }
      if (search.test(category)) {
        category = category.replace(search, replace);
        modified = true;
      }
    });
    
    if (modified) {
      console.log(`\nPatching post ID: ${doc.id}`);
      console.log(`Original title: ${data.title}`);
      console.log(`New title:      ${title}`);
      
      await db.collection("posts").doc(doc.id).update({
        title,
        excerpt,
        body,
        category,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      patchCount++;
    }
  }
  
  // Also check currentAffairs collection
  console.log("\nFetching current affairs in Firestore...");
  const caSnapshot = await db.collection("currentAffairs").get();
  console.log(`Found ${caSnapshot.size} total current affairs.`);
  
  let caPatchCount = 0;
  for (const doc of caSnapshot.docs) {
    const data = doc.data();
    let headline = data.headline || "";
    let modified = false;
    
    replacements.forEach(({ search, replace }) => {
      if (search.test(headline)) {
        headline = headline.replace(search, replace);
        modified = true;
      }
    });
    
    if (modified) {
      console.log(`Patching current affair ID: ${doc.id} -> ${headline}`);
      await db.collection("currentAffairs").doc(doc.id).update({
        headline,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      caPatchCount++;
    }
  }
  
  console.log(`\nComplete! Patched ${patchCount} posts and ${caPatchCount} current affairs.`);
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
