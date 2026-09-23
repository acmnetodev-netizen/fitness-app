import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { GymRatsTheme } from '@/constants/GymRatsTheme';
import type { ConversationSummary } from '@/types/chat';

function formatTimestamp(iso: string | null) {
  if (!iso) return '';
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  return isToday
    ? date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
}

type Props = {
  conversation: ConversationSummary;
  onPress: () => void;
};

export function ConversationListItem({ conversation, onPress }: Props) {
  const initial = conversation.name.charAt(0).toUpperCase();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.containerPressed]}>
      <View style={styles.avatar}>
        {conversation.isGroup ? (
          <SymbolView
            name={{ ios: 'person.3.fill', android: 'groups', web: 'groups' }}
            tintColor={GymRatsTheme.background}
            size={20}
          />
        ) : (
          <Text style={styles.avatarText}>{initial}</Text>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {conversation.name}
        </Text>
        <Text style={styles.preview} numberOfLines={1}>
          {conversation.lastMessage ?? 'Diz olá 👋'}
        </Text>
      </View>
      <Text style={styles.timestamp}>{formatTimestamp(conversation.lastMessageAt)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  containerPressed: {
    backgroundColor: GymRatsTheme.surfaceAlt,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: GymRatsTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: GymRatsTheme.background,
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: GymRatsTheme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    color: GymRatsTheme.textSecondary,
    fontSize: 14,
  },
  timestamp: {
    color: GymRatsTheme.textSecondary,
    fontSize: 12,
  },
});
