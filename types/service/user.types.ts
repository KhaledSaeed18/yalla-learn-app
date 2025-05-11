// User types based on the Prisma model and API response structure

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role?: string;
    bio?: string | null;
    location?: string | null;
    phoneNumber?: string | null;
    avatar?: string | null;
    isVerified?: boolean;
    totpEnabled?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface UserResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        user: User;
    };
}

export interface UpdateProfileRequest extends Partial<User> { }