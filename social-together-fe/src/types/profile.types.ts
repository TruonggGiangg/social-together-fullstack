import { ResponseData } from './global.types';

export interface ProfileData {
    email: string;
    _id: string;
    role: string;
    name: string;
    iat: number;
    exp: number;
}

export type ProfileResponse = ResponseData<ProfileData>;
