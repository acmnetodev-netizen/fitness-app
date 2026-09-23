import * as ImagePicker from 'expo-image-picker';
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
import { fetchMessages, getDisplayName, sendImageMessage, sendTextMessage, subscribeToMessages } from '@/lib/chat/api';
import type { ChatMessage } from '@/types/chat';

export default function ChatRoomScreen() {
  const { session, signOut } = useAuth();
  const user = session?.user;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    fetchMessages(user.id)
      .then((data) => {
        if (isMounted) setMessages(data);
      })
      .catch((error) => {
        Alert.alert('Não foi possível carregar as mensagens', error instanceof Error ? error.message : undefined);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    const unsubscribe = subscribeToMessages(user.id, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }, []);

  const handleSendText = async (text: string) => {
    if (!user) return;
    const userName = getDisplayName(user);
    const tempId = `optimistic-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        senderId: user.id,
        senderName: userName,
        content: text,
        imageUrl: null,
        createdAt: new Date().toISOString(),
        isMine: true,
      },
    ]);
    scrollToEnd();
    try {
      await sendTextMessage(user.id, userName, text);
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      Alert.alert('Não foi possível enviar a mensagem', error instanceof Error ? error.message : undefined);
    }
  };

  const handleSendImage = async (localUri: string) => {
    if (!user) return;
    const userName = getDisplayName(user);
    const tempId = `optimistic-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        senderId: user.id,
        senderName: userName,
        content: null,
        imageUrl: localUri,
        createdAt: new Date().toISOString(),
        isMine: true,
      },
    ]);
    scrollToEnd();
    try {
      await sendImageMessage(user.id, userName, localUri);
    } catch (error) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      Alert.alert('Não foi possível enviar a foto', error instanceof Error ? error.message : undefined);
    }
  };

  const handleCheckIn = () => {
    Alert.alert('Partilhar check-in', 'Escolhe uma foto do treino de hoje', [
      { text: 'Câmara', onPress: () => pickCheckInPhoto('camera') },
      { text: 'Galeria', onPress: () => pickCheckInPhoto('library') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const pickCheckInPhoto = async (source: 'camera' | 'library') => {
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
    handleSendImage(result.assets[0].uri);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gym Rats</Text>
          <Text style={styles.subtitle}>Sala da equipa de treino</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton} onPress={handleCheckIn}>
            <SymbolView
              name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
              tintColor={GymRatsTheme.accentAlt}
              size={18}
            />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={signOut}>
            <SymbolView
              name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
              tintColor={GymRatsTheme.textSecondary}
              size={18}
            />
          </Pressable>
        </View>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
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
