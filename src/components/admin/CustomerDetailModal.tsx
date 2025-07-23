'use client';

import { useEffect } from 'react';

interface Customer {
    id: string;
    fullName: string;
    phone: string;
    weddingDate: string;
    requirements: string;
    status: 'new' | 'contacted' | 'deposited' | 'in_progress' | 'completed' | 'cancelled';
    createdAt: string;
    email?: string;
    guestCount?: number;
    budget?: string;
    venue?: string;
    notes?: string;
}interface CustomerDetailModalProps {
    customer: Customer | null;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: (customerId: string, newStatus: string) => void;
}

export default function CustomerDetailModal({
    customer,
    isOpen,
    onClose,
    onStatusChange
}: CustomerDetailModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !customer) return null;

    const getStatusColor = (status: string) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800',
            contacted: 'bg-yellow-100 text-yellow-800',
            deposited: 'bg-orange-100 text-orange-800',
            in_progress: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    }; const getStatusLabel = (status: string) => {
        const labels = {
            new: 'Mới',
            contacted: 'Đã liên hệ',
            deposited: 'Đã đặt cọc',
            in_progress: 'Đang xử lý',
            completed: 'Hoàn thành',
            cancelled: 'Hủy',
        };
        return labels[status as keyof typeof labels] || status;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatWeddingDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Chi tiết khách hàng
                    </h3>
                    <button
                        type="button"
                        className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                        onClick={onClose}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Thông tin cá nhân</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Họ và tên</label>
                                <p className="mt-1 text-sm text-gray-900">{customer.fullName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    <a href={`tel:${customer.phone}`} className="text-rose-600 hover:text-rose-700">
                                        {customer.phone}
                                    </a>
                                </p>
                            </div>
                            {customer.email && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        <a href={`mailto:${customer.email}`} className="text-rose-600 hover:text-rose-700">
                                            {customer.email}
                                        </a>
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Ngày gửi yêu cầu</label>
                                <p className="mt-1 text-sm text-gray-900">{formatDate(customer.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Wedding Info */}
                    <div className="bg-rose-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Thông tin đám cưới</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Ngày cưới dự kiến</label>
                                <p className="mt-1 text-sm text-gray-900">
                                    {customer.weddingDate ? formatWeddingDate(customer.weddingDate) : 'Chưa xác định'}
                                </p>
                            </div>
                            {customer.guestCount && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Số lượng khách</label>
                                    <p className="mt-1 text-sm text-gray-900">{customer.guestCount} người</p>
                                </div>
                            )}
                            {customer.budget && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Ngân sách</label>
                                    <p className="mt-1 text-sm text-gray-900">{customer.budget}</p>
                                </div>
                            )}
                            {customer.venue && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Địa điểm</label>
                                    <p className="mt-1 text-sm text-gray-900">{customer.venue}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Yêu cầu đặc biệt</label>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                {customer.requirements || 'Không có yêu cầu đặc biệt'}
                            </p>
                        </div>
                    </div>

                    {/* Notes */}
                    {customer.notes && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Ghi chú nội bộ</label>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-gray-900 whitespace-pre-wrap">{customer.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Status Management */}
                    <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Quản lý trạng thái</h4>
                        <div className="flex items-center space-x-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Trạng thái hiện tại</label>
                                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(customer.status)}`}>
                                    {getStatusLabel(customer.status)}
                                </span>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Cập nhật trạng thái</label>
                                <select
                                    value={customer.status}
                                    onChange={(e) => onStatusChange(customer.id, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                >
                                    <option value="new">Mới</option>
                                    <option value="contacted">Đã liên hệ</option>
                                    <option value="deposited">Đã đặt cọc</option>
                                    <option value="in_progress">Đang xử lý</option>
                                    <option value="completed">Hoàn thành</option>
                                    <option value="cancelled">Hủy</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Fixed */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                    >
                        Lưu ghi chú
                    </button>
                    <a
                        href={`tel:${customer.phone}`}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                    >
                        Gọi ngay
                    </a>
                </div>
            </div>
        </div>
    );
}
