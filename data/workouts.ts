import type { ProgramStatus, WeeklyScheduleEntry, WorkoutDay } from '@/types/workout';

export const programStatus: ProgramStatus = {
  programName: 'Meu programa',
  completedWorkouts: 0,
};

export const workoutDays: WorkoutDay[] = [
  {
    id: 'day-1',
    dayNumber: 1,
    title: 'Costa - Bíceps',
    progress: 0,
    exercises: [
      { id: 'ex-1', name: 'Puxada aberta no graviton', muscleGroup: 'costas' },
      { id: 'ex-2', name: 'Remada sentado na máquina', muscleGroup: 'costas' },
      { id: 'ex-3', name: 'Puxada frontal pegada fechada', muscleGroup: 'costas' },
      { id: 'ex-4', name: 'Puxada frontal com pegada invertida', muscleGroup: 'biceps' },
      { id: 'ex-5', name: 'Pullover em pé com barra curta', muscleGroup: 'costas' },
    ],
  },
  {
    id: 'day-2',
    dayNumber: 2,
    title: 'Peito e Tríceps',
    progress: 0,
    exercises: [
      { id: 'ex-6', name: 'Supino reto com barra', muscleGroup: 'peito' },
      { id: 'ex-7', name: 'Supino inclinado com halteres', muscleGroup: 'peito' },
      { id: 'ex-8', name: 'Crucifixo na máquina', muscleGroup: 'peito' },
      { id: 'ex-9', name: 'Tríceps corda no pulley', muscleGroup: 'triceps' },
      { id: 'ex-10', name: 'Tríceps francês com halter', muscleGroup: 'triceps' },
    ],
  },
  {
    id: 'day-3',
    dayNumber: 3,
    title: 'Ombro Tríceps e Bíceps',
    progress: 0,
    exercises: [
      { id: 'ex-11', name: 'Desenvolvimento com halteres', muscleGroup: 'ombro' },
      { id: 'ex-12', name: 'Elevação lateral na polia', muscleGroup: 'ombro' },
      { id: 'ex-13', name: 'Elevação frontal com anilha', muscleGroup: 'ombro' },
      { id: 'ex-14', name: 'Rosca direta com barra', muscleGroup: 'biceps' },
      { id: 'ex-15', name: 'Tríceps testa na polia', muscleGroup: 'triceps' },
    ],
  },
];

export const weeklySchedule: WeeklyScheduleEntry[] = [
  { day: 'Segunda', label: 'Costa - Bíceps', isRestDay: false },
  { day: 'Terça', label: 'Peito e Tríceps', isRestDay: false },
  { day: 'Quarta', label: 'Descanso', isRestDay: true },
  { day: 'Quinta', label: 'Ombro Tríceps e Bíceps', isRestDay: false },
  { day: 'Sexta', label: 'Descanso', isRestDay: true },
  { day: 'Sábado', label: 'Descanso', isRestDay: true },
  { day: 'Domingo', label: 'Descanso', isRestDay: true },
];
