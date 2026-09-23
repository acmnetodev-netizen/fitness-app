import * as ImagePicker from 'expo-image-picker';
import { SymbolView } from 'expo-symbols';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConversationListItem } from '@/components/chat/ConversationListItem';
import { NewChatFab } from '@/components/chat/NewChatFab';
import { GymRatsTheme } from '@/constants/GymRatsTheme';
import { fetchConversations } from '@/lib/chat/api';
import { useAuth } from '@/lib/auth/AuthProvider';
import type { ConversationSummary } from '@/types/chat';

export default function ChatHubScreen() {
  const { session, signOut } = useAuth();
  const userId = session?.user.id;
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await fetchConversations(userId);
      setConversations(data);
    } catch (error) {
      Alert.alert('Não foi possível carregar as conversas', error instanceof Error ? error.message : undefined);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [loadConversations])
  );

  const openConversation = (conversation: ConversationSummary) => {
    router.push({ pathname: '/chat/[id]', params: { id: conversation.id, name: conversation.name } });
  };

  const handleNewConversation = () => {
    router.push('/chat/new');
  };

  const handleShareCheckIn = () => {
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

    router.push({ pathname: '/chat/new', params: { checkinUri: result.assets[0].uri } });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Gym Rats</Text>
          <Text style={styles.subtitle}>A tua equipa de treino</Text>
        </View>
        <Pressable style={styles.signOutButton} onPress={signOut}>
          <SymbolView
            name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
            tintColor={GymRatsTheme.textSecondary}
            size={20}
          />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={GymRatsTheme.accent} />
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Ainda não tens conversas.{'\n'}Toca em + para começar.</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ConversationListItem conversation={item} onPress={() => openConversation(item)} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <NewChatFab onNewConversation={handleNewConversation} onShareCheckIn={handleShareCheckIn} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GymRatsTheme.background,
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
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: GymRatsTheme.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  signOutButton: {
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
  separator: {
    height: 1,
    backgroundColor: GymRatsTheme.border,
    marginLeft: 76,
  },
});
