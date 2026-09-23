import { WEEK_DAYS, type WeekDay, type WorkoutRoutine, type WorkoutSession } from '@/types/workout';

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// JS Date#getDay(): 0=Sunday..6=Saturday. WEEK_DAYS is Monday-first, so remap.
function weekDayIndex(jsDay: number): number {
  return (jsDay + 6) % 7;
}

export function getTodayWeekDay(referenceDate: Date = new Date()): WeekDay {
  return WEEK_DAYS[weekDayIndex(referenceDate.getDay())];
}

export function getTodayISODate(referenceDate: Date = new Date()): string {
  return toISODate(referenceDate);
}

/** ISO dates for every day of the current week (Monday-first), keyed by WeekDay. */
export function getCurrentWeekDates(referenceDate: Date = new Date()): Record<WeekDay, string> {
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() - weekDayIndex(referenceDate.getDay()));

  const result = {} as Record<WeekDay, string>;
  WEEK_DAYS.forEach((day, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    result[day] = toISODate(date);
  });
  return result;
}

export type ScheduleDayEntry = {
  weekDay: WeekDay;
  date: string;
  routines: { routine: WorkoutRoutine; progress: number; isCompleted: boolean }[];
};

function routineProgress(routine: WorkoutRoutine, session: WorkoutSession | undefined): number {
  if (!session || routine.exercises.length === 0) return 0;
  return session.completedExerciseIds.length / routine.exercises.length;
}

export function buildWeeklySchedule(
  routines: WorkoutRoutine[],
  sessions: WorkoutSession[],
  referenceDate: Date = new Date()
): ScheduleDayEntry[] {
  const dates = getCurrentWeekDates(referenceDate);

  return WEEK_DAYS.map((weekDay) => {
    const date = dates[weekDay];
    const dayRoutines = routines
      .filter((routine) => routine.weekDays.includes(weekDay))
      .map((routine) => {
        const session = sessions.find((s) => s.routineId === routine.id && s.date === date);
        return { routine, progress: routineProgress(routine, session), isCompleted: session?.isCompleted ?? false };
      });
    return { weekDay, date, routines: dayRoutines };
  });
}
