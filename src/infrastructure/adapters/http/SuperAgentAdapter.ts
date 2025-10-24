import superagent from "superagent";
import type {
  HttpError,
  HttpRequestConfig,
  HttpResponse,
  IHttpClient,
  RequestInterceptor,
  ResponseInterceptor,
} from "../../interfaces/http/IHttpClient";

export class SuperAgentAdapter implements IHttpClient {
  private baseURL: string = "http://localhost:3000";
  private defaultHeaders: Record<string, string> = {};
  private defaultTimeout: number = 10000; // 默认 10 秒超时
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL.endsWith("/") ? baseURL.slice(0, -1) : baseURL;
  }

  setDefaultHeaders(headers: Record<string, string>): void {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  setDefaultTimeout(timeout: number): void {
    this.defaultTimeout = timeout;
  }

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  private async executeRequestInterceptors(
    config: HttpRequestConfig
  ): Promise<HttpRequestConfig> {
    let index = 0;
    const interceptors = this.requestInterceptors;

    const next = async (): Promise<HttpRequestConfig> => {
      if (index >= interceptors.length) {
        return config;
      }
      const interceptor = interceptors[index++];
      return await interceptor(config, next);
    };

    return await next();
  }

  private async executeResponseInterceptors(
    response: HttpResponse
  ): Promise<HttpResponse> {
    let index = 0;
    const interceptors = this.responseInterceptors;

    const next = async (): Promise<HttpResponse> => {
      if (index >= interceptors.length) {
        return response;
      }
      const interceptor = interceptors[index++];
      return await interceptor(response, next);
    };

    return await next();
  }

  async get<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const processedConfig = await this.executeRequestInterceptors(
        config || {}
      );

      const fullURL = this.buildURL(url);

      const mergedHeaders = {
        ...this.defaultHeaders,
        ...processedConfig.headers,
      };
      const timeout = processedConfig.timeout ?? this.defaultTimeout;

      const response = await superagent
        .get(fullURL)
        .set(mergedHeaders)
        .query(processedConfig?.params || {})
        .timeout(timeout);

      const httpResponse: HttpResponse<T> = {
        data: response.body,
        status: response.status,
        requestHeaders: mergedHeaders,
        responseHeaders: response.header || {},
      };

      return await this.executeResponseInterceptors(httpResponse);
    } catch (err: any) {
      const httpError: HttpError = {
        message: err.timeout ? "Request timeout" : (err.message || "Request failed"),
        status: err.response?.status || err.status,
        response: err.response?.body || err.response,
      };
      throw httpError;
    }
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const processedConfig = await this.executeRequestInterceptors(
        config || {}
      );

      const fullURL = this.buildURL(url);
      const mergedHeaders = {
        ...this.defaultHeaders,
        ...processedConfig.headers,
      };
      const timeout = processedConfig.timeout ?? this.defaultTimeout;

      const response = await superagent
        .post(fullURL)
        .set(mergedHeaders)
        .send(data)
        .timeout(timeout);

      const httpResponse: HttpResponse<T> = {
        data: response.body,
        status: response.status,
        requestHeaders: mergedHeaders,
        responseHeaders: response.header || {},
      };

      return await this.executeResponseInterceptors(httpResponse);
    } catch (err: any) {
      const httpError: HttpError = {
        message: err.timeout ? "Request timeout" : (err.message || "Request failed"),
        status: err.response?.status || err.status,
        response: err.response?.body || err.response,
      };
      throw httpError;
    }
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const processedConfig = await this.executeRequestInterceptors(
        config || {}
      );

      const fullURL = this.buildURL(url);
      const mergedHeaders = {
        ...this.defaultHeaders,
        ...processedConfig.headers,
      };
      const timeout = processedConfig.timeout ?? this.defaultTimeout;

      const response = await superagent
        .put(fullURL)
        .set(mergedHeaders)
        .send(data)
        .timeout(timeout);

      const httpResponse: HttpResponse<T> = {
        data: response.body,
        status: response.status,
        requestHeaders: mergedHeaders,
        responseHeaders: response.header || {},
      };

      return await this.executeResponseInterceptors(httpResponse);
    } catch (err: any) {
      const httpError: HttpError = {
        message: err.timeout ? "Request timeout" : (err.message || "Request failed"),
        status: err.response?.status || err.status,
        response: err.response?.body || err.response,
      };
      throw httpError;
    }
  }

  async delete<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const processedConfig = await this.executeRequestInterceptors(
        config || {}
      );

      const fullURL = this.buildURL(url);
      const mergedHeaders = {
        ...this.defaultHeaders,
        ...processedConfig.headers,
      };
      const timeout = processedConfig.timeout ?? this.defaultTimeout;

      const response = await superagent
        .delete(fullURL)
        .set(mergedHeaders)
        .timeout(timeout);

      const httpResponse: HttpResponse<T> = {
        data: response.body,
        status: response.status,
        requestHeaders: mergedHeaders,
        responseHeaders: response.header || {},
      };

      return await this.executeResponseInterceptors(httpResponse);
    } catch (err: any) {
      const httpError: HttpError = {
        message: err.timeout ? "Request timeout" : (err.message || "Request failed"),
        status: err.response?.status || err.status,
        response: err.response?.body || err.response,
      };
      throw httpError;
    }
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const processedConfig = await this.executeRequestInterceptors(
        config || {}
      );

      const fullURL = this.buildURL(url);
      const mergedHeaders = {
        ...this.defaultHeaders,
        ...processedConfig.headers,
      };
      const timeout = processedConfig.timeout ?? this.defaultTimeout;

      const response = await superagent
        .patch(fullURL)
        .set(mergedHeaders)
        .send(data)
        .timeout(timeout);

      const httpResponse: HttpResponse<T> = {
        data: response.body,
        status: response.status,
        requestHeaders: mergedHeaders,
        responseHeaders: response.header || {},
      };

      return await this.executeResponseInterceptors(httpResponse);
    } catch (err: any) {
      const httpError: HttpError = {
        message: err.timeout ? "Request timeout" : (err.message || "Request failed"),
        status: err.response?.status || err.status,
        response: err.response?.body || err.response,
      };
      throw httpError;
    }
  }

  async request<T = any>(
    url: string,
    config: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    const method = config.method || "GET";
    switch (method) {
      case "GET":
        return this.get<T>(url, config);
      case "POST":
        return this.post<T>(url, config.body, config);
      case "PUT":
        return this.put<T>(url, config.body, config);
      case "DELETE":
        return this.delete<T>(url, config);
      case "PATCH":
        return this.patch<T>(url, config.body, config);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }

  private buildURL(url: string): string {
    if (url.startsWith("http")) {
      return url;
    }
    return `${this.baseURL}${url}`;
  }
}

// Export singleton instance
export const httpClient = new SuperAgentAdapter();
