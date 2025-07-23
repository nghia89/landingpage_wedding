import { useState, useEffect, useCallback } from 'react';

export interface Promotion {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    type: 'popup' | 'banner' | 'slide';
    targetPage: 'landing' | 'booking' | 'homepage';
    startDate: string;
    endDate: string;
    isActive: boolean;
    ctaText?: string;
    ctaLink?: string;
    priority: number;
    createdAt: string;
    updatedAt: string;
}

export interface PromotionCreateData {
    title: string;
    description: string;
    imageUrl: string;
    type: 'popup' | 'banner' | 'slide';
    targetPage: 'landing' | 'booking' | 'homepage';
    startDate: string;
    endDate: string;
    isActive: boolean;
    ctaText?: string;
    ctaLink?: string;
    priority: number;
}

export interface PromotionFilters {
    search?: string;
    status?: 'all' | 'active' | 'inactive' | 'expired' | 'upcoming';
    type?: 'all' | 'popup' | 'banner' | 'slide';
    targetPage?: 'all' | 'landing' | 'booking' | 'homepage';
    page?: number;
    limit?: number;
}

interface PromotionsPaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

interface UsePromotionsResult {
    promotions: Promotion[];
    loading: boolean;
    error: string | null;
    pagination: PromotionsPaginationInfo | null;
    filters: PromotionFilters;
    setFilters: (filters: PromotionFilters) => void;
    fetchPromotions: () => Promise<void>;
    createPromotion: (data: PromotionCreateData) => Promise<boolean>;
    updatePromotion: (id: string, data: Partial<PromotionCreateData>) => Promise<boolean>;
    deletePromotion: (id: string) => Promise<boolean>;
    deleteMultiplePromotions: (ids: string[]) => Promise<boolean>;
}

export const usePromotions = (): UsePromotionsResult => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PromotionsPaginationInfo | null>(null);
    const [filters, setFilters] = useState<PromotionFilters>({
        page: 1,
        limit: 10,
        status: 'all',
        type: 'all',
        targetPage: 'all'
    });

    // Build query string from filters
    const buildQueryString = useCallback((filterParams: PromotionFilters) => {
        const params = new URLSearchParams();

        if (filterParams.search) params.append('search', filterParams.search);
        if (filterParams.status && filterParams.status !== 'all') params.append('status', filterParams.status);
        if (filterParams.type && filterParams.type !== 'all') params.append('type', filterParams.type);
        if (filterParams.targetPage && filterParams.targetPage !== 'all') params.append('targetPage', filterParams.targetPage);
        if (filterParams.page) params.append('page', filterParams.page.toString());
        if (filterParams.limit) params.append('limit', filterParams.limit.toString());

        return params.toString();
    }, []);

    // Fetch promotions
    const fetchPromotions = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const queryString = buildQueryString(filters);
            const response = await fetch(`/api/promotions?${queryString}`);
            const result = await response.json();

            if (result.success) {
                setPromotions(result.data || []);
                setPagination(result.pagination || null);
            } else {
                setError(result.error || 'Failed to fetch promotions');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch promotions');
        } finally {
            setLoading(false);
        }
    }, [filters, buildQueryString]);

    // Create new promotion
    const createPromotion = useCallback(async (data: PromotionCreateData): Promise<boolean> => {
        try {
            const response = await fetch('/api/promotions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                await fetchPromotions(); // Refresh list
                return true;
            } else {
                setError(result.error || 'Failed to create promotion');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create promotion');
            return false;
        }
    }, [fetchPromotions]);

    // Update promotion
    const updatePromotion = useCallback(async (id: string, data: Partial<PromotionCreateData>): Promise<boolean> => {
        try {
            const response = await fetch(`/api/promotions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (result.success) {
                await fetchPromotions(); // Refresh list
                return true;
            } else {
                setError(result.error || 'Failed to update promotion');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update promotion');
            return false;
        }
    }, [fetchPromotions]);

    // Delete single promotion
    const deletePromotion = useCallback(async (id: string): Promise<boolean> => {
        try {
            const response = await fetch(`/api/promotions/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                await fetchPromotions(); // Refresh list
                return true;
            } else {
                setError(result.error || 'Failed to delete promotion');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete promotion');
            return false;
        }
    }, [fetchPromotions]);

    // Delete multiple promotions
    const deleteMultiplePromotions = useCallback(async (ids: string[]): Promise<boolean> => {
        try {
            const response = await fetch('/api/promotions', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids }),
            });

            const result = await response.json();

            if (result.success) {
                await fetchPromotions(); // Refresh list
                return true;
            } else {
                setError(result.error || 'Failed to delete promotions');
                return false;
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete promotions');
            return false;
        }
    }, [fetchPromotions]);

    // Fetch promotions when filters change
    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    return {
        promotions,
        loading,
        error,
        pagination,
        filters,
        setFilters,
        fetchPromotions,
        createPromotion,
        updatePromotion,
        deletePromotion,
        deleteMultiplePromotions,
    };
};
