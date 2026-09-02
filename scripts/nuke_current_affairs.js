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

// Only keep Current Affairs posts if they contain these strictly educational/exam keywords
const EDUCATIONAL_KEYWORDS = [
  'exam', 'recruitment', 'kpsc', 'kea', 'upsc', 'ssc', 'rrb', 'ibps', 'admit card', 'syllabus',
  'isro', 'drdo', 'nasa', 'space', 'satellite', 
  'scheme', 'policy', 'budget', 'mission', 'initiative', 'yojana', 'ಯೋಜನೆ',
  'award', 'prize', 'nobel', 'oscar', 'padma', 'bharat ratna', 'ಪ್ರಶಸ್ತಿ',
  'index', 'rank', 'report',
  'ಪರೀಕ್ಷೆ', 'ನೇಮಕಾತಿ', 'ಫಲಿತಾಂಶ', 'ಪಠ್ಯಕ್ರಮ', 'ಉದ್ಯೋಗ',
  'technology', 'ai', 'science', 'ತಂತ್ರಜ್ಞಾನ', 'ವಿಜ್ಞಾನ'
];

async function deepCleanCurrentAffairs() {
  const snapshot = await db.collection('posts').where('category', '==', 'Current Affairs').get();
  
  let deletedCount = 0;
  let keptCount = 0;
  let batch = db.batch();
  let ops = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    let title = '';
    
    if (typeof data.title === 'string') {
      title = data.title;
    } else if (data.title && typeof data.title === 'object') {
      title = (data.title.en || '') + ' ' + (data.title.kn || '');
    }
    
    title = title.toLowerCase();
    
    let isEducational = false;
    for (const kw of EDUCATIONAL_KEYWORDS) {
      if (title.includes(kw)) {
        isEducational = true;
        break;
      }
    }
    
    // Additional filter: if it contains obvious sports/news keywords despite matching an educational keyword
    const JUNK_KEYWORDS = [
      'fire', 'flood', 'accident', 'murder', 'arrested', 'harassment', 'scam', 'corruption',
      'shreyas iyer', 'real madrid', 'champions league', 'barcelona', 'psg',
      'test win', 'tournament', 'match', 'league', 'world cup'
    ];
    
    for (const jkw of JUNK_KEYWORDS) {
      if (title.includes(jkw)) {
        isEducational = false; // Override to false if it's clearly news/sports
        break;
      }
    }
    
    if (!isEducational) {
      batch.delete(doc.ref);
      deletedCount++;
      ops++;
      console.log(`DELETING: ${title.substring(0, 80)}`);
    } else {
      keptCount++;
      console.log(`KEEPING: ${title.substring(0, 80)}`);
    }

    if (ops >= 400) {
      await batch.commit();
      batch = db.batch();
      ops = 0;
    }
  }

  if (ops > 0) {
    await batch.commit();
  }
  
  console.log(`Done. Deleted ${deletedCount} posts. Kept ${keptCount} posts in Current Affairs.`);
}

deepCleanCurrentAffairs().then(() => process.exit(0)).catch(console.error);
