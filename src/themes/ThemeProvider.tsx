import { useSettingsStore } from '@/stores/useSettingsStore';
import { themes, type ColorScheme, type ThemeName } from '@/themes';
import { useColorScheme } from 'nativewind';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { themeName, colorScheme: storeColorScheme, loadSettings } = useSettingsStore();

  // Load saved settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Sync colorScheme with NativeWind
  useEffect(() => {
    if (colorScheme !== storeColorScheme) {
      setColorScheme(storeColorScheme);
    }
  }, [storeColorScheme, colorScheme, setColorScheme]);

  // Ensure we have valid theme values before rendering
  const currentTheme: ThemeName = themeName || 'default';
  const currentColorScheme: ColorScheme = storeColorScheme || 'light';

  // Get theme styles safely
  const themeStyles = themes[currentTheme]?.[currentColorScheme] || themes.default.light;

  return (
    <View style={themeStyles} className="flex-1">
      {children}
    </View>
  );
}
