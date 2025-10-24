import { create } from 'zustand';
import { storage } from './index';

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
    await storage.set('app-settings', get());
  },

  setLanguage: async (language) => {
    set({ language });
    await storage.set('app-settings', get());
  },

  toggleNotifications: async () => {
    set({ notifications: !get().notifications });
    await storage.set('app-settings', get());
  },

  loadSettings: async () => {
    const saved = await storage.get<Omit<SettingsState, 'setTheme' | 'setLanguage' | 'toggleNotifications' | 'loadSettings'>>('app-settings');
    if (saved) {
      set(saved);
    }
  },
}));
