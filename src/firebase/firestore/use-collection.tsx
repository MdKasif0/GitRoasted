// src/firebase/firestore/use-collection.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Query, DocumentData, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { onSnapshot as firebaseOnSnapshot } from 'firebase/firestore';

interface UseCollectionOptions {
  listen?: boolean;
}

export function useCollection<T extends DocumentData>(
  query: Query<T> | null,
  options: UseCollectionOptions = { listen: true }
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setData([]);
      setLoading(false);
      return;
    }

    const handleSnapshot = (snapshot: QuerySnapshot<T>) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
      setData(docs);
      setLoading(false);
    };

    const handleError = (error: Error) => {
      console.error("Error fetching collection: ", error);
      setLoading(false);
    };

    if (options.listen) {
      const unsubscribe = firebaseOnSnapshot(query, handleSnapshot, handleError);
      return () => unsubscribe();
    } else {
        // Just get the data once
        const getDocuments = async () => {
            try {
                const { getDocs } = await import('firebase/firestore');
                const snapshot = await getDocs(query);
                handleSnapshot(snapshot as QuerySnapshot<T>);
            } catch (error) {
                handleError(error as Error);
            }
        };
        getDocuments();
    }

  }, [query, options.listen]);

  return { data, loading };
}
