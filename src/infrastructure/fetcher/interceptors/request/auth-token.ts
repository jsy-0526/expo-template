import type { RequestInterceptor } from '../../../interfaces/http/IHttpClient';
import { PERSISTENT_STORAGE_KEYS } from '../../../../stores/persistentStorageKeys';

// Request interceptor: Inject auth token
export const authTokenInterceptor: RequestInterceptor = async (config, next) => {
  // TODO: Get token from your storage
  // const token = await AsyncStorage.getItem(PERSISTENT_STORAGE_KEYS.AUTH_TOKEN);
  const token = 'mock-token';

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return await next();
};
