import type { Href } from "expo-router";
import { useRouter as useExpoRouter } from "expo-router";
import type { NavigationOptions } from "expo-router/build/global-state/routing";

export const useRouter = () => {
  const { back: expoBack, push: expoPush } = useExpoRouter();

  const to = (path: Href, options: NavigationOptions = {}) => {
    expoPush(path, options);
  };

  const back = () => {
    expoBack();
  };

  return {
    to,
    back,
  };
};
