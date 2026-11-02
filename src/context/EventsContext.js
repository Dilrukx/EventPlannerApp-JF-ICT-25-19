import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleReminder, cancelReminder } from '../utils/notifications';

const STORAGE_KEY = '@event_planner_events_v1';


const SEED = [
  { id: 's1', name: 'Project Presentation', date: '2026-10-25', time: '10:00', description: 'Present the final project.', reminderEnabled: true, reminderTime: '09:30', notificationId: null },
  { id: 's2', name: 'Birthday Party', date: '2026-10-28', time: '18:00', description: 'At home with family!', reminderEnabled: false, reminderTime: '', notificationId: null },
  { id: 's3', name: 'Study Session', date: '2026-10-30', time: '14:00', description: 'Prepare for exam.', reminderEnabled: false, reminderTime: '', notificationId: null },
  { id: 's4', name: 'Movie Night', date: '2026-11-02', time: '19:30', description: 'Watch a great movie!', reminderEnabled: false, reminderTime: '', notificationId: null },
  { id: 's5', name: 'Project Meeting', date: '2026-11-15', time: '11:00', description: 'Team discussion.', reminderEnabled: false, reminderTime: '', notificationId: null },
];

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setEvents(raw !== null ? JSON.parse(raw) : SEED);
      } catch (e) {
        setEvents(SEED);
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events)).catch(() => {});
  }, [events, loaded]);

  const addEvent = useCallback(async (data) => {
    const notificationId = await scheduleReminder(data);
    setEvents((prev) => [...prev, { ...data, id: Date.now().toString(), notificationId }]);
  }, []);

  const updateEvent = useCallback(
    async (id, data) => {
      const old = events.find((e) => e.id === id);
      await cancelReminder(old?.notificationId);
      const notificationId = await scheduleReminder(data);
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...data, notificationId } : e)));
    },
    [events]
  );

  const deleteEvent = useCallback(
    async (id) => {
      const old = events.find((e) => e.id === id);
      await cancelReminder(old?.notificationId);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    },
    [events]
  );

  const getEvent = useCallback((id) => events.find((e) => e.id === id), [events]);

  return (
    <EventsContext.Provider value={{ events, loaded, addEvent, updateEvent, deleteEvent, getEvent }}>
      {children}
    </EventsContext.Provider>
  );
}

export const useEvents = () => useContext(EventsContext);
