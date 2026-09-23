import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ConversationListItem } from '@/components/chat/ConversationListItem';
import { GymRatsTheme } from '@/constants/GymRatsTheme';
import { useAuth } from '@/lib/auth/AuthProvider';
import {
  fetchConversations,
  findOrCreateDirectConversation,
  searchProfiles,
  sendImageMessage,
} from '@/lib/chat/api';
import type { ConversationSummary, Profile } from '@/types/chat';

export default function NewConversationScreen() {
  const { checkinUri } = useLocalSearchParams<{ checkinUri?: string }>();
  const { session } = useAuth();
  const userId = session?.user.id;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchConversations(userId).then(setConversations).catch(() => {});
  }, [userId]);

  useEffect(() => {
    if (!userId || !query.trim()) return;
    setIsSearching(true);
    const timeout = setTimeout(() => {
      searchProfiles(query, userId)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setIsSearching(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, userId]);

  const openConversation = useCallback(
    async (conversationId: string, name: string) => {
      if (checkinUri && userId) {
        try {
          await sendImageMessage(conversationId, userId, checkinUri);
        } catch (error) {
          Alert.alert('Não foi possível partilhar o check-in', error instanceof Error ? error.message : undefined);
        }
      }
      router.replace({ pathname: '/chat/[id]', params: { id: conversationId, name } });
    },
    [checkinUri, userId]
  );

  const handleSelectProfile = async (profile: Profile) => {
    if (!userId || isBusy) return;
    setIsBusy(true);
    try {
      const conversationId = await findOrCreateDirectConversation(userId, profile.id);
      await openConversation(conversationId, profile.username);
    } catch (error) {
      Alert.alert('Não foi possível iniciar a conversa', error instanceof Error ? error.message : undefined);
    } finally {
      setIsBusy(false);
    }
  };

  const handleSelectConversation = async (conversation: ConversationSummary) => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      await openConversation(conversation.id, conversation.name);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {checkinUri && (
        <View style={styles.banner}>
          <SymbolView
            name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
            tintColor={GymRatsTheme.accentAlt}
            size={18}
          />
          <Text style={styles.bannerText}>A partilhar o teu check-in — escolhe para quem enviar</Text>
        </View>
      )}

      <View style={styles.searchRow}>
        <SymbolView
          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          tintColor={GymRatsTheme.textSecondary}
          size={18}
        />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Procurar por nome de utilizador"
          placeholderTextColor={GymRatsTheme.textSecondary}
          autoCapitalize="none"
        />
        {isSearching && <ActivityIndicator size="small" color={GymRatsTheme.accent} />}
      </View>

      {query.trim().length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            !isSearching ? (
              <Text style={styles.emptyText}>Nenhum Gym Rat encontrado.</Text>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.profileRow, pressed && styles.profileRowPressed]}
              disabled={isBusy}
              onPress={() => handleSelectProfile(item)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.username.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.profileName}>{item.username}</Text>
            </Pressable>
          )}
        />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            conversations.length > 0 ? <Text style={styles.sectionLabel}>As tuas conversas</Text> : null
          }
          renderItem={({ item }) => (
            <ConversationListItem conversation={item} onPress={() => handleSelectConversation(item)} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GymRatsTheme.background,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: GymRatsTheme.surfaceAlt,
  },
  bannerText: {
    flex: 1,
    color: GymRatsTheme.textPrimary,
    fontSize: 13,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: GymRatsTheme.surface,
  },
  searchInput: {
    flex: 1,
    color: GymRatsTheme.textPrimary,
    fontSize: 15,
  },
  sectionLabel: {
    color: GymRatsTheme.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  emptyText: {
    color: GymRatsTheme.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileRowPressed: {
    backgroundColor: GymRatsTheme.surfaceAlt,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: GymRatsTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: GymRatsTheme.background,
    fontWeight: '700',
  },
  profileName: {
    color: GymRatsTheme.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});
