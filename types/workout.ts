export const MUSCLE_GROUPS = [
  'Costas',
  'Peito',
  'Pernas',
  'Ombros',
  'Bíceps',
  'Tríceps',
  'Abdômen',
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const EXERCISE_TYPES = ['Força', 'Hipertrofia', 'Resistência'] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

export const EQUIPMENT_OPTIONS = [
  'Halteres',
  'Barra',
  'Máquinas',
  'Cabos/Polia',
  'Graviton',
  'Peso Corporal',
] as const;
export type Equipment = (typeof EQUIPMENT_OPTIONS)[number];

export const WEEK_DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export type ExerciseDefinition = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  type: ExerciseType;
  equipment: Equipment;
};

/** An exercise as configured inside a user-built routine. */
export type RoutineExercise = {
  exerciseId: string;
  sets: number;
  reps: number;
  /** kg; 0 means bodyweight / unspecified. */
  load: number;
};

export type WorkoutRoutine = {
  id: string;
  name: string;
  weekDays: WeekDay[];
  exercises: RoutineExercise[];
  createdAt: string;
};

/** One day's record of a routine being worked through. */
export type WorkoutSession = {
  /** ISO date (yyyy-mm-dd) this session belongs to. */
  date: string;
  routineId: string;
  completedExerciseIds: string[];
  isCompleted: boolean;
};
