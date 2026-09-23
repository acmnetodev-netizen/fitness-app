import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { GymRatsTheme } from '@/constants/GymRatsTheme';

type Props = {
  onSendText: (text: string) => Promise<void>;
};

export function ChatComposer({ onSendText }: Props) {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendText = async () => {
    const value = text.trim();
    if (!value || isSending) return;
    setIsSending(true);
    try {
      await onSendText(value);
      setText('');
    } catch {
      // The caller already surfaced an alert; keep the text so the user can retry.
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Escreve uma mensagem"
        placeholderTextColor={GymRatsTheme.textSecondary}
        multiline
        editable={!isSending}
      />
      <Pressable
        style={[styles.sendButton, (!text.trim() || isSending) && styles.sendButtonDisabled]}
        disabled={!text.trim() || isSending}
        onPress={handleSendText}>
        {isSending ? (
          <ActivityIndicator size="small" color={GymRatsTheme.background} />
        ) : (
          <SymbolView
            name={{ ios: 'arrow.up', android: 'arrow_upward', web: 'arrow_upward' }}
            tintColor={GymRatsTheme.background}
            size={18}
          />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: GymRatsTheme.surface,
    borderTopWidth: 1,
    borderTopColor: GymRatsTheme.border,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    backgroundColor: GymRatsTheme.surfaceAlt,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: GymRatsTheme.textPrimary,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GymRatsTheme.accent,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
});
