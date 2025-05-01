import { ProductResponse, ListingsResponse } from '@/types/service/product.types';
import { api } from '../api/base';
import { ProductFormData } from '@/lib/validations/product.validation';
import { FilterOptions } from '@/components/listings/listings-filter';

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
    getListings: async (page: number = 1, limit: number = 10, filters?: FilterOptions): Promise<ListingsResponse> => {
        let url = `/listings/get-listings?page=${page}&limit=${limit}`;

        // Add filters to URL if they exist
        if (filters) {
            if (filters.category) url += `&category=${filters.category}`;
            if (filters.condition) url += `&condition=${filters.condition}`;
            if (filters.isRentable !== undefined) url += `&isRentable=${filters.isRentable}`;
            if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
            if (filters.sortOrder) url += `&sortOrder=${filters.sortOrder}`;
        }

        return api.get<ListingsResponse>(url);
    },

    /**
     * Upload product images
     */
    uploadProductImages: async (imageUris: string[]): Promise<string[]> => {
        // This is a placeholder method - you should implement actual image upload logic here
        // For example, converting images to base64 or multipart form data and sending to your backend
        return imageUris;
    }
};
