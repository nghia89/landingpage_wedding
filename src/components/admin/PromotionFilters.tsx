import React from 'react';
import { PromotionFilters as FiltersType } from '@/hooks/usePromotions';

interface PromotionFiltersProps {
    filters: FiltersType;
    onFiltersChange: (filters: FiltersType) => void;
    selectedCount: number;
    onDeleteSelected: () => void;
}

export default function PromotionFilters({
    filters,
    onFiltersChange,
    selectedCount,
    onDeleteSelected
}: PromotionFiltersProps) {
    const handleSearchChange = (value: string) => {
        onFiltersChange({ ...filters, search: value, page: 1 });
    };

    const handleStatusChange = (status: string) => {
        onFiltersChange({ ...filters, status: status as FiltersType['status'], page: 1 });
    };

    const handleTypeChange = (type: string) => {
        onFiltersChange({ ...filters, type: type as FiltersType['type'], page: 1 });
    };

    const handleTargetPageChange = (targetPage: string) => {
        onFiltersChange({ ...filters, targetPage: targetPage as FiltersType['targetPage'], page: 1 });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">

                {/* Search */}
                <div className="flex-1 max-w-md">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Tìm kiếm
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            placeholder="Tìm theo tiêu đề..."
                            value={filters.search || ''}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">

                    {/* Status Filter */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            id="status"
                            value={filters.status || 'all'}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                            <option value="expired">Đã hết hạn</option>
                            <option value="upcoming">Sắp diễn ra</option>
                        </select>
                    </div>

                    {/* Type Filter */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                            Kiểu hiển thị
                        </label>
                        <select
                            id="type"
                            value={filters.type || 'all'}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="popup">Popup</option>
                            <option value="banner">Banner</option>
                            <option value="slide">Slide</option>
                        </select>
                    </div>

                    {/* Target Page Filter */}
                    <div>
                        <label htmlFor="targetPage" className="block text-sm font-medium text-gray-700 mb-2">
                            Trang áp dụng
                        </label>
                        <select
                            id="targetPage"
                            value={filters.targetPage || 'all'}
                            onChange={(e) => handleTargetPageChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="landing">Landing Page</option>
                            <option value="booking">Booking Page</option>
                            <option value="homepage">Homepage</option>
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedCount > 0 && (
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">
                            Đã chọn {selectedCount} mục
                        </span>
                        <button
                            onClick={onDeleteSelected}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Xóa đã chọn</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
