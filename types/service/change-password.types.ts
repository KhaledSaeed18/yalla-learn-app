export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface ChangePasswordResponse {
    status: string;
    statusCode: number;
    message: string;
}
