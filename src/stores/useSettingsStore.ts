import type { ColorScheme, ThemeName } from '@/themes';
import { create } from 'zustand';
import { PERSISTENT_STORAGE_KEYS } from '../constants/persistentStorageKeys';
import { storage } from './index';

// Settings store with persistence
interface SettingsState {
  themeName: ThemeName;
  colorScheme: ColorScheme;
  language: string;
  notifications: boolean;
  setThemeName: (themeName: ThemeName) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  setLanguage: (language: string) => void;
  toggleNotifications: () => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  themeName: 'default',
  colorScheme: 'light',
  language: 'en',
  notifications: true,

  setThemeName: async (themeName) => {
    set({ themeName });
    await storage.set(PERSISTENT_STORAGE_KEYS.APP_SETTINGS, get());
  },

  setColorScheme: async (colorScheme) => {
    set({ colorScheme });
    await storage.set(PERSISTENT_STORAGE_KEYS.APP_SETTINGS, get());
  },

  setLanguage: async (language) => {
    set({ language });
    await storage.set(PERSISTENT_STORAGE_KEYS.APP_SETTINGS, get());
  },

  toggleNotifications: async () => {
    set({ notifications: !get().notifications });
    await storage.set(PERSISTENT_STORAGE_KEYS.APP_SETTINGS, get());
  },

  loadSettings: async () => {
    const saved = await storage.get<Omit<SettingsState, 'setThemeName' | 'setColorScheme' | 'setLanguage' | 'toggleNotifications' | 'loadSettings'>>(PERSISTENT_STORAGE_KEYS.APP_SETTINGS);
    if (saved) {
      set(saved);
    }
  },
}));
