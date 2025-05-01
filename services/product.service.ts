import { ProductResponse, ListingsResponse } from '@/types/service/product.types';
import { api } from '../api/base';
import { ProductFormData } from '@/lib/validations/product.validation';

export const productService = {
    /**
     * Create a new product listing
     */
    createProduct: async (productData: ProductFormData): Promise<ProductResponse> => {
        const formattedData = {
            ...productData,
            price: parseFloat(productData.price),
            rentalPeriod: productData.rentalPeriod ? parseInt(productData.rentalPeriod) : undefined,
            images: productData.images
        };

        return api.post<ProductResponse>('/listings/add', formattedData);
    },

    /**
     * Get paginated listings
     */
    getListings: async (page: number = 1, limit: number = 10): Promise<ListingsResponse> => {
        return api.get<ListingsResponse>(`/listings/get-listings?page=${page}&limit=${limit}`);
    }
};
