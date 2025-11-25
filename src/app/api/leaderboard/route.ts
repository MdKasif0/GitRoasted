
import { NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Cache this route for 5 minutes
export const revalidate = 300;

export async function GET() {
  try {
    const { firestore } = initializeFirebase();

    const q = query(
      collection(firestore, 'leaderboard'),
      orderBy('score', 'desc'),
      limit(100)
    );
    
    const snapshot = await getDocs(q);
    const leaderboard = snapshot.docs.map(doc => {
        const data = doc.data();
        // Ensure timestamp is serializable
        const roastedAt = data.roastedAt instanceof Timestamp 
            ? data.roastedAt.toDate().toISOString() 
            : new Date().toISOString();

        return {
            id: doc.id,
            ...data,
            roastedAt,
        }
    });
    
    return NextResponse.json({
      success: true,
      data: leaderboard,
      timestamp: Date.now()
    }, {
      headers: {
        'Cache-Control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate * 2}`
      }
    });
  } catch (error: any) {
    console.error("API Route Error: Failed to fetch leaderboard", error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch leaderboard',
      details: error.message,
    }, { status: 500 });
  }
}
