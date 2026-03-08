import { Map, MapMarker } from '@/components/ui/map';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function LayerMarkersExample() {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(0);

  const locations = [
    {
      coordinate: [-122.4194, 37.7749] as [number, number],
      title: 'Ferry Building',
      description: 'Historic landmark and marketplace',
      rating: '4.5',
    },
    {
      coordinate: [-122.4183, 37.8099] as [number, number],
      title: "Fisherman's Wharf",
      description: 'Popular tourist attraction',
      rating: '4.3',
    },
  ];

  return (
    <View className="h-full">
      <Map zoom={12} center={[-122.4194, 37.7749]}>
        {locations.map((loc, idx) => (
          <MapMarker key={idx} coordinate={loc.coordinate}>
            <Pressable onPress={() => setSelectedMarker(idx)}>
              <View
                className={cn(
                  'h-8 w-8 items-center justify-center rounded-full border-2 bg-red-500',
                  selectedMarker === idx ? 'border-blue-500' : 'border-background'
                )}>
                <Text className="text-xs font-bold text-white">{idx + 1}</Text>
              </View>
            </Pressable>
          </MapMarker>
        ))}
      </Map>

      {selectedMarker !== null && (
        <View className="ios:bottom-24 bg-background border-border absolute bottom-4 left-4 right-4 rounded-lg border p-4 shadow-xl">
          <View className="mb-2 flex-row items-start justify-between">
            <Text className="text-foreground flex-1 text-xl font-bold">
              {locations[selectedMarker].title}
            </Text>
            <Pressable onPress={() => setSelectedMarker(null)}>
              <Text className="text-muted-foreground text-lg">×</Text>
            </Pressable>
          </View>
          <Text className="text-muted-foreground mb-2 text-sm">
            {locations[selectedMarker].description}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-amber-500">★</Text>
            <Text className="text-foreground text-sm font-medium">
              {locations[selectedMarker].rating}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
