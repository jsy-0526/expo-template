import { createSWRConfig } from "@/infrastructure";
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
  return (
    <SafeAreaProvider>
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
        <StatusBar style="auto" />
      </SWRConfig>
    </SafeAreaProvider>
  );
}
