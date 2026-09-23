import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { WorkoutTheme } from '@/constants/WorkoutTheme';
import type { Exercise } from '@/types/workout';

const MUSCLE_GROUP_LABEL: Record<Exercise['muscleGroup'], string> = {
  costas: 'Costas',
  peito: 'Peito',
  triceps: 'Tríceps',
  biceps: 'Bíceps',
  ombro: 'Ombro',
};

export function ExerciseListItem({ exercise, index }: { exercise: Exercise; index: number }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconContainer}>
        <SymbolView
          name={{ ios: 'dumbbell.fill', android: 'fitness_center', web: 'fitness_center' }}
          tintColor={WorkoutTheme.accent}
          size={22}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.muscleGroup}>{MUSCLE_GROUP_LABEL[exercise.muscleGroup]}</Text>
        <Text style={styles.name}>{exercise.name}</Text>
      </View>
      <Text style={styles.index}>{index + 1}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: WorkoutTheme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: WorkoutTheme.border,
    padding: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: WorkoutTheme.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  muscleGroup: {
    color: WorkoutTheme.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    color: WorkoutTheme.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  index: {
    color: WorkoutTheme.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
