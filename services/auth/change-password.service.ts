import { api } from '@/api/base';
import { ChangePasswordRequest, ChangePasswordResponse } from '@/types/service/change-password.types';

/**
 * Change the current user's password
 * @param data The password change request data
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
    try {
        await api.post<ChangePasswordResponse>('/users/change-password', data);
    } catch (error) {
        throw error;
    }
};
