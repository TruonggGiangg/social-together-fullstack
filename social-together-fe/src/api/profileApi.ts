import api from './axiosClient';
import { ProfileResponse } from '../types/profile.types';
import { secureStorage } from '../utils/secureStorage';

// Add a request interceptor to attach the access token automatically
api.interceptors.request.use(async (config) => {
    const accessToken = await secureStorage.getAccessToken();
    if (accessToken) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
});

export const profileApi = {
    getProfile: async (): Promise<ProfileResponse> => {
        const res = await api.get<ProfileResponse>('/profile/');
        return res.data;
    },
};
