import { Stack } from 'expo-router';

export default function StackLayout() {
  return (
    <Stack>
      <Stack.Screen name="new-screen" options={{ title: 'New Screen' }} />
    </Stack>
  );
}
