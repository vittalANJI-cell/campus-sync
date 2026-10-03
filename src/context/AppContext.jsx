import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialEvents, initialResources } from '../data/sampleData.js';
import { generateSchedule } from '../services/scheduler.js';

const AppContext = createContext(null);

const STORAGE_KEY_EVENTS = 'campussync_events';
const STORAGE_KEY_RESOURCES = 'campussync_resources';
const STORAGE_KEY_CONFLICTS = 'campussync_conflicts';
const STORAGE_KEY_STATS = 'campussync_stats';

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const [events, setEvents] = useState(() => loadFromStorage(STORAGE_KEY_EVENTS, initialEvents));
  const [resources, setResources] = useState(() => loadFromStorage(STORAGE_KEY_RESOURCES, initialResources));
  const [conflicts, setConflicts] = useState(() => loadFromStorage(STORAGE_KEY_CONFLICTS, []));
  const [scheduleStats, setScheduleStats] = useState(() => loadFromStorage(STORAGE_KEY_STATS, null));
  const [scheduleGenerated, setScheduleGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState('');
  const [notification, setNotification] = useState(null);

  // Persist to localStorage whenever data changes
  useEffect(() => { localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(resources)); }, [resources]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CONFLICTS, JSON.stringify(conflicts)); }, [conflicts]);
  useEffect(() => { if (scheduleStats) localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(scheduleStats)); }, [scheduleStats]);

  // Show a toast notification
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  // ── Event CRUD ────────────────────────────────────────────────────────────
  const addEvent = useCallback((eventData) => {
    const newEvent = {
      ...eventData,
      id: `e${Date.now()}`,
      status: 'Pending',
      assignedRoom: null,
      assignedStartTime: null,
    };
    setEvents(prev => [...prev, newEvent]);
    showNotification(`Event "${newEvent.name}" added successfully.`);
    return newEvent;
  }, [showNotification]);

  const updateEvent = useCallback((id, updates) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    showNotification('Event updated successfully.');
  }, [showNotification]);

  const deleteEvent = useCallback((id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setConflicts(prev => prev.filter(c => c.eventId !== id));
    showNotification('Event deleted.', 'info');
  }, [showNotification]);

  const rescheduleEvent = useCallback((eventId, suggestion) => {
    setEvents(prev => prev.map(e =>
      e.id === eventId
        ? { ...e, assignedRoom: suggestion.roomId, assignedStartTime: suggestion.startTime, status: 'Scheduled' }
        : e
    ));
    setConflicts(prev => prev.filter(c => c.eventId !== eventId));
    showNotification('Event rescheduled successfully.');
  }, [showNotification]);

  // ── Resource CRUD ─────────────────────────────────────────────────────────
  const addResource = useCallback((data) => {
    const newResource = { ...data, id: `r${Date.now()}` };
    setResources(prev => [...prev, newResource]);
    showNotification(`Resource "${newResource.name}" added.`);
  }, [showNotification]);

  const updateResource = useCallback((id, updates) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    showNotification('Resource updated.');
  }, [showNotification]);

  const deleteResource = useCallback((id) => {
    setResources(prev => prev.filter(r => r.id !== id));
    showNotification('Resource deleted.', 'info');
  }, [showNotification]);

  const toggleResourceAvailability = useCallback((id) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, available: !r.available } : r));
  }, []);

  // ── Schedule Generation ───────────────────────────────────────────────────
  const runGenerateSchedule = useCallback(async () => {
    setIsGenerating(true);
    setScheduleGenerated(false);

    const steps = [
      'Analyzing events...',
      'Checking resources...',
      'Resolving conflicts...',
      'Optimizing schedule...',
      'Finalizing assignments...',
    ];

    for (const step of steps) {
      setGeneratingStep(step);
      await new Promise(r => setTimeout(r, 600));
    }

    const result = generateSchedule(events, resources);

    setEvents(result.scheduledEvents);
    setConflicts(result.conflicts);
    setScheduleStats(result.stats);
    setScheduleGenerated(true);
    setIsGenerating(false);
    setGeneratingStep('');

    if (result.conflicts.length > 0) {
      showNotification(`Schedule generated with ${result.conflicts.length} conflict(s). Check Conflicts page.`, 'warning');
    } else {
      showNotification(`Schedule generated! ${result.stats.scheduled} events scheduled, 0 conflicts.`);
    }
  }, [events, resources, showNotification]);

  // ── Derived stats ─────────────────────────────────────────────────────────
  const stats = {
    total: events.length,
    scheduled: events.filter(e => e.status === 'Scheduled').length,
    pending: events.filter(e => e.status === 'Pending').length,
    unscheduled: events.filter(e => e.status === 'Unscheduled' || e.status === 'Conflict').length,
    availableResources: resources.filter(r => r.available).length,
    conflictCount: conflicts.length,
  };

  return (
    <AppContext.Provider value={{
      events, resources, conflicts, scheduleStats, scheduleGenerated,
      isGenerating, generatingStep, notification, stats,
      addEvent, updateEvent, deleteEvent, rescheduleEvent,
      addResource, updateResource, deleteResource, toggleResourceAvailability,
      runGenerateSchedule, showNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
