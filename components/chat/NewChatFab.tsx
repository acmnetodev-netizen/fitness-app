import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { GymRatsTheme } from '@/constants/GymRatsTheme';

type Props = {
  onNewConversation: () => void;
  onShareCheckIn: () => void;
};

export function NewChatFab({ onNewConversation, onShareCheckIn }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Pressable style={styles.fab} onPress={() => setIsMenuOpen(true)}>
        <SymbolView
          name={{ ios: 'plus', android: 'add', web: 'add' }}
          tintColor={GymRatsTheme.background}
          size={26}
        />
      </Pressable>

      <Modal visible={isMenuOpen} transparent animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIsMenuOpen(false)}>
          <View style={styles.menu}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                onNewConversation();
              }}>
              <SymbolView
                name={{ ios: 'bubble.left.and.bubble.right.fill', android: 'chat_bubble', web: 'chat_bubble' }}
                tintColor={GymRatsTheme.accent}
                size={20}
              />
              <Text style={styles.menuText}>Nova conversa</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                onShareCheckIn();
              }}>
              <SymbolView
                name={{ ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' }}
                tintColor={GymRatsTheme.accentAlt}
                size={20}
              />
              <Text style={styles.menuText}>Partilhar check-in</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: GymRatsTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GymRatsTheme.accent,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: GymRatsTheme.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 8,
    paddingBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuDivider: {
    height: 1,
    backgroundColor: GymRatsTheme.border,
    marginHorizontal: 20,
  },
  menuText: {
    color: GymRatsTheme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
