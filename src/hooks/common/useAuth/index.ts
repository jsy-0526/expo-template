import { storage } from "../../../stores";
import { useRouter } from "../useRouter";

export const useAuth = () => {
  const { reset } = useRouter();

  const toLoginPage = () => {
    reset("/login");
  };

  const getToken = () => {
    let token = null;
    try {
      token = storage.get("token");
    } catch (error) {
      console.error("error getting token:", error);
    }
    return token;
  };

  const setToken = (token: string) => {
    storage.set("token", token);
  };

  return {
    toLoginPage,
    getToken,
    setToken,
  };
};
