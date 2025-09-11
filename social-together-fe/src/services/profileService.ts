import { profileApi } from '../api/profileApi';
import { ProfileResponse } from '../types/profile.types';
export const profileService = {
    async fetchProfile(): Promise<ProfileResponse> {
        return profileApi.getProfile();
    },
};
