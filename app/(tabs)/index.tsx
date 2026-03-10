import { Link, Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useTranslation } from 'react-i18next';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="bg-background flex-1"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Stack.Screen options={{ title: t('home.screenTitle') }} />
      <View className="gap-4">
        <Text variant="h1">{t('home.welcome')}</Text>
        <Text variant="muted" selectable>
          {t('home.description')}
        </Text>
        <Link href="/details" asChild>
          <Button size="lg">
            <Text>{t('home.openDetails')}</Text>
          </Button>
        </Link>
        <Link href="/new-screen" asChild>
          <Button size="lg" variant="outline">
            <Text>{t('home.openNewScreen')}</Text>
          </Button>
        </Link>
      </View>
    </ScrollView>
  );
}
