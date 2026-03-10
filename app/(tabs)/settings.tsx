import { useAutoDiscovery } from 'expo-auth-session';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { oidcConfig } from '@/config/openid-connect';
import { useAuthStore } from '@/lib/auth';
import { formatCurrency, formatDate, formatNumber } from '@/lib/locale';
import { useTheme } from '@/lib/theme-context';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colorScheme, themeMode, setColorScheme, toggleColorScheme } = useTheme();
  const discovery = useAutoDiscovery(oidcConfig.issuer);
  const { status, user, signOut } = useAuthStore((s) => ({
    status: s.status,
    user: s.user,
    signOut: s.signOut,
  }));

  const name = typeof user?.name === 'string' ? user.name : undefined;
  const email = typeof user?.email === 'string' ? user.email : undefined;

  const handleSignOut = async () => {
    await signOut(discovery);
    router.replace('/(auth)/login' as any);
  };

  const locale = i18n.resolvedLanguage;

  const translatedMode = t(`settings.themeMode.${themeMode}`);
  const translatedScheme = t(`settings.colorScheme.${colorScheme}`);

  return (
    <ScrollView
      className="bg-background flex-1"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Stack.Screen options={{ title: t('settings.screenTitle') }} />
      <View className="gap-3">
        <Text variant="h3">{t('settings.appearanceTitle')}</Text>
        <Text selectable>{t('settings.currentMode', { mode: translatedMode })}</Text>
        <Text selectable>{t('settings.resolvedScheme', { scheme: translatedScheme })}</Text>
        <Button onPress={toggleColorScheme}>
          <Text>{t('settings.toggleTheme')}</Text>
        </Button>
        <Button variant="outline" onPress={() => setColorScheme('system')}>
          <Text>{t('settings.useSystemTheme')}</Text>
        </Button>
      </View>

      <View className="gap-3">
        <Text variant="h3">{t('settings.accountTitle')}</Text>
        {status === 'authenticated' && user ? (
          <>
            {name ? <Text selectable>{t('settings.name', { value: name })}</Text> : null}
            {email ? <Text selectable>{t('settings.email', { value: email })}</Text> : null}
            <Text selectable>
              {t('settings.sampleNumber', {
                value: formatNumber(1234567.89, locale),
              })}
            </Text>
            <Text selectable>
              {t('settings.sampleCurrency', {
                value: formatCurrency(2499.95, 'EUR', locale),
              })}
            </Text>
            <Text selectable>
              {t('settings.sampleDate', {
                value: formatDate(new Date(), undefined, locale),
              })}
            </Text>
            <Button variant="outline" onPress={handleSignOut}>
              <Text>{t('common.signOut')}</Text>
            </Button>
          </>
        ) : (
          <Button onPress={() => router.push('/(auth)/login' as any)}>
            <Text>{t('common.signIn')}</Text>
          </Button>
        )}
      </View>
    </ScrollView>
  );
}
