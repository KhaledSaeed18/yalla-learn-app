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

/**
 * Upload avatar image
 * This function takes an image URI and returns the uploaded image URL
 */
export const uploadAvatar = async (imageUri: string): Promise<string> => {
    // In a real implementation, you would upload the image to your server or a cloud storage service
    // For now, we'll just return the URI as if it was uploaded
    // This should be replaced with actual image upload logic
    return imageUri;
};