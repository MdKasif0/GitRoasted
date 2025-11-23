// src/firebase/index.ts
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  firestore = getFirestore(app);

  return { app, auth, firestore };
}

export { initializeFirebase };
export * from './provider';
