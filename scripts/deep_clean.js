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

const CATEGORIES_TO_DELETE = ['Results', 'Agriculture', 'Heritage & Tourism', 'Question Papers', 'Study Materials', 'Movies', 'Sports News'];
const JUNK_KEYWORDS = [
  'sri lanka', 'test series', 'test match', 'bhuvaneshwar', 'shami', 'dhoni', 'kohli', 'rohit sharma', 'bumrah', 'siraj', 'ashwin', 'jadeja',
  'cricket', 'football', 'tennis', 'badminton', 'olympic', 'wrestler', 'sports', 'wimbledon',
  'bcci', 'ipl', 't20', 'odi', 'world cup', 'batter', 'bowler', 'innings', 'wicket', 'match',
  'messi', 'ronaldo', 'fifa', 'soccer', 'hockey',
  'ಕ್ರಿಕೆಟ್', 'ಕ್ರೀಡೆ', 'ಟೆಸ್ಟ್', 'ಬ್ಯಾಟರ್', 'ಬೌಲರ್', 'ಫುಟ್ಬಾಲ್', 'ಹಾಕಿ', 'ಟೂರ್ನಿ', 'ಪಂದ್ಯ', 'ಟಿ20', 'ವಿಶ್ವಕಪ್', 'ಪಾಕಿಸ್ತಾನ', 'ಪಂದ್ಯಾವಳಿ',
  'ರಾಜಕೀಯ', 'ಬಿಜೆಪಿ', 'ಕಾಂಗ್ರೆಸ್', 'ಮೋದಿ', 'ರಾಹುಲ್ ಗಾಂಧಿ', 'ಚುನಾವಣೆ', 'ಮತ', 'ಸಂಸತ್ತು', 'ಶಾಸಕ', 'ಸಂಸದ',
  'ಮುಖ್ಯಮಂತ್ರಿ', 'ಪ್ರಧಾನ ಮಂತ್ರಿ', 'ಸಿದ್ದರಾಮಯ್ಯ', 'ಡಿಕೆ ಶಿವಕುಮಾರ್', 'ಬೊಮ್ಮಾಯಿ', 'ಜೆಡಿಎಸ್', 'ಕುಮಾರಸ್ವಾಮಿ',
  'politics', 'bjp', 'congress', 'modi', 'rahul gandhi', 'election', 'vote', 'parliament', 'mla', 'mp', 
  'chief minister', 'prime minister', 'siddaramaiah', 'dk shivakumar', 'bommai', 'jds', 'kumaraswamy',
  'trinamool', 'aap', 'kejriwal'
];

async function cleanUp() {
  const snapshot = await db.collection('posts').get();
  let deletedCount = 0;
  let updatedCount = 0;
  let batch = db.batch();
  let ops = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const cat = data.category || '';
    
    if (CATEGORIES_TO_DELETE.includes(cat)) {
      batch.delete(doc.ref);
      deletedCount++;
      ops++;
      console.log(`Deleting [CATEGORY]: ${cat} - ${data.title?.en || data.title}`);
    } else if (cat === 'KPSC') {
      batch.update(doc.ref, { category: 'Jobs' });
      updatedCount++;
      ops++;
      console.log(`Updating [KPSC -> Jobs]: ${data.title?.en || data.title}`);
    } else {
      // Check for junk keywords
      let title = '';
      if (typeof data.title === 'string') {
        title = data.title;
      } else if (data.title && typeof data.title === 'object') {
        title = (data.title.en || '') + ' ' + (data.title.kn || '');
      }
      
      title = title.toLowerCase();
      
      let isJunk = false;
      for (const kw of JUNK_KEYWORDS) {
        if (title.includes(kw)) {
          isJunk = true;
          console.log(`Deleting [JUNK KEYWORD]: ${title} (matched: ${kw})`);
          break;
        }
      }
      
      if (isJunk) {
        batch.delete(doc.ref);
        deletedCount++;
        ops++;
      }
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
  
  console.log(`Done. Deleted ${deletedCount} posts. Updated ${updatedCount} posts.`);
}

cleanUp().then(() => process.exit(0)).catch(console.error);
