export type MuscleGroup = 'costas' | 'peito' | 'triceps' | 'biceps' | 'ombro';

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
};

export type WorkoutDay = {
  id: string;
  dayNumber: number;
  title: string;
  /** 0 to 1 */
  progress: number;
  exercises: Exercise[];
};

export type WeeklyScheduleEntry = {
  day: string;
  label: string;
  isRestDay: boolean;
};

export type ProgramStatus = {
  programName: string;
  completedWorkouts: number;
};
