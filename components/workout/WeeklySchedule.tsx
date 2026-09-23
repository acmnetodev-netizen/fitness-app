import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WorkoutTheme } from '@/constants/WorkoutTheme';
import type { ScheduleDayEntry } from '@/lib/workout/schedule';

type Props = {
  entries: ScheduleDayEntry[];
  onSelectRoutine: (routineId: string) => void;
};

export function WeeklySchedule({ entries, onSelectRoutine }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={() => setIsExpanded((value) => !value)}>
        <Text style={styles.headerTitle}>Cronograma de treino</Text>
        <SymbolView
          name={{
            ios: isExpanded ? 'chevron.up' : 'chevron.down',
            android: isExpanded ? 'expand_less' : 'expand_more',
            web: isExpanded ? 'expand_less' : 'expand_more',
          }}
          tintColor={WorkoutTheme.textSecondary}
          size={18}
        />
      </Pressable>

      {isExpanded && (
        <View style={styles.list}>
          {entries.map((entry) => {
            const isRestDay = entry.routines.length === 0;
            const label = isRestDay
              ? 'Descanso'
              : entry.routines.map((r) => r.routine.name).join(' + ');
            const allCompleted = !isRestDay && entry.routines.every((r) => r.isCompleted);

            return (
              <Pressable
                key={entry.weekDay}
                style={styles.row}
                disabled={isRestDay}
                onPress={() => entry.routines[0] && onSelectRoutine(entry.routines[0].routine.id)}>
                <View
                  style={[
                    styles.dot,
                    isRestDay ? styles.dotRest : allCompleted ? styles.dotCompleted : styles.dotActive,
                  ]}
                />
                <Text style={styles.dayText}>{entry.weekDay}</Text>
                <Text style={[styles.labelText, isRestDay && styles.labelTextRest]} numberOfLines={1}>
                  {label}
                </Text>
                {allCompleted && (
                  <SymbolView
                    name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                    tintColor={WorkoutTheme.accent}
                    size={16}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WorkoutTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WorkoutTheme.border,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    color: WorkoutTheme.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  list: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: WorkoutTheme.accent,
  },
  dotCompleted: {
    backgroundColor: '#3DDC84',
  },
  dotRest: {
    backgroundColor: WorkoutTheme.restDay,
  },
  dayText: {
    color: WorkoutTheme.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    width: 72,
  },
  labelText: {
    color: WorkoutTheme.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  labelTextRest: {
    fontStyle: 'italic',
  },
});
