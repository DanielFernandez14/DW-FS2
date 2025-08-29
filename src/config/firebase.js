// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";        // Firestore (recomendado)
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";           // Realtime Database (opcional)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Evita reinicializar en HMR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Servicios que probablemente uses
export const auth = getAuth(app);
export const db = getFirestore(app);         // Firestore
export const storage = getStorage(app);

// Opcional: Realtime Database
export const rtdb = getDatabase(app);

// Analytics solo en navegadores compatibles y fuera de SSR
export let analytics = null;

if (typeof window !== "undefined") {
  analyticsIsSupported().then((ok) => {
    if (ok) {
      analytics = getAnalytics(app);
    }
  });
}


export default app;
