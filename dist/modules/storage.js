export class StorageService {
    static load(key, defaultValue) {
        const raw = localStorage.getItem(key);
        if (!raw)
            return defaultValue;
        try {
            return JSON.parse(raw);
        }
        catch (error) {
            console.error(`Failed to parse localStorage for key "${key}"`, error);
            return defaultValue;
        }
    }
    static save(key, value) {
        try {
            const json = JSON.stringify(value);
            localStorage.setItem(key, json);
        }
        catch (error) {
            console.error(`Failed to save localStorage for key "${key}"`, error);
        }
    }
}
