import * as SecureStore from 'expo-secure-store';

// persistent storage adapter using expo-secure-store
export class PersistentStorageAdapter {
  // cache key only contain alphanumeric characters, ".", "-", and "_"
  // replaces invalid characters with underscores
  // and 
  // adds hash suffix for uniqueness
  private sanitizeKey(key: string): string {
    // replace invalid characters with underscores
    const sanitized = key.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    // if key is too long (SecureStore has 2048 byte limit), truncate and add hash
    if (sanitized.length > 200) {
      const hash = this.simpleHash(key);
      return sanitized.substring(0, 190) + '_' + hash;
    }

    return sanitized;
  }

  // simple hash function for key uniqueness
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // get value from secure storage,
  //  automatically parses JSON
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const sanitizedKey = this.sanitizeKey(key);
      const value = await SecureStore.getItemAsync(sanitizedKey);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  // set value to secure storage, 
  // automatically stringifies to JSON
  async set<T = any>(key: string, value: T): Promise<void> {
    try {
      const sanitizedKey = this.sanitizeKey(key);
      const serialized = JSON.stringify(value);
      await SecureStore.setItemAsync(sanitizedKey, serialized);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  // remove value from secure storage
  async remove(key: string): Promise<void> {
    try {
      const sanitizedKey = this.sanitizeKey(key);
      await SecureStore.deleteItemAsync(sanitizedKey);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  // clear all storage
  // note: SecureStore doesn't have a clear all method
  // you need to track keys yourself or implement key management
  async clear(): Promise<void> {
    console.warn('SecureStore does not support clear all. Please remove keys individually.');
  }
}

// export singleton instance
export const persistentStorage = new PersistentStorageAdapter();
