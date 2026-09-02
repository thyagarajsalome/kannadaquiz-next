const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join('D:\\My projects\\kannaquiz-next', 'service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkDb() {
  const snapshot = await db.collection('posts').get();
  const counts = {};
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const cat = data.category || 'Unknown';
    counts[cat] = (counts[cat] || 0) + 1;
  }
  
  console.log("Categories in DB:");
  console.table(counts);
}

checkDb().then(() => process.exit(0)).catch(console.error);
