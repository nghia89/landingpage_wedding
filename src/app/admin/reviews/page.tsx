'use client';

import { useState } from 'react';
import { useReviews, useCreateReview, useUpdateReview, useDeleteReview } from '@/hooks/useApi';
import { Review } from '@/types/api';
import AdminLayout from '@/components/admin/AdminLayout';

export default function ReviewsAdminPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState(1);

    // API hooks
    const { data: reviewsResponse, loading, error, refetch } = useReviews({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        rating: ratingFilter
    });

    const { createReview, loading: creating } = useCreateReview();
    const { updateReview, loading: updating } = useUpdateReview();
    const { deleteReview, loading: deleting } = useDeleteReview();

    // Form state
    const [formData, setFormData] = useState({
        customerName: '',
        avatarUrl: '',
        content: '',
        rating: 5,
        eventDate: ''
    });

    const reviews = reviewsResponse?.data?.data || [];
    const pagination = reviewsResponse?.data?.pagination;

    const handleOpenModal = (review?: Review) => {
        if (review) {
            setEditingReview(review);
            setFormData({
                customerName: review.customerName,
                avatarUrl: review.avatarUrl,
                content: review.content,
                rating: review.rating,
                eventDate: new Date(review.eventDate).toISOString().split('T')[0]
            });
        } else {
            setEditingReview(null);
            setFormData({
                customerName: '',
                avatarUrl: '',
                content: '',
                rating: 5,
                eventDate: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingReview(null);
        setFormData({
            customerName: '',
            avatarUrl: '',
            content: '',
            rating: 5,
            eventDate: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const submitData = {
                ...formData,
                eventDate: formData.eventDate
            };

            if (editingReview) {
                await updateReview(editingReview._id, submitData);
            } else {
                await createReview(submitData);
            }

            handleCloseModal();
            refetch();
        } catch (error) {
            console.error('Error saving review:', error);
        }
    };

    const handleDelete = async (id: string, customerName: string) => {
        if (confirm(`Bạn có chắc muốn xóa đánh giá của "${customerName}"?`)) {
            try {
                await deleteReview(id);
                refetch();
            } catch (error) {
                console.error('Error deleting review:', error);
            }
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        refetch();
    };

    const renderStars = (rating: number, size: string = 'w-4 h-4') => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`${size} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">({rating})</span>
            </div>
        );
    };

    const truncateText = (text: string, maxLength: number = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Khách hàng đánh giá</h1>
                            <p className="mt-2 text-gray-600">Quản lý đánh giá và phản hồi từ khách hàng</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <button
                                onClick={() => handleOpenModal()}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Thêm đánh giá
                            </button>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên khách hàng hoặc nội dung..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            />
                        </div>
                        <div className="w-full sm:w-48">
                            <select
                                value={ratingFilter || ''}
                                onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : undefined)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            >
                                <option value="">Tất cả đánh giá</option>
                                <option value="5">5 sao</option>
                                <option value="4">4 sao</option>
                                <option value="3">3 sao</option>
                                <option value="2">2 sao</option>
                                <option value="1">1 sao</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Tìm kiếm
                        </button>
                    </form>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                        <span className="ml-2 text-gray-600">Đang tải...</span>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Có lỗi xảy ra</h3>
                                <div className="mt-2 text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews Table */}
                {!loading && reviews && reviews.length > 0 && (
                    <>
                        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
                            <ul className="divide-y divide-gray-200">
                                {reviews.map((review: Review) => (
                                    <li key={review._id} className="px-6 py-4 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center flex-1 min-w-0">
                                                {/* Avatar */}
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="h-12 w-12 rounded-full object-cover"
                                                        src={review.avatarUrl || 'https://via.placeholder.com/48x48?text=👤'}
                                                        alt={review.customerName}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://via.placeholder.com/48x48?text=👤';
                                                        }}
                                                    />
                                                </div>

                                                {/* Customer Info */}
                                                <div className="ml-4 flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {review.customerName}
                                                            </p>
                                                            <div className="mt-1">
                                                                {renderStars(review.rating)}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(review.eventDate).toLocaleDateString('vi-VN')}
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                Tạo: {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Review Content */}
                                                    <div className="mt-2">
                                                        <p
                                                            className="text-sm text-gray-600"
                                                            title={review.content}
                                                        >
                                                            {truncateText(review.content, 150)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="ml-4 flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(review)}
                                                    disabled={updating}
                                                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review._id, review.customerName)}
                                                    disabled={deleting}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.pages > 1 && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-gray-700">
                                    <span>
                                        Hiển thị {((currentPage - 1) * 10) + 1} đến {Math.min(currentPage * 10, pagination.total)} trong {pagination.total} đánh giá
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Trước
                                    </button>
                                    <span className="px-3 py-2 text-sm">
                                        Trang {currentPage} / {pagination.pages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                        disabled={currentPage >= pagination.pages}
                                        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && (!reviews || reviews.length === 0) && (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có đánh giá nào</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || ratingFilter ? 'Không tìm thấy đánh giá nào phù hợp.' : 'Bắt đầu bằng cách thêm đánh giá đầu tiên.'}
                        </p>
                        {!searchTerm && !ratingFilter && (
                            <div className="mt-6">
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Thêm đánh giá
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {editingReview ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}
                                    </h3>
                                    <button
                                        onClick={handleCloseModal}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Modal Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                                            Tên khách hàng *
                                        </label>
                                        <input
                                            type="text"
                                            id="customerName"
                                            required
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                            placeholder="Nhập tên khách hàng"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                                            URL Avatar
                                        </label>
                                        <input
                                            type="url"
                                            id="avatarUrl"
                                            value={formData.avatarUrl}
                                            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                        {formData.avatarUrl && (
                                            <img
                                                src={formData.avatarUrl}
                                                alt="Preview"
                                                className="mt-2 h-12 w-12 rounded-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                            Nội dung đánh giá *
                                        </label>
                                        <textarea
                                            id="content"
                                            required
                                            rows={4}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                            placeholder="Nhập nội dung đánh giá"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                            Đánh giá *
                                        </label>
                                        <select
                                            id="rating"
                                            required
                                            value={formData.rating}
                                            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                        >
                                            <option value={5}>⭐⭐⭐⭐⭐ (5 sao)</option>
                                            <option value={4}>⭐⭐⭐⭐ (4 sao)</option>
                                            <option value={3}>⭐⭐⭐ (3 sao)</option>
                                            <option value={2}>⭐⭐ (2 sao)</option>
                                            <option value={1}>⭐ (1 sao)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                                            Ngày sự kiện *
                                        </label>
                                        <input
                                            type="date"
                                            id="eventDate"
                                            required
                                            value={formData.eventDate}
                                            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                        />
                                    </div>

                                    {/* Modal Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={creating || updating}
                                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                                        >
                                            {creating || updating ? 'Đang lưu...' : (editingReview ? 'Cập nhật' : 'Thêm mới')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
