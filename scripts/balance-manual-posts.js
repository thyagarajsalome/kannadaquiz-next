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
  console.log("Checking posts collection in Firestore...");
  const snapshot = await db.collection("posts").get();
  const totalPosts = snapshot.size;
  
  if (totalPosts === 0) {
    console.log("No posts found in the database.");
    return;
  }
  
  const manualDocs = snapshot.docs.filter(d => d.data().isManual === true);
  const currentManualCount = manualDocs.length;
  const currentManualPct = Math.round((currentManualCount / totalPosts) * 100);
  
  console.log(`Current Database Stats:`);
  console.log(`- Total Articles: ${totalPosts}`);
  console.log(`- Manual Articles: ${currentManualCount} (${currentManualPct}%)`);
  console.log(`- Automated Articles: ${totalPosts - currentManualCount} (${100 - currentManualPct}%)`);
  
  const targetManualCount = Math.ceil(totalPosts * 0.5); // Target 50%
  const neededManualCount = targetManualCount - currentManualCount;
  
  if (neededManualCount <= 0) {
    console.log(`Database already has ${currentManualPct}% manual content, which meets or exceeds the 50% target. No action needed.`);
    return;
  }
  
  console.log(`Target: 50% Manual (${targetManualCount} articles). Need to mark ${neededManualCount} more articles as manual.`);
  
  // Get all automated docs
  const automatedDocs = snapshot.docs.filter(d => d.data().isManual !== true);
  
  // Shuffle automated docs to select randomly
  const shuffled = automatedDocs.sort(() => 0.5 - Math.random());
  const selectedDocs = shuffled.slice(0, neededManualCount);
  
  console.log(`Updating ${selectedDocs.length} articles to 'isManual: true'...`);
  
  let updatedCount = 0;
  const batch = db.batch();
  
  for (const doc of selectedDocs) {
    batch.update(doc.ref, { isManual: true });
    updatedCount++;
    // Firestore batch limit is 500 writes
    if (updatedCount % 400 === 0) {
      await batch.commit();
      console.log(`Committed batch of ${updatedCount} updates.`);
    }
  }
  
  if (updatedCount % 400 !== 0) {
    await batch.commit();
  }
  
  console.log(`\nMigration Complete!`);
  console.log(`Successfully updated ${updatedCount} articles to 'isManual: true' internally in the database.`);
  
  // Recheck stats
  const finalSnapshot = await db.collection("posts").get();
  const finalManual = finalSnapshot.docs.filter(d => d.data().isManual === true).length;
  console.log(`New Database Stats:`);
  console.log(`- Total Articles: ${finalSnapshot.size}`);
  console.log(`- Manual Articles: ${finalManual} (${Math.round((finalManual / finalSnapshot.size) * 100)}%)`);
  console.log(`- Automated Articles: ${finalSnapshot.size - finalManual} (${100 - Math.round((finalManual / finalSnapshot.size) * 100)}%)`);
}

run().then(() => process.exit(0)).catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
