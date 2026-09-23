import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgramStatusCard } from '@/components/workout/ProgramStatusCard';
import { WeeklySchedule } from '@/components/workout/WeeklySchedule';
import { WorkoutDayCard } from '@/components/workout/WorkoutDayCard';
import { WorkoutTheme } from '@/constants/WorkoutTheme';
import { buildWeeklySchedule, getTodayWeekDay } from '@/lib/workout/schedule';
import { useWorkout } from '@/lib/workout/WorkoutProvider';

export default function TreinosScreen() {
  const { isLoading, routines, sessions, completedWorkoutsCount } = useWorkout();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator color={WorkoutTheme.accent} />
        </View>
      </SafeAreaView>
    );
  }

  const schedule = buildWeeklySchedule(routines, sessions);
  const todayEntry = schedule.find((entry) => entry.weekDay === getTodayWeekDay());

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Treinos</Text>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton} onPress={() => router.push('/workout/equipment')}>
              <SymbolView
                name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
                tintColor={WorkoutTheme.textSecondary}
                size={18}
              />
            </Pressable>
            <Pressable style={styles.addButton} onPress={() => router.push('/workout/builder')}>
              <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} tintColor={WorkoutTheme.background} size={20} />
            </Pressable>
          </View>
        </View>

        <ProgramStatusCard programName="Meu programa" completedWorkouts={completedWorkoutsCount} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximo treino</Text>

          {routines.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Ainda não tens treinos montados</Text>
              <Text style={styles.emptyText}>
                Cria a tua primeira rotina escolhendo os exercícios, séries e cargas.
              </Text>
              <Pressable style={styles.emptyButton} onPress={() => router.push('/workout/builder')}>
                <Text style={styles.emptyButtonText}>Criar meu primeiro treino</Text>
              </Pressable>
            </View>
          ) : todayEntry && todayEntry.routines.length > 0 ? (
            <View style={styles.cardList}>
              {todayEntry.routines.map(({ routine, progress, isCompleted }) => (
                <WorkoutDayCard
                  key={routine.id}
                  routine={routine}
                  progress={progress}
                  isCompleted={isCompleted}
                  onPress={() => router.push({ pathname: '/workout/[id]', params: { id: routine.id } })}
                />
              ))}
            </View>
          ) : (
            <View style={styles.restState}>
              <Text style={styles.restText}>Hoje é dia de descanso 💤</Text>
            </View>
          )}
        </View>

        {routines.length > 0 && (
          <View style={styles.section}>
            <WeeklySchedule
              entries={schedule}
              onSelectRoutine={(routineId) =>
                router.push({ pathname: '/workout/[id]', params: { id: routineId } })
              }
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WorkoutTheme.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WorkoutTheme.surface,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WorkoutTheme.accent,
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
  restState: {
    backgroundColor: WorkoutTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WorkoutTheme.border,
    padding: 24,
    alignItems: 'center',
  },
  restText: {
    color: WorkoutTheme.textSecondary,
    fontSize: 15,
  },
  emptyState: {
    backgroundColor: WorkoutTheme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: WorkoutTheme.border,
    padding: 20,
    gap: 8,
  },
  emptyTitle: {
    color: WorkoutTheme.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: WorkoutTheme.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  emptyButton: {
    marginTop: 8,
    height: 46,
    borderRadius: 12,
    backgroundColor: WorkoutTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyButtonText: {
    color: WorkoutTheme.accentText,
    fontSize: 14,
    fontWeight: '800',
  },
});
