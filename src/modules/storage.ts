export class StorageService {
  static load<T>(key: string, defaultValue: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;

    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      console.error(`Failed to parse localStorage for key "${key}"`, error);
      return defaultValue;
    }
  }

  static save<T>(key: string, value: T): void {
    try {
      const json = JSON.stringify(value);
      localStorage.setItem(key, json);
    } catch (error) {
      console.error(`Failed to save localStorage for key "${key}"`, error);
    }
  }
}
