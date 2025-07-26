import React from 'react';
import { Promotion } from '@/hooks/usePromotions';
import Image from 'next/image';

interface PromotionTableProps {
    promotions: Promotion[];
    loading: boolean;
    selectedPromotions: string[];
    onSelectionChange: (ids: string[]) => void;
    onEdit: (promotion: Promotion) => void;
    onDelete: (id: string) => void;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    } | null;
    onPageChange: (page: number) => void;
}

export default function PromotionTable({
    promotions,
    loading,
    selectedPromotions,
    onSelectionChange,
    onEdit,
    onDelete,
    pagination,
    onPageChange
}: PromotionTableProps) {
    // Handle select all
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            onSelectionChange(promotions.map(p => p._id));
        } else {
            onSelectionChange([]);
        }
    };

    // Handle individual selection
    const handleSelectOne = (id: string, checked: boolean) => {
        if (checked) {
            onSelectionChange([...selectedPromotions, id]);
        } else {
            onSelectionChange(selectedPromotions.filter(selectedId => selectedId !== id));
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Get status badge
    const getStatusBadge = (promotion: Promotion) => {
        const now = new Date();
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);

        if (!promotion.isActive) {
            return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Không hoạt động</span>;
        }

        if (endDate < now) {
            return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Đã hết hạn</span>;
        }

        if (startDate > now) {
            return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Sắp diễn ra</span>;
        }

        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Đang hoạt động</span>;
    };

    // Get type badge
    const getTypeBadge = (type: string) => {
        const badges = {
            popup: 'bg-purple-100 text-purple-800',
            banner: 'bg-blue-100 text-blue-800',
            slide: 'bg-indigo-100 text-indigo-800'
        };
        return badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    // Get target page badge
    const getTargetPageBadge = (targetPage: string) => {
        const pages = {
            landing: 'Landing Page',
            booking: 'Booking Page',
            homepage: 'Homepage'
        };
        return pages[targetPage as keyof typeof pages] || targetPage;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedPromotions.length === promotions.length && promotions.length > 0}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hình ảnh
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tiêu đề
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kiểu hiển thị
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trang áp dụng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thời gian
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {promotions.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                    Không có khuyến mãi nào
                                </td>
                            </tr>
                        ) : (
                            promotions.map((promotion) => (
                                <tr key={promotion._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedPromotions.includes(promotion._id)}
                                            onChange={(e) => handleSelectOne(promotion._id, e.target.checked)}
                                            className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                                            {promotion.imageUrl ? (
                                                <Image
                                                    src={promotion.imageUrl}
                                                    alt={promotion.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {promotion.title}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {promotion.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(promotion.type)}`}>
                                            {promotion.type.charAt(0).toUpperCase() + promotion.type.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">
                                            {getTargetPageBadge(promotion.targetPage)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(promotion)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => onEdit(promotion)}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => onDelete(promotion._id)}
                                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Hiển thị {((pagination.page - 1) * pagination.limit) + 1} đến{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} trong{' '}
                            {pagination.total} kết quả
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => onPageChange(pagination.page - 1)}
                                disabled={pagination.page <= 1}
                                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Trước
                            </button>

                            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                                .filter(page =>
                                    page === 1 ||
                                    page === pagination.pages ||
                                    (page >= pagination.page - 1 && page <= pagination.page + 1)
                                )
                                .map((page, index, array) => (
                                    <React.Fragment key={page}>
                                        {index > 0 && array[index - 1] !== page - 1 && (
                                            <span className="px-2 text-gray-500">...</span>
                                        )}
                                        <button
                                            onClick={() => onPageChange(page)}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${page === pagination.page
                                                    ? 'bg-pink-600 text-white'
                                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    </React.Fragment>
                                ))
                            }

                            <button
                                onClick={() => onPageChange(pagination.page + 1)}
                                disabled={pagination.page >= pagination.pages}
                                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
