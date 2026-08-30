'use client';

import { useEffect } from 'react';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { firebaseConfig } from '@/firebase/config';

export function FirebaseAnalytics() {
  useEffect(() => {
    // Skip if we are using a dummy API key to prevent network errors
    if (firebaseConfig.apiKey.includes('AIzaSyA')) {
      console.warn('Firebase Analytics disabled: Missing valid API key');
      return;
    }

    // Initialize Firebase
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

    // Check if analytics is supported
    isSupported().then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    });
  }, []);

  return null;
}
