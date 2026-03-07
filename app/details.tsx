import { View } from 'react-native';

import { Stack, useLocalSearchParams } from 'expo-router';

import { Container } from '@/components/Container';
import { CardPreview } from './card-preview';

export default function Details() {
  const { name } = useLocalSearchParams();

  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: 'Details' }} />
      <Container>
        <CardPreview />
      </Container>
    </View>
  );
}

const styles = {
  container: 'flex flex-1 bg-white',
};
