import React, { useState, useEffect } from 'react';
import { Promotion, PromotionCreateData } from '@/hooks/usePromotions';
import ImageUploadCloudinary from './ImageUploadCloudinary';

interface PromotionFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PromotionCreateData) => void;
    initialData?: Promotion | null;
    isEditing?: boolean;
}

export default function PromotionForm({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    isEditing = false
}: PromotionFormProps) {
    const [formData, setFormData] = useState<PromotionCreateData>({
        title: '',
        description: '',
        imageUrl: '',
        type: 'popup',
        targetPage: 'landing',
        startDate: '',
        endDate: '',
        isActive: true,
        ctaText: '',
        ctaLink: '',
        priority: 1
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize form data when editing
    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                imageUrl: initialData.imageUrl,
                type: initialData.type,
                targetPage: initialData.targetPage,
                startDate: initialData.startDate.split('T')[0],
                endDate: initialData.endDate.split('T')[0],
                isActive: initialData.isActive,
                ctaText: initialData.ctaText || '',
                ctaLink: initialData.ctaLink || '',
                priority: initialData.priority
            });
        } else {
            setFormData({
                title: '',
                description: '',
                imageUrl: '',
                type: 'popup',
                targetPage: 'landing',
                startDate: '',
                endDate: '',
                isActive: true,
                ctaText: '',
                ctaLink: '',
                priority: 1
            });
        }
        setErrors({});
    }, [isEditing, initialData, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal */}
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative z-10">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {isEditing ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới'}
                            </h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-6">
                            {isEditing ? 'Chỉnh sửa thông tin khuyến mãi' : 'Điền thông tin khuyến mãi mới'}
                        </p>

                        {/* Form Fields */}
                        <form onSubmit={(e) => {
                            e.preventDefault();

                            // Validation
                            if (!formData.imageUrl) {
                                setErrors({ ...errors, imageUrl: 'Vui lòng tải lên hình ảnh khuyến mãi' });
                                return;
                            }

                            // Clear errors and submit
                            setErrors({});
                            onSubmit(formData);
                        }} className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tiêu đề khuyến mãi *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Nhập tiêu đề khuyến mãi"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    placeholder="Nhập mô tả khuyến mãi"
                                    rows={3}
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <ImageUploadCloudinary
                                    label="Hình ảnh khuyến mãi *"
                                    defaultValue={formData.imageUrl}
                                    onUpload={(url) => {
                                        setFormData({ ...formData, imageUrl: url });
                                        // Clear image error when user uploads
                                        if (errors.imageUrl) {
                                            setErrors({ ...errors, imageUrl: '' });
                                        }
                                    }}
                                    className="w-full"
                                />
                                {errors.imageUrl && (
                                    <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>
                                )}
                            </div>

                            {/* Type and Target Page */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại hiển thị *
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    >
                                        <option value="popup">Popup</option>
                                        <option value="banner">Banner</option>
                                        <option value="slide">Slide</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trang áp dụng *
                                    </label>
                                    <select
                                        value={formData.targetPage}
                                        onChange={(e) => setFormData({ ...formData, targetPage: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    >
                                        <option value="landing">Landing Page</option>
                                        <option value="booking">Booking Page</option>
                                        <option value="homepage">Homepage</option>
                                    </select>
                                </div>
                            </div>

                            {/* Start and End Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày bắt đầu *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngày kết thúc *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* CTA Text and Link */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Text Call-to-Action
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ctaText}
                                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="Đặt lịch ngay"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link Call-to-Action
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.ctaLink}
                                        onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        placeholder="https://example.com/booking"
                                    />
                                </div>
                            </div>

                            {/* Priority and Active Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Độ ưu tiên
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                        min="1"
                                        max="10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Trạng thái
                                    </label>
                                    <div className="flex items-center space-x-4 pt-2">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">Kích hoạt</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            onClick={() => {
                                onSubmit(formData);
                                onClose();
                            }}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            {isEditing ? 'Cập nhật' : 'Tạo mới'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
