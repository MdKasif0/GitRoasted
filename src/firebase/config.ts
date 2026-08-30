// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSy" + "A".repeat(33),
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gitroasted.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gitroasted",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gitroasted.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "864735895518",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:864735895518:web:e72c70c4e73cba4328074f",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-Q5JDDL4CQM"
};
