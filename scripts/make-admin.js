const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

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

const identifier = process.argv[2];

if (!identifier) {
  console.log("Usage: node scripts/make-admin.js <email-or-uid>");
  process.exit(1);
}

async function run() {
  try {
    let userRecord;
    if (identifier.includes("@")) {
      console.log(`Looking up user by email: ${identifier}...`);
      userRecord = await admin.auth().getUserByEmail(identifier);
    } else {
      console.log(`Looking up user by UID: ${identifier}...`);
      userRecord = await admin.auth().getUser(identifier);
    }

    console.log(`User found: ${userRecord.email} (UID: ${userRecord.uid})`);
    console.log("Setting custom user claims: { admin: true }...");

    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    console.log("Success! Custom user claim 'admin' has been set to true.");

    // Create the admins/{uid} document in Firestore for safety and instant compatibility
    const db = admin.firestore();
    console.log(`Writing fallback admin document to Firestore: admins/${userRecord.uid}...`);
    await db.collection("admins").doc(userRecord.uid).set({
      email: userRecord.email,
      role: "owner",
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log("Firestore admin document created successfully.");
    console.log("Note: If using custom claims, please log out and log back in for changes to take effect.");
  } catch (error) {
    console.error("Error setting custom claims:", error.message);
  }
}

run();
