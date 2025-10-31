import { ErrorFallback } from "@/components/error-page/ErrorFallback";
import { ModalProvider } from "@/components/modal";
import { createSWRConfig } from "@/infrastructure";
import "@/infrastructure/i18n";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { ThemeProvider } from "@/themes/ThemeProvider";
import { PortalProvider } from "@gorhom/portal";
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

function AppContent() {
  const colorScheme = useSettingsStore((state) => state.colorScheme);

  return (
    <ThemeProvider>
      <SWRConfig
        value={{
          ...createSWRConfig(),
        }}
      >
        <Stack>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </SWRConfig>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const handleError = (error: Error, stackTrace: string) => {
    console.error('Error caught by ErrorBoundary:', error, stackTrace);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <PortalProvider>
            <ModalProvider>
              <AppContent />
              <ToastWithSafeArea />
            </ModalProvider>
          </PortalProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
