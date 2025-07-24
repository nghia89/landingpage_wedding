'use client';

import { useReviews, useCreateReview, useUpdateReview, useDeleteReview } from '@/hooks/useApi';
import { useState } from 'react';

export default function ReviewTestPage() {
    const { data: reviews, loading, error, refetch } = useReviews();
    const { createReview, loading: creating } = useCreateReview();
    const { updateReview, loading: updating } = useUpdateReview();
    const { deleteReview, loading: deleting } = useDeleteReview();

    const [customerName, setCustomerName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [eventDate, setEventDate] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const reviewData = {
            customerName,
            avatarUrl,
            content,
            rating,
            eventDate
        };

        try {
            if (editingId) {
                await updateReview(editingId, reviewData);
                setEditingId(null);
            } else {
                await createReview(reviewData);
            }

            // Reset form
            setCustomerName('');
            setAvatarUrl('');
            setContent('');
            setRating(5);
            setEventDate('');
            refetch();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEdit = (review: any) => {
        setCustomerName(review.customerName);
        setAvatarUrl(review.avatarUrl);
        setContent(review.content);
        setRating(review.rating);
        setEventDate(new Date(review.eventDate).toISOString().split('T')[0]);
        setEditingId(review._id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc muốn xóa đánh giá này?')) {
            try {
                await deleteReview(id);
                refetch();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setCustomerName('');
        setAvatarUrl('');
        setContent('');
        setRating(5);
        setEventDate('');
    };

    const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? "button" : undefined}
                        className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            } ${interactive ? 'hover:text-yellow-300 cursor-pointer' : ''}`}
                        onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
                        disabled={!interactive}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Review Management Test
                </h1>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá mới'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên khách hàng *
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    URL ảnh đại diện *
                                </label>
                                <input
                                    type="url"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung đánh giá *
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đánh giá sao *
                                </label>
                                {renderStars(rating, true, setRating)}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày diễn ra sự kiện *
                                </label>
                                <input
                                    type="date"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={creating || updating}
                                className="bg-pink-600 text-white px-6 py-2 rounded-md hover:bg-pink-700 disabled:opacity-50"
                            >
                                {editingId ? 'Cập nhật' : 'Thêm mới'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                                >
                                    Hủy
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Reviews List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Danh sách đánh giá</h2>

                    {loading && <p>Đang tải...</p>}
                    {error && <p className="text-red-500">Lỗi: {error}</p>}

                    {reviews && 'data' in reviews && reviews.data?.data && reviews.data.data.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.data.data.map((review: any) => (
                                <div key={review._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={review.avatarUrl}
                                            alt={review.customerName}
                                            className="w-16 h-16 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-900">
                                                        {review.customerName}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {renderStars(review.rating)}
                                                        <span className="text-sm text-gray-600">
                                                            ({review.rating}/5)
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        Sự kiện: {new Date(review.eventDate).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(review)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(review._id)}
                                                        disabled={deleting}
                                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 italic">"{review.content}"</p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Đăng vào: {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && <p className="text-gray-500">Chưa có đánh giá nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
