import { api } from '@/api/base';
import { ServiceFormData } from '@/lib/validations/service.validation';
import { CreateServiceRequest, ServiceResponse } from '@/types/service/service.types';

export const serviceService = {
    /**
     * Create a new service listing (offering or request)
     */
    createService: async (serviceData: ServiceFormData): Promise<ServiceResponse> => {
        // Format the data for the API
        const formattedData: CreateServiceRequest = {
            ...serviceData,
            price: serviceData.price ? parseFloat(serviceData.price) : undefined,
        };

        return api.post<ServiceResponse>('/services/add', formattedData);
    },

    /**
     * Get all services
     */
    getServices: async (): Promise<ServiceResponse[]> => {
        return api.get<ServiceResponse[]>('/services');
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
    getServicesByCategory: async (category: string): Promise<ServiceResponse[]> => {
        return api.get<ServiceResponse[]>(`/services/category/${category}`);
    },

    /**
     * Get services by direction (offering or requesting)
     */
    getServicesByDirection: async (direction: string): Promise<ServiceResponse[]> => {
        return api.get<ServiceResponse[]>(`/services/direction/${direction}`);
    }
};
