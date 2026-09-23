import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WorkoutTheme } from '@/constants/WorkoutTheme';
import type { ExerciseDefinition } from '@/types/workout';

type Props = {
  exercise: ExerciseDefinition;
  isSelected: boolean;
  onPress: () => void;
};

export function ExerciseCatalogItem({ exercise, isSelected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        isSelected && styles.rowSelected,
        pressed && styles.rowPressed,
      ]}>
      <View style={styles.body}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.meta}>
          {exercise.muscleGroup} · {exercise.type} · {exercise.equipment}
        </Text>
      </View>
      <View style={[styles.addButton, isSelected && styles.addButtonSelected]}>
        <SymbolView
          name={
            isSelected
              ? { ios: 'checkmark', android: 'check', web: 'check' }
              : { ios: 'plus', android: 'add', web: 'add' }
          }
          tintColor={isSelected ? WorkoutTheme.accentText : WorkoutTheme.textPrimary}
          size={16}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: WorkoutTheme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: WorkoutTheme.border,
    padding: 14,
  },
  rowSelected: {
    borderColor: WorkoutTheme.accent,
  },
  rowPressed: {
    backgroundColor: WorkoutTheme.surfaceAlt,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: WorkoutTheme.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    color: WorkoutTheme.textSecondary,
    fontSize: 12,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WorkoutTheme.surfaceAlt,
  },
  addButtonSelected: {
    backgroundColor: WorkoutTheme.accent,
  },
});
