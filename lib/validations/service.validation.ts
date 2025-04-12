import { z } from 'zod';

// Importing enums to use with validation
import { ServiceDirection, GigCategory } from '@/types/enums';

export const serviceSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
    price: z.string()
        .refine((val) => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
            message: 'Price must be a positive number',
        })
        .optional(),
    category: z.nativeEnum(GigCategory, {
        errorMap: () => ({ message: 'Please select a valid category' }),
    }),
    direction: z.nativeEnum(ServiceDirection, {
        errorMap: () => ({ message: 'Please select offer or request' }),
    }),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
