import '@/global.css';
import '@/config/i18n';

import { SafeAreaListener, SafeAreaProvider } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

import { StatusBar } from 'expo-status-bar';

import { queryClient } from '@/config/query-client';
import { useAuthStore } from '@/lib/auth';
import { useSystemLocale } from '@/lib/locale';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

function RootLayout() {
  const { colorScheme } = useTheme();
  const hydrate = useAuthStore((s) => s.hydrate);
  useSystemLocale();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    Uniwind.setTheme(colorScheme);
  }, [colorScheme]);

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <SafeAreaListener
          onChange={({ insets }) => {
            Uniwind.updateInsets(insets);
          }}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

          <Stack>
            <Stack.Screen name="(tabs)" options={{ title: 'Tabs', headerShown: false }} />
            <Stack.Screen name="(stack)" options={{ title: 'Stack' }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>

          <PortalHost />
        </SafeAreaListener>
      </SafeAreaProvider>
    </NavigationThemeProvider>
  );
}

export default function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RootLayout />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
