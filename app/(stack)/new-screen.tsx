import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export default function NewScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  const { data, isLoading, isError } = useQuery<{ placeholder: string }>({
    queryKey: ['test-data'],
    queryFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ placeholder: 'test data' });
        }, 1000);
      });
    },
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/(auth)/login?returnTo=%2F(stack)%2Fnew-screen' as any);
    }
  }, [router, status]);

  if (status !== 'authenticated') return null;

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <ScrollView className="bg-background p-safe flex-1">
      <Stack.Header style={{ backgroundColor: 'transparent' }} />
      <Stack.SearchBar onChangeText={(e) => handleSearchChange(e.nativeEvent.text)} />
      <Stack.Screen
        options={{
          title: t('stack.newScreenTitle'),
        }}
      />
      <View className="bg-background flex-1 items-center justify-center">
        <Text variant="h1">{searchQuery}</Text>

        {isLoading && <Text>{t('newScreen.loading')}</Text>}
        {isError && <Text>{t('newScreen.errorLoadingData')}</Text>}
        {data && <Text>{t('newScreen.dataLabel', { data: JSON.stringify(data) })}</Text>}
      </View>
    </ScrollView>
  );
}
