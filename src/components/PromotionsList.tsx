'use client';

import { useMemo } from 'react';
import { usePromotions } from '@/hooks/useApi';
import { useRenderCount } from '@/hooks/useDebug';
import { Promotion } from '@/types/api';

interface PromotionsListProps {
    limit?: number;
    showOnlyActive?: boolean;
    className?: string;
}

export default function PromotionsList({
    limit = 6,
    showOnlyActive = true,
    className = ''
}: PromotionsListProps) {
    // Debug render count
    const renderCount = useRenderCount('PromotionsList');

    // Memoize params để tránh tạo object mới mỗi lần render
    const params = useMemo(() => ({
        active: showOnlyActive,
        limit
    }), [showOnlyActive, limit]);

    const { data: promotions, loading, error } = usePromotions(params);

    // Log để debug
    console.log('🎯 PromotionsList render:', { renderCount, params, promotions: promotions?.length });

    if (loading) {
        return (
            <div className={`${className}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: limit }).map((_, index) => (
                        <PromotionSkeleton key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${className}`}>
                <div className="text-center py-12">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không thể tải khuyến mãi</h3>
                    <p className="text-gray-500">{error}</p>
                </div>
            </div>
        );
    }

    if (!promotions || promotions.length === 0) {
        return (
            <div className={`${className}`}>
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khuyến mãi</h3>
                    <p className="text-gray-500">Hiện tại chưa có chương trình khuyến mãi nào.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promotion) => (
                    <PromotionCard key={promotion._id} promotion={promotion} />
                ))}
            </div>
        </div>
    );
}

// Promotion Card Component
function PromotionCard({ promotion }: { promotion: Promotion }) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const isExpired = new Date(promotion.validTo) < new Date();
    const isUpcoming = new Date(promotion.validFrom) > new Date();

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-rose-100 to-pink-100">
                {promotion.image ? (
                    <img
                        src={promotion.image}
                        alt={promotion.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                    </div>
                )}

                {/* Discount Badge */}
                <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {promotion.discountType === 'percentage'
                            ? `-${promotion.discount}%`
                            : `-${promotion.discount.toLocaleString('vi-VN')}đ`
                        }
                    </div>
                </div>

                {/* Status Badge */}
                {(isExpired || isUpcoming) && (
                    <div className="absolute top-4 left-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${isExpired
                                ? 'bg-gray-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}>
                            {isExpired ? 'Đã hết hạn' : 'Sắp diễn ra'}
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {promotion.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {promotion.description}
                </p>

                {/* Promotion Code */}
                {promotion.code && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-gray-600">Mã khuyến mãi:</span>
                            <div className="flex items-center">
                                <code className="bg-rose-100 text-rose-800 px-2 py-1 rounded text-sm font-mono">
                                    {promotion.code}
                                </code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(promotion.code!)}
                                    className="ml-2 text-gray-400 hover:text-gray-600"
                                    title="Copy mã"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Validity Period */}
                <div className="text-xs text-gray-500 mb-4">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                            {formatDate(promotion.validFrom)} - {formatDate(promotion.validTo)}
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    className={`
                        w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200
                        ${isExpired
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isUpcoming
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                        }
                    `}
                    disabled={isExpired}
                >
                    {isExpired
                        ? 'Đã hết hạn'
                        : isUpcoming
                            ? 'Sắp diễn ra'
                            : 'Áp dụng ngay'
                    }
                </button>
            </div>
        </div>
    );
}

// Skeleton Loading Component
function PromotionSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-4 w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
    );
}
