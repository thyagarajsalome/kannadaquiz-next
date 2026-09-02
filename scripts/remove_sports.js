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

const SPORTS_KEYWORDS = [
  'cricket', 'bcci', 'ipl', 't20', 'odi', 'world cup', 'test match', 'batter', 'bowler', 'innings', 'wicket',
  'football', 'messi', 'ronaldo', 'fifa', 'soccer',
  'hockey', 'tennis', 'badminton', 'olympic', 'wrestler', 'sports', 'wimbledon',
  'ಕ್ರಿಕೆಟ್', 'ಕ್ರೀಡೆ', 'ಟೆಸ್ಟ್', 'ಬ್ಯಾಟರ್', 'ಬೌಲರ್', 'ಫುಟ್ಬಾಲ್', 'ಹಾಕಿ', 'ಟೂರ್ನಿ', 'ಪಂದ್ಯ', 'ಟಿ20', 'ವಿಶ್ವಕಪ್', 'ಪಾಕಿಸ್ತಾನ', 'ಪಂದ್ಯಾವಳಿ'
];

async function removeSports() {
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
    
    let isSports = false;
    for (const kw of SPORTS_KEYWORDS) {
      if (title.includes(kw)) {
        isSports = true;
        console.log(`Deleting [SPORTS]: ${title} (matched: ${kw})`);
        break;
      }
    }

    if (isSports) {
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
  
  console.log(`Done. Deleted ${deletedCount} sports posts.`);
}

removeSports().then(() => process.exit(0)).catch(console.error);
