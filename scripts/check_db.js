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

async function checkPosts() {
  const snapshot = await db.collection('posts').get();
  
  let categoryCounts = {};
  let sampleTitles = {};
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const cat = data.category || 'Uncategorized';
    
    if (!categoryCounts[cat]) {
      categoryCounts[cat] = 0;
      sampleTitles[cat] = [];
    }
    
    categoryCounts[cat]++;
    
    let title = '';
    if (typeof data.title === 'string') {
      title = data.title;
    } else if (data.title && typeof data.title === 'object') {
      title = data.title.en || data.title.kn || '';
    }
    
    if (sampleTitles[cat].length < 5) {
      sampleTitles[cat].push(title);
    }
  }
  
  console.log('--- CATEGORY COUNTS ---');
  for (const [cat, count] of Object.entries(categoryCounts)) {
    console.log(`${cat}: ${count} posts`);
    console.log(`Samples:`);
    sampleTitles[cat].forEach(t => console.log(`  - ${t}`));
    console.log('');
  }
  
  console.log(`Total Posts: ${snapshot.docs.length}`);
}

checkPosts().then(() => process.exit(0)).catch(console.error);
