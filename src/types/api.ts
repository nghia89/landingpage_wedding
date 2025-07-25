// Booking types
export interface BookingFormData {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    service: string;
    message?: string;
}

// Backend API format for booking
export interface BookingApiData {
    customerName: string;
    phone: string;
    consultationDate: string;
    consultationTime: string;
    requirements?: string;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Booking {
    _id: string;
    customerName: string;
    phone: string;
    consultationDate: string;
    consultationTime: string;
    requirements?: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

// Contact types
export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export interface Contact extends ContactFormData {
    _id: string;
    status: 'new' | 'responded' | 'closed';
    createdAt: string;
    updatedAt: string;
}

// Promotion types
export interface Promotion {
    _id: string;
    title: string;
    description: string;
    discount: number;
    discountType: 'percentage' | 'fixed';
    code?: string;
    validFrom: string;
    validTo: string;
    isActive: boolean;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

// Service types
export interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    features: string[];
    category: 'basic' | 'standard' | 'premium' | 'luxury';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceCreateData {
    name: string;
    description: string;
    price: number;
    features: string[];
    category: 'basic' | 'standard' | 'premium' | 'luxury';
    isActive?: boolean;
}

// Customer types
export interface Customer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
    totalBookings: number;
    totalSpent: number;
    createdAt: string;
    updatedAt: string;
}

// Gallery types
export interface Gallery {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
}

export interface GalleryCreateData {
    title: string;
    description: string;
    imageUrl: string;
}

export interface GalleryUpdateData {
    title?: string;
    description?: string;
    imageUrl?: string;
}

// Review types
export interface Review {
    _id: string;
    customerName: string;
    avatarUrl: string;
    content: string;
    rating: number;
    eventDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReviewCreateData {
    customerName: string;
    avatarUrl: string;
    content: string;
    rating: number;
    eventDate: string;
}

export interface ReviewUpdateData {
    customerName?: string;
    avatarUrl?: string;
    content?: string;
    rating?: number;
    eventDate?: string;
}

// Common API response wrapper
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
