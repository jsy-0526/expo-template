// Interfaces
export type {
  HttpError,
  HttpRequestConfig,
  HttpResponse,
  IHttpClient,
  RequestInterceptor,
  ResponseInterceptor,
  SUPPROT_HTTP_METHOD
} from "./interfaces/http/IHttpClient";
export type { IStorage, ITypedStorage } from "./interfaces/storage/IStorage";

// Adapters
export { SuperAgentAdapter } from "./adapters/http/SuperAgentAdapter";
export {
  persistentStorage,
  PersistentStorageAdapter
} from "./adapters/storage/PersistentStorageAdapter";

// Fetcher (configured instance)
export { fetcher } from "./fetcher";

// SWR Configuration
export { asyncStorageCacheProvider } from "./swr/asyncStorageProvider";
export { createSWRConfig } from "./swr/config";

// i18n

export * from './interfaces';

