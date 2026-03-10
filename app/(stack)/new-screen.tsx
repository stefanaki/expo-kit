import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/store/auth-store';
import { useQuery } from '@tanstack/react-query';

export default function NewScreen() {
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
  }, [status]);

  if (status !== 'authenticated') return null;

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <ScrollView className="bg-background flex-1 p-safe">
      <Stack.Header style={{ backgroundColor: 'transparent' }} />
      <Stack.SearchBar onChangeText={(e) => handleSearchChange(e.nativeEvent.text)} />
      <Stack.Screen
        options={{
          title: 'New Screen',
        }}
      />
      <View className="bg-background flex-1 items-center justify-center">
        <Text variant="h1">
          {searchQuery}
        </Text>

        {isLoading && <Text>Loading...</Text>}
        {isError && <Text>Error loading data</Text>}
        {data && <Text>Data: {JSON.stringify(data)}</Text>}
      </View>
    </ScrollView>
  );
}
