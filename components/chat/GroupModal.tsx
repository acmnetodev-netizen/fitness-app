import { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { GymRatsTheme } from '@/constants/GymRatsTheme';
import { createGroup, joinGroupByCode } from '@/lib/chat/api';
import type { ChatGroup } from '@/types/chat';

type Mode = 'create' | 'join';

type Props = {
  visible: boolean;
  userId: string;
  onClose: () => void;
  onGroupReady: (group: ChatGroup) => void;
};

export function GroupModal({ visible, userId, onClose, onGroupReady }: Props) {
  const [mode, setMode] = useState<Mode>('create');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGroup, setCreatedGroup] = useState<ChatGroup | null>(null);

  const reset = () => {
    setMode('create');
    setName('');
    setCode('');
    setCreatedGroup(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      const group = await createGroup(name, userId);
      setCreatedGroup(group);
      onGroupReady(group);
    } catch (error) {
      Alert.alert('Não foi possível criar o grupo', error instanceof Error ? error.message : undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoin = async () => {
    setIsSubmitting(true);
    try {
      const group = await joinGroupByCode(code, userId);
      onGroupReady(group);
      handleClose();
    } catch (error) {
      Alert.alert('Não foi possível entrar no grupo', error instanceof Error ? error.message : undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{createdGroup ? 'Grupo criado!' : 'Equipas'}</Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <SymbolView name={{ ios: 'xmark', android: 'close', web: 'close' }} tintColor={GymRatsTheme.textSecondary} size={18} />
            </Pressable>
          </View>

          {createdGroup ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                Partilha este código com a tua equipa para se juntarem a &quot;{createdGroup.name}&quot;:
              </Text>
              <Text style={styles.codeText}>{createdGroup.code}</Text>
              <Pressable style={styles.submitButton} onPress={handleClose}>
                <Text style={styles.submitButtonText}>Concluído</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.toggle}>
                <Pressable
                  style={[styles.toggleButton, mode === 'create' && styles.toggleButtonActive]}
                  onPress={() => setMode('create')}>
                  <Text style={[styles.toggleText, mode === 'create' && styles.toggleTextActive]}>
                    Criar grupo
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.toggleButton, mode === 'join' && styles.toggleButtonActive]}
                  onPress={() => setMode('join')}>
                  <Text style={[styles.toggleText, mode === 'join' && styles.toggleTextActive]}>
                    Entrar em grupo
                  </Text>
                </Pressable>
              </View>

              {mode === 'create' ? (
                <View style={styles.form}>
                  <Text style={styles.label}>Nome do grupo</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ex: Treino de manhã"
                    placeholderTextColor={GymRatsTheme.textSecondary}
                  />
                  <Pressable
                    style={[styles.submitButton, !name.trim() && styles.submitButtonDisabled]}
                    disabled={!name.trim() || isSubmitting}
                    onPress={handleCreate}>
                    {isSubmitting ? (
                      <ActivityIndicator color={GymRatsTheme.background} />
                    ) : (
                      <Text style={styles.submitButtonText}>Criar grupo</Text>
                    )}
                  </Pressable>
                </View>
              ) : (
                <View style={styles.form}>
                  <Text style={styles.label}>Código do grupo</Text>
                  <TextInput
                    style={styles.input}
                    value={code}
                    onChangeText={setCode}
                    placeholder="Ex: A1B2C3"
                    placeholderTextColor={GymRatsTheme.textSecondary}
                    autoCapitalize="characters"
                  />
                  <Pressable
                    style={[styles.submitButton, !code.trim() && styles.submitButtonDisabled]}
                    disabled={!code.trim() || isSubmitting}
                    onPress={handleJoin}>
                    {isSubmitting ? (
                      <ActivityIndicator color={GymRatsTheme.background} />
                    ) : (
                      <Text style={styles.submitButtonText}>Entrar</Text>
                    )}
                  </Pressable>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: GymRatsTheme.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: GymRatsTheme.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GymRatsTheme.surfaceAlt,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: GymRatsTheme.surfaceAlt,
    borderRadius: 14,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: GymRatsTheme.accent,
  },
  toggleText: {
    color: GymRatsTheme.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: GymRatsTheme.background,
  },
  form: {
    gap: 12,
  },
  label: {
    color: GymRatsTheme.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    backgroundColor: GymRatsTheme.surfaceAlt,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GymRatsTheme.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: GymRatsTheme.textPrimary,
    fontSize: 15,
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: GymRatsTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: GymRatsTheme.background,
    fontSize: 15,
    fontWeight: '800',
  },
  successBox: {
    gap: 14,
    alignItems: 'center',
  },
  successText: {
    color: GymRatsTheme.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  codeText: {
    color: GymRatsTheme.accent,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
  },
});
