import axios from 'axios';
import { secureStorage } from '../utils/secureStorage';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import type { NavigationContainerRef } from '@react-navigation/native';

let navigationRef: NavigationContainerRef<any> | null = null;
export const setNavigationRef = (ref: NavigationContainerRef<any> | null) => {
    navigationRef = ref;
};

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the access token automatically
api.interceptors.request.use(async (config) => {
    const accessToken = await secureStorage.getAccessToken();
    if (accessToken) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
});

// Add a response interceptor to handle token expiration and refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data?.message?.includes('Token không hợp lệ hoặc đã hết hạn') &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                // Gọi API refresh token
                const refreshRes = await api.post('/refresh');
                const newAccessToken = refreshRes.data?.data?.accessToken;
                if (newAccessToken) {
                    const refreshToken = (await secureStorage.getRefreshToken?.()) || '';
                    await secureStorage.setTokens(newAccessToken, refreshToken);
                    // Gắn lại accessToken vào header và retry request gốc
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Nếu refresh cũng fail thì clear token, thông báo và chuyển về Login
                await secureStorage.clearTokens();
                Alert.alert('Phiên đăng nhập đã hết hạn', 'Vui lòng đăng nhập lại.');
                if (navigationRef && navigationRef.isReady && navigationRef.isReady()) {
                    navigationRef.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        })
                    );
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
