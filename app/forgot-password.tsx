import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GymRatsTheme } from '@/constants/GymRatsTheme';
import { useAuth } from '@/lib/auth/AuthProvider';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Falta o email', 'Introduz o email da tua conta.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(email.trim());
      Alert.alert(
        'Email enviado',
        'Se existir uma conta com este email, vais receber um link para redefinir a palavra-passe.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Não foi possível enviar', error instanceof Error ? error.message : undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <SymbolView
          name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
          tintColor={GymRatsTheme.textPrimary}
          size={22}
        />
      </Pressable>
      <View style={styles.content}>
        <Text style={styles.title}>Esqueceste-te da palavra-passe?</Text>
        <Text style={styles.subtitle}>
          Introduz o email associado à tua conta e enviamos-te um link para a redefinires.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="tu@exemplo.com"
            placeholderTextColor={GymRatsTheme.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>

        <Pressable style={styles.submitButton} disabled={isSubmitting} onPress={handleSubmit}>
          {isSubmitting ? (
            <ActivityIndicator color={GymRatsTheme.background} />
          ) : (
            <Text style={styles.submitButtonText}>Enviar link de redefinição</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GymRatsTheme.background,
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: 8,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 4,
    gap: 20,
  },
  title: {
    color: GymRatsTheme.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: GymRatsTheme.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  field: {
    gap: 6,
  },
  label: {
    color: GymRatsTheme.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    backgroundColor: GymRatsTheme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GymRatsTheme.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: GymRatsTheme.textPrimary,
    fontSize: 15,
  },
  submitButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: GymRatsTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: GymRatsTheme.background,
    fontSize: 15,
    fontWeight: '800',
  },
});
