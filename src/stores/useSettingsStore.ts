import { create } from 'zustand';
import { storage } from './index';
import { PERSISTENT_STORAGE_KEYS } from './persistentStorageKeys';

// Settings store with persistence
interface SettingsState {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: string) => void;
  toggleNotifications: () => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'light',
  language: 'en',
  notifications: true,

  setTheme: async (theme) => {
    set({ theme });
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
    const saved = await storage.get<Omit<SettingsState, 'setTheme' | 'setLanguage' | 'toggleNotifications' | 'loadSettings'>>(PERSISTENT_STORAGE_KEYS.APP_SETTINGS);
    if (saved) {
      set(saved);
    }
  },
}));
