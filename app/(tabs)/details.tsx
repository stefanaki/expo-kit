import { Stack } from 'expo-router';
import { View } from 'react-native';

import LayerMarkersExample from '@/components/examples/layer-markers-example';

export default function DetailsScreen() {
  return (
    <View className="bg-background flex-1">
      <Stack.Screen options={{ title: 'Details' }} />
      <View className="flex-1">
        <LayerMarkersExample />
      </View>
    </View>
  );
}
