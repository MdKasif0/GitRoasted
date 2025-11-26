
import { NextResponse, type NextRequest } from 'next/server';
import { collection, query, orderBy, limit, getDocs, getCountFromServer, startAfter, doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export const revalidate = 0; // Disable caching for this dynamic route

export async function GET(request: NextRequest) {
  try {
    const { firestore } = initializeFirebase();
    const { searchParams } = new URL(request.url);
    const pageSize = 50;
    const lastVisibleId = searchParams.get('lastVisible');

    const leaderboardCollection = collection(firestore, 'leaderboard');

    // Get total count of users
    const countQuery = query(leaderboardCollection);
    const countSnapshot = await getCountFromServer(countQuery);
    const totalUsers = countSnapshot.data().count;

    // Base query
    let q = query(
      leaderboardCollection,
      orderBy('score', 'desc'),
      limit(pageSize)
    );

    // If lastVisibleId is provided, start the query after that document
    if (lastVisibleId) {
      const lastDocSnapshot = await getDoc(doc(leaderboardCollection, lastVisibleId));
      if (lastDocSnapshot.exists()) {
        q = query(q, startAfter(lastDocSnapshot));
      }
    }
    
    const snapshot = await getDocs(q);
    const leaderboard = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to ISO string
            roastedAt: data.roastedAt?.toDate ? data.roastedAt.toDate().toISOString() : new Date().toISOString(),
        }
    });

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    
    return NextResponse.json({
      success: true,
      data: {
        leaderboard,
        totalUsers,
        lastVisibleId: lastDoc ? lastDoc.id : null,
        hasMore: leaderboard.length === pageSize
      },
      timestamp: Date.now()
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
