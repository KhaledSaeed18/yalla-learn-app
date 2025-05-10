import { api } from '@/api/base';
import { ServiceFormData } from '@/lib/validations/service.validation';
import { CreateServiceRequest, ServiceFilters, ServiceResponse, ServicesListResponse } from '@/types/service/service.types';

export const serviceService = {
    /**
     * Create a new service listing (offering or request)
     */
    createService: async (serviceData: ServiceFormData): Promise<ServiceResponse> => {
        const formattedData: CreateServiceRequest = {
            ...serviceData,
            price: serviceData.price ? parseFloat(serviceData.price) : undefined,
        };

        return api.post<ServiceResponse>('/services/add', formattedData);
    },

    /**
     * Get all services with optional filters
     */
    getServices: async (filters?: ServiceFilters): Promise<ServicesListResponse> => {
        const queryParams = new URLSearchParams();

        if (filters) {
            if (filters.page) queryParams.append('page', filters.page.toString());
            if (filters.limit) queryParams.append('limit', filters.limit.toString());
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.direction) queryParams.append('direction', filters.direction);
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
        }

        const queryString = queryParams.toString();
        const url = `/services/get-services${queryString ? `?${queryString}` : ''}`;

        return api.get<ServicesListResponse>(url);
    },

    /**
     * Get a specific service by ID
     */
    getServiceById: async (id: string): Promise<ServiceResponse> => {
        return api.get<ServiceResponse>(`/services/get-service/${id}`);
    },

    /**
     * Get all services created by the current user
     */
    getUserServices: async (filters?: ServiceFilters): Promise<ServicesListResponse> => {
        const queryParams = new URLSearchParams();

        if (filters) {
            if (filters.page) queryParams.append('page', filters.page.toString());
            if (filters.limit) queryParams.append('limit', filters.limit.toString());
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.direction) queryParams.append('direction', filters.direction);
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
        }

        const queryString = queryParams.toString();
        const url = `/services/user/my-services${queryString ? `?${queryString}` : ''}`;

        return api.get<ServicesListResponse>(url);
    },

    /**
     * Update an existing service
     */
    updateService: async (id: string, serviceData: ServiceFormData): Promise<ServiceResponse> => {
        const formattedData: CreateServiceRequest = {
            ...serviceData,
            price: serviceData.price ? parseFloat(serviceData.price) : undefined,
        };

        return api.put<ServiceResponse>(`/services/${id}`, formattedData);
    },

    /**
     * Delete a service
     */
    deleteService: async (id: string): Promise<any> => {
        return api.delete(`/services/delete-service/${id}`);
    }
};
