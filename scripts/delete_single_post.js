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

async function deletePost(slug) {
  const snapshot = await db.collection('posts').where('slug', '==', slug).get();
  
  if (snapshot.empty) {
    console.log(`No post found with slug: ${slug}`);
    return;
  }
  
  for (const doc of snapshot.docs) {
    await doc.ref.delete();
    console.log(`Deleted post: ${slug} (ID: ${doc.id})`);
  }
}

deletePost('karnataka-opposition-leader-alleges-rs-800-crore-corruption-in-kpsc-recruitment---the-news')
  .then(() => process.exit(0))
  .catch(console.error);
