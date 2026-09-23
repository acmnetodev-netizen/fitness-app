import { router, useLocalSearchParams } from 'expo-router';
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
import { fetchMessages, sendImageMessage, sendTextMessage, subscribeToMessages } from '@/lib/chat/api';
import type { ChatMessage } from '@/types/chat';

export default function ChatRoomScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const { session } = useAuth();
  const userId = session?.user.id;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    if (!userId || !id) return;

    let isMounted = true;
    fetchMessages(id, userId)
      .then((data) => {
        if (isMounted) setMessages(data);
      })
      .catch((error) => {
        Alert.alert('Não foi possível carregar as mensagens', error instanceof Error ? error.message : undefined);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    const unsubscribe = subscribeToMessages(id, userId, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [id, userId]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, []);

  const handleSendText = async (text: string) => {
    if (!userId || !id) return;
    const tempId = `optimistic-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        conversationId: id,
        senderId: userId,
        senderName: 'Tu',
        content: text,
        imageUrl: null,
        createdAt: new Date().toISOString(),
        isMine: true,
      },
    ]);
    scrollToEnd();
    try {
      await sendTextMessage(id, userId, text);
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      Alert.alert('Não foi possível enviar a mensagem', error instanceof Error ? error.message : undefined);
    }
  };

  const handleSendImage = async (localUri: string) => {
    if (!userId || !id) return;
    const tempId = `optimistic-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        conversationId: id,
        senderId: userId,
        senderName: 'Tu',
        content: null,
        imageUrl: localUri,
        createdAt: new Date().toISOString(),
        isMine: true,
      },
    ]);
    scrollToEnd();
    try {
      await sendImageMessage(id, userId, localUri);
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      Alert.alert('Não foi possível enviar a foto', error instanceof Error ? error.message : undefined);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            tintColor={GymRatsTheme.textPrimary}
            size={22}
          />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {name ?? 'Conversa'}
        </Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={GymRatsTheme.accent} />
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

        <ChatComposer onSendText={handleSendText} onSendImage={handleSendImage} />
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
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: GymRatsTheme.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: GymRatsTheme.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContent: {
    paddingVertical: 12,
  },
});
