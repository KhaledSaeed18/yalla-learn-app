import { GigCategory, ServiceDirection } from '../enums';

export interface CreateServiceRequest {
    title: string;
    description: string;
    price?: number;
    category: GigCategory;
    direction: ServiceDirection;
}

export interface ServiceResponse {
    id: string;
    title: string;
    description: string;
    price?: number | null;
    category: GigCategory;
    direction: ServiceDirection;
    createdAt: string;
    updatedAt: string;
    userId: string;
    user?: ServiceUser;
}

export interface ServiceUser {
    id: string;
    firstName: string;
    lastName: string;
    [key: string]: any; // For any additional user properties
}

export interface ServicePagination {
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
    totalPages: number;
    totalServices: number;
}

export interface ServicesListResponse {
    data: {
        pagination: ServicePagination;
        services: ServiceResponse[];
    };
    message: string;
    status: string;
    statusCode: number;
}
