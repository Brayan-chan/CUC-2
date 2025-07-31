"use client"

import { useState, useEffect } from "react"
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  subscribeToEvents,
  incrementEventViews,
  toggleEventLike,
  type EventData,
} from "@/lib/firestore"

export const useEvents = (filters?: {
  category?: string
  status?: string
  limit?: number
}) => {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToEvents((newEvents) => {
      setEvents(newEvents)
      setLoading(false)
    }, filters)

    return unsubscribe
  }, [filters])

  const addEvent = async (eventData: Omit<EventData, "id" | "createdAt" | "updatedAt">) => {
    try {
      setError(null)
      const eventId = await createEvent(eventData)
      return eventId
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const editEvent = async (eventId: string, eventData: Partial<EventData>) => {
    try {
      setError(null)
      await updateEvent(eventId, eventData)
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const removeEvent = async (eventId: string) => {
    try {
      setError(null)
      await deleteEvent(eventId)
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const viewEvent = async (eventId: string) => {
    try {
      await incrementEventViews(eventId)
    } catch (error) {
      console.error("Error incrementing views:", error)
    }
  }

  const likeEvent = async (eventId: string, isLiked: boolean) => {
    try {
      await toggleEventLike(eventId, !isLiked)
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  return {
    events,
    loading,
    error,
    addEvent,
    editEvent,
    removeEvent,
    viewEvent,
    likeEvent,
  }
}

export const useEvent = (eventId: string) => {
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setError(null)
        setLoading(true)
        const eventData = await getEvent(eventId)
        setEvent(eventData)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (eventId) {
      fetchEvent()
    }
  }, [eventId])

  return { event, loading, error }
}
