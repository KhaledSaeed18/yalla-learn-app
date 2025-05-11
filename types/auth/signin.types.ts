export interface SignInRequest {
    email: string;
    password: string;
}

export interface ApiSignInResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
            isVerified: boolean;
            totpEnabled: boolean;
            avatar?: string;
            bio?: string;
            location?: string;
        };
        accessToken: string;
        refreshToken: string;
    };
}

// The transformed response structure used in the app
export interface SignInResponse {
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
    accessToken: string;
    refreshToken: string;
}
