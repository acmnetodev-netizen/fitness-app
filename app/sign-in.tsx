import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GymRatsTheme } from '@/constants/GymRatsTheme';
import { useAuth } from '@/lib/auth/AuthProvider';

type Mode = 'signIn' | 'signUp';

export default function SignInScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Faltam dados', 'Preenche o email e a palavra-passe.');
      return;
    }
    if (mode === 'signUp' && !name.trim()) {
      Alert.alert('Faltam dados', 'Preenche o teu nome.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signIn') {
        await signIn(email.trim(), password);
      } else {
        const { needsEmailConfirmation } = await signUp(name.trim(), email.trim(), password);
        if (needsEmailConfirmation) {
          Alert.alert(
            'Confirma o teu email',
            'Enviámos um link de confirmação para o teu email. Confirma para poderes entrar.'
          );
          setMode('signIn');
        }
      }
    } catch (error) {
      Alert.alert('Não foi possível continuar', error instanceof Error ? error.message : undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Text style={styles.title}>Gym Rats</Text>
            <Text style={styles.subtitle}>Treina, come e conversa com a tua equipa.</Text>
          </View>

          <View style={styles.toggle}>
            <Pressable
              style={[styles.toggleButton, mode === 'signIn' && styles.toggleButtonActive]}
              onPress={() => setMode('signIn')}>
              <Text style={[styles.toggleText, mode === 'signIn' && styles.toggleTextActive]}>
                Iniciar Sessão
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggleButton, mode === 'signUp' && styles.toggleButtonActive]}
              onPress={() => setMode('signUp')}>
              <Text style={[styles.toggleText, mode === 'signUp' && styles.toggleTextActive]}>
                Criar Conta
              </Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            {mode === 'signUp' && (
              <View style={styles.field}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="O teu nome"
                  placeholderTextColor={GymRatsTheme.textSecondary}
                  autoCapitalize="words"
                />
              </View>
            )}

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

            <View style={styles.field}>
              <Text style={styles.label}>Palavra-passe</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={GymRatsTheme.textSecondary}
                secureTextEntry
              />
            </View>

            {mode === 'signIn' && (
              <Pressable onPress={() => router.push('/forgot-password')}>
                <Text style={styles.forgotLink}>Esqueceu-se da palavra-passe?</Text>
              </Pressable>
            )}
          </View>

          <Pressable style={styles.submitButton} disabled={isSubmitting} onPress={handleSubmit}>
            {isSubmitting ? (
              <ActivityIndicator color={GymRatsTheme.background} />
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === 'signIn' ? 'Entrar' : 'Criar Conta'}
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GymRatsTheme.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    gap: 28,
  },
  hero: {
    gap: 8,
  },
  title: {
    color: GymRatsTheme.textPrimary,
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: GymRatsTheme.textSecondary,
    fontSize: 16,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: GymRatsTheme.surface,
    borderRadius: 14,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonActive: {
    backgroundColor: GymRatsTheme.accent,
  },
  toggleText: {
    color: GymRatsTheme.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: GymRatsTheme.background,
  },
  form: {
    gap: 16,
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
  forgotLink: {
    color: GymRatsTheme.accent,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
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
    fontSize: 16,
    fontWeight: '800',
  },
});
