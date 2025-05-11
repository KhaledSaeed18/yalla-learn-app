import { api } from '@/api/base';
import { User, UserResponse, UpdateProfileRequest } from '@/types/service/user.types';

/**
 * Get the current user's profile
 */
export const getCurrentUserProfile = async (): Promise<User> => {
    try {
        const response = await api.get<UserResponse>('/users/profile');
        return response.data.user;
    } catch (error) {
        throw error;
    }
};

/**
 * Update the current user's profile
 */
export const updateProfile = async (userData: UpdateProfileRequest): Promise<User> => {
    try {
        const response = await api.put<UserResponse>('/users/update-profile', userData);
        return response.data.user;
    } catch (error) {
        throw error;
    }
};