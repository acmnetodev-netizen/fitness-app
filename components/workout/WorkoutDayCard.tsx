import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CircularProgress } from '@/components/workout/CircularProgress';
import { WorkoutTheme } from '@/constants/WorkoutTheme';
import type { WorkoutRoutine } from '@/types/workout';

type Props = {
  routine: WorkoutRoutine;
  progress: number;
  isCompleted: boolean;
  onPress: () => void;
};

export function WorkoutDayCard({ routine, progress, isCompleted, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{routine.name}</Text>
          {isCompleted && (
            <SymbolView
              name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
              tintColor={WorkoutTheme.accent}
              size={16}
            />
          )}
        </View>
        <Text style={styles.exerciseCount}>{routine.exercises.length} exercícios</Text>
      </View>
      <CircularProgress progress={progress} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WorkoutTheme.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: WorkoutTheme.border,
  },
  cardPressed: {
    backgroundColor: WorkoutTheme.surfaceAlt,
  },
  body: {
    flex: 1,
    gap: 2,
    marginRight: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: WorkoutTheme.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  exerciseCount: {
    color: WorkoutTheme.textSecondary,
    fontSize: 13,
  },
});
