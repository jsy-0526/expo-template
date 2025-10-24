// Storage abstraction interface
// Provides a generic interface for key-value storage operations
export interface IStorage {
  // Get an item from storage
  getItem(key: string): Promise<string | null>;

  // Set an item in storage
  setItem(key: string, value: string): Promise<void>;

  // Remove an item from storage
  removeItem(key: string): Promise<void>;

  // Get all keys in storage
  getAllKeys(): Promise<readonly string[]>;

  // Clear all items from storage
  clear(): Promise<void>;

  // Get multiple items from storage
  multiGet(keys: readonly string[]): Promise<readonly [string, string | null][]>;

  // Set multiple items in storage
  multiSet(keyValuePairs: [string, string][]): Promise<void>;

  // Remove multiple items from storage
  multiRemove(keys: string[]): Promise<void>;
}

// Typed storage interface for working with objects
export interface ITypedStorage {
  // Get a typed object from storage
  getObject<T>(key: string): Promise<T | null>;

  // Set a typed object in storage
  setObject<T>(key: string, value: T): Promise<void>;

  // Remove an object from storage
  removeObject(key: string): Promise<void>;
}
