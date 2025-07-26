'use client';

import { useState, useCallback, useMemo } from 'react';
import { Service, ServiceCreateData } from '@/types/api';
import { apiClient } from '@/lib/apiClient';
import { useToast } from '@/components/ToastProvider';

interface UseServicesFilters {
    page?: number;
    limit?: number;
    category?: string;
    isActive?: boolean;
    search?: string;
    [key: string]: string | number | boolean | undefined;
}

interface UseServicesReturn {
    services: Service[];
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    filters: UseServicesFilters;
    setFilters: (filters: UseServicesFilters) => void;
    createService: (data: ServiceCreateData) => Promise<boolean>;
    updateService: (id: string, data: ServiceCreateData) => Promise<boolean>;
    deleteService: (id: string) => Promise<boolean>;
    deleteMultipleServices: (ids: string[]) => Promise<boolean>;
    refetch: () => void;
}

export function useServicesAdmin(): UseServicesReturn {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const [filters, setFiltersState] = useState<UseServicesFilters>({
        page: 1,
        limit: 10
    });

    const { showToast } = useToast();

    // Fetch services
    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Filter out undefined values
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== undefined)
            ) as Record<string, string | number | boolean>;

            const response = await apiClient.get<{
                data: Service[];
                pagination: typeof pagination;
            }>('/api/services', cleanFilters);

            if (response.data) {
                setServices(response.data.data || []);
                setPagination(response.data.pagination || pagination);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch services';
            setError(errorMessage);
            console.error('Error fetching services:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Set filters with refetch
    const setFilters = useCallback((newFilters: UseServicesFilters) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    }, []);

    // Create service
    const createService = useCallback(async (data: ServiceCreateData): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await apiClient.post<Service>('/api/services', data);

            if (response.success) {
                await fetchServices(); // Refetch to update list
                showToast({
                    type: 'success',
                    title: 'Thành công',
                    message: 'Tạo gói dịch vụ thành công!'
                });
                return true;
            }
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create service';
            showToast({
                type: 'error',
                title: 'Lỗi',
                message: errorMessage
            });
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchServices, showToast]);

    // Update service
    const updateService = useCallback(async (id: string, data: ServiceCreateData): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await apiClient.put<Service>(`/api/services/${id}`, data);

            if (response.success) {
                await fetchServices(); // Refetch to update list
                showToast({
                    type: 'success',
                    title: 'Thành công',
                    message: 'Cập nhật gói dịch vụ thành công!'
                });
                return true;
            }
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update service';
            showToast({
                type: 'error',
                title: 'Lỗi',
                message: errorMessage
            });
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchServices, showToast]);

    // Delete service
    const deleteService = useCallback(async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await apiClient.delete(`/api/services/${id}`);

            if (response.success) {
                await fetchServices(); // Refetch to update list
                showToast({
                    type: 'success',
                    title: 'Thành công',
                    message: 'Xóa gói dịch vụ thành công!'
                });
                return true;
            }
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete service';
            showToast({
                type: 'error',
                title: 'Lỗi',
                message: errorMessage
            });
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchServices, showToast]);

    // Delete multiple services
    const deleteMultipleServices = useCallback(async (ids: string[]): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await apiClient.post('/api/services/delete-multiple', { ids });

            if (response.success) {
                await fetchServices(); // Refetch to update list
                showToast({
                    type: 'success',
                    title: 'Thành công',
                    message: `Xóa ${ids.length} gói dịch vụ thành công!`
                });
                return true;
            }
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete services';
            showToast({
                type: 'error',
                title: 'Lỗi',
                message: errorMessage
            });
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchServices, showToast]);

    // Auto-fetch when filters change
    useState(() => {
        fetchServices();
    });

    // Memoized return value to prevent unnecessary re-renders
    return useMemo(() => ({
        services,
        loading,
        error,
        pagination,
        filters,
        setFilters,
        createService,
        updateService,
        deleteService,
        deleteMultipleServices,
        refetch: fetchServices
    }), [
        services,
        loading,
        error,
        pagination,
        filters,
        setFilters,
        createService,
        updateService,
        deleteService,
        deleteMultipleServices,
        fetchServices
    ]);
}
