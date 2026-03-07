import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Stack } from 'expo-router';

import { PortalHost } from '@rn-primitives/portal';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider, useTheme } from '@/lib/theme-context';

function RootLayout() {
  const { colorScheme } = useTheme();

  return (
    <NavigationThemeProvider value={NAV_THEME[colorScheme]}>
      <SafeAreaProvider>
        <Stack />
        <PortalHost />
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
