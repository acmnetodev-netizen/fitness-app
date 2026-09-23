import { StyleSheet, Text, View } from 'react-native';

import { GymRatsTheme } from '@/constants/GymRatsTheme';
import type { ChatMessage } from '@/types/chat';

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export function ChatBubble({ message }: { message: ChatMessage }) {
  return (
    <View style={[styles.row, message.isMine ? styles.rowMine : styles.rowOther]}>
      <View style={[styles.bubble, message.isMine ? styles.bubbleMine : styles.bubbleOther]}>
        {!message.isMine && <Text style={styles.senderName}>{message.senderName}</Text>}
        {message.content && (
          <Text style={message.isMine ? styles.textMine : styles.textOther}>{message.content}</Text>
        )}
        <Text style={[styles.time, message.isMine ? styles.timeMine : styles.timeOther]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  rowMine: {
    justifyContent: 'flex-end',
  },
  rowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 4,
  },
  bubbleMine: {
    backgroundColor: GymRatsTheme.bubbleMine,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: GymRatsTheme.bubbleOther,
    borderBottomLeftRadius: 4,
  },
  senderName: {
    color: GymRatsTheme.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  textMine: {
    color: GymRatsTheme.bubbleMineText,
    fontSize: 15,
  },
  textOther: {
    color: GymRatsTheme.bubbleOtherText,
    fontSize: 15,
  },
  time: {
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  timeMine: {
    color: 'rgba(6, 32, 18, 0.6)',
  },
  timeOther: {
    color: GymRatsTheme.textSecondary,
  },
});
