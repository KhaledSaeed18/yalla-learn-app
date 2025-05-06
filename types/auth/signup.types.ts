export interface SignUpRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface SignUpResponse {
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
        };
    };
}