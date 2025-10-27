import { enUS, zhCN } from "@/locales";
import { storage } from "@/stores";
import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LANGUAGE_STORAGE_KEY = "app_language";

const resources = {
  "en-US": { translation: enUS },
  "zh-CN": { translation: zhCN },
};

// Initialize i18n with persisted language or device locale
const initializeI18n = async () => {
  const savedLanguage = await storage.get<string>(LANGUAGE_STORAGE_KEY);
  const deviceLocale = Localization.getLocales()[0]?.languageTag || "en-US";

  const initialLanguage = savedLanguage || deviceLocale;

  await i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false, // React already escapes values
    }
  });
};

// Initialize immediately
initializeI18n();

export default i18n;
