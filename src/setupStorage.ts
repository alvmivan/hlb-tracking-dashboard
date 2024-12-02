import {setCustomStorage} from "hlb-api-library/src/shared/appContext.ts";

interface Storage {
    setItem: (key: string, value: string) => Promise<void>,
    getItem: (key: string) => Promise<string | null>,
    removeItem: (key: string) => Promise<void>,
};


class LocalCacheStorage implements Storage {
    // let's use the browser's local storage
    async setItem(key: string, value: string): Promise<void> {
        localStorage.setItem(key, value);
    }

    async getItem(key: string): Promise<string | null> {
        return localStorage.getItem(key);
    }

    async removeItem(key: string): Promise<void> {
        localStorage.removeItem(key);
    }
    

}


export const initStorageStep={
    name: "Setup storage",
    description: "Setup storage for the app",
    action: async () => {
        await setupStorage();
    }
}

export const setupStorage = async () => {
    setCustomStorage(new LocalCacheStorage());
}