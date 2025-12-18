const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const storageService = {
    async getData(key) {
        await delay(300); // Symuluje opóźnienie sieci
        if (typeof window !== 'undefined') {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        }
        return null;
    },

    async saveData(key, data) {
        await delay(300);
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(data));
        }
        return { success: true };
    },
};