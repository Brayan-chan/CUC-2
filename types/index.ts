import { Timestamp } from 'firebase/firestore';

// User types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Event types
export interface Event {
  id?: string;
  title: string;
  description: string;
  type: 'Danza' | 'Música' | 'Teatro' | 'Arte' | 'Literatura' | 'Otro';
  category: string;
  date: Timestamp;
  location: string;
  participants?: number;
  images: string[];
  videos?: string[];
  views: number;
  likes: number;
  isHighlighted: boolean;
  isFeatured: boolean;
  gradient?: string;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Gallery types
export interface GalleryItem {
  id?: string;
  title: string;
  description?: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  eventId?: string;
  tags: string[];
  year: number;
  views: number;
  likes: number;
  isHighlighted: boolean;
  uploadedBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Timeline types
export interface TimelineEvent {
  id?: string;
  year: number;
  date: string;
  title: string;
  description: string;
  type: 'Danza' | 'Música' | 'Teatro' | 'Arte' | 'Literatura' | 'Otro';
  location: string;
  participants?: number;
  images: string[]; // Array of image URLs
  videos?: string[]; // Array of video URLs
  views: number;
  likes: number;
  isHighlighted: boolean;
  eventId?: string; // Reference to the main event
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Timeline form data
export interface TimelineEventFormData {
  title: string;
  description: string;
  type: 'Danza' | 'Música' | 'Teatro' | 'Arte' | 'Literatura' | 'Otro';
  location: string;
  participants?: number;
  date: string; // YYYY-MM-DD format
  images: string[];
  videos?: string[];
  isHighlighted: boolean;
}

// Statistics types
export interface Statistics {
  totalEvents: number;
  totalGalleryItems: number;
  totalViews: number;
  totalLikes: number;
  totalUsers: number;
  eventsThisYear: number;
  lastUpdated: Timestamp;
}

// Like types
export interface Like {
  id?: string;
  userId: string;
  itemId: string;
  itemType: 'event' | 'gallery' | 'timeline';
  createdAt: Timestamp;
}

// View types
export interface View {
  id?: string;
  userId?: string;
  itemId: string;
  itemType: 'event' | 'gallery' | 'timeline';
  sessionId: string;
  createdAt: Timestamp;
}

// Form types for creating/editing
export interface EventFormData {
  title: string;
  description: string;
  type: Event['type'];
  category: string;
  date: Date;
  location: string;
  participants?: number;
  images: File[];
  isHighlighted: boolean;
  isFeatured: boolean;
  gradient?: string;
}

export interface GalleryFormData {
  title: string;
  description?: string;
  files: File[];
  eventId?: string;
  tags: string[];
  year: number;
  isHighlighted: boolean;
}

export interface TimelineFormData {
  year: number;
  date: string;
  title: string;
  description: string;
  type: TimelineEvent['type'];
  location: string;
  participants?: number;
  isHighlighted: boolean;
  eventId?: string;
}
