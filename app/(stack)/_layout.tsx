import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function StackLayout() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen name="new-screen" options={{ title: t('stack.newScreenTitle') }} />
    </Stack>
  );
}
