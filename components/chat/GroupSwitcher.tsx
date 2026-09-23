import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { GymRatsTheme } from '@/constants/GymRatsTheme';
import type { ChatGroup } from '@/types/chat';

type Props = {
  groups: ChatGroup[];
  activeGroupId: string | null;
  onSelect: (groupId: string | null) => void;
  onAddPress: () => void;
};

export function GroupSwitcher({ groups, activeGroupId, onSelect, onAddPress }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Pressable
        style={[styles.chip, activeGroupId === null && styles.chipActive]}
        onPress={() => onSelect(null)}>
        <Text style={[styles.chipText, activeGroupId === null && styles.chipTextActive]}>Sala Geral</Text>
      </Pressable>

      {groups.map((group) => (
        <Pressable
          key={group.id}
          style={[styles.chip, activeGroupId === group.id && styles.chipActive]}
          onPress={() => onSelect(group.id)}>
          <Text style={[styles.chipText, activeGroupId === group.id && styles.chipTextActive]} numberOfLines={1}>
            {group.name}
          </Text>
        </Pressable>
      ))}

      <Pressable style={styles.addButton} onPress={onAddPress}>
        <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} tintColor={GymRatsTheme.background} size={16} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: GymRatsTheme.surface,
    borderWidth: 1,
    borderColor: GymRatsTheme.border,
    maxWidth: 160,
  },
  chipActive: {
    backgroundColor: GymRatsTheme.accent,
    borderColor: GymRatsTheme.accent,
  },
  chipText: {
    color: GymRatsTheme.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: GymRatsTheme.background,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GymRatsTheme.accent,
  },
});
