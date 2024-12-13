import { setCustomStorage } from "../lib/hlb-api-library/src/shared/appContext";

const browserStorage = {
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

export const initializeStorage = () => {
    setCustomStorage(browserStorage);
} 