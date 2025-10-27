import superagent from 'superagent';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SuperAgentAdapter } from '../../adapters/http/SuperAgentAdapter';
import type { RequestInterceptor, ResponseInterceptor } from '../../interfaces/http/IHttpClient';

// Mock superagent
vi.mock('superagent');

describe('SuperAgentAdapter', () => {
  let adapter: SuperAgentAdapter;
  let mockRequest: any;

  beforeEach(() => {
    adapter = new SuperAgentAdapter();

    // Create mock chain
    mockRequest = {
      set: vi.fn().mockReturnThis(),
      query: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      timeout: vi.fn().mockResolvedValue({
        body: { data: 'test' },
        status: 200,
        header: { 'content-type': 'application/json' },
      }),
    };

    // Mock superagent methods
    (superagent.get as any) = vi.fn().mockReturnValue(mockRequest);
    (superagent.post as any) = vi.fn().mockReturnValue(mockRequest);
    (superagent.put as any) = vi.fn().mockReturnValue(mockRequest);
    (superagent.delete as any) = vi.fn().mockReturnValue(mockRequest);
    (superagent.patch as any) = vi.fn().mockReturnValue(mockRequest);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('configuration', () => {
    it('should set base URL correctly', () => {
      adapter.setBaseURL('https://api.example.com');
      expect(adapter['baseURL']).toBe('https://api.example.com');
    });

    it('should remove trailing slash from base URL', () => {
      adapter.setBaseURL('https://api.example.com/');
      
      expect(adapter['baseURL']).toBe('https://api.example.com');
    });

    it('should set default headers', () => {
      adapter.setDefaultHeaders({ 'X-Custom': 'value' });

      expect(adapter['defaultHeaders']).toEqual({ 'X-Custom': 'value' });
    });

    it('should merge default headers', () => {
      adapter.setDefaultHeaders({ 'X-Custom-1': 'value1' });
      adapter.setDefaultHeaders({ 'X-Custom-2': 'value2' });

      expect(adapter['defaultHeaders']).toEqual({
        'X-Custom-1': 'value1',
        'X-Custom-2': 'value2',
      });
    });

    it('should set default timeout', () => {
      adapter.setDefaultTimeout(5000);
      expect(adapter['defaultTimeout']).toBe(5000);
    });
  });

  describe('request interceptors', () => {
    it('should add and execute request interceptor', async () => {

      // mock a insterceptor , 
      const interceptor: RequestInterceptor = vi.fn(async (config, next) => {
        config.headers = { ...config.headers, 'X-Intercepted': 'true' };
        return await next();
      });

      adapter.addRequestInterceptor(interceptor);
      await adapter.get('/test');

      expect(interceptor).toHaveBeenCalled();
      expect(mockRequest.set).toHaveBeenCalledWith(
        expect.objectContaining({ 'X-Intercepted': 'true' })
      );
    });

    it('should execute multiple request interceptors in order', async () => {
      const order: number[] = [];

      const interceptor1: RequestInterceptor = async (config, next) => {
        order.push(1);
        return await next();
      };

      const interceptor2: RequestInterceptor = async (config, next) => {
        order.push(2);
        return await next();
      };

      adapter.addRequestInterceptor(interceptor1);
      adapter.addRequestInterceptor(interceptor2);
      await adapter.get('/test');

      expect(order).toEqual([1, 2]);
    });

    it('should allow interceptor to modify config', async () => {
      const interceptor: RequestInterceptor = async (config, next) => {
        config.timeout = 999;
        config.headers = { 'X-Modified': 'yes' };
        return await next();
      };

      adapter.addRequestInterceptor(interceptor);
      await adapter.get('/test');

      expect(mockRequest.timeout).toHaveBeenCalledWith(999);
      expect(mockRequest.set).toHaveBeenCalledWith(
        expect.objectContaining({ 'X-Modified': 'yes' })
      );
    });
  });

  describe('response interceptors', () => {
    it('should add and execute response interceptor', async () => {
      const interceptor: ResponseInterceptor = vi.fn(async (response, next) => {
        return await next();
      });

      adapter.addResponseInterceptor(interceptor);
      await adapter.get('/test');

      expect(interceptor).toHaveBeenCalled();
    });

    it('should execute multiple response interceptors in order', async () => {
      const order: number[] = [];

      const interceptor1: ResponseInterceptor = async (response, next) => {
        order.push(1);
        return await next();
      };

      const interceptor2: ResponseInterceptor = async (response, next) => {
        order.push(2);
        return await next();
      };

      adapter.addResponseInterceptor(interceptor1);
      adapter.addResponseInterceptor(interceptor2);
      await adapter.get('/test');

      expect(order).toEqual([1, 2]);
    });

    it('should allow interceptor to modify response', async () => {
      const interceptor: ResponseInterceptor = async (response, next) => {
        response.data = { modified: true };
        return await next();
      };

      adapter.addResponseInterceptor(interceptor);
      const result = await adapter.get('/test');

      expect(result.data).toEqual({ modified: true });
    });

    it('should allow interceptor to throw error', async () => {
      const interceptor: ResponseInterceptor = async (response) => {
        throw new Error('Interceptor error');
      };

      adapter.addResponseInterceptor(interceptor);

      await expect(adapter.get('/test')).rejects.toThrow('Interceptor error');
    });
  });

  describe('HTTP methods', () => {
    it('should make GET request', async () => {
      adapter.setBaseURL('https://api.example.com');
      await adapter.get('/users', { params: { page: 1 } });

      expect(superagent.get).toHaveBeenCalledWith('https://api.example.com/users');
      expect(mockRequest.query).toHaveBeenCalledWith({ page: 1 });
    });

    it('should make POST request', async () => {
      adapter.setBaseURL('https://api.example.com');
      const data = { name: 'test' };
      await adapter.post('/users', data);

      expect(superagent.post).toHaveBeenCalledWith('https://api.example.com/users');
      expect(mockRequest.send).toHaveBeenCalledWith(data);
    });

    it('should make PUT request', async () => {
      adapter.setBaseURL('https://api.example.com');
      const data = { name: 'updated' };
      await adapter.put('/users/1', data);

      expect(superagent.put).toHaveBeenCalledWith('https://api.example.com/users/1');
      expect(mockRequest.send).toHaveBeenCalledWith(data);
    });

    it('should make DELETE request', async () => {
      adapter.setBaseURL('https://api.example.com');
      await adapter.delete('/users/1');

      expect(superagent.delete).toHaveBeenCalledWith('https://api.example.com/users/1');
    });

    it('should make PATCH request', async () => {
      adapter.setBaseURL('https://api.example.com');
      const data = { name: 'patched' };
      await adapter.patch('/users/1', data);

      expect(superagent.patch).toHaveBeenCalledWith('https://api.example.com/users/1');
      expect(mockRequest.send).toHaveBeenCalledWith(data);
    });
  });

  describe('generic request method', () => {
    it('should route to GET', async () => {
      const getSpy = vi.spyOn(adapter, 'get');
      await adapter.request('/test', { method: 'GET' });
      expect(getSpy).toHaveBeenCalled();
    });

    it('should route to POST', async () => {
      const postSpy = vi.spyOn(adapter, 'post');
      await adapter.request('/test', { method: 'POST', body: { data: 'test' } });
      expect(postSpy).toHaveBeenCalled();
    });

    it('should throw error for unsupported method', async () => {
      await expect(
        adapter.request('/test', { method: 'INVALID' as any })
      ).rejects.toThrow('Unsupported method: INVALID');
    });
  });

  describe('URL building', () => {
    it('should build URL with baseURL', () => {
      adapter.setBaseURL('https://api.example.com');
      const url = adapter['buildURL']('/users');
      expect(url).toBe('https://api.example.com/users');
    });

    it('should not prepend baseURL for absolute URLs', () => {
      adapter.setBaseURL('https://api.example.com');
      const url = adapter['buildURL']('https://other.com/users');
      expect(url).toBe('https://other.com/users');
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      const error = new Error('Network error');
      mockRequest.timeout.mockRejectedValueOnce(error);

      await expect(adapter.get('/test')).rejects.toMatchObject({
        message: 'Network error',
      });
    });

    it('should handle timeout errors', async () => {
      const timeoutError = Object.assign(new Error('Timeout'), { timeout: true });
      mockRequest.timeout.mockRejectedValueOnce(timeoutError);

      await expect(adapter.get('/test')).rejects.toMatchObject({
        message: 'Request timeout',
      });
    });

    it('should handle HTTP errors with status', async () => {
      const httpError = Object.assign(new Error('Bad Request'), {
        response: { status: 400, body: { error: 'Invalid request' } },
        status: 400,
      });
      mockRequest.timeout.mockRejectedValueOnce(httpError);

      await expect(adapter.get('/test')).rejects.toMatchObject({
        status: 400,
        response: { error: 'Invalid request' },
      });
    });
  });

  describe('headers merging', () => {
    it('should merge default headers with request headers', async () => {
      adapter.setDefaultHeaders({ 'X-Default': 'default' });
      await adapter.get('/test', { headers: { 'X-Custom': 'custom' } });

      expect(mockRequest.set).toHaveBeenCalledWith({
        'X-Default': 'default',
        'X-Custom': 'custom',
      });
    });

    it('should allow request headers to override default headers', async () => {
      adapter.setDefaultHeaders({ 'X-Header': 'default' });
      await adapter.get('/test', { headers: { 'X-Header': 'override' } });

      expect(mockRequest.set).toHaveBeenCalledWith({
        'X-Header': 'override',
      });
    });
  });

  describe('timeout configuration', () => {
    it('should use default timeout', async () => {
      adapter.setDefaultTimeout(5000);
      await adapter.get('/test');

      expect(mockRequest.timeout).toHaveBeenCalledWith(5000);
    });

    it('should allow request config to override default timeout', async () => {
      adapter.setDefaultTimeout(5000);
      await adapter.get('/test', { timeout: 3000 });

      expect(mockRequest.timeout).toHaveBeenCalledWith(3000);
    });
  });
});
