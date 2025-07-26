'use client';

import React, { useState } from 'react';
import { usePromotions, Promotion, PromotionCreateData } from '@/hooks/usePromotions';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import PromotionForm from '@/components/admin/PromotionForm';
import PromotionFilters from '@/components/admin/PromotionFilters';
import PromotionTable from '@/components/admin/PromotionTable';
import { useToast } from '@/components/ToastProvider';

export default function PromotionsPage() {
    const { showToast } = useToast();
    const {
        promotions,
        loading,
        error,
        pagination,
        filters,
        setFilters,
        createPromotion,
        updatePromotion,
        deletePromotion,
        deleteMultiplePromotions,
    } = usePromotions();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    const [selectedPromotions, setSelectedPromotions] = useState<string[]>([]);

    // Handle create promotion
    const handleCreatePromotion = async (data: PromotionCreateData) => {
        const success = await createPromotion(data);
        if (success) {
            setIsFormOpen(false);
            showToast({
                type: 'success',
                title: 'Thành công',
                message: 'Tạo khuyến mãi thành công!'
            });
        } else {
            showToast({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi tạo khuyến mãi'
            });
        }
    };

    // Handle update promotion
    const handleUpdatePromotion = async (data: PromotionCreateData) => {
        if (!editingPromotion) return;

        const success = await updatePromotion(editingPromotion._id, data);
        if (success) {
            setIsFormOpen(false);
            setEditingPromotion(null);
            showToast({
                type: 'success',
                title: 'Thành công',
                message: 'Cập nhật khuyến mãi thành công!'
            });
        } else {
            showToast({
                type: 'error',
                title: 'Lỗi',
                message: 'Có lỗi xảy ra khi cập nhật khuyến mãi'
            });
        }
    };

    // Handle delete promotion
    const handleDeletePromotion = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) {
            const success = await deletePromotion(id);
            if (success) {
                showToast({
                    type: 'success',
                    title: 'Thành công',
                    message: 'Xóa khuyến mãi thành công!'
                });
            } else {
                showToast({
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Có lỗi xảy ra khi xóa khuyến mãi'
                });
            }
        }
    };

    // Handle delete multiple promotions
    const handleDeleteSelected = async () => {
        if (selectedPromotions.length === 0) return;

        if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedPromotions.length} khuyến mãi đã chọn?`)) {
            const success = await deleteMultiplePromotions(selectedPromotions);
            if (success) {
                setSelectedPromotions([]);
                showToast({
                    type: 'success',
                    title: 'Thành công',
                    message: `Xóa ${selectedPromotions.length} khuyến mãi thành công!`
                });
            } else {
                showToast({
                    type: 'error',
                    title: 'Lỗi',
                    message: 'Có lỗi xảy ra khi xóa khuyến mãi'
                });
            }
        }
    };

    // Handle edit promotion
    const handleEditPromotion = (promotion: Promotion) => {
        setEditingPromotion(promotion);
        setIsFormOpen(true);
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        setFilters({ ...filters, page });
    };

    // Handle close form
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingPromotion(null);
    };

    return (
        <AdminAuthGuard>
            <AdminLayout>
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Page Header */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        Quản lý Khuyến mãi / Ưu đãi
                                    </h1>
                                    <p className="mt-2 text-gray-600">
                                        Quản lý các chương trình khuyến mãi và ưu đãi cho website
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsFormOpen(true);
                                    }}
                                    className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Tạo khuyến mãi mới</span>
                                </button>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex">
                                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Filters */}
                        <PromotionFilters
                            filters={filters}
                            onFiltersChange={setFilters}
                            selectedCount={selectedPromotions.length}
                            onDeleteSelected={handleDeleteSelected}
                        />

                        {/* Table */}
                        <PromotionTable
                            promotions={promotions}
                            loading={loading}
                            selectedPromotions={selectedPromotions}
                            onSelectionChange={setSelectedPromotions}
                            onEdit={handleEditPromotion}
                            onDelete={handleDeletePromotion}
                            pagination={pagination}
                            onPageChange={handlePageChange}
                        />

                        {/* Promotion Form Modal */}
                        {isFormOpen && (
                            <PromotionForm
                                isOpen={isFormOpen}
                                onClose={handleCloseForm}
                                onSubmit={editingPromotion ? handleUpdatePromotion : handleCreatePromotion}
                                initialData={editingPromotion}
                                isEditing={!!editingPromotion}
                            />
                        )}
                    </div>
                </div>
            </AdminLayout>
        </AdminAuthGuard>
    );
}
