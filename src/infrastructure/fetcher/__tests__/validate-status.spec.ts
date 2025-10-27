import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { HttpResponse } from '../../interfaces/http/IHttpClient';
import { validateStatusInterceptor } from '../interceptors/response/validate-status';

describe('validateStatusInterceptor', () => {
  let consoleWarnSpy: any;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should not log warning for status 200', async () => {
    const response: HttpResponse = {
      data: { success: true },
      status: 200,
      requestHeaders: {},
      responseHeaders: {},
    };
    const next = vi.fn().mockResolvedValue(response);

    await validateStatusInterceptor(response, next);

    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should log warning for non-200 status codes', async () => {
    const response: HttpResponse = {
      data: { error: 'Not Found' },
      status: 404,
      requestHeaders: {},
      responseHeaders: {},
    };
    const next = vi.fn().mockResolvedValue(response);

    await validateStatusInterceptor(response, next);

    expect(consoleWarnSpy).toHaveBeenCalledWith('HTTP 404: Request may have issues');
    expect(next).toHaveBeenCalled();
  });

  it('should log warning for 4xx errors', async () => {
    const response: HttpResponse = {
      data: { error: 'Bad Request' },
      status: 400,
      requestHeaders: {},
      responseHeaders: {},
    };
    const next = vi.fn().mockResolvedValue(response);

    await validateStatusInterceptor(response, next);

    expect(consoleWarnSpy).toHaveBeenCalledWith('HTTP 400: Request may have issues');
  });

  it('should log warning for 5xx errors', async () => {
    const response: HttpResponse = {
      data: { error: 'Internal Server Error' },
      status: 500,
      requestHeaders: {},
      responseHeaders: {},
    };
    const next = vi.fn().mockResolvedValue(response);

    await validateStatusInterceptor(response, next);

    expect(consoleWarnSpy).toHaveBeenCalledWith('HTTP 500: Request may have issues');
  });

  it('should call next() to continue interceptor chain', async () => {
    const response: HttpResponse = {
      data: {},
      status: 200,
      requestHeaders: {},
      responseHeaders: {},
    };
    const next = vi.fn().mockResolvedValue(response);

    await validateStatusInterceptor(response, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should return result from next()', async () => {
    const response: HttpResponse = {
      data: {},
      status: 200,
      requestHeaders: {},
      responseHeaders: {},
    };
    const modifiedResponse = { ...response, modified: true };
    const next = vi.fn().mockResolvedValue(modifiedResponse);

    const result = await validateStatusInterceptor(response, next);

    expect(result).toBe(modifiedResponse);
  });

  it('should not block response even with non-200 status', async () => {
    const response: HttpResponse = {
      data: { error: 'Unauthorized' },
      status: 401,
      requestHeaders: {},
      responseHeaders: {},
    };
    const next = vi.fn().mockResolvedValue(response);

    const result = await validateStatusInterceptor(response, next);

    expect(result).toBe(response);
    expect(next).toHaveBeenCalled();
  });
});
