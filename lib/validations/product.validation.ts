import { z } from 'zod';

// Importing enums to use with validation
import { Condition, ListingCategory } from '@/types/enums';

export const productSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
    price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: 'Price must be a positive number',
    }),
    condition: z.nativeEnum(Condition, {
        errorMap: () => ({ message: 'Please select a valid condition' }),
    }),
    category: z.nativeEnum(ListingCategory, {
        errorMap: () => ({ message: 'Please select a valid category' }),
    }),
    isRentable: z.boolean(),
    rentalPeriod: z.string()
        .refine((val) => val === '' || (!isNaN(parseInt(val)) && parseInt(val) > 0), {
            message: 'Rental period must be a positive number of days',
        })
        .optional()
        .nullable(),
    images: z.array(z.string()).min(1, 'At least one image is required'),
});

export type ProductFormData = z.infer<typeof productSchema>;
