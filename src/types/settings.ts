// Public settings interface
export interface PublicSettings {
    brandName: string;
    logoUrl?: string;
    description?: string;
    address: string;
    phone: string;
    email: string;
    openTime: string;
    closeTime: string;
    facebookPage?: string;
    instagram?: string;
    website?: string;
    zaloUrl?: string;
    slogan?: string;
}

// API response interface
export interface PublicSettingsResponse {
    success: boolean;
    data?: PublicSettings;
    error?: string;
}
