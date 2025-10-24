import { SuperAgentAdapter } from '../adapters/http/SuperAgentAdapter';
import { authTokenInterceptor } from './interceptors/request/auth-token';
import { validateStatusInterceptor } from './interceptors/response/validate-status';

// Create and configure fetcher instance
const fetcher = new SuperAgentAdapter();

// Set default timeout (10 seconds)
fetcher.setDefaultTimeout(10000);

// Setup default interceptors
// Request: Inject auth token
fetcher.addRequestInterceptor(authTokenInterceptor);

// Response: Validate status code
fetcher.addResponseInterceptor(validateStatusInterceptor);

// Export configured fetcher instance
export { fetcher };

// Re-export types
  export type {
    HttpError, HttpRequestConfig,
    HttpResponse, IHttpClient, RequestInterceptor,
    ResponseInterceptor, SUPPROT_HTTP_METHOD
  } from '../interfaces/http/IHttpClient';

// Re-export interceptors for custom setup
export * from './interceptors';
