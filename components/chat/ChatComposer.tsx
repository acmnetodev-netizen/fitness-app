import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { GymRatsTheme } from '@/constants/GymRatsTheme';

type Props = {
  onSendText: (text: string) => Promise<void>;
  onSendImage: (localUri: string) => Promise<void>;
};

export function ChatComposer({ onSendText, onSendImage }: Props) {
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

  const handleAttach = () => {
    if (isSending) return;
    Alert.alert('Enviar foto', 'Escolhe a origem da imagem', [
      { text: 'Câmara', onPress: () => pickImage('camera') },
      { text: 'Galeria', onPress: () => pickImage('library') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const pickImage = async (source: 'camera' | 'library') => {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({ quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (result.canceled || !result.assets[0]) return;

    setIsSending(true);
    try {
      await onSendImage(result.assets[0].uri);
    } catch {
      // The caller already surfaced an alert.
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.attachButton} disabled={isSending} onPress={handleAttach}>
        <SymbolView
          name={{ ios: 'paperclip', android: 'attach_file', web: 'attach_file' }}
          tintColor={GymRatsTheme.textPrimary}
          size={20}
        />
      </Pressable>
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
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GymRatsTheme.surfaceAlt,
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
