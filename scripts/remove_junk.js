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

const JUNK_KEYWORDS = [
  // Politics - EN
  'politics', 'bjp', 'congress', 'modi', 'rahul gandhi', 'election', 'vote', 'parliament', 'mla', 'mp', 
  'chief minister', 'prime minister', 'siddaramaiah', 'dk shivakumar', 'bommai', 'jds', 'kumaraswamy',
  'trinamool', 'aap', 'kejriwal', 'minister', 'government forms', 'political', 'brics', 'khamenei', 
  // Politics - KN
  'ರಾಜಕೀಯ', 'ಬಿಜೆಪಿ', 'ಕಾಂಗ್ರೆಸ್', 'ಮೋದಿ', 'ರಾಹುಲ್ ಗಾಂಧಿ', 'ಚುನಾವಣೆ', 'ಮತ', 'ಸಂಸತ್ತು', 'ಶಾಸಕ', 'ಸಂಸದ',
  'ಮುಖ್ಯಮಂತ್ರಿ', 'ಪ್ರಧಾನ ಮಂತ್ರಿ', 'ಸಿದ್ದರಾಮಯ್ಯ', 'ಡಿಕೆ ಶಿವಕುಮಾರ್', 'ಬೊಮ್ಮಾಯಿ', 'ಜೆಡಿಎಸ್', 'ಕುಮಾರಸ್ವಾಮಿ',
  'ಸಚಿವ', 'ಸರ್ಕಾರ',
  
  // Extra Sports just in case
  'sports', 'cricket', 'football', 'tennis', 'ಹಾಕಿ', 'ಕ್ರಿಕೆಟ್', 'ಫುಟ್ಬಾಲ್', 'ಪಂದ್ಯ',
  'bcci', 'icc', 'world cup'
];

async function removeJunk() {
  const snapshot = await db.collection('posts').get();
  let deletedCount = 0;
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
    
    // Check source category as well
    const sourceCategory = (data.sourceCategory || '').toLowerCase();
    
    let isJunk = false;
    if (sourceCategory.includes('sports') || sourceCategory.includes('entertainment') || sourceCategory.includes('politics') || sourceCategory.includes('movies')) {
       isJunk = true;
       console.log(`Deleting [CATEGORY JUNK]: ${title} (sourceCategory: ${sourceCategory})`);
    } else {
      for (const kw of JUNK_KEYWORDS) {
        if (title.includes(kw)) {
          isJunk = true;
          console.log(`Deleting [JUNK KEYWORD]: ${title} (matched: ${kw})`);
          break;
        }
      }
    }

    if (isJunk) {
      batch.delete(doc.ref);
      deletedCount++;
      ops++;
      
      if (ops >= 400) {
        await batch.commit();
        batch = db.batch();
        ops = 0;
      }
    }
  }

  if (ops > 0) {
    await batch.commit();
  }
  
  console.log(`Done. Deleted ${deletedCount} junk posts.`);
}

removeJunk().then(() => process.exit(0)).catch(console.error);
