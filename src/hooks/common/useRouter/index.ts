import {
  router,
  useRouter as useExpoRouter,
  useLocalSearchParams,
  type Href,
} from "expo-router";

export interface RouterParams {
  [key: string]: string | string[] | undefined;
}

export interface NavigateOptions {
  pathname: string;
  params?: Record<string, string | number>;
}

export interface UseRouterReturn {
  // navigation methods
  push: (href: string | NavigateOptions) => void;
  replace: (href: string | NavigateOptions) => void;
  reset: (href: string | NavigateOptions) => void;
  back: () => void;
  dismiss: () => void;
  dismissAll: () => void;

  // params
  params: RouterParams;
  getParam: <T = string>(key: string, defaultValue?: T) => T | undefined;

  // utility
  canGoBack: () => boolean;
}

export const useRouter = () => {
  const expoRouter = useExpoRouter();
  const params = useLocalSearchParams();

  // navigate to a new route
  const push = (href: string | NavigateOptions) => {
    if (typeof href === "string") {
      router.push(href as Href);
    } else {
      router.push({
        pathname: href.pathname,
        params: href.params,
      } as Href);
    }
  };

  // replace current route
  const replace = (href: string | NavigateOptions) => {
    if (typeof href === "string") {
      router.replace(href as Href);
    } else {
      router.replace({
        pathname: href.pathname,
        params: href.params,
      } as Href);
    }
  };

  // reset navigation stack - clears all history
  // use this for logout or other scenarios where you want to prevent going back
  const reset = (href: string | NavigateOptions) => {
    // dismiss all modals first
    // maybe 
    // I will use the modal navigation router in the future
    while (expoRouter.canDismiss?.()) {
      router.dismiss();
    }

    // navigate to root and replace
    if (typeof href === "string") {
      // use dismissAll + replace to clear stack
      router.dismissAll();
      router.replace(href as Href);
    } else {
      router.dismissAll();
      router.replace({
        pathname: href.pathname,
        params: href.params,
      } as Href);
    }
  };

  // go back to previous route
  const back = () => {
    if (expoRouter.canGoBack()) {
      router.back();
    }
  };

  // dismiss modal
  const dismiss = () => {
    router.dismiss();
  };

  // dismiss all modals
  const dismissAll = () => {
    router.dismissAll();
  };

  // get a parameter from the URL
  const getParam = <T = string>(
    key: string,
    defaultValue?: T
  ): T | undefined => {
    const value = params[key];

    if (value === undefined) {
      return defaultValue;
    }

    // handle array params (e.g., ?ids=1&ids=2)
    if (Array.isArray(value)) {
      return value as unknown as T;
    }

    // handle type conversion
    if (typeof defaultValue === "number") {
      return (value ? Number(value) : defaultValue) as unknown as T;
    }

    if (typeof defaultValue === "boolean") {
      return (value === "true" || value === "1") as unknown as T;
    }

    return value as unknown as T;
  };

  // check if can go back
  const canGoBack = () => {
    return expoRouter.canGoBack();
  };

  return {
    push,
    replace,
    reset,
    back,
    dismiss,
    dismissAll,
    params,
    getParam,
    canGoBack,
  };
};
