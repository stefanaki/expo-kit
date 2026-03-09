import { Stack } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { Text } from '@/components/ui/text';

export default function NewScreen() {
  const [searchQuery, setSearchQuery] = useState('');

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
      </View>
    </ScrollView>
  );
}
