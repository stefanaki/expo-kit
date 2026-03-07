import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Stack } from 'expo-router';

import { PortalHost } from '@rn-primitives/portal';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack />
      <PortalHost />
    </SafeAreaProvider>
  );
}
