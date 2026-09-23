import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgramStatusCard } from '@/components/workout/ProgramStatusCard';
import { WeeklySchedule } from '@/components/workout/WeeklySchedule';
import { WorkoutDayCard } from '@/components/workout/WorkoutDayCard';
import { WorkoutTheme } from '@/constants/WorkoutTheme';
import { programStatus, weeklySchedule, workoutDays } from '@/data/workouts';

export default function TreinosScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Treinos</Text>

        <ProgramStatusCard status={programStatus} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximo treino</Text>
          <View style={styles.cardList}>
            {workoutDays.map((day) => (
              <WorkoutDayCard
                key={day.id}
                day={day}
                onPress={() => router.push({ pathname: '/workout/[id]', params: { id: day.id } })}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <WeeklySchedule entries={weeklySchedule} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WorkoutTheme.background,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  screenTitle: {
    color: WorkoutTheme.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: WorkoutTheme.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  cardList: {
    gap: 12,
  },
});
