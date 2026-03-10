import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from '@/i18n';
import { DEFAULT_LANGUAGE, getDeviceLanguageTag, toSupportedLanguage } from '@/lib/locale/utils';

const initialLanguage = toSupportedLanguage(getDeviceLanguageTag());
const i18n = createInstance();

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    fallbackLng: DEFAULT_LANGUAGE,
    lng: initialLanguage,
    interpolation: {
      escapeValue: false,
    },
    resources,
  });
}

export default i18n;
