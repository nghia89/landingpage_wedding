'use client';

import { useGalleries, useCreateGallery, useUpdateGallery, useDeleteGallery } from '@/hooks/useApi';
import { useState } from 'react';

export default function GalleryTestPage() {
    const { data: galleries, loading, error, refetch } = useGalleries();
    const { createGallery, loading: creating } = useCreateGallery();
    const { updateGallery, loading: updating } = useUpdateGallery();
    const { deleteGallery, loading: deleting } = useDeleteGallery();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const galleryData = {
            title,
            description,
            imageUrl
        };

        try {
            if (editingId) {
                await updateGallery(editingId, galleryData);
                setEditingId(null);
            } else {
                await createGallery(galleryData);
            }

            setTitle('');
            setDescription('');
            setImageUrl('');
            refetch();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEdit = (gallery: any) => {
        setTitle(gallery.title);
        setDescription(gallery.description);
        setImageUrl(gallery.imageUrl);
        setEditingId(gallery._id);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc muốn xóa ảnh này?')) {
            try {
                await deleteGallery(id);
                refetch();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setImageUrl('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Gallery Management Test
                </h1>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? 'Chỉnh sửa ảnh' : 'Thêm ảnh mới'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL ảnh
                            </label>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                required
                            />
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

                {/* Gallery List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Danh sách ảnh</h2>

                    {loading && <p>Đang tải...</p>}
                    {error && <p className="text-red-500">Lỗi: {error}</p>}

                    {galleries && 'data' in galleries && galleries.data?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleries.data.map((gallery: any) => (
                                <div key={gallery._id} className="border rounded-lg overflow-hidden">
                                    <img
                                        src={gallery.imageUrl}
                                        alt={gallery.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-2">{gallery.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4">{gallery.description}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(gallery)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(gallery._id)}
                                                disabled={deleting}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && <p>Chưa có ảnh nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
