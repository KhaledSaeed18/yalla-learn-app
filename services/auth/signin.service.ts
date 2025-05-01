import { api } from '@/api/base';
import { SignInRequest, SignInResponse, ApiSignInResponse } from '@/types/auth/signin.types';

export const authServices = {
    /**
     * Sign in a user with email and password
     * @param credentials - The user's email and password
     * @returns A promise that resolves to the sign-in response
     */
    signIn: async (credentials: SignInRequest): Promise<SignInResponse> => {
        try {
            const apiResponse = await api.post<ApiSignInResponse>(
                '/auth/signin',
                credentials
            );

            console.log('API Response:', apiResponse);

            // Extract the data from the nested structure
            if (!apiResponse?.data?.user || !apiResponse?.data?.accessToken || !apiResponse?.data?.refreshToken) {
                console.error('Invalid response structure:', apiResponse);
                throw new Error('Invalid response received from authentication server');
            }

            // Return the structure we need, preserving the original user properties
            return {
                user: {
                    id: apiResponse.data.user.id,
                    name: `${apiResponse.data.user.firstName} ${apiResponse.data.user.lastName}`,
                    email: apiResponse.data.user.email,
                    avatar: apiResponse.data.user.avatar,
                },
                accessToken: apiResponse.data.accessToken,
                refreshToken: apiResponse.data.refreshToken
            };
        } catch (error) {
            console.error('SignIn service error:', error);
            throw error;
        }
    },
};
