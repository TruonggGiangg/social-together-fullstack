import api from '../api/axiosClient';
import { secureStorage } from '../utils/secureStorage';

export const logoutService = {
    async logout(): Promise<void> {
        try {
            await api.post('/logout/');
        } catch (e) {
            // ignore error, proceed to clear storage anyway
        }
        await secureStorage.clearTokens();
    },
};
