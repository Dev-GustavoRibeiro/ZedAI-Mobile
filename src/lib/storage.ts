import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage helper usando AsyncStorage
 */

export const storage = {
    // Salvar item
    async setItem<T>(key: string, value: T): Promise<void> {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error(`Erro ao salvar ${key}:`, error);
            throw error;
        }
    },

    // Obter item
    async getItem<T>(key: string): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error(`Erro ao ler ${key}:`, error);
            return null;
        }
    },

    // Remover item
    async removeItem(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Erro ao remover ${key}:`, error);
            throw error;
        }
    },

    // Limpar tudo
    async clear(): Promise<void> {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('Erro ao limpar storage:', error);
            throw error;
        }
    },
};

// Keys do storage
export const STORAGE_KEYS = {
    USER_PREFERENCES: '@zed:user_preferences',
    THEME: '@zed:theme',
    ONBOARDING_COMPLETED: '@zed:onboarding_completed',
    CHAT_HISTORY: '@zed:chat_history',
} as const;
