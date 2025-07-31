"use client";

import { useState, useEffect } from 'react';
import { 
  EventsService, 
  GalleryService, 
  TimelineService, 
  LikesService,
  ViewsService 
} from '@/lib/firebase-services';
import { Event, GalleryItem, TimelineEvent } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Hook for real-time events
export const useEvents = (limitCount = 50) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = EventsService.subscribeToEvents((newEvents) => {
      setEvents(newEvents);
      setLoading(false);
    }, limitCount);

    return unsubscribe;
  }, [limitCount]);

  const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
    try {
      const id = await EventsService.create(eventData);
      return id;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const updateEvent = async (id: string, data: Partial<Event>) => {
    try {
      await EventsService.update(id, data);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await EventsService.delete(id);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};

// Hook for real-time gallery
export const useGallery = (limitCount = 50) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = GalleryService.subscribeToGallery((newItems) => {
      setGalleryItems(newItems);
      setLoading(false);
    }, limitCount);

    return unsubscribe;
  }, [limitCount]);

  const createGalleryItem = async (itemData: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
    try {
      const id = await GalleryService.create(itemData);
      return id;
    } catch (error) {
      console.error('Error creating gallery item:', error);
      throw error;
    }
  };

  const updateGalleryItem = async (id: string, data: Partial<GalleryItem>) => {
    try {
      await GalleryService.update(id, data);
    } catch (error) {
      console.error('Error updating gallery item:', error);
      throw error;
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      await GalleryService.delete(id);
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      throw error;
    }
  };

  return {
    galleryItems,
    loading,
    error,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
  };
};

// Hook for real-time timeline
export const useTimeline = (year: number) => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = TimelineService.subscribeToTimeline(year, (newEvents) => {
      setTimelineEvents(newEvents);
      setLoading(false);
    });

    return unsubscribe;
  }, [year]);

  const createTimelineEvent = async (eventData: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>) => {
    try {
      const id = await TimelineService.create(eventData);
      return id;
    } catch (error) {
      console.error('Error creating timeline event:', error);
      throw error;
    }
  };

  const updateTimelineEvent = async (id: string, data: Partial<TimelineEvent>) => {
    try {
      await TimelineService.update(id, data);
    } catch (error) {
      console.error('Error updating timeline event:', error);
      throw error;
    }
  };

  const deleteTimelineEvent = async (id: string) => {
    try {
      await TimelineService.delete(id);
    } catch (error) {
      console.error('Error deleting timeline event:', error);
      throw error;
    }
  };

  return {
    timelineEvents,
    loading,
    error,
    createTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
  };
};

// Hook for likes functionality
export const useLikes = () => {
  const { user } = useAuth();
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const toggleLike = async (itemId: string, itemType: 'event' | 'gallery' | 'timeline') => {
    if (!user) {
      throw new Error('User must be logged in to like items');
    }

    try {
      const isCurrentlyLiked = likedItems.has(itemId);
      
      if (isCurrentlyLiked) {
        await LikesService.removeLike(user.uid, itemId, itemType);
        setLikedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      } else {
        await LikesService.addLike(user.uid, itemId, itemType);
        setLikedItems(prev => new Set(prev).add(itemId));
      }
      
      return !isCurrentlyLiked;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  };

  const isLiked = (itemId: string) => {
    return likedItems.has(itemId);
  };

  // Load user's likes on mount
  useEffect(() => {
    const loadUserLikes = async () => {
      if (user) {
        try {
          const userLikes = await LikesService.getUserLikes(user.uid);
          const likedItemIds = new Set(userLikes.map(like => like.itemId));
          setLikedItems(likedItemIds);
        } catch (error) {
          console.error('Error loading user likes:', error);
        }
      } else {
        setLikedItems(new Set());
      }
    };

    loadUserLikes();
  }, [user]);

  return {
    toggleLike,
    isLiked,
  };
};

// Hook for views functionality
export const useViews = () => {
  const { user } = useAuth();

  const recordView = async (itemId: string, itemType: 'event' | 'gallery' | 'timeline') => {
    try {
      await ViewsService.addView(itemId, itemType, user?.uid);
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  return {
    recordView,
  };
};

// Hook for featured events
export const useFeaturedEvents = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedEvents = async () => {
      try {
        const events = await EventsService.getFeatured();
        setFeaturedEvents(events);
      } catch (error) {
        console.error('Error loading featured events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedEvents();
  }, []);

  return {
    featuredEvents,
    loading,
  };
};

// Hook for highlighted gallery items
export const useHighlightedGallery = () => {
  const [highlightedItems, setHighlightedItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHighlightedItems = async () => {
      try {
        const items = await GalleryService.getHighlighted();
        setHighlightedItems(items);
      } catch (error) {
        console.error('Error loading highlighted gallery items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHighlightedItems();
  }, []);

  return {
    highlightedItems,
    loading,
  };
};

// Hook for timeline years
export const useTimelineYears = () => {
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadYears = async () => {
      try {
        const timelineYears = await TimelineService.getAllYears();
        setYears(timelineYears);
      } catch (error) {
        console.error('Error loading timeline years:', error);
      } finally {
        setLoading(false);
      }
    };

    loadYears();
  }, []);

  return {
    years,
    loading,
  };
};

// Hook for timeline events by year
export const useTimelineEventsByYear = (year: number) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!year) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const loadEvents = async () => {
      try {
        const timelineEvents = await TimelineService.getByYear(year);
        setEvents(timelineEvents);
      } catch (error) {
        console.error('Error loading timeline events for year:', year, error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [year]);

  return {
    events,
    loading,
    refetch: () => {
      setLoading(true);
      TimelineService.getByYear(year).then(setEvents).finally(() => setLoading(false));
    }
  };
};

// Hook for all timeline events
export const useAllTimelineEvents = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const timelineEvents = await TimelineService.getAll();
        setEvents(timelineEvents);
      } catch (error) {
        console.error('Error loading all timeline events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return {
    events,
    loading,
    refetch: () => {
      setLoading(true);
      TimelineService.getAll().then(setEvents).finally(() => setLoading(false));
    }
  };
};

// Hook for real-time timeline events
export const useRealtimeTimelineEvents = (year?: number) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    if (year) {
      unsubscribe = TimelineService.subscribeToYear(year, (timelineEvents) => {
        setEvents(timelineEvents);
        setLoading(false);
      });
    } else {
      unsubscribe = TimelineService.subscribeToAll((timelineEvents) => {
        setEvents(timelineEvents);
        setLoading(false);
      });
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [year]);

  return {
    events,
    loading,
  };
};

// Hook for creating timeline events
export const useCreateTimelineEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvent = async (eventData: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'year'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const eventId = await TimelineService.create(eventData);
      return eventId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el evento';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent,
    loading,
    error,
  };
};
