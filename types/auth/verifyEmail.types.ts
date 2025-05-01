export interface VerifyEmailRequest {
    email: string;
    code: string;
}

export interface VerifyEmailResponse {
    message: string;
    verified: boolean;
}

export interface ResendVerificationRequest {
    email: string;
}

export interface ResendVerificationResponse {
    message: string;
    sent: boolean;
}
