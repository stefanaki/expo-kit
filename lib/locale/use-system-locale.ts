import { AppState, Platform } from 'react-native';
import { useEffect } from 'react';

import i18n from '@/config/i18n';
import { getDeviceLanguageTag, toSupportedLanguage } from '@/lib/locale/utils';

export function useSystemLocale() {
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState !== 'active') return;

      const nextLanguage = toSupportedLanguage(getDeviceLanguageTag());
      if (nextLanguage !== i18n.resolvedLanguage) {
        void i18n.changeLanguage(nextLanguage);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
}
