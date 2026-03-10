import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { exchangeCode, useOidcAuthRequest, useOidcDiscovery, useAuthStore } from '@/lib/auth';
import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const returnTo = params.returnTo ?? '/(tabs)';

  const discovery = useOidcDiscovery();
  const [request, response, promptAsync] = useOidcAuthRequest(discovery);

  const { signIn, error, status } = useAuthStore((s) => ({
    signIn: s.signIn,
    error: s.error,
    status: s.status,
  }));

  // Handle auth response
  useEffect(() => {
    if (!response || !request || !discovery) return;

    if (response.type === 'success') {
      const { code } = response.params;
      exchangeCode(code, request, discovery)
        .then((payload) => signIn(payload))
        .then(() => router.replace(returnTo as any))
        .catch((err) => {
          console.error('[OIDC] Code exchange failed', err);
          useAuthStore.setState({ error: t('auth.signInFailed') });
        });
    } else if (response.type === 'error') {
      useAuthStore.setState({ error: response.error?.message ?? t('auth.signInFailedShort') });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, t]);

  const isLoading = !request || status === 'loading';

  return (
    <View className="bg-background flex-1 items-center justify-center gap-6 p-8">
      <View className="items-center gap-2">
        <Text variant="h1">{t('auth.signInTitle')}</Text>
        <Text className="text-muted-foreground text-center">{t('auth.signInSubtitle')}</Text>
      </View>

      {error ? <Text className="text-destructive text-center">{error}</Text> : null}

      {isLoading && !response ? (
        <ActivityIndicator />
      ) : (
        <Button disabled={!request} onPress={() => promptAsync()}>
          <Text>{t('common.signIn')}</Text>
        </Button>
      )}
    </View>
  );
}
