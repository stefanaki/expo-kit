import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useOidcDiscovery } from '@/lib/auth/oidc';
import { useTheme } from '@/lib/theme-context';
import { useAuthStore } from '@/store/auth-store';

export default function SettingsScreen() {
  const router = useRouter();
  const { colorScheme, themeMode, setColorScheme, toggleColorScheme } = useTheme();
  const discovery = useOidcDiscovery();
  const { status, user, signOut } = useAuthStore((s) => ({
    status: s.status,
    user: s.user,
    signOut: s.signOut,
  }));

  const handleSignOut = async () => {
    await signOut(discovery);
    router.replace('/(auth)/login' as any);
  };

  return (
    <ScrollView
      className="bg-background flex-1"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Stack.Screen options={{ title: 'Settings' }} />
      <View className="gap-3">
        <Text variant="h3">Appearance</Text>
        <Text selectable>Current mode: {themeMode}</Text>
        <Text selectable>Resolved scheme: {colorScheme}</Text>
        <Button onPress={toggleColorScheme}>
          <Text>Toggle Theme</Text>
        </Button>
        <Button variant="outline" onPress={() => setColorScheme('system')}>
          <Text>Use System Theme</Text>
        </Button>
      </View>

      <View className="gap-3">
        <Text variant="h3">Account</Text>
        {status === 'authenticated' && user ? (
          <>
            {user.name ? <Text selectable>Name: {user.name}</Text> : null}
            {user.email ? <Text selectable>Email: {user.email}</Text> : null}
            <Button variant="outline" onPress={handleSignOut}>
              <Text>Sign out</Text>
            </Button>
          </>
        ) : (
          <Button onPress={() => router.push('/(auth)/login' as any)}>
            <Text>Sign in</Text>
          </Button>
        )}
      </View>
    </ScrollView>
  );
}
