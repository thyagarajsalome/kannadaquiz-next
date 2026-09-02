const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");

if (!require('fs').existsSync(serviceAccountPath)) {
  console.error("Missing serviceAccountKey.json");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();

async function deleteNonEducationalPosts() {
  console.log("Starting cleanup of non-educational posts...");
  let totalDeleted = 0;

  const categoriesToWipe = ['karnataka', 'national', 'international', 'movies', 'sports', 'bangalore'];

  for (const cat of categoriesToWipe) {
    console.log(`Fetching posts for category: ${cat}`);
    const snapshot = await db.collection("posts").where("category", "==", cat).get();
    
    if (snapshot.empty) {
      console.log(`No posts found for ${cat}.`);
      continue;
    }

    console.log(`Found ${snapshot.size} posts in ${cat}. Deleting...`);
    
    let batch = db.batch();
    let count = 0;
    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
      count++;
      if (count === 500) {
        await batch.commit();
        batch = db.batch();
        count = 0;
      }
    }
    if (count > 0) {
      await batch.commit();
    }
    totalDeleted += snapshot.size;
    console.log(`Deleted ${snapshot.size} posts from ${cat}.`);
  }


  // Also delete any posts with isNews == true that aren't in the above categories just in case (except educational ones)
  console.log(`Cleanup complete! Total posts deleted: ${totalDeleted}`);
}

deleteNonEducationalPosts().catch(console.error).finally(() => process.exit(0));