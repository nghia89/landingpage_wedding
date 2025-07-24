'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { apiClient, ApiError } from '@/lib/apiClient';
import { useToast } from '@/components/ToastProvider';
import {
    Booking,
    BookingFormData,
    BookingApiData,
    Contact,
    ContactFormData,
    Promotion,
    Service,
    PaginatedResponse
} from '@/types/api';

// Generic hook for API calls với debounce
export function useApiCall<T>(
    apiCall: () => Promise<T>,
    dependencies: React.DependencyList = [],
    autoExecute: boolean = true,
    debounceMs: number = 300
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const execute = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiCall();
            setData(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : 'Có lỗi xảy ra';
            setError(errorMessage);
            showToast({
                type: 'error',
                title: 'Lỗi API',
                message: errorMessage,
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiCall, showToast]);

    const debouncedExecute = useCallback(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            execute();
        }, debounceMs);
    }, [execute, debounceMs]);

    useEffect(() => {
        if (autoExecute) {
            debouncedExecute();
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [autoExecute, debouncedExecute, ...dependencies]);

    return { data, loading, error, execute, refetch: execute };
}

// Hook for submitting forms
export function useSubmit<TData, TResponse = unknown>() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();

    const submit = async (
        apiCall: (data: TData) => Promise<TResponse>,
        data: TData,
        options?: {
            successMessage?: string;
            errorMessage?: string;
            showSuccessToast?: boolean;
            showErrorToast?: boolean;
        }
    ): Promise<TResponse> => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiCall(data);

            if (options?.showSuccessToast !== false) {
                showToast({
                    type: 'success',
                    title: 'Thành công',
                    message: options?.successMessage || 'Thao tác thành công',
                });
            }

            return result;
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message : (options?.errorMessage || 'Có lỗi xảy ra');
            setError(errorMessage);

            if (options?.showErrorToast !== false) {
                showToast({
                    type: 'error',
                    title: 'Lỗi',
                    message: errorMessage,
                });
            }

            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submit, loading, error };
}

// Specific hooks for each API

// Bookings
export function useBookings(params?: { page?: number; limit?: number; status?: string }) {
    // Memoize params để tránh infinite loop
    const memoizedParams = useMemo(() => params || {}, [
        params?.page,
        params?.limit,
        params?.status
    ]);

    return useApiCall(
        () => apiClient.get<PaginatedResponse<Booking>>('/api/bookings', memoizedParams),
        [memoizedParams?.page, memoizedParams?.limit, memoizedParams?.status]
    );
}

export function useCreateBooking() {
    return useSubmit<BookingFormData, Booking>();
}

export function useBookingSubmit() {
    const { submit, loading, error } = useSubmit<BookingFormData, { data: Booking }>();

    const submitBooking = async (data: BookingFormData) => {
        return submit(
            async (formData) => {
                // Convert form data to API format
                const apiData: BookingApiData = {
                    customerName: formData.name,
                    phone: formData.phone,
                    consultationDate: formData.date,
                    consultationTime: formData.time,
                    requirements: formData.message || undefined,
                    status: 'pending'
                };

                const response = await apiClient.post<Booking>('/api/bookings', apiData);
                // Email notification is automatically sent by the backend API
                console.log('� Booking created successfully, email notification sent automatically');

                return { data: response.data! };
            },
            data,
            {
                successMessage: 'Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.',
            }
        );
    };

    return { submitBooking, loading, error };
}

// Contact
export function useContactSubmit() {
    const { submit, loading, error } = useSubmit<ContactFormData, { data: Contact }>();

    const submitContact = async (data: ContactFormData) => {
        return submit(
            async (contactData) => {
                const response = await apiClient.post<Contact>('/api/contact', contactData);
                return { data: response.data! };
            },
            data,
            {
                successMessage: 'Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.',
            }
        );
    };

    return { submitContact, loading, error };
}

// Promotions với caching và mock support
export function usePromotions(params?: { active?: boolean; limit?: number }) {
    // Memoize params để tránh infinite loop
    const memoizedParams = useMemo(() => params || {}, [
        params?.active,
        params?.limit
    ]);

    // Tạo cache key
    const cacheKey = useMemo(() =>
        `promotions_${memoizedParams?.active ?? 'all'}_${memoizedParams?.limit ?? 'unlimited'}`,
        [memoizedParams?.active, memoizedParams?.limit]
    );

    // Check if we can use mock data
    const [mockEnabled, setMockEnabled] = useState(false);
    const [mockData, setMockData] = useState<Promotion[]>([]);

    // Try to get mock context (optional)
    useEffect(() => {
        try {
            // This will only work if MockApiProvider is available
            const mockContext = (window as any).__mockApiContext;
            if (mockContext?.isEnabled) {
                setMockEnabled(true);
                let filtered = mockContext.mockData.promotions;

                if (memoizedParams?.active !== undefined) {
                    filtered = filtered.filter((p: Promotion) => p.isActive === memoizedParams.active);
                }

                if (memoizedParams?.limit) {
                    filtered = filtered.slice(0, memoizedParams.limit);
                }

                setMockData(filtered);
            }
        } catch (error) {
            // Mock context not available, use real API
            console.log('Mock context not available, using real API');
        }
    }, [memoizedParams]);

    const apiResult = useApiCall(
        async () => {
            if (mockEnabled) {
                // Return mock data
                return new Promise<Promotion[]>(resolve => {
                    setTimeout(() => resolve(mockData), 300); // Simulate network delay
                });
            }

            const response = await apiClient.get<Promotion[]>('/api/promotions', memoizedParams);
            return response.data || [];
        },
        [cacheKey, mockEnabled, mockData], // Include mock state in dependencies
        true,
        500 // Debounce 500ms cho promotions
    );

    return apiResult;
}

// Services
export function useServices(params?: { active?: boolean; category?: string }) {
    // Memoize params để tránh infinite loop
    const memoizedParams = useMemo(() => params || {}, [
        params?.active,
        params?.category
    ]);

    return useApiCall(
        async () => {
            const response = await apiClient.get<Service[]>('/api/services', memoizedParams);
            return response.data || [];
        },
        [memoizedParams?.active, memoizedParams?.category], // Chỉ depend vào các giá trị cụ thể
        true
    );
}

// Newsletter subscription
export function useNewsletterSubscribe() {
    const { submit, loading, error } = useSubmit<{ email: string }, { success: boolean }>();

    const subscribe = async (email: string) => {
        return submit(
            async (data) => {
                const response = await apiClient.post('/api/newsletter', data);
                return { success: response.success };
            },
            { email },
            {
                successMessage: 'Đăng ký nhận tin thành công!',
            }
        );
    };

    return { subscribe, loading, error };
}

// Custom hook for real-time data fetching
export function useRealTimeData<T>(
    fetcher: () => Promise<T>,
    interval: number = 30000, // 30 seconds
    dependencies: React.DependencyList = []
) {
    const { data, loading, error, execute } = useApiCall(fetcher, dependencies);

    useEffect(() => {
        if (!interval) return;

        const intervalId = setInterval(() => {
            execute();
        }, interval);

        return () => clearInterval(intervalId);
    }, [interval, execute]);

    return { data, loading, error, refetch: execute };
}
