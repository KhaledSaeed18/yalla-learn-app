export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
}
