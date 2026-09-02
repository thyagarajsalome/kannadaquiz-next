const fs = require('fs');
const lines = fs.readFileSync('scripts/sync-news.js', 'utf-8').split('\n');
const initEnd = lines.findIndex(l => l.includes('const FEEDS'));
const initCode = lines.slice(0, initEnd).join('\n');

const checkCode = `
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
`;

fs.writeFileSync('scripts/check.js', initCode + '\n' + checkCode);