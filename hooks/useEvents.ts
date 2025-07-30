"use client"

import { useState, useEffect } from "react"
import { type EventData, subscribeToEvents, subscribeToTimelineEvents } from "@/lib/firestore"

export const useEvents = () => {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)

    const unsubscribe = subscribeToEvents((eventsData) => {
      setEvents(eventsData)
      setLoading(false)
      setError(null)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return { events, loading, error }
}

export const useTimelineEvents = () => {
  const [timelineEvents, setTimelineEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)

    const unsubscribe = subscribeToTimelineEvents((eventsData) => {
      setTimelineEvents(eventsData)
      setLoading(false)
      setError(null)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return { timelineEvents, loading, error }
}
