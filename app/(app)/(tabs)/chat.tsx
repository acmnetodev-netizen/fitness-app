import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatComposer } from '@/components/chat/ChatComposer';
import { GymRatsTheme } from '@/constants/GymRatsTheme';
import { useAuth } from '@/lib/auth/AuthProvider';
import { fetchMessages, getDisplayName, sendTextMessage, subscribeToMessages } from '@/lib/chat/api';
import type { ChatMessage } from '@/types/chat';

export default function ChatRoomScreen() {
  const { session, signOut } = useAuth();
  const user = session?.user;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => (prev.some((m) => m.id === message.id) ? prev : [...prev, message]));
  }, []);

  useEffect(() => {
    if (!user) return;
    const userName = getDisplayName(user);

    let isMounted = true;
    fetchMessages(user.id, userName)
      .then((data) => {
        if (isMounted) setMessages(data);
      })
      .catch((error) => {
        Alert.alert('Não foi possível carregar as mensagens', error instanceof Error ? error.message : undefined);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    const unsubscribe = subscribeToMessages(user.id, userName, appendMessage);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user, appendMessage]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, []);

  const handleSendText = async (text: string) => {
    try {
      await sendTextMessage(text);
      scrollToEnd();
    } catch (error) {
      Alert.alert('Não foi possível enviar a mensagem', error instanceof Error ? error.message : undefined);
      throw error;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gym Rats</Text>
          <Text style={styles.subtitle}>Sala da equipa de treino</Text>
        </View>
        <Pressable style={styles.iconButton} onPress={signOut}>
          <SymbolView
            name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
            tintColor={GymRatsTheme.textSecondary}
            size={18}
          />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={GymRatsTheme.accent} />
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Ainda não há mensagens.{'\n'}Diz olá à equipa 👋</Text>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={scrollToEnd}
          />
        )}

        <ChatComposer onSendText={handleSendText} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    color: GymRatsTheme.textPrimary,
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: GymRatsTheme.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GymRatsTheme.surface,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: GymRatsTheme.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  messagesContent: {
    paddingVertical: 12,
  },
});
