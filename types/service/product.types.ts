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
        email: string;
    };
}

export interface ListingDetailResponse {
    status: string;
    statusCode: number;
    message: string;
    data: {
        listing: ListingResponse;
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