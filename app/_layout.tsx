import { createSWRConfig } from "@/infrastructure";
import "@/infrastructure/i18n";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { ThemeProvider } from "@/themes/ThemeProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SWRConfig } from "swr";
import "../global.css";

// for native back anchor
export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useSettingsStore((state) => state.colorScheme);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SWRConfig
          value={{
            ...createSWRConfig(),
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
          }}
        >
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </SWRConfig>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
