import AsyncStorage from '@react-native-async-storage/async-storage';

export const secureStorage = {
    async setTokens(accessToken: string, refreshToken: string) {
        await AsyncStorage.multiSet([
            ['accessToken', accessToken],
            ['refreshToken', refreshToken],
        ]);
    },
    async getAccessToken() {
        return AsyncStorage.getItem('accessToken');
    },
    async getRefreshToken() {
        return AsyncStorage.getItem('refreshToken');
    },
    async clearTokens() {
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    },
};
