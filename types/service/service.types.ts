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
    price?: number;
    category: GigCategory;
    direction: ServiceDirection;
    createdAt: string;
    updatedAt: string;
    userId: string;
}
