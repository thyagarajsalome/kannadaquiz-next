import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';

function getDb() {
  if (!admin.apps.length) {
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
          }),
        });
      }
    } catch (error) {
      console.error('Firebase Admin Init Error:', error);
    }
  }
  return admin.apps.length ? admin.firestore() : null;
}

export async function GET(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: 'Firestore not initialized (missing env config on Vercel)' }, { status: 500 });
  }

  try {
    const snapshot = await db.collection('posts').get();
    let deletedCount = 0;
    
    const batch = db.batch();
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const textToSearch = ((data.title || '') + ' ' + (data.body || '') + ' ' + (data.slug || '')).toLowerCase();
      
      if (textToSearch.includes('pakistan') || textToSearch.includes('?????????')) {
        batch.delete(doc.ref);
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      await batch.commit();
      
      revalidatePath('/');
      revalidatePath('/kn');
      revalidatePath('/en');
      revalidatePath('/kn/category/international');
      revalidatePath('/en/category/international');
    }

    return NextResponse.json({ 
      success: true, 
      message: Successfully found and permanently deleted  articles related to Pakistan.,
      action: 'Please go back to Google Search Console. If any URLs are already indexed, you dont need to do anything. Since the articles are deleted, the server will now return a 404 Not Found. Google will naturally see this and drop them from the index during its next crawl.'
    });
    
  } catch (error: any) {
    console.error('Cleanup Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
