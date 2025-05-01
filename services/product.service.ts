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

export const productService = {
    /**
     * Create a new product listing
     */
    createProduct: async (productData: ProductFormData): Promise<ProductResponse> => {
        // Convert form data to the format expected by the API
        const formattedData = {
            ...productData,
            price: parseFloat(productData.price),
            rentalPeriod: productData.rentalPeriod ? parseInt(productData.rentalPeriod) : undefined,
            images: productData.images // Assuming the backend expects imageUrls
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
    }
};
