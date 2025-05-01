import { api } from '@/api/base';
import { SignUpRequest, SignUpResponse } from '@/types/auth/signup.types';

export const signupServices = {
    /**
     * Register a new user with their information
     * @param userData - The user's registration data
     * @returns A promise that resolves to the signup response
     */
    signUp: (userData: SignUpRequest) => {
        return api.post<SignUpResponse>(
            '/auth/signup',
            userData
        );
    },
};
