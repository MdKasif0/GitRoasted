// src/firebase/provider.tsx
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '.';

type FirebaseContextValue = {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const firebase = useMemo(() => {
    const { app, firestore, auth } = initializeFirebase();
    return { app, firestore, auth };
  }, []);

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().app;
}

export function useFirestore() {
  return useFirebase().firestore;
}

export function useAuth() {
  return useFirebase().auth;
}