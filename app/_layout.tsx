import '@/global.css';

import { SafeAreaListener, SafeAreaProvider } from 'react-native-safe-area-context';
import { Uniwind } from 'uniwind';

import { StatusBar } from 'expo-status-bar';

import { ThemeProvider, useTheme } from '@/lib/theme-context';
import {
  ThemeProvider as NavigationThemeProvider,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

function RootLayout() {
  const { colorScheme } = useTheme();

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
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
          <PortalHost />
        </SafeAreaListener>
      </SafeAreaProvider>
    </NavigationThemeProvider>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <RootLayout />
    </ThemeProvider>
  );
}
