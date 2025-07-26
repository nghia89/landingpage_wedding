'use client';

import { useState } from 'react';
import { useGalleries, useCreateGallery, useUpdateGallery, useDeleteGallery } from '@/hooks/useApi';
import { Gallery } from '@/types/api';
import AdminLayout from '@/components/admin/AdminLayout';

export default function GalleryAdminPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // API hooks
    const { data: galleriesResponse, loading, error, refetch } = useGalleries({
        page: currentPage,
        limit: 12,
        search: searchTerm
    });

    const { createGallery, loading: creating } = useCreateGallery();
    const { updateGallery, loading: updating } = useUpdateGallery();
    const { deleteGallery, loading: deleting } = useDeleteGallery();

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: ''
    });

    const galleries = galleriesResponse?.data?.data || [];
    const pagination = galleriesResponse?.data?.pagination;

    const handleOpenModal = (gallery?: Gallery) => {
        if (gallery) {
            setEditingGallery(gallery);
            setFormData({
                title: gallery.title,
                description: gallery.description,
                imageUrl: gallery.imageUrl
            });
        } else {
            setEditingGallery(null);
            setFormData({
                title: '',
                description: '',
                imageUrl: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingGallery(null);
        setFormData({
            title: '',
            description: '',
            imageUrl: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingGallery) {
                await updateGallery(editingGallery._id, formData);
            } else {
                await createGallery(formData);
            }

            handleCloseModal();
            refetch();
        } catch (error) {
            console.error('Error saving gallery:', error);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Bạn có chắc muốn xóa ảnh "${title}"?`)) {
            try {
                await deleteGallery(id);
                refetch();
            } catch (error) {
                console.error('Error deleting gallery:', error);
            }
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        refetch();
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Thư viện ảnh</h1>
                            <p className="mt-2 text-gray-600">Quản lý hình ảnh cho website</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <button
                                onClick={() => handleOpenModal()}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Thêm ảnh mới
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="mt-6 flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                            />
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

                {/* Gallery Grid */}
                {!loading && galleries && galleries.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {galleries.map((gallery: Gallery) => (
                                <div key={gallery._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                                    {/* Image */}
                                    <div className="aspect-w-16 aspect-h-9">
                                        <img
                                            src={gallery.imageUrl}
                                            alt={gallery.title}
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                                            }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {gallery.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                            {gallery.description}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(gallery)}
                                                disabled={updating}
                                                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(gallery._id, gallery.title)}
                                                disabled={deleting}
                                                className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <div className="px-4 py-3 bg-gray-50 text-xs text-gray-500">
                                        Tạo: {new Date(gallery.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.pages > 1 && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-sm text-gray-700">
                                    <span>
                                        Hiển thị {((currentPage - 1) * 12) + 1} đến {Math.min(currentPage * 12, pagination.total)} trong {pagination.total} ảnh
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
                {!loading && (!galleries || galleries.length === 0) && (
                    <div className="text-center py-12">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có ảnh nào</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm ? 'Không tìm thấy ảnh nào phù hợp.' : 'Bắt đầu bằng cách thêm ảnh đầu tiên.'}
                        </p>
                        {!searchTerm && (
                            <div className="mt-6">
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                >
                                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Thêm ảnh mới
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div className="mt-3">
                                {/* Modal Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {editingGallery ? 'Chỉnh sửa ảnh' : 'Thêm ảnh mới'}
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
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            Tiêu đề *
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                            placeholder="Nhập tiêu đề ảnh"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                            Mô tả *
                                        </label>
                                        <textarea
                                            id="description"
                                            required
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                            placeholder="Nhập mô tả ảnh"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                                            URL ảnh *
                                        </label>
                                        <input
                                            type="url"
                                            id="imageUrl"
                                            required
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>

                                    {/* Preview */}
                                    {formData.imageUrl && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Xem trước
                                            </label>
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-md border border-gray-300"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}

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
                                            {creating || updating ? 'Đang lưu...' : (editingGallery ? 'Cập nhật' : 'Thêm mới')}
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
