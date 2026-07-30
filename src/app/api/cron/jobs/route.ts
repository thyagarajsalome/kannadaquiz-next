import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import * as admin from 'firebase-admin';
import Parser from 'rss-parser';

// 1. Initialize Firebase Admin securely
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase Admin Init Error:', error);
  }
}

const db = admin.firestore();
const parser = new Parser();

// Configure the RSS Feed for Karnataka and Central Govt Jobs
const JOBS_RSS_URL = 'https://news.google.com/rss/search?q=karnataka+government+jobs+recruitment+OR+KPSC+OR+UPSC+OR+SSC+OR+RRB+OR+India+government+jobs&hl=en-IN&gl=IN&ceid=IN:en';

function generateSlug(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 90);
}

export async function GET(request: Request) {
  // Optional security: Ensure this is called by Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const feed = await parser.parseURL(JOBS_RSS_URL);
    const recentItems = feed.items.slice(0, 3); // Process top 3 news items to save API costs
    
    let addedCount = 0;

    for (const item of recentItems) {
      if (!item.title) continue;
      
      const slug = generateSlug(item.title);
      
      // Check if job already exists
      const existing = await db.collection('jobs').where('slug', '==', slug).get();
      if (!existing.empty) continue;
      
      // We will parse with Gemini
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY missing');
      }

      const prompt = `You are an expert job portal editor.
Analyze this job news: "${item.title}" - "${item.contentSnippet || item.content || ''}"

Return a strict JSON object with:
{
  "kn": {
    "title": "Clean Job Title in Kannada (e.g. KPSC 200 ಹುದ್ದೆಗಳ ನೇಮಕಾತಿ)",
    "body": "A short 2 paragraph summary of the job in Kannada. Include organization, eligibility, and apply link if visible."
  },
  "en": {
    "title": "Clean Job Title in English",
    "body": "A short 2 paragraph summary of the job in English. Include organization, eligibility, and apply link if visible."
  },
  "organization": "The hiring organization name in English (e.g. KPSC, KEA, BMTC)",
  "deadline": "Extract deadline in YYYY-MM-DD format. If unknown, return a date 15 days from today."
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      
      const geminiData = await res.json();
      if (geminiData.candidates && geminiData.candidates[0].content.parts[0].text) {
        const parsed = JSON.parse(geminiData.candidates[0].content.parts[0].text);
        
        // Save Kannada version
        await db.collection('jobs').add({
          locale: 'kn',
          slug: slug,
          title: parsed.kn.title,
          body: parsed.kn.body,
          organization: parsed.organization,
          deadline: parsed.deadline,
          applyUrl: item.link || '',
          status: 'published',
          publishedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Save English version
        await db.collection('jobs').add({
          locale: 'en',
          slug: slug,
          title: parsed.en.title,
          body: parsed.en.body,
          organization: parsed.organization,
          deadline: parsed.deadline,
          applyUrl: item.link || '',
          status: 'published',
          publishedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        addedCount++;
      }
    }

    // ==========================================
    // CLEANUP EXPIRED JOBS (Keep for 2 days after deadline)
    // ==========================================
    
    // Calculate cutoff date: 2 days ago
    const cutoffDateObj = new Date();
    cutoffDateObj.setDate(cutoffDateObj.getDate() - 2);
    const cutoffStr = cutoffDateObj.toISOString().split('T')[0];
    
    // Fetch jobs where deadline < cutoff date (expired more than 2 days ago)
    const snapshot = await db.collection('jobs')
      .where('deadline', '<', cutoffStr)
      .get();
      
    let deletedCount = 0;
    
    if (!snapshot.empty) {
      const batch = db.batch();
      snapshot.forEach(doc => {
        batch.delete(doc.ref);
        deletedCount++;
      });
      await batch.commit();
    }

    // Revalidate paths
    revalidatePath('/kn/jobs');
    revalidatePath('/en/jobs');

    return NextResponse.json({ 
      success: true, 
      jobsAdded: addedCount,
      expiredJobsDeleted: deletedCount,
      cutoffDateUsed: cutoffStr
    });
    
  } catch (error: any) {
    console.error('Jobs Cron Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
