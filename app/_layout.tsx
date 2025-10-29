import { ErrorFallback } from "@/components/error-page/ErrorFallback";
import { ModalContainer } from "@/components/modal";
import { createSWRConfig } from "@/infrastructure";
import "@/infrastructure/i18n";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { ThemeProvider } from "@/themes/ThemeProvider";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ErrorBoundary from "react-native-error-boundary";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { SWRConfig } from "swr";
import "../global.css";

// for native back anchor
export const unstable_settings = {
  anchor: "(tabs)",
};

function ToastWithSafeArea() {
  const insets = useSafeAreaInsets();
  return <Toast topOffset={insets.top} />;
}

export default function RootLayout() {
  const colorScheme = useSettingsStore((state) => state.colorScheme);

  const handleError = (error: Error, stackTrace: string) => {
    console.error('Error caught by ErrorBoundary:', error, stackTrace);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <SWRConfig
              value={{
                ...createSWRConfig(),
              }}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            </SWRConfig>
          </ThemeProvider>
          <ToastWithSafeArea />
          <ModalContainer />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
