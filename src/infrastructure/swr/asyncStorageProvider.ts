import { persistentStorage } from '../adapters/storage/PersistentStorageAdapter';
import type { Cache } from 'swr';

export const asyncStorageCacheProvider = (cache: Cache<any>): Cache<any> => {
  // Extend the cache with persistent storage
  const originalSet = cache.set.bind(cache);
  const originalDelete = cache.delete.bind(cache);

  return {
    get: (key: any) => {
      const valueFromCache = cache.get(key);

      // If value exists in memory cache, return it
      if (valueFromCache !== undefined) {
        return valueFromCache;
      }

      // Try to load from persistent storage asynchronously
      if (typeof key === 'string') {
        persistentStorage.get(key).then((value) => {
          if (value !== undefined && value !== null) {
            cache.set(key, value);
          }
        }).catch((error) => {
          console.error('Error reading from storage:', error);
        });
      }

      return undefined;
    },
    set: (key: any, value: any) => {
      originalSet(key, value);

      // Persist to storage asynchronously
      if (typeof key === 'string') {
        persistentStorage.set(key, value).catch((error) => {
          console.error('Error writing to storage:', error);
        });
      }
    },
    delete: (key: any) => {
      originalDelete(key);

      // Remove from storage asynchronously
      if (typeof key === 'string') {
        persistentStorage.remove(key).catch((error) => {
          console.error('Error deleting from storage:', error);
        });
      }
    },
    keys: () => cache.keys(),
  };
};
