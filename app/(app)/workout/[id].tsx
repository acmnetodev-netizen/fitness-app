import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CircularProgress } from '@/components/workout/CircularProgress';
import { ExerciseListItem } from '@/components/workout/ExerciseListItem';
import { WorkoutTheme } from '@/constants/WorkoutTheme';
import { workoutDays } from '@/data/workouts';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const day = workoutDays.find((item) => item.id === id);

  if (!day) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Treino não encontrado.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            tintColor={WorkoutTheme.textPrimary}
            size={22}
          />
        </Pressable>
        <View style={styles.headerBody}>
          <Text style={styles.headerTitle}>{day.title}</Text>
          <Text style={styles.headerSubtitle}>{day.dayNumber}º dia de treino</Text>
        </View>
        <CircularProgress progress={day.progress} size={48} strokeWidth={4} />
      </View>

      <FlatList
        data={day.exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => <ExerciseListItem exercise={item} index={index} />}
      />

      <View style={styles.footer}>
        <Pressable style={styles.startButton}>
          <Text style={styles.startButtonText}>COMEÇAR TREINO</Text>
        </Pressable>
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
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: WorkoutTheme.border,
  },
  backButton: {
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
    fontSize: 18,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: WorkoutTheme.textSecondary,
    fontSize: 13,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
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
  },
  startButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: WorkoutTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: WorkoutTheme.accentText,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
