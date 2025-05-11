import { api } from '@/api/base';
import {
    ForgotPasswordRequest,
    ForgotPasswordResponse
} from '@/types/auth/forgotPassword.types';

export const forgotPasswordServices = {
    /**
     * Send password reset instructions to user email
     * @param emailData - User email
     * @returns A promise that resolves to the forgot password response
     */
    forgotPassword: (emailData: ForgotPasswordRequest) => {
        return api.post<ForgotPasswordResponse>(
            '/auth/forgot-password',
            emailData
        );
    },
};
