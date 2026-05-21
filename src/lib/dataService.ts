import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { mockProjects, mockFlashcards, type ConstituencyProject, type CivicFlashcard } from './mockData';

// ── Constituency Projects ────────────────────────────────────
export async function getProjects(): Promise<ConstituencyProject[]> {
  try {
    const q = query(collection(db, 'projects'), orderBy('progressPercent', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.info('[dataService] Firestore "projects" is empty — using mock data.');
      return mockProjects;
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConstituencyProject));
  } catch (err) {
    console.warn('[dataService] Firestore unavailable, falling back to mock projects.', err);
    return mockProjects;
  }
}

// ── Civic Flashcards ─────────────────────────────────────────
export async function getFlashcards(): Promise<CivicFlashcard[]> {
  try {
    const snapshot = await getDocs(collection(db, 'flashcards'));
    if (snapshot.empty) {
      console.info('[dataService] Firestore "flashcards" is empty — using mock data.');
      return mockFlashcards;
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CivicFlashcard));
  } catch (err) {
    console.warn('[dataService] Firestore unavailable, falling back to mock flashcards.', err);
    return mockFlashcards;
  }
}

export type { ConstituencyProject, CivicFlashcard };
