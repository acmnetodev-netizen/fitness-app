import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import * as storage from '@/lib/workout/storage';
import type { Equipment, WorkoutRoutine, WorkoutSession } from '@/types/workout';

type WorkoutContextValue = {
  isLoading: boolean;
  equipment: Equipment[];
  setEquipment: (equipment: Equipment[]) => void;
  routines: WorkoutRoutine[];
  addRoutine: (routine: WorkoutRoutine) => void;
  deleteRoutine: (routineId: string) => void;
  sessions: WorkoutSession[];
  getSession: (routineId: string, date: string) => WorkoutSession | undefined;
  toggleExerciseDone: (routineId: string, date: string, exerciseId: string) => void;
  setSessionCompleted: (routineId: string, date: string, isCompleted: boolean) => void;
  completedWorkoutsCount: number;
};

const WorkoutContext = createContext<WorkoutContextValue | null>(null);

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return ctx;
}

function emptySession(routineId: string, date: string): WorkoutSession {
  return { date, routineId, completedExerciseIds: [], isCompleted: false };
}

export function WorkoutProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [equipment, setEquipmentState] = useState<Equipment[]>([]);
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    Promise.all([storage.loadEquipment(), storage.loadRoutines(), storage.loadSessions()]).then(
      ([loadedEquipment, loadedRoutines, loadedSessions]) => {
        setEquipmentState(loadedEquipment);
        setRoutines(loadedRoutines);
        setSessions(loadedSessions);
        setIsLoading(false);
      }
    );
  }, []);

  const setEquipment = (next: Equipment[]) => {
    setEquipmentState(next);
    storage.saveEquipment(next);
  };

  const addRoutine = (routine: WorkoutRoutine) => {
    setRoutines((prev) => {
      const next = [...prev, routine];
      storage.saveRoutines(next);
      return next;
    });
  };

  const deleteRoutine = (routineId: string) => {
    setRoutines((prev) => {
      const next = prev.filter((r) => r.id !== routineId);
      storage.saveRoutines(next);
      return next;
    });
    setSessions((prev) => {
      const next = prev.filter((s) => s.routineId !== routineId);
      storage.saveSessions(next);
      return next;
    });
  };

  const getSession = (routineId: string, date: string) =>
    sessions.find((s) => s.routineId === routineId && s.date === date);

  const upsertSession = (
    routineId: string,
    date: string,
    updater: (session: WorkoutSession) => WorkoutSession
  ) => {
    setSessions((prev) => {
      const existingIndex = prev.findIndex((s) => s.routineId === routineId && s.date === date);
      const base = existingIndex >= 0 ? prev[existingIndex] : emptySession(routineId, date);
      const updated = updater(base);
      const next =
        existingIndex >= 0
          ? prev.map((s, i) => (i === existingIndex ? updated : s))
          : [...prev, updated];
      storage.saveSessions(next);
      return next;
    });
  };

  const toggleExerciseDone = (routineId: string, date: string, exerciseId: string) => {
    upsertSession(routineId, date, (session) => {
      const isDone = session.completedExerciseIds.includes(exerciseId);
      return {
        ...session,
        completedExerciseIds: isDone
          ? session.completedExerciseIds.filter((id) => id !== exerciseId)
          : [...session.completedExerciseIds, exerciseId],
      };
    });
  };

  const setSessionCompleted = (routineId: string, date: string, isCompleted: boolean) => {
    upsertSession(routineId, date, (session) => ({ ...session, isCompleted }));
  };

  const completedWorkoutsCount = useMemo(
    () => sessions.filter((s) => s.isCompleted).length,
    [sessions]
  );

  return (
    <WorkoutContext.Provider
      value={{
        isLoading,
        equipment,
        setEquipment,
        routines,
        addRoutine,
        deleteRoutine,
        sessions,
        getSession,
        toggleExerciseDone,
        setSessionCompleted,
        completedWorkoutsCount,
      }}>
      {children}
    </WorkoutContext.Provider>
  );
}
