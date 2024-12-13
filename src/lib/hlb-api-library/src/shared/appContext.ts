interface Storage {
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
}

// Wrapper para el localStorage del navegador que simula la API async
const browserStorage: Storage = {
    async setItem(key: string, value: string) {
        window.localStorage.setItem(key, value);
    },
    async getItem(key: string) {
        return window.localStorage.getItem(key);
    },
    async removeItem(key: string) {
        window.localStorage.removeItem(key);
    }
};

let localStorage: Storage = browserStorage;

let cache: Map<string, string> = new Map();
let nodeLocalStorage: Storage = {
    // create the same async functions
    setItem: async (key: string, value: string) => {
        cache.set(key, value);
    },
    getItem: async (key: string): Promise<string | null> => {
        return cache.get(key) || null;
    },
    removeItem: async (key: string) => {
        cache.delete(key);
    }
}

//esto es para prevenir errores cuando estoy testeando fuera de react o react-native
if (typeof window === 'undefined') {
    localStorage = nodeLocalStorage;
}


export function setCustomStorage(storage: Storage) {
    localStorage = storage;
}

export type StorageSettings = {
    IsDebug: boolean,
    config: {
        [key: string]: any
    },
}

const settings: Partial<StorageSettings> = {
    IsDebug: false,
    config: undefined,
};

export function getSettings(): Partial<StorageSettings> {
    return settings;
}

export const configSettings = (conf: StorageSettings) => {
    settings.IsDebug = conf.IsDebug;
    settings.config = conf.config;
}

let memoryCache: Map<string, any> = new Map();
export const MemoryCache = {

    set: (key: string, value: any) => {
        memoryCache.set(key, value);
    },
    get: (key: string) => {
        return memoryCache.get(key);
    },
    has: (key: string) => {
        return memoryCache.has(key);
    },
    remove: (key: string) => {
        memoryCache.delete(key);
    },
    clear: () => {
        memoryCache.clear();
    }

}

export const AppCache = {

    set: async (key: string, value: any) => {
        let val = JSON.stringify(value);
        if (settings.IsDebug) {
            console.log(`Setting ${key} in cache with value: ${val}`);
        }
        await localStorage.setItem(key, val);
    },
    get: async (key: string) => {

        const item = await localStorage.getItem(key) || "{}";
        if (settings.IsDebug) {
            console.log(`Getting ${key} from cache with value: ${item}`);
        }
        return JSON.parse(item);
    },
    has: async (key: string) => {
        const value = await localStorage.getItem(key);
        return value !== null;
    },
    remove: async (key: string) => {
        await localStorage.removeItem(key);
    },
};


export const AppConfig = {
    get: (key: string) => {
        if (settings.config === undefined) {
            console.error("CONFIG IS NOT SET! please all configSettings() before using the API");
            return;
        }
        return settings.config[key];
    },
};
