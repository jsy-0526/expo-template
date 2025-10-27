import { describe, expect, it, vi } from 'vitest';
import type { HttpRequestConfig } from '../../interfaces/http/IHttpClient';
import { authTokenInterceptor } from '../interceptors/request/auth-token';

describe('authTokenInterceptor', () => {
  it('should add Authorization header with Bearer token', async () => {
    const config: HttpRequestConfig = {};
    const next = vi.fn().mockResolvedValue(config);

    await authTokenInterceptor(config, next);

    expect(config.headers).toEqual({
      Authorization: 'Bearer mock-token',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should preserve existing headers', async () => {
    const config: HttpRequestConfig = {
      headers: { 'X-Custom': 'value' },
    };
    const next = vi.fn().mockResolvedValue(config);

    await authTokenInterceptor(config, next);

    expect(config.headers).toEqual({
      'X-Custom': 'value',
      Authorization: 'Bearer mock-token',
    });
  });

  it('should call next() to continue interceptor chain', async () => {
    const config: HttpRequestConfig = {};
    const next = vi.fn().mockResolvedValue(config);

    await authTokenInterceptor(config, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should return result from next()', async () => {
    const config: HttpRequestConfig = {};
    const modifiedConfig = { ...config, modified: true };
    const next = vi.fn().mockResolvedValue(modifiedConfig);

    const result = await authTokenInterceptor(config, next);

    expect(result).toBe(modifiedConfig);
  });
});
