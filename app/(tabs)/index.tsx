import { Link, Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function HomeScreen() {
  return (
    <ScrollView
      className="bg-background flex-1"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Stack.Screen options={{ title: 'Home' }} />
      <View className="gap-4">
        <Text variant="h1">Welcome</Text>
        <Text variant="muted" selectable>
          Expo 55 scaffold with native tabs, Uniwind, and React Compiler enabled.
        </Text>
        <Link href="/details" asChild>
          <Button size='lg'>
            <Text>Open Details</Text>
          </Button>
        </Link>
      </View>
    </ScrollView>
  );
}
