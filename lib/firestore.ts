import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
} from "firebase/firestore"
import { db } from "./firebase"

export interface UserData {
  id: string
  email: string
  displayName: string
  role: "admin" | "moderator" | "contributor" | "viewer"
  institution?: string
  matricula?: string
  createdAt?: any
  updatedAt?: any
}

export interface EventData {
  id?: string
  title: string
  description: string
  date: string
  category: string
  tags: string[]
  images: string[]
  videos: string[]
  documents: string[]
  location?: string
  participants?: string[]
  significance: string
  sources: string[]
  status: "draft" | "pending" | "approved" | "rejected"
  createdBy: string
  createdAt?: any
  updatedAt?: any
  views?: number
  likes?: number
  shares?: number
}

// User functions
export const createOrUpdateUser = async (userData: Omit<UserData, "createdAt" | "updatedAt">) => {
  try {
    const userRef = doc(db, "users", userData.id)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      })
    } else {
      await updateDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

    return userData
  } catch (error) {
    console.error("Error creating/updating user:", error)
    throw error
  }
}

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, "users", userId)
    const userDoc = await getDoc(userRef)

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as UserData
    }

    return null
  } catch (error) {
    console.error("Error getting user data:", error)
    throw error
  }
}

// Event functions
export const createEvent = async (eventData: Omit<EventData, "id" | "createdAt" | "updatedAt">) => {
  try {
    const eventsRef = collection(db, "events")
    const docRef = await addDoc(eventsRef, {
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      views: 0,
      likes: 0,
      shares: 0,
    })

    return docRef.id
  } catch (error) {
    console.error("Error creating event:", error)
    throw error
  }
}

export const updateEvent = async (eventId: string, eventData: Partial<EventData>) => {
  try {
    const eventRef = doc(db, "events", eventId)
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating event:", error)
    throw error
  }
}

export const deleteEvent = async (eventId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    await deleteDoc(eventRef)
  } catch (error) {
    console.error("Error deleting event:", error)
    throw error
  }
}

export const getEvent = async (eventId: string): Promise<EventData | null> => {
  try {
    const eventRef = doc(db, "events", eventId)
    const eventDoc = await getDoc(eventRef)

    if (eventDoc.exists()) {
      return { id: eventDoc.id, ...eventDoc.data() } as EventData
    }

    return null
  } catch (error) {
    console.error("Error getting event:", error)
    throw error
  }
}

export const getEvents = async (filters?: {
  category?: string
  status?: string
  limit?: number
  orderBy?: string
}) => {
  try {
    let q = query(collection(db, "events"))

    if (filters?.category) {
      q = query(q, where("category", "==", filters.category))
    }

    if (filters?.status) {
      q = query(q, where("status", "==", filters.status))
    }

    if (filters?.orderBy) {
      q = query(q, orderBy(filters.orderBy, "desc"))
    }

    if (filters?.limit) {
      q = query(q, limit(filters.limit))
    }

    const querySnapshot = await getDocs(q)
    const events: EventData[] = []

    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as EventData)
    })

    return events
  } catch (error) {
    console.error("Error getting events:", error)
    throw error
  }
}

export const subscribeToEvents = (
  callback: (events: EventData[]) => void,
  filters?: {
    category?: string
    status?: string
    limit?: number
  },
) => {
  let q = query(collection(db, "events"), orderBy("createdAt", "desc"))

  if (filters?.category) {
    q = query(q, where("category", "==", filters.category))
  }

  if (filters?.status) {
    q = query(q, where("status", "==", filters.status))
  }

  if (filters?.limit) {
    q = query(q, limit(filters.limit))
  }

  return onSnapshot(q, (querySnapshot) => {
    const events: EventData[] = []
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as EventData)
    })
    callback(events)
  })
}

export const incrementEventViews = async (eventId: string) => {
  try {
    const eventRef = doc(db, "events", eventId)
    await updateDoc(eventRef, {
      views: increment(1),
    })
  } catch (error) {
    console.error("Error incrementing views:", error)
  }
}

export const toggleEventLike = async (eventId: string, increment: boolean) => {
  try {
    const eventRef = doc(db, "events", eventId)
    await updateDoc(eventRef, {
      likes: increment ? increment(1) : increment(-1),
    })
  } catch (error) {
    console.error("Error toggling like:", error)
  }
}
