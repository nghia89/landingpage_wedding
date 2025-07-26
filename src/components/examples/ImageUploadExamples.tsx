'use client';

import { useState } from 'react';
import ImageUploadCloudinary from '@/components/admin/ImageUploadCloudinary';

/**
 * Example component demonstrating various use cases of ImageUploadCloudinary
 * This component shows different scenarios and configurations
 */
export default function ImageUploadExamples() {
    const [productImage, setProductImage] = useState('');
    const [bannerImage, setBannerImage] = useState('https://via.placeholder.com/800x400/f3f4f6/6b7280?text=Default+Banner');
    const [multipleImages, setMultipleImages] = useState<string[]>([]);

    const handleProductImageUpload = (url: string) => {
        setProductImage(url);
    };

    const handleBannerImageUpload = (url: string) => {
        setBannerImage(url);
    };

    const handleMultipleImageUpload = (url: string, index: number) => {
        const newImages = [...multipleImages];
        newImages[index] = url;
        setMultipleImages(newImages);
    };

    const addImageSlot = () => {
        setMultipleImages([...multipleImages, '']);
    };

    const removeImageSlot = (index: number) => {
        const newImages = multipleImages.filter((_, i) => i !== index);
        setMultipleImages(newImages);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    ImageUploadCloudinary Examples
                </h1>
                <p className="text-gray-600">
                    Các ví dụ sử dụng component upload ảnh trong different scenarios
                </p>
            </div>

            {/* Example 1: Basic Product Image */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    1. Upload ảnh sản phẩm cơ bản
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <ImageUploadCloudinary
                            onUpload={handleProductImageUpload}
                            defaultValue={productImage}
                            label="Ảnh sản phẩm"
                        />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Kết quả:</p>
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <code className="text-xs text-gray-600 break-all">
                                {productImage || 'Chưa có ảnh nào được upload'}
                            </code>
                        </div>
                    </div>
                </div>
            </div>

            {/* Example 2: Banner with Default Value */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    2. Banner với ảnh có sẵn (defaultValue)
                </h2>
                <ImageUploadCloudinary
                    onUpload={handleBannerImageUpload}
                    defaultValue={bannerImage}
                    label="Banner website"
                />
            </div>

            {/* Example 3: Disabled State */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    3. Trạng thái disabled (chỉ xem)
                </h2>
                <ImageUploadCloudinary
                    onUpload={() => { }}
                    defaultValue="https://via.placeholder.com/400x300/e5e7eb/6b7280?text=View+Only+Image"
                    label="Ảnh chỉ xem (disabled)"
                    disabled={true}
                />
            </div>

            {/* Example 4: Multiple Images (Gallery) */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    4. Upload nhiều ảnh (Gallery)
                </h2>
                <div className="space-y-4">
                    {multipleImages.map((imageUrl, index) => (
                        <div key={index} className="flex items-start space-x-4">
                            <div className="flex-1">
                                <ImageUploadCloudinary
                                    onUpload={(url) => handleMultipleImageUpload(url, index)}
                                    defaultValue={imageUrl}
                                    label={`Ảnh ${index + 1}`}
                                />
                            </div>
                            <button
                                onClick={() => removeImageSlot(index)}
                                className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Xóa slot ảnh này"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addImageSlot}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
                    >
                        + Thêm slot ảnh mới
                    </button>
                </div>
            </div>

            {/* Example 5: Form Integration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    5. Tích hợp vào form hoàn chỉnh
                </h2>
                <form className="space-y-4" onSubmit={(e) => {
                    e.preventDefault();
                    alert('Form submitted!');
                }}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên sản phẩm
                        </label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            placeholder="Nhập tên sản phẩm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ImageUploadCloudinary
                            onUpload={handleProductImageUpload}
                            defaultValue={productImage}
                            label="Ảnh đại diện"
                        />
                        <ImageUploadCloudinary
                            onUpload={handleBannerImageUpload}
                            defaultValue={bannerImage}
                            label="Ảnh banner"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-rose-600 text-white py-3 px-4 rounded-lg hover:bg-rose-700 transition-colors font-medium"
                    >
                        Lưu thông tin
                    </button>
                </form>
            </div>

            {/* Configuration Guide */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    � Cấu hình Cloudinary (Signed Upload)
                </h3>
                <div className="text-sm text-blue-700 space-y-2">
                    <p>Để component hoạt động, bạn cần cấu hình:</p>
                    <div className="bg-white/50 rounded-lg p-3 font-mono text-xs">
                        <div>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name</div>
                        <div>CLOUDINARY_API_KEY=your-api-key</div>
                        <div>CLOUDINARY_API_SECRET=your-api-secret</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                        <p className="text-xs text-green-800">
                            <strong>🔒 Bảo mật:</strong> Upload sử dụng signed upload thông qua server API.
                            API Secret chỉ được sử dụng trên server, không bao giờ expose ra client.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
