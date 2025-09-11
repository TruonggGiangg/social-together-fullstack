import { ResponseData } from './global.types';

// Định nghĩa các type liên quan đến Auth

export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginData {
    accessToken: string;
    refreshToken?: string;
    [key: string]: any;
}

export type LoginResponse = ResponseData<LoginData>;
