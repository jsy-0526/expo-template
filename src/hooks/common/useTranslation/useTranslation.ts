import { persistentStorage } from "@/infrastructure/adapters/storage/PersistentStorageAdapter";
import { useTranslation as useI18nextTranslation } from "react-i18next";

const LANGUAGE_STORAGE_KEY = "app_language";

export function useTranslation() {
  const { t, i18n } = useI18nextTranslation();

  const changeLanguage = async (lng: string, shouldStore = true) => {
    await i18n.changeLanguage(lng);
    if (shouldStore) {
      await persistentStorage.set(LANGUAGE_STORAGE_KEY, lng);
    }
  };

  const getCurrentLanguage = () => i18n.language;

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
  };
}
