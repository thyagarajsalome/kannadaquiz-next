import { getApps, initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

function getEnv(val: string | undefined, fallback: string): string {
  if (!val || val === "undefined" || val === "null" || val.trim() === "") {
    return fallback;
  }
  return val;
}

const firebaseConfig = {
  apiKey: getEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, "AIzaSyC07b-JG7h-lkTFi4m96fB_He-LeBmus7A"),
  authDomain: getEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, "kannadaquiz-fc21b.firebaseapp.com"),
  projectId: getEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, "kannadaquiz-fc21b"),
  storageBucket: getEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, "kannadaquiz-fc21b.firebasestorage.app"),
  messagingSenderId: getEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, "270133744435"),
  appId: getEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, "1:270133744435:web:6a9e1b06eab5bc5bd6e446"),
};

export const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

try {
  if (hasFirebaseConfig) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
} catch (err) {
  console.warn("Firebase initialization skipped or failed, using local zero-cost fallbacks:", err);
}

export const firebaseApp = app;
export const firebaseAuth = auth;
export const firestore = db;
export const firebaseStorage = storage;
