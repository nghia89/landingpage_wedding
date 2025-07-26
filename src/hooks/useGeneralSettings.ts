'use client';

import { useState, useEffect, useCallback } from 'react';

// General Settings interface
export interface GeneralSettings {
    _id?: string;
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
    createdAt?: string;
    updatedAt?: string;
}

// Hook return type
interface UseGeneralSettingsReturn {
    settings: GeneralSettings | null;
    loading: boolean;
    error: string;
    updateSettings: (data: Omit<GeneralSettings, '_id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
    refetchSettings: () => Promise<void>;
}

// Default settings values
const defaultSettings: GeneralSettings = {
    brandName: 'Wedding Dreams',
    logoUrl: '',
    description: 'Chúng tôi tạo ra những đám cưới trong mơ với dịch vụ chuyên nghiệp và tận tâm.',
    address: 'Hà Nội, Việt Nam',
    phone: '0123456789',
    email: 'contact@weddingdreams.vn',
    openTime: '09:00',
    closeTime: '18:00',
    facebookPage: '',
    instagram: '',
    website: ''
};

export function useGeneralSettings(): UseGeneralSettingsReturn {
    const [settings, setSettings] = useState<GeneralSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    // Fetch settings from API
    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/settings/general');
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Lỗi tải cài đặt');
            }

            // Merge with default settings to ensure all fields exist
            const mergedSettings = { ...defaultSettings, ...result.data };
            setSettings(mergedSettings);

        } catch (err) {
            console.error('Error fetching settings:', err);
            setError(err instanceof Error ? err.message : 'Lỗi tải cài đặt');
            // Set default settings if fetch fails
            setSettings(defaultSettings);
        } finally {
            setLoading(false);
        }
    }, []);

    // Update settings via API
    const updateSettings = useCallback(async (data: Omit<GeneralSettings, '_id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/settings/general', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Lỗi cập nhật cài đặt');
            }

            // Update local state with new data
            const mergedSettings = { ...defaultSettings, ...result.data };
            setSettings(mergedSettings);

            return true;

        } catch (err) {
            console.error('Error updating settings:', err);
            setError(err instanceof Error ? err.message : 'Lỗi cập nhật cài đặt');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Refetch settings (useful for manual refresh)
    const refetchSettings = useCallback(async () => {
        await fetchSettings();
    }, [fetchSettings]);

    // Initial fetch on mount
    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings,
        loading,
        error,
        updateSettings,
        refetchSettings
    };
}
