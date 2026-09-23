import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { WorkoutTheme } from '@/constants/WorkoutTheme';
import type { ProgramStatus } from '@/types/workout';

export function ProgramStatusCard({ status }: { status: ProgramStatus }) {
  return (
    <LinearGradient
      colors={['#123F3A', WorkoutTheme.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}>
      <View style={styles.iconWatermark}>
        <SymbolView
          name={{ ios: 'dumbbell.fill', android: 'fitness_center', web: 'fitness_center' }}
          tintColor="rgba(45, 225, 194, 0.18)"
          size={96}
        />
      </View>
      <Text style={styles.label}>{status.programName}</Text>
      <Text style={styles.value}>{status.completedWorkouts}</Text>
      <Text style={styles.caption}>treinos realizados</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: WorkoutTheme.border,
  },
  iconWatermark: {
    position: 'absolute',
    right: -12,
    top: -12,
  },
  label: {
    color: WorkoutTheme.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    color: WorkoutTheme.textPrimary,
    fontSize: 40,
    fontWeight: '800',
    marginTop: 4,
  },
  caption: {
    color: WorkoutTheme.textSecondary,
    fontSize: 14,
  },
});
