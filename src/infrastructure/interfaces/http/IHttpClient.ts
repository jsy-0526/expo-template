// HTTP request methods
export type SUPPROT_HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// HTTP request configuration
export interface HttpRequestConfig {
  method?: SUPPROT_HTTP_METHOD;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
}

// HTTP response
export interface HttpResponse<T = any> {
  // http response payload
  data: T;
  // http status code
  status: number;
  // request headers
  requestHeaders: Record<string, string>;
  // response headers
  responseHeaders: Record<string, string>;
}

// HTTP error
export interface HttpError {
  message: string;
  status?: number;
  response?: any;
}

// Interceptor types
export type RequestInterceptor = (
  config: HttpRequestConfig,
  next: () => Promise<HttpRequestConfig>
) => Promise<HttpRequestConfig>;

export type ResponseInterceptor = (
  response: HttpResponse,
  next: () => Promise<HttpResponse>
) => Promise<HttpResponse>;

// HTTP client abstraction interface
export interface IHttpClient {
  // Make a GET request
  get<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;

  // Make a POST request
  post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  // Make a PUT request
  put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  // Make a DELETE request
  delete<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  // Make a PATCH request
  patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  // Make a generic request
  request<T = any>(
    url: string,
    config: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  // Set default headers for all requests
  setDefaultHeaders(headers: Record<string, string>): void;

  // Set base URL for all requests
  setBaseURL(baseURL: string): void;

  // Add request interceptor (AOP-style)
  addRequestInterceptor(interceptor: RequestInterceptor): void;

  // Add response interceptor (AOP-style)
  addResponseInterceptor(interceptor: ResponseInterceptor): void;
}
