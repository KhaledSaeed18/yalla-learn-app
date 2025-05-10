import { ProductResponse, ListingsResponse, ListingDetailResponse } from '@/types/service/product.types';
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
     * Delete a listing by ID
     */
    deleteListing: async (id: string): Promise<void> => {
        return api.delete(`/listings/delete-listing/${id}`);
    },

    /**
     * Get paginated listings
     */
    getListings: async (page: number = 1, limit: number = 10, filters?: FilterOptions): Promise<ListingsResponse> => {
        let url = `/listings/get-listings?page=${page}&limit=${limit}`;

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
     * Get user's own listings
     */
    getUserListings: async (page: number = 1, limit: number = 10, sortBy: string = 'createdAt', sortOrder: string = 'desc'): Promise<ListingsResponse> => {
        const url = `/listings/user/my-listings?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
        return api.get<ListingsResponse>(url);
    },

    /**
     * Get a specific listing by ID
     */
    getListingById: async (id: string): Promise<ListingDetailResponse> => {
        return api.get<ListingDetailResponse>(`/listings/get-listing/${id}`);
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
