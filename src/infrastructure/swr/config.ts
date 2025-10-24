import NetInfo from "@react-native-community/netinfo";
import { AppState } from "react-native";
import type { SWRConfiguration } from "swr";
import { asyncStorageCacheProvider } from "./asyncStorageProvider";

export const createSWRConfig: () => SWRConfiguration = () => ({
  provider: asyncStorageCacheProvider,
  isOnline() {
    // Custom network state detector
    // TODO
    return true;
  },
  isVisible() {
    // Custom visibility state detector
    // TODO
    return true;
  },
  shouldRetryOnError: false,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  dedupingInterval: 2000,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  initFocus(callback: () => void) {
    let appState = AppState.currentState;
    const onAppStateChange = (nextAppState: any) => {
      // If recovering from background or non-active mode to active mode
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        callback();
      }
      appState = nextAppState;
    };

    // Subscribe to app state change events
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => {
      subscription.remove();
    };
  },
  initReconnect(callback: () => void) {
    // Register listener to state provider
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        callback();
      }
    });
    return () => {
      unsubscribe();
    };
  },
});
