import { Stack } from 'expo-router';

import { WorkoutProvider } from '@/lib/workout/WorkoutProvider';

export default function AppLayout() {
  return (
    <WorkoutProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen
          name="chat/[id]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen name="chat/new" options={{ presentation: 'modal', title: 'Nova conversa' }} />
        <Stack.Screen
          name="workout/[id]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="workout/builder"
          options={{ presentation: 'modal', title: 'Novo treino' }}
        />
        <Stack.Screen
          name="workout/equipment"
          options={{ presentation: 'modal', title: 'Equipamentos disponíveis' }}
        />
      </Stack>
    </WorkoutProvider>
  );
}
