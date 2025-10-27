import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { persistentStorage } from '@/infrastructure/adapters/storage/PersistentStorageAdapter';

import enUS from '@/locales/en-US';
import zhCN from '@/locales/zh-CN';

const LANGUAGE_STORAGE_KEY = 'app_language';

const resources = {
  'en-US': { translation: enUS },
  'zh-CN': { translation: zhCN },
};

// Initialize i18n with persisted language or device locale
const initializeI18n = async () => {
  const savedLanguage = await persistentStorage.get<string>(LANGUAGE_STORAGE_KEY);
  const deviceLocale = Localization.getLocales()[0]?.languageTag || 'en-US';

  const initialLanguage = savedLanguage || deviceLocale;

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'en-US',
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      compatibilityJSON: 'v4', // For React Native
    });
};

// Initialize immediately
initializeI18n();

export default i18n;
