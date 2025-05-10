import { api } from '@/api/base';
import { ServiceFormData } from '@/lib/validations/service.validation';
import { CreateServiceRequest, ServiceResponse, ServicesListResponse } from '@/types/service/service.types';

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
     * Get all services
     */
    getServices: async (): Promise<ServicesListResponse> => {
        return api.get<ServicesListResponse>('/services/get-services');
    },

    /**
     * Get a specific service by ID
     */
    getServiceById: async (id: string): Promise<ServiceResponse> => {
        return api.get<ServiceResponse>(`/services/${id}`);
    },

    /**
     * Get services by category
     */
    getServicesByCategory: async (category: string): Promise<ServicesListResponse> => {
        return api.get<ServicesListResponse>(`/services/category/${category}`);
    },

    /**
     * Get services by direction (offering or requesting)
     */
    getServicesByDirection: async (direction: string): Promise<ServicesListResponse> => {
        return api.get<ServicesListResponse>(`/services/direction/${direction}`);
    }
};
