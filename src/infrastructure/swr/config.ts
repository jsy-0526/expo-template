import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";
import { AppState, type AppStateStatus } from "react-native";
import type { SWRConfiguration } from "swr";
import { asyncStorageCacheProvider } from "./asyncStorageProvider";

// maintain global state for network and app visibility
let networkState: NetInfoState | null = null;
let appState: AppStateStatus = AppState.currentState;

// initialize network state monitoring
NetInfo.fetch().then(state => {
  networkState = state;
});
NetInfo.addEventListener(state => {
  networkState = state;
});

// initialize app state monitoring
AppState.addEventListener("change", nextState => {
  appState = nextState;
});

export const createSWRConfig: () => SWRConfiguration = () => ({
  provider: asyncStorageCacheProvider,
  isOnline() {
    // return current network connection status
    return networkState?.isConnected ?? true;
  },
  isVisible() {
    // return whether app is in foreground
    return appState === "active";
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
