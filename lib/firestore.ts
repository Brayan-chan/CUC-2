import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface EventData {
  id?: string
  title: string
  description: string
  date: string
  location: string
  type: string
  participants: number
  tags: string[]
  images: Array<{
    url: string
    publicId: string
    format: string
  }>
  videos: Array<{
    url: string
    publicId: string
    format: string
    duration?: number
  }>
  documents: Array<{
    url: string
    publicId: string
    format: string
    name: string
  }>
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
  status: "draft" | "pending" | "approved" | "rejected"
  featured: boolean
  views: number
  likes: number
  year: string
  gradient?: string
}

export interface UserData {
  id: string
  email: string
  displayName: string
  role: "admin" | "editor" | "contributor"
  institution?: string
  matricula?: string
  createdAt: Timestamp
  lastLogin: Timestamp
}

// Events Collection
export const eventsCollection = collection(db, "events")
export const timelineEventsCollection = collection(db, "timelineEvents")
export const usersCollection = collection(db, "users")

// Create Event
export const createEvent = async (eventData: Omit<EventData, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const docRef = await addDoc(eventsCollection, {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

// Update Event
export const updateEvent = async (eventId: string, eventData: Partial<EventData>): Promise<void> => {
  try {
    const eventRef = doc(eventsCollection, eventId)
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}

// Delete Event
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(eventsCollection, eventId)
    await deleteDoc(eventRef)
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}

// Get Events with Real-time Updates
export const subscribeToEvents = (callback: (events: EventData[]) => void) => {
  const q = query(eventsCollection, orderBy("createdAt", "desc"))

  return onSnapshot(q, (snapshot) => {
    const events: EventData[] = []
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as EventData)
    })
    callback(events)
  })
}

// Get Timeline Events with Real-time Updates
export const subscribeToTimelineEvents = (callback: (events: EventData[]) => void) => {
  const q = query(timelineEventsCollection, where("status", "==", "approved"), orderBy("date", "desc"))

  return onSnapshot(q, (snapshot) => {
    const events: EventData[] = []
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as EventData)
    })
    callback(events)
  })
}

// Get Events by Status
export const getEventsByStatus = async (status: EventData["status"]): Promise<EventData[]> => {
  try {
    const q = query(eventsCollection, where("status", "==", status), orderBy("createdAt", "desc"))
    const snapshot = await getDocs(q)
    const events: EventData[] = []
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as EventData)
    })
    return events
  } catch (error) {
    console.error("Error getting events by status:", error)
    throw error
  }
}

// Add Event to Timeline
export const addEventToTimeline = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(eventsCollection, eventId)
    const eventSnap = await getDoc(eventRef)

    if (eventSnap.exists()) {
      const eventData = eventSnap.data() as EventData
      await addDoc(timelineEventsCollection, {
        ...eventData,
        originalEventId: eventId,
        addedToTimelineAt: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error("Error adding event to timeline:", error)
    throw error
  }
}

// Create or Update User
export const createOrUpdateUser = async (userData: Omit<UserData, "createdAt">): Promise<void> => {
  try {
    const userRef = doc(usersCollection, userData.id)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      await updateDoc(userRef, {
        ...userData,
        lastLogin: serverTimestamp(),
      })
    } else {
      await updateDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error("Error creating/updating user:", error)
    throw error
  }
}

// Get User Data
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userRef = doc(usersCollection, userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as UserData
    }
    return null
  } catch (error) {
    console.error("Error getting user data:", error)
    throw error
  }
}

// Update Event Views
export const incrementEventViews = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(eventsCollection, eventId)
    const eventSnap = await getDoc(eventRef)

    if (eventSnap.exists()) {
      const currentViews = eventSnap.data().views || 0
      await updateDoc(eventRef, {
        views: currentViews + 1,
      })
    }
  } catch (error) {
    console.error("Error incrementing views:", error)
    throw error
  }
}

// Update Event Likes
export const incrementEventLikes = async (eventId: string): Promise<void> => {
  try {
    const eventRef = doc(eventsCollection, eventId)
    const eventSnap = await getDoc(eventRef)

    if (eventSnap.exists()) {
      const currentLikes = eventSnap.data().likes || 0
      await updateDoc(eventRef, {
        likes: currentLikes + 1,
      })
    }
  } catch (error) {
    console.error("Error incrementing likes:", error)
    throw error
  }
}
