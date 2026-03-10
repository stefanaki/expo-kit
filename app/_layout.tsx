import '@/global.css';

import { SafeAreaListener, SafeAreaProvider } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

import { StatusBar } from 'expo-status-bar';

import { queryClient } from '@/config/query-client';
import { useAuthBootstrap } from '@/lib/auth/use-auth-bootstrap';
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
  useAuthBootstrap();

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
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(stack)" />
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
