import { Stack, Link } from 'expo-router';

import { View } from 'react-native';

import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function Home() {
  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: 'Home' }} />
      <Container>
        <Link href={{ pathname: '/details', params: { name: 'Dan' } }} asChild>
          <Button><Text>Go to Details</Text></Button>
        </Link>
      </Container>
    </View>
  );
}

const styles = {
  container: 'flex flex-1 bg-background',
};
