import 'server-only';

import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

function readServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is missing.');
  }

  try {
    return JSON.parse(raw);
  } catch {
    // JSON.parse errors quote the input, which here is a private key. Never rethrow them.
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not valid JSON.');
  }
}

// Initialized on first use so that builds don't need the credential.
function getAdminApp(): App {
  return getApps()[0] ?? initializeApp({ credential: cert(readServiceAccount()) });
}

export function getAdminFirestore(): Firestore {
  return getFirestore(getAdminApp());
}
