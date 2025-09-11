import api from '../api/axiosClient';
import { LoginPayload, LoginResponse } from '../types/auth.types';

export const authService = {
    login: async (payload: LoginPayload): Promise<LoginResponse> => {
        const res = await api.post<LoginResponse>('/login/', payload);
        return res.data;
    },
};
