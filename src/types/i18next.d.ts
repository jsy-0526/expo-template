import 'i18next';
import type { II18nTranslation } from '@/infrastructure/interfaces/i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: II18nTranslation;
    };
    defaultNS: 'translation';
  }
}
