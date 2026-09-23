import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CircularProgress } from '@/components/workout/CircularProgress';
import { ExerciseListItem } from '@/components/workout/ExerciseListItem';
import { WorkoutTheme } from '@/constants/WorkoutTheme';
import { getExerciseById } from '@/data/exercises';
import { getTodayISODate } from '@/lib/workout/schedule';
import { useWorkout } from '@/lib/workout/WorkoutProvider';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { routines, getSession, toggleExerciseDone, setSessionCompleted, deleteRoutine } = useWorkout();
  const routine = routines.find((item) => item.id === id);
  const today = getTodayISODate();

  if (!routine) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Treino não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const session = getSession(routine.id, today);
  const completedExerciseIds = session?.completedExerciseIds ?? [];
  const isCompleted = session?.isCompleted ?? false;
  const progress = routine.exercises.length > 0 ? completedExerciseIds.length / routine.exercises.length : 0;

  const handleComplete = () => {
    const pending = routine.exercises.length - completedExerciseIds.length;
    if (pending > 0) {
      Alert.alert(
        'Ainda faltam exercícios',
        `Tens ${pending} exercício(s) por marcar. Concluir o treino mesmo assim?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Concluir', onPress: () => setSessionCompleted(routine.id, today, true) },
        ]
      );
      return;
    }
    setSessionCompleted(routine.id, today, true);
  };

  const handleDelete = () => {
    Alert.alert('Apagar treino', `Queres mesmo apagar "${routine.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: () => {
          deleteRoutine(routine.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            tintColor={WorkoutTheme.textPrimary}
            size={22}
          />
        </Pressable>
        <View style={styles.headerBody}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {routine.name}
          </Text>
          <Text style={styles.headerSubtitle}>{routine.weekDays.join(', ')}</Text>
        </View>
        <Pressable style={styles.iconButton} onPress={handleDelete}>
          <SymbolView
            name={{ ios: 'trash', android: 'delete', web: 'delete' }}
            tintColor={WorkoutTheme.textSecondary}
            size={20}
          />
        </Pressable>
        <CircularProgress progress={progress} size={48} strokeWidth={4} />
      </View>

      <FlatList
        data={routine.exercises}
        keyExtractor={(item) => item.exerciseId}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const exercise = getExerciseById(item.exerciseId);
          if (!exercise) return null;
          return (
            <ExerciseListItem
              exercise={exercise}
              routineExercise={item}
              isDone={completedExerciseIds.includes(item.exerciseId)}
              onToggle={() => toggleExerciseDone(routine.id, today, item.exerciseId)}
            />
          );
        }}
      />

      <View style={styles.footer}>
        {isCompleted ? (
          <View style={styles.completedRow}>
            <Pressable style={styles.completedButton} disabled>
              <SymbolView
                name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
                tintColor={WorkoutTheme.accentText}
                size={18}
              />
              <Text style={styles.startButtonText}>TREINO CONCLUÍDO</Text>
            </Pressable>
            <Pressable onPress={() => setSessionCompleted(routine.id, today, false)}>
              <Text style={styles.undoLink}>Marcar como não feito</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.startButton} onPress={handleComplete}>
            <Text style={styles.startButtonText}>CONCLUIR TREINO</Text>
          </Pressable>
        )}
      </View>
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
  notFoundText: {
    color: WorkoutTheme.textSecondary,
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: WorkoutTheme.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBody: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    color: WorkoutTheme.textPrimary,
    fontSize: 17,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: WorkoutTheme.textSecondary,
    fontSize: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
  separator: {
    height: 10,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: WorkoutTheme.background,
    borderTopWidth: 1,
    borderTopColor: WorkoutTheme.border,
    gap: 10,
  },
  startButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: WorkoutTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedRow: {
    gap: 8,
    alignItems: 'center',
  },
  completedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    width: '100%',
    borderRadius: 14,
    backgroundColor: WorkoutTheme.accent,
    opacity: 0.9,
  },
  startButtonText: {
    color: WorkoutTheme.accentText,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  undoLink: {
    color: WorkoutTheme.textSecondary,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
