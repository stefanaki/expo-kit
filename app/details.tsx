import { Stack } from 'expo-router';

import LayerMarkersExample from './layer-markers-example';

export default function Details() {
  return (
    <>
      <Stack.Screen options={{ title: 'Details' }} />
      <LayerMarkersExample />
    </>
  );
}
