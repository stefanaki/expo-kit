import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import LayerMarkersExample from '@/components/examples/layer-markers-example';
import { useAuthStore } from '@/store/auth-store';

export default function DetailsScreen() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/(auth)/login?returnTo=%2F(tabs)%2Fdetails' as any);
    }
  }, [status]);

  if (status !== 'authenticated') return null;

  return (
    <View className="bg-background flex-1">
      <Stack.Screen options={{ title: 'Details' }} />
      <View className="flex-1">
        <LayerMarkersExample />
      </View>
    </View>
  );
}
