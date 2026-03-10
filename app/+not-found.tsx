import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <View className={styles.container}>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View className="p-safe bg-background flex flex-1">
        <Text className={styles.title}>{t('notFound.message')}</Text>
        <Link href="/" className={styles.link}>
          <Text className={styles.linkText}>{t('notFound.cta')}</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = {
  container: 'flex flex-1 bg-background',
  title: `text-xl font-bold`,
  link: `mt-4 pt-4`,
  linkText: 'text-base text-primary',
};
