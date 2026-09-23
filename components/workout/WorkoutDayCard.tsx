import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CircularProgress } from '@/components/workout/CircularProgress';
import { WorkoutTheme } from '@/constants/WorkoutTheme';
import type { WorkoutDay } from '@/types/workout';

export function WorkoutDayCard({ day, onPress }: { day: WorkoutDay; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={styles.body}>
        <Text style={styles.dayLabel}>{day.dayNumber}º dia de treino</Text>
        <Text style={styles.title}>{day.title}</Text>
        <Text style={styles.exerciseCount}>{day.exercises.length} exercícios</Text>
      </View>
      <CircularProgress progress={day.progress} />
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
  dayLabel: {
    color: WorkoutTheme.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
