import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Text as ThemedText, View } from '@/components/Themed';
import { useAuth } from '@/lib/auth/AuthProvider';

type Provider = 'google' | 'apple';

export default function SignInScreen() {
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [pendingProvider, setPendingProvider] = useState<Provider | null>(null);

  const handleSignIn = async (provider: Provider) => {
    setPendingProvider(provider);
    try {
      await (provider === 'google' ? signInWithGoogle() : signInWithApple());
    } catch (error) {
      Alert.alert('Não foi possível iniciar sessão', error instanceof Error ? error.message : undefined);
    } finally {
      setPendingProvider(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <ThemedText style={styles.title}>Gym Rats</ThemedText>
        <ThemedText style={styles.subtitle}>Treina, come e conversa com a tua equipa.</ThemedText>
      </View>

      <View style={styles.buttons} lightColor="transparent" darkColor="transparent">
        <Pressable
          style={[styles.button, styles.googleButton]}
          disabled={pendingProvider !== null}
          onPress={() => handleSignIn('google')}>
          {pendingProvider === 'google' ? (
            <ActivityIndicator color="#1F1F1F" />
          ) : (
            <>
              <SymbolView name={{ ios: 'g.circle.fill', android: 'g_mobiledata', web: 'g_mobiledata' }} size={20} />
              <Text style={styles.googleButtonText}>Continuar com Google</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={[styles.button, styles.appleButton]}
          disabled={pendingProvider !== null}
          onPress={() => handleSignIn('apple')}>
          {pendingProvider === 'apple' ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <SymbolView
                name={{ ios: 'apple.logo' }}
                fallback={null}
                tintColor="#FFFFFF"
                size={20}
              />
              <Text style={styles.appleButtonText}>Continuar com Apple</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 64,
  },
  hero: {
    marginTop: 48,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.7,
  },
  buttons: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 12,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
  },
  googleButtonText: {
    color: '#1F1F1F',
    fontSize: 16,
    fontWeight: '600',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
