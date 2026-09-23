import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/workout/Chip';
import { ExerciseCatalogItem } from '@/components/workout/ExerciseCatalogItem';
import { SelectedExerciseRow } from '@/components/workout/SelectedExerciseRow';
import { WorkoutTheme } from '@/constants/WorkoutTheme';
import { EXERCISE_CATALOG, getExerciseById } from '@/data/exercises';
import { useWorkout } from '@/lib/workout/WorkoutProvider';
import { MUSCLE_GROUPS, WEEK_DAYS, type MuscleGroup, type RoutineExercise, type WeekDay } from '@/types/workout';

const DEFAULT_SETS = 3;
const DEFAULT_REPS = 12;

export default function WorkoutBuilderScreen() {
  const { equipment, addRoutine } = useWorkout();

  const [name, setName] = useState('');
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | 'Todos'>('Todos');
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);

  const toggleDay = (day: WeekDay) => {
    setSelectedDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const toggleExercise = (exerciseId: string) => {
    setSelectedExercises((prev) => {
      if (prev.some((e) => e.exerciseId === exerciseId)) {
        return prev.filter((e) => e.exerciseId !== exerciseId);
      }
      return [...prev, { exerciseId, sets: DEFAULT_SETS, reps: DEFAULT_REPS, load: 0 }];
    });
  };

  const updateExercise = (next: RoutineExercise) => {
    setSelectedExercises((prev) => prev.map((e) => (e.exerciseId === next.exerciseId ? next : e)));
  };

  const removeExercise = (exerciseId: string) => {
    setSelectedExercises((prev) => prev.filter((e) => e.exerciseId !== exerciseId));
  };

  const filteredCatalog = EXERCISE_CATALOG.filter((exercise) => {
    const matchesMuscle = muscleFilter === 'Todos' || exercise.muscleGroup === muscleFilter;
    const matchesEquipment = equipment.length === 0 || equipment.includes(exercise.equipment);
    return matchesMuscle && matchesEquipment;
  });

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Dá um nome ao treino', 'Por exemplo "Treino A" ou "Costas e Bíceps".');
      return;
    }
    if (selectedDays.length === 0) {
      Alert.alert('Escolhe pelo menos um dia', 'Em que dia(s) da semana fazes este treino?');
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert('Adiciona exercícios', 'Escolhe pelo menos um exercício para o treino.');
      return;
    }

    addRoutine({
      id: `routine-${Date.now()}`,
      name: name.trim(),
      weekDays: selectedDays,
      exercises: selectedExercises,
      createdAt: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Nome do treino</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Treino A"
            placeholderTextColor={WorkoutTheme.textSecondary}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Dias da semana</Text>
          <View style={styles.chipRow}>
            {WEEK_DAYS.map((day) => (
              <Chip key={day} label={day} isSelected={selectedDays.includes(day)} onPress={() => toggleDay(day)} />
            ))}
          </View>
        </View>

        {selectedExercises.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.label}>Exercícios escolhidos ({selectedExercises.length})</Text>
            <View style={styles.selectedList}>
              {selectedExercises.map((routineExercise) => {
                const exercise = getExerciseById(routineExercise.exerciseId);
                if (!exercise) return null;
                return (
                  <SelectedExerciseRow
                    key={routineExercise.exerciseId}
                    exercise={exercise}
                    routineExercise={routineExercise}
                    onChange={updateExercise}
                    onRemove={() => removeExercise(routineExercise.exerciseId)}
                  />
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Adicionar exercícios</Text>

          {equipment.length === 0 && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Ainda não configuraste o equipamento da tua academia — a mostrar todos os
                exercícios.
              </Text>
              <Pressable onPress={() => router.push('/workout/equipment')}>
                <Text style={styles.bannerLink}>Configurar</Text>
              </Pressable>
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <View style={styles.chipRow}>
              <Chip label="Todos" isSelected={muscleFilter === 'Todos'} onPress={() => setMuscleFilter('Todos')} />
              {MUSCLE_GROUPS.map((group) => (
                <Chip
                  key={group}
                  label={group}
                  isSelected={muscleFilter === group}
                  onPress={() => setMuscleFilter(group)}
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.catalogList}>
            {filteredCatalog.map((exercise) => (
              <ExerciseCatalogItem
                key={exercise.id}
                exercise={exercise}
                isSelected={selectedExercises.some((e) => e.exerciseId === exercise.id)}
                onPress={() => toggleExercise(exercise.id)}
              />
            ))}
            {filteredCatalog.length === 0 && (
              <Text style={styles.emptyText}>Nenhum exercício disponível com este filtro.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar treino</Text>
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
  content: {
    padding: 20,
    paddingBottom: 100,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  label: {
    color: WorkoutTheme.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  nameInput: {
    backgroundColor: WorkoutTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: WorkoutTheme.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: WorkoutTheme.textPrimary,
    fontSize: 15,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  selectedList: {
    gap: 10,
  },
  catalogList: {
    gap: 10,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: WorkoutTheme.surfaceAlt,
    borderRadius: 12,
    padding: 12,
  },
  bannerText: {
    flex: 1,
    color: WorkoutTheme.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  bannerLink: {
    color: WorkoutTheme.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyText: {
    color: WorkoutTheme.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 12,
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
  saveButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: WorkoutTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: WorkoutTheme.accentText,
    fontSize: 15,
    fontWeight: '800',
  },
});
