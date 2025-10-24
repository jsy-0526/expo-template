import type { ResponseInterceptor } from '../../../interfaces/http/IHttpClient';

// Response interceptor: Validate HTTP status code
export const validateStatusInterceptor: ResponseInterceptor = async (response, next) => {
  // Check if status is 200
  if (response.status !== 200) {
    console.warn(`HTTP ${response.status}: Request may have issues`);
  }

  return await next();
};
