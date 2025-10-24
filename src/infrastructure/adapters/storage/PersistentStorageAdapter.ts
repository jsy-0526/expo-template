import AsyncStorage from '@react-native-async-storage/async-storage';

// Persistent storage adapter using AsyncStorage
// Automatically handles JSON serialization/deserialization
export class PersistentStorageAdapter {
  // Get value from storage, automatically parses JSON
  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  // Set value to storage, automatically stringifies to JSON
  async set<T = any>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      throw error;
    }
  }

  // Remove value from storage
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      throw error;
    }
  }

  // Clear all storage
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const persistentStorage = new PersistentStorageAdapter();
