import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { WorkoutTheme } from '@/constants/WorkoutTheme';
import type { ExerciseDefinition, RoutineExercise } from '@/types/workout';

type Props = {
  exercise: ExerciseDefinition;
  routineExercise: RoutineExercise;
  onChange: (next: RoutineExercise) => void;
  onRemove: () => void;
};

function Stepper({ value, onChange, min = 1 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <View style={styles.stepper}>
      <Pressable style={styles.stepperButton} onPress={() => onChange(Math.max(min, value - 1))}>
        <Text style={styles.stepperButtonText}>–</Text>
      </Pressable>
      <Text style={styles.stepperValue}>{value}</Text>
      <Pressable style={styles.stepperButton} onPress={() => onChange(value + 1)}>
        <Text style={styles.stepperButtonText}>+</Text>
      </Pressable>
    </View>
  );
}

export function SelectedExerciseRow({ exercise, routineExercise, onChange, onRemove }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>
          {exercise.name}
        </Text>
        <Pressable onPress={onRemove} style={styles.removeButton}>
          <SymbolView name={{ ios: 'xmark', android: 'close', web: 'close' }} tintColor={WorkoutTheme.textSecondary} size={16} />
        </Pressable>
      </View>

      <View style={styles.fields}>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Séries</Text>
          <Stepper
            value={routineExercise.sets}
            onChange={(sets) => onChange({ ...routineExercise, sets })}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Reps</Text>
          <Stepper
            value={routineExercise.reps}
            onChange={(reps) => onChange({ ...routineExercise, reps })}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Carga (kg)</Text>
          <TextInput
            style={styles.loadInput}
            keyboardType="numeric"
            value={String(routineExercise.load)}
            onChangeText={(text) => {
              const parsed = parseInt(text.replace(/[^0-9]/g, ''), 10);
              onChange({ ...routineExercise, load: Number.isNaN(parsed) ? 0 : parsed });
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WorkoutTheme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: WorkoutTheme.border,
    padding: 14,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    color: WorkoutTheme.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WorkoutTheme.surfaceAlt,
  },
  fields: {
    flexDirection: 'row',
    gap: 16,
  },
  field: {
    gap: 6,
    alignItems: 'flex-start',
  },
  fieldLabel: {
    color: WorkoutTheme.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepperButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: WorkoutTheme.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    color: WorkoutTheme.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  stepperValue: {
    color: WorkoutTheme.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  loadInput: {
    width: 56,
    height: 30,
    borderRadius: 8,
    backgroundColor: WorkoutTheme.surfaceAlt,
    color: WorkoutTheme.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 0,
  },
});
