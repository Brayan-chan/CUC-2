import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  increment,
  writeBatch,
  onSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Event, GalleryItem, TimelineEvent, User, Like, View, Statistics } from '@/types';

// Collections
export const COLLECTIONS = {
  EVENTS: 'events',
  GALLERY: 'gallery',
  TIMELINE: 'timeline',
  USERS: 'users',
  LIKES: 'likes',
  VIEWS: 'views',
  STATISTICS: 'statistics',
} as const;

// Events Service
export class EventsService {
  static async create(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.EVENTS), {
      ...eventData,
      views: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  static async getAll(limitCount = 50): Promise<Event[]> {
    const q = query(
      collection(db, COLLECTIONS.EVENTS),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
  }

  static async getById(id: string): Promise<Event | null> {
    const docRef = doc(db, COLLECTIONS.EVENTS, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Event;
    }
    return null;
  }

  static async getFeatured(): Promise<Event[]> {
    // Simplified query to avoid index requirement - get all events and filter in memory
    const q = query(
      collection(db, COLLECTIONS.EVENTS),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    const allEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    
    // Filter for featured events in memory
    return allEvents.filter(event => event.isFeatured).slice(0, 10);
  }

  static async getByCategory(category: string): Promise<Event[]> {
    const q = query(
      collection(db, COLLECTIONS.EVENTS),
      where('category', '==', category),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
  }

  static async update(id: string, data: Partial<Event>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EVENTS, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EVENTS, id);
    await deleteDoc(docRef);
  }

  static async incrementViews(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EVENTS, id);
    await updateDoc(docRef, {
      views: increment(1),
    });
  }

  static async incrementLikes(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EVENTS, id);
    await updateDoc(docRef, {
      likes: increment(1),
    });
  }

  static async decrementLikes(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.EVENTS, id);
    await updateDoc(docRef, {
      likes: increment(-1),
    });
  }

  static subscribeToEvents(
    callback: (events: Event[]) => void,
    limitCount = 50
  ): () => void {
    const q = query(
      collection(db, COLLECTIONS.EVENTS),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    
    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      callback(events);
    });
  }
}

// Gallery Service
export class GalleryService {
  static async create(galleryData: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTIONS.GALLERY), {
      ...galleryData,
      views: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  static async getAll(limitCount = 50): Promise<GalleryItem[]> {
    const q = query(
      collection(db, COLLECTIONS.GALLERY),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
  }

  static async getByYear(year: number): Promise<GalleryItem[]> {
    const q = query(
      collection(db, COLLECTIONS.GALLERY),
      where('year', '==', year),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
  }

  static async getByEventId(eventId: string): Promise<GalleryItem[]> {
    const q = query(
      collection(db, COLLECTIONS.GALLERY),
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
  }

  static async getHighlighted(): Promise<GalleryItem[]> {
    // Simplified query to avoid index requirement
    const q = query(
      collection(db, COLLECTIONS.GALLERY),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    const allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
    
    // Filter for highlighted items in memory
    return allItems.filter(item => item.isHighlighted).slice(0, 20);
  }

  static async update(id: string, data: Partial<GalleryItem>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.GALLERY, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.GALLERY, id);
    await deleteDoc(docRef);
  }

  static async incrementViews(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.GALLERY, id);
    await updateDoc(docRef, {
      views: increment(1),
    });
  }

  static async incrementLikes(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.GALLERY, id);
    await updateDoc(docRef, {
      likes: increment(1),
    });
  }

  static subscribeToGallery(
    callback: (items: GalleryItem[]) => void,
    limitCount = 50
  ): () => void {
    const q = query(
      collection(db, COLLECTIONS.GALLERY),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
      callback(items);
    });
  }
}

// Timeline Service
export class TimelineService {
  static async create(timelineData: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'year'>): Promise<string> {
    const now = Timestamp.now();
    const year = new Date(timelineData.date).getFullYear();
    
    const docRef = await addDoc(collection(db, COLLECTIONS.TIMELINE), {
      ...timelineData,
      year,
      views: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  }

  static async getAll(limitCount = 100): Promise<TimelineEvent[]> {
    // Simplificamos la consulta eliminando orderBy múltiples
    const q = query(
      collection(db, COLLECTIONS.TIMELINE),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as TimelineEvent));
    
    // Ordenamos en el cliente por año y fecha descendente
    return events.sort((a, b) => {
      if (a.year !== b.year) {
        return b.year - a.year;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  static async getByYear(year: number): Promise<TimelineEvent[]> {
    // Simplificamos la consulta para evitar índices complejos
    const q = query(
      collection(db, COLLECTIONS.TIMELINE),
      where('year', '==', year)
    );
    const snapshot = await getDocs(q);
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimelineEvent));
    
    // Ordenamos en el cliente para evitar el índice compuesto
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async getHighlighted(): Promise<TimelineEvent[]> {
    // Simplificamos eliminando orderBy para evitar índices
    const q = query(
      collection(db, COLLECTIONS.TIMELINE),
      where('isHighlighted', '==', true),
      limit(20)
    );
    const snapshot = await getDocs(q);
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimelineEvent));
    
    // Ordenamos en el cliente
    return events.sort((a, b) => b.year - a.year);
  }

  static async getAllYears(): Promise<number[]> {
    const snapshot = await getDocs(collection(db, COLLECTIONS.TIMELINE));
    const years = new Set<number>();
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      years.add(data.year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }

  static async update(id: string, data: Partial<TimelineEvent>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TIMELINE, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TIMELINE, id);
    await deleteDoc(docRef);
  }

  static subscribeToTimeline(
    year: number,
    callback: (events: TimelineEvent[]) => void
  ): () => void {
    // Simplificamos la consulta para evitar índices complejos
    const q = query(
      collection(db, COLLECTIONS.TIMELINE),
      where('year', '==', year)
    );
    
    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimelineEvent));
      // Ordenamos en el cliente
      const sortedEvents = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      callback(sortedEvents);
    });
  }

  static subscribeToYear(year: number, callback: (events: TimelineEvent[]) => void): () => void {
    return this.subscribeToTimeline(year, callback);
  }

  static subscribeToAll(callback: (events: TimelineEvent[]) => void): () => void {
    // Simplificamos eliminando ordenamiento múltiple
    const q = query(
      collection(db, COLLECTIONS.TIMELINE),
      limit(100)
    );
    
    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as TimelineEvent));
      
      // Ordenamos en el cliente
      const sortedEvents = events.sort((a, b) => {
        if (a.year !== b.year) {
          return b.year - a.year;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      callback(sortedEvents);
    });
  }

  static async incrementViews(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TIMELINE, id);
    await updateDoc(docRef, {
      views: increment(1),
    });
  }

  static async incrementLikes(id: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.TIMELINE, id);
    await updateDoc(docRef, {
      likes: increment(1),
    });
  }
}

// Likes Service
export class LikesService {
  static async addLike(userId: string, itemId: string, itemType: 'event' | 'gallery' | 'timeline'): Promise<void> {
    const batch = writeBatch(db);
    
    // Add like document
    const likeRef = doc(collection(db, COLLECTIONS.LIKES));
    batch.set(likeRef, {
      userId,
      itemId,
      itemType,
      createdAt: Timestamp.now(),
    });

    // Increment likes count in the item
    const itemRef = doc(db, itemType === 'event' ? COLLECTIONS.EVENTS : 
                           itemType === 'gallery' ? COLLECTIONS.GALLERY : 
                           COLLECTIONS.TIMELINE, itemId);
    batch.update(itemRef, {
      likes: increment(1),
    });

    await batch.commit();
  }

  static async removeLike(userId: string, itemId: string, itemType: 'event' | 'gallery' | 'timeline'): Promise<void> {
    const batch = writeBatch(db);
    
    // Find and remove like document
    const q = query(
      collection(db, COLLECTIONS.LIKES),
      where('userId', '==', userId),
      where('itemId', '==', itemId),
      where('itemType', '==', itemType)
    );
    const snapshot = await getDocs(q);
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Decrement likes count in the item
    const itemRef = doc(db, itemType === 'event' ? COLLECTIONS.EVENTS : 
                           itemType === 'gallery' ? COLLECTIONS.GALLERY : 
                           COLLECTIONS.TIMELINE, itemId);
    batch.update(itemRef, {
      likes: increment(-1),
    });

    await batch.commit();
  }

  static async isLiked(userId: string, itemId: string, itemType: 'event' | 'gallery' | 'timeline'): Promise<boolean> {
    const q = query(
      collection(db, COLLECTIONS.LIKES),
      where('userId', '==', userId),
      where('itemId', '==', itemId),
      where('itemType', '==', itemType)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  static async getUserLikes(userId: string): Promise<Like[]> {
    // Simplified query to avoid index requirement
    const q = query(
      collection(db, COLLECTIONS.LIKES),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const likes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Like));
    
    // Sort in memory by createdAt desc
    return likes.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
  }
}

// Views Service
export class ViewsService {
  static async addView(itemId: string, itemType: 'event' | 'gallery' | 'timeline', userId?: string): Promise<void> {
    const sessionId = typeof window !== 'undefined' ? 
      sessionStorage.getItem('sessionId') || Math.random().toString(36) : 
      Math.random().toString(36);
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('sessionId', sessionId);
    }

    // Check if view already exists for this session
    const q = query(
      collection(db, COLLECTIONS.VIEWS),
      where('itemId', '==', itemId),
      where('itemType', '==', itemType),
      where('sessionId', '==', sessionId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      const batch = writeBatch(db);
      
      // Add view document
      const viewRef = doc(collection(db, COLLECTIONS.VIEWS));
      batch.set(viewRef, {
        userId,
        itemId,
        itemType,
        sessionId,
        createdAt: Timestamp.now(),
      });

      // Increment views count in the item
      const itemRef = doc(db, itemType === 'event' ? COLLECTIONS.EVENTS : 
                             itemType === 'gallery' ? COLLECTIONS.GALLERY : 
                             COLLECTIONS.TIMELINE, itemId);
      batch.update(itemRef, {
        views: increment(1),
      });

      await batch.commit();
    }
  }
}

// Users Service
export class UsersService {
  static async create(userId: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const now = Timestamp.now();
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: now,
      updatedAt: now,
    });
  }

  static async getById(userId: string): Promise<User | null> {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  }

  static async update(userId: string, data: Partial<User>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }
}

// Statistics Service
export class StatisticsService {
  static async getStatistics(): Promise<Statistics | null> {
    const docRef = doc(db, COLLECTIONS.STATISTICS, 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Statistics;
    }
    return null;
  }

  static async updateStatistics(): Promise<void> {
    const batch = writeBatch(db);
    
    // Get counts from all collections
    const [eventsSnapshot, gallerySnapshot, usersSnapshot] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.EVENTS)),
      getDocs(collection(db, COLLECTIONS.GALLERY)),
      getDocs(collection(db, COLLECTIONS.USERS)),
    ]);

    // Calculate totals
    let totalViews = 0;
    let totalLikes = 0;
    let eventsThisYear = 0;
    const currentYear = new Date().getFullYear();

    eventsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      totalViews += data.views || 0;
      totalLikes += data.likes || 0;
      if (data.date?.toDate?.()?.getFullYear() === currentYear) {
        eventsThisYear++;
      }
    });

    gallerySnapshot.docs.forEach(doc => {
      const data = doc.data();
      totalViews += data.views || 0;
      totalLikes += data.likes || 0;
    });

    const statsRef = doc(db, COLLECTIONS.STATISTICS, 'general');
    batch.set(statsRef, {
      totalEvents: eventsSnapshot.size,
      totalGalleryItems: gallerySnapshot.size,
      totalUsers: usersSnapshot.size,
      totalViews,
      totalLikes,
      eventsThisYear,
      lastUpdated: Timestamp.now(),
    });

    await batch.commit();
  }
}
