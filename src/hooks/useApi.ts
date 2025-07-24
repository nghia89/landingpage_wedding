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
    PaginatedResponse,
    Gallery,
    GalleryCreateData,
    GalleryUpdateData,
    Review,
    ReviewCreateData,
    ReviewUpdateData
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

                // Add sendEmail=true parameter for frontend bookings
                const response = await apiClient.post<Booking>('/api/bookings?sendEmail=true', apiData);
                console.log('📧 Booking created successfully from frontend, email notification sent');

                return { data: response.data! };
            },
            data,
            {
                successMessage: 'Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm và bạn sẽ nhận được email xác nhận.',
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
    const memoizedParams = useMemo(() => {
        if (!params) return {};

        const queryParams: Record<string, string> = {};
        if (params.active !== undefined) {
            queryParams.isActive = params.active.toString();
        }
        if (params.category) {
            queryParams.category = params.category;
        }

        return queryParams;
    }, [params?.active, params?.category]);

    return useApiCall(
        async () => {
            const response = await apiClient.get<Service[]>('/api/services', memoizedParams);
            return response.data || [];
        },
        [JSON.stringify(memoizedParams)], // Sử dụng JSON.stringify để stable dependency
        false, // Tắt auto execute để tránh infinite loop
        300 // Debounce 300ms
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

// Gallery hooks
export function useGalleries(params?: { page?: number; limit?: number; search?: string }) {
    const memoizedParams = useMemo(() => {
        if (!params) return {};

        const queryParams: Record<string, string> = {};
        if (params.page) queryParams.page = params.page.toString();
        if (params.limit) queryParams.limit = params.limit.toString();
        if (params.search) queryParams.search = params.search;

        return queryParams;
    }, [params?.page, params?.limit, params?.search]);

    return useApiCall(
        async () => {
            const response = await apiClient.get<{
                success: boolean;
                data: Gallery[];
                pagination: any;
            }>('/api/admin/gallery', memoizedParams);
            return response;
        },
        [JSON.stringify(memoizedParams)],
        false,
        300
    );
}

export function useCreateGallery() {
    const { submit, loading, error } = useSubmit<GalleryCreateData, Gallery>();

    const createGallery = async (data: GalleryCreateData) => {
        return submit(
            async (galleryData) => {
                const response = await apiClient.post<{
                    success: boolean;
                    data: Gallery;
                }>('/api/admin/gallery', galleryData);
                return response.data?.data!; // Return just the Gallery object
            },
            data,
            {
                successMessage: 'Thêm ảnh thành công!',
            }
        );
    };

    return { createGallery, loading, error };
}

export function useUpdateGallery() {
    const { submit, loading, error } = useSubmit<{ id: string, data: GalleryUpdateData }, Gallery>();

    const updateGallery = async (id: string, data: GalleryUpdateData) => {
        return submit(
            async ({ id, data }) => {
                const response = await apiClient.put<{
                    success: boolean;
                    data: Gallery;
                }>(`/api/admin/gallery/${id}`, data);
                return response.data?.data!; // Return just the Gallery object
            },
            { id, data },
            {
                successMessage: 'Cập nhật ảnh thành công!',
            }
        );
    };

    return { updateGallery, loading, error };
}

export function useDeleteGallery() {
    const { submit, loading, error } = useSubmit<string, Gallery>();

    const deleteGallery = async (id: string) => {
        return submit(
            async (galleryId) => {
                const response = await apiClient.delete<{
                    success: boolean;
                    data: Gallery;
                }>(`/api/admin/gallery/${galleryId}`);
                return response.data?.data!; // Return just the Gallery object
            },
            id,
            {
                successMessage: 'Xóa ảnh thành công!',
            }
        );
    };

    return { deleteGallery, loading, error };
}

// Review hooks
export function useReviews(params?: { page?: number; limit?: number; search?: string; rating?: number }) {
    const memoizedParams = useMemo(() => {
        if (!params) return {};

        const queryParams: Record<string, string> = {};
        if (params.page) queryParams.page = params.page.toString();
        if (params.limit) queryParams.limit = params.limit.toString();
        if (params.search) queryParams.search = params.search;
        if (params.rating) queryParams.rating = params.rating.toString();

        return queryParams;
    }, [params?.page, params?.limit, params?.search, params?.rating]);

    return useApiCall(
        async () => {
            const response = await apiClient.get<{
                success: boolean;
                data: Review[];
                pagination: any;
            }>('/api/admin/reviews', memoizedParams);
            return response;
        },
        [JSON.stringify(memoizedParams)],
        false,
        300
    );
}

export function useCreateReview() {
    const { submit, loading, error } = useSubmit<ReviewCreateData, Review>();

    const createReview = async (data: ReviewCreateData) => {
        return submit(
            async (reviewData) => {
                const response = await apiClient.post<{
                    success: boolean;
                    data: Review;
                }>('/api/admin/reviews', reviewData);
                return response.data?.data!;
            },
            data,
            {
                successMessage: 'Tạo đánh giá thành công!',
            }
        );
    };

    return { createReview, loading, error };
}

export function useUpdateReview() {
    const { submit, loading, error } = useSubmit<ReviewUpdateData, Review>();

    const updateReview = async (id: string, data: ReviewUpdateData) => {
        return submit(
            async (reviewData) => {
                const response = await apiClient.put<{
                    success: boolean;
                    data: Review;
                }>(`/api/admin/reviews/${id}`, reviewData);
                return response.data?.data!;
            },
            data,
            {
                successMessage: 'Cập nhật đánh giá thành công!',
            }
        );
    };

    return { updateReview, loading, error };
}

export function useDeleteReview() {
    const { submit, loading, error } = useSubmit<void, Review>();

    const deleteReview = async (id: string) => {
        return submit(
            async () => {
                const response = await apiClient.delete<{
                    success: boolean;
                    data: Review;
                }>(`/api/admin/reviews/${id}`);
                return response.data?.data!;
            },
            undefined,
            {
                successMessage: 'Xóa đánh giá thành công!',
            }
        );
    };

    return { deleteReview, loading, error };
}
