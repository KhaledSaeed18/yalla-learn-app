export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
}

export interface SignUpResponse {
    message: string;
    userId: string;
    email: string;
}
