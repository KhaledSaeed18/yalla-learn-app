import { api } from '../api/base';
import { ProductFormData } from '@/lib/validations/product.validation';

export interface ProductResponse {
    id: string;
    title: string;
    description: string;
    price: number;
    condition: string;
    category: string;
    isRentable: boolean;
    rentalPeriod?: string;
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ListingResponse {
    id: string;
    title: string;
    description: string;
    price: number;
    condition: string;
    category: string;
    images: string[];
    isAvailable: boolean;
    userId: string;
    isRentable: boolean;
    rentalPeriod: number | null;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
}

export interface PaginationInfo {
    totalListings: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface ListingsResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        listings: ListingResponse[];
        pagination: PaginationInfo;
    };
}

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
     * Upload product images and get back URLs
     */
    uploadProductImages: async (images: string[]): Promise<string[]> => {
        // In a real implementation, you would handle file uploads here
        // For now, we'll simulate it by returning the original URLs
        // This would typically involve FormData and multipart/form-data request

        // Simulated response - in a real app, you'd send the files to the server
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(images);
            }, 1000);
        });
    },

    /**
     * Get paginated listings
     */
    getListings: async (page: number = 1, limit: number = 10): Promise<ListingsResponse> => {
        return api.get<ListingsResponse>(`/listings/get-listings?page=${page}&limit=${limit}`);
    }
};
