import { Pressable, StyleSheet, Text } from 'react-native';

import { WorkoutTheme } from '@/constants/WorkoutTheme';

type Props = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

export function Chip({ label, isSelected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected]}>
      <Text style={[styles.label, isSelected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: WorkoutTheme.accent,
    borderColor: WorkoutTheme.accent,
  },
  chipUnselected: {
    backgroundColor: WorkoutTheme.surface,
    borderColor: WorkoutTheme.border,
  },
  label: {
    color: WorkoutTheme.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  labelSelected: {
    color: WorkoutTheme.accentText,
  },
});
