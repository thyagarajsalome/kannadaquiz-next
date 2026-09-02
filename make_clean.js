const fs = require('fs');
const lines = fs.readFileSync('scripts/sync-news.js', 'utf-8').split('\n');
const initEnd = lines.findIndex(l => l.includes('const FEEDS'));
const initCode = lines.slice(0, initEnd).join('\n');

const cleanupCode = `\
async function deleteNonEducationalPosts() {
  const db = admin.firestore();
  let totalDeleted = 0;

  const categoriesToWipe = ['Sports News', 'Home Design'];

  for (const cat of categoriesToWipe) {
    console.log('Fetching posts for category: ' + cat);
    const snapshot = await db.collection('posts').where('category', '==', cat).get();
    
    if (snapshot.empty) {
      console.log('No posts found for ' + cat);
      continue;
    }

    console.log('Found ' + snapshot.size + ' posts in ' + cat + '. Deleting...');
    
    let batch = db.batch();
    let count = 0;
    for(const doc of snapshot.docs) {
      batch.delete(doc.ref);
      count++;
      if (count === 400) {
        await batch.commit();
        batch = db.batch();
        count = 0;
      }
    }
    if (count > 0) {
      await batch.commit();
    }
    totalDeleted += snapshot.size;
  }

  console.log('Cleanup complete! Total posts deleted: ' + totalDeleted);
}
deleteNonEducationalPosts().then(() => process.exit(0)).catch(console.log);
`;

fs.writeFileSync('scripts/clean.js', initCode + '\n' + cleanupCode);