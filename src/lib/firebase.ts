import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const hasFirebaseConfig = true;

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

export const firebaseApp = hasFirebaseConfig
  ? getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
export const firebaseStorage = firebaseApp ? getStorage(firebaseApp) : null;
