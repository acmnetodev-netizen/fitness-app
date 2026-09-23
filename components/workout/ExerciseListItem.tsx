import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WorkoutTheme } from '@/constants/WorkoutTheme';
import type { ExerciseDefinition, RoutineExercise } from '@/types/workout';

type Props = {
  exercise: ExerciseDefinition;
  routineExercise: RoutineExercise;
  isDone: boolean;
  onToggle: () => void;
};

export function ExerciseListItem({ exercise, routineExercise, isDone, onToggle }: Props) {
  const loadLabel = routineExercise.load > 0 ? `${routineExercise.load}kg` : 'peso corporal';

  return (
    <Pressable style={styles.row} onPress={onToggle}>
      <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
        {isDone && (
          <SymbolView name={{ ios: 'checkmark', android: 'check', web: 'check' }} tintColor={WorkoutTheme.accentText} size={16} />
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>
        <Text style={[styles.name, isDone && styles.nameDone]}>{exercise.name}</Text>
        <Text style={styles.detail}>
          {routineExercise.sets}x{routineExercise.reps} · {loadLabel}
        </Text>
      </View>
    </Pressable>
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
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: WorkoutTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: WorkoutTheme.accent,
    borderColor: WorkoutTheme.accent,
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
  nameDone: {
    color: WorkoutTheme.textSecondary,
    textDecorationLine: 'line-through',
  },
  detail: {
    color: WorkoutTheme.textSecondary,
    fontSize: 13,
  },
});
