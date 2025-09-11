import { useState } from 'react';
import { authService } from '../services/authService';
import { LoginPayload, LoginResponse } from '../types/auth.types';
import { secureStorage } from '../utils/secureStorage';

export function useLogin() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const login = async (payload: LoginPayload) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authService.login(payload);
            setData(res);
            // Lưu token vào storage
            if (res?.data?.accessToken && res?.data?.refreshToken) {
                await secureStorage.setTokens(res.data.accessToken, res.data.refreshToken);
            }
            return res;
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { login, loading, error, data };
}
