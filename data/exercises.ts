import type { ExerciseDefinition } from '@/types/workout';

export const EXERCISE_CATALOG: ExerciseDefinition[] = [
  // Costas
  { id: 'costas-1', name: 'Puxada aberta no graviton', muscleGroup: 'Costas', type: 'Hipertrofia', equipment: 'Graviton' },
  { id: 'costas-2', name: 'Remada sentada na máquina', muscleGroup: 'Costas', type: 'Hipertrofia', equipment: 'Máquinas' },
  { id: 'costas-3', name: 'Puxada frontal pegada fechada', muscleGroup: 'Costas', type: 'Hipertrofia', equipment: 'Cabos/Polia' },
  { id: 'costas-4', name: 'Puxada frontal pegada invertida', muscleGroup: 'Costas', type: 'Hipertrofia', equipment: 'Cabos/Polia' },
  { id: 'costas-5', name: 'Pullover em pé com barra curta', muscleGroup: 'Costas', type: 'Hipertrofia', equipment: 'Barra' },
  { id: 'costas-6', name: 'Remada curvada com barra', muscleGroup: 'Costas', type: 'Força', equipment: 'Barra' },
  { id: 'costas-7', name: 'Barra fixa', muscleGroup: 'Costas', type: 'Força', equipment: 'Peso Corporal' },
  { id: 'costas-8', name: 'Remada unilateral com halter', muscleGroup: 'Costas', type: 'Hipertrofia', equipment: 'Halteres' },

  // Peito
  { id: 'peito-1', name: 'Supino reto com barra', muscleGroup: 'Peito', type: 'Força', equipment: 'Barra' },
  { id: 'peito-2', name: 'Supino inclinado com halteres', muscleGroup: 'Peito', type: 'Hipertrofia', equipment: 'Halteres' },
  { id: 'peito-3', name: 'Crucifixo na máquina', muscleGroup: 'Peito', type: 'Hipertrofia', equipment: 'Máquinas' },
  { id: 'peito-4', name: 'Crossover no cabo', muscleGroup: 'Peito', type: 'Hipertrofia', equipment: 'Cabos/Polia' },
  { id: 'peito-5', name: 'Flexão de braço', muscleGroup: 'Peito', type: 'Resistência', equipment: 'Peso Corporal' },
  { id: 'peito-6', name: 'Supino declinado com halteres', muscleGroup: 'Peito', type: 'Força', equipment: 'Halteres' },
  { id: 'peito-7', name: 'Peck deck', muscleGroup: 'Peito', type: 'Hipertrofia', equipment: 'Máquinas' },

  // Pernas
  { id: 'pernas-1', name: 'Agachamento livre com barra', muscleGroup: 'Pernas', type: 'Força', equipment: 'Barra' },
  { id: 'pernas-2', name: 'Leg press 45°', muscleGroup: 'Pernas', type: 'Força', equipment: 'Máquinas' },
  { id: 'pernas-3', name: 'Cadeira extensora', muscleGroup: 'Pernas', type: 'Hipertrofia', equipment: 'Máquinas' },
  { id: 'pernas-4', name: 'Mesa flexora', muscleGroup: 'Pernas', type: 'Hipertrofia', equipment: 'Máquinas' },
  { id: 'pernas-5', name: 'Afundo com halteres', muscleGroup: 'Pernas', type: 'Hipertrofia', equipment: 'Halteres' },
  { id: 'pernas-6', name: 'Cadeira adutora', muscleGroup: 'Pernas', type: 'Hipertrofia', equipment: 'Máquinas' },
  { id: 'pernas-7', name: 'Stiff com barra', muscleGroup: 'Pernas', type: 'Hipertrofia', equipment: 'Barra' },
  { id: 'pernas-8', name: 'Agachamento búlgaro', muscleGroup: 'Pernas', type: 'Resistência', equipment: 'Peso Corporal' },
  { id: 'pernas-9', name: 'Panturrilha em pé na máquina', muscleGroup: 'Pernas', type: 'Resistência', equipment: 'Máquinas' },

  // Ombros
  { id: 'ombros-1', name: 'Desenvolvimento com halteres', muscleGroup: 'Ombros', type: 'Força', equipment: 'Halteres' },
  { id: 'ombros-2', name: 'Desenvolvimento na máquina', muscleGroup: 'Ombros', type: 'Força', equipment: 'Máquinas' },
  { id: 'ombros-3', name: 'Elevação lateral com halteres', muscleGroup: 'Ombros', type: 'Hipertrofia', equipment: 'Halteres' },
  { id: 'ombros-4', name: 'Elevação lateral na polia', muscleGroup: 'Ombros', type: 'Hipertrofia', equipment: 'Cabos/Polia' },
  { id: 'ombros-5', name: 'Elevação frontal com halteres', muscleGroup: 'Ombros', type: 'Hipertrofia', equipment: 'Halteres' },
  { id: 'ombros-6', name: 'Remada alta com barra', muscleGroup: 'Ombros', type: 'Hipertrofia', equipment: 'Barra' },
  { id: 'ombros-7', name: 'Crucifixo invertido na máquina', muscleGroup: 'Ombros', type: 'Hipertrofia', equipment: 'Máquinas' },

  // Bíceps
  { id: 'biceps-1', name: 'Rosca direta com barra', muscleGroup: 'Bíceps', type: 'Hipertrofia', equipment: 'Barra' },
  { id: 'biceps-2', name: 'Rosca alternada com halteres', muscleGroup: 'Bíceps', type: 'Hipertrofia', equipment: 'Halteres' },
  { id: 'biceps-3', name: 'Rosca scott na máquina', muscleGroup: 'Bíceps', type: 'Hipertrofia', equipment: 'Máquinas' },
  { id: 'biceps-4', name: 'Rosca no cabo', muscleGroup: 'Bíceps', type: 'Hipertrofia', equipment: 'Cabos/Polia' },
  { id: 'biceps-5', name: 'Rosca martelo com halteres', muscleGroup: 'Bíceps', type: 'Hipertrofia', equipment: 'Halteres' },

  // Tríceps
  { id: 'triceps-1', name: 'Tríceps corda no pulley', muscleGroup: 'Tríceps', type: 'Hipertrofia', equipment: 'Cabos/Polia' },
  { id: 'triceps-2', name: 'Tríceps francês com halter', muscleGroup: 'Tríceps', type: 'Hipertrofia', equipment: 'Halteres' },
  { id: 'triceps-3', name: 'Tríceps testa com barra', muscleGroup: 'Tríceps', type: 'Força', equipment: 'Barra' },
  { id: 'triceps-4', name: 'Mergulho no banco', muscleGroup: 'Tríceps', type: 'Resistência', equipment: 'Peso Corporal' },
  { id: 'triceps-5', name: 'Tríceps no graviton', muscleGroup: 'Tríceps', type: 'Hipertrofia', equipment: 'Graviton' },

  // Abdômen
  { id: 'abdomen-1', name: 'Prancha isométrica', muscleGroup: 'Abdômen', type: 'Resistência', equipment: 'Peso Corporal' },
  { id: 'abdomen-2', name: 'Abdominal supra no solo', muscleGroup: 'Abdômen', type: 'Resistência', equipment: 'Peso Corporal' },
  { id: 'abdomen-3', name: 'Abdominal na máquina', muscleGroup: 'Abdômen', type: 'Hipertrofia', equipment: 'Máquinas' },
  { id: 'abdomen-4', name: 'Elevação de pernas na paralela', muscleGroup: 'Abdômen', type: 'Resistência', equipment: 'Peso Corporal' },
  { id: 'abdomen-5', name: 'Abdominal no cabo', muscleGroup: 'Abdômen', type: 'Hipertrofia', equipment: 'Cabos/Polia' },
];

export function getExerciseById(id: string) {
  return EXERCISE_CATALOG.find((exercise) => exercise.id === id);
}
