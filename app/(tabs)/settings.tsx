import { Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/lib/theme-context';

export default function SettingsScreen() {
  const { colorScheme, themeMode, setColorScheme, toggleColorScheme } = useTheme();

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
    </ScrollView>
  );
}
