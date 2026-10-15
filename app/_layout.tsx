import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/context/AuthContext';
import { SectorProvider } from '../src/context/SectorContext';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { AppointmentsProvider } from '../src/context/AppointmentsContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SectorProvider>
          <FavoritesProvider>
            <AppointmentsProvider>
              <StatusBar style="light" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="chat/[id]" options={{ presentation: 'card' }} />
                <Stack.Screen name="provider/[id]" options={{ presentation: 'card' }} />
              </Stack>
            </AppointmentsProvider>
          </FavoritesProvider>
        </SectorProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
