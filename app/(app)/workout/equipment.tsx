import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WorkoutTheme } from '@/constants/WorkoutTheme';
import { useWorkout } from '@/lib/workout/WorkoutProvider';
import { EQUIPMENT_OPTIONS, type Equipment } from '@/types/workout';

export default function EquipmentScreen() {
  const { equipment, setEquipment } = useWorkout();
  const [selected, setSelected] = useState<Equipment[]>(equipment);

  const toggle = (item: Equipment) => {
    setSelected((prev) => (prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]));
  };

  const handleSave = () => {
    setEquipment(selected);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.subtitle}>
        Marca o que tens disponível na tua academia. Vamos filtrar os exercícios do criador de
        treinos de acordo com isto.
      </Text>

      <View style={styles.list}>
        {EQUIPMENT_OPTIONS.map((item) => {
          const isSelected = selected.includes(item);
          return (
            <Pressable key={item} style={styles.row} onPress={() => toggle(item)}>
              <Text style={styles.rowLabel}>{item}</Text>
              <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                {isSelected && (
                  <SymbolView
                    name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                    tintColor={WorkoutTheme.accentText}
                    size={16}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WorkoutTheme.background,
    padding: 20,
    gap: 20,
  },
  subtitle: {
    color: WorkoutTheme.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: WorkoutTheme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: WorkoutTheme.border,
    padding: 16,
  },
  rowLabel: {
    color: WorkoutTheme.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: WorkoutTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: WorkoutTheme.accent,
    borderColor: WorkoutTheme.accent,
  },
  saveButton: {
    marginTop: 'auto',
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
