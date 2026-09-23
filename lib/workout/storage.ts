import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Equipment, WorkoutRoutine, WorkoutSession } from '@/types/workout';

const KEYS = {
  equipment: 'gymrats.equipment.v1',
  routines: 'gymrats.routines.v1',
  sessions: 'gymrats.sessions.v1',
} as const;

async function loadJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const loadEquipment = () => loadJson<Equipment[]>(KEYS.equipment, []);
export const saveEquipment = (equipment: Equipment[]) =>
  AsyncStorage.setItem(KEYS.equipment, JSON.stringify(equipment));

export const loadRoutines = () => loadJson<WorkoutRoutine[]>(KEYS.routines, []);
export const saveRoutines = (routines: WorkoutRoutine[]) =>
  AsyncStorage.setItem(KEYS.routines, JSON.stringify(routines));

export const loadSessions = () => loadJson<WorkoutSession[]>(KEYS.sessions, []);
export const saveSessions = (sessions: WorkoutSession[]) =>
  AsyncStorage.setItem(KEYS.sessions, JSON.stringify(sessions));
