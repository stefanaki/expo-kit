import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

import LayerMarkersExample from '@/components/examples/layer-markers-example';
import { useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';

export default function DetailsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/(auth)/login?returnTo=%2F(tabs)%2Fdetails' as any);
    }
  }, [router, status]);

  if (status !== 'authenticated') return null;

  return (
    <View className="bg-background flex-1">
      <Stack.Screen options={{ title: t('details.screenTitle') }} />
      <View className="flex-1">
        <LayerMarkersExample />
      </View>
    </View>
  );
}
