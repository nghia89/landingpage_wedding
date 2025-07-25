'use client';

import { useState } from 'react';
import ImageUploadCloudinary from '@/components/admin/ImageUploadCloudinary';
import AdminLayout from '@/components/admin/AdminLayout';

export default function ImageUploadTestPage() {
    const [uploadedUrl, setUploadedUrl] = useState<string>('');
    const [defaultImageUrl, setDefaultImageUrl] = useState<string>('');

    const handleUpload = (url: string) => {
        setUploadedUrl(url);
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Test Component ImageUploadCloudinary
                        </h1>

                        <div className="space-y-8">
                            {/* Component Test 1: Basic Upload */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                                    1. Upload cơ bản
                                </h2>
                                <ImageUploadCloudinary
                                    onUpload={handleUpload}
                                    label="Chọn ảnh để upload"
                                />
                                {uploadedUrl && (
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-sm font-medium text-green-800 mb-2">URL ảnh đã upload:</p>
                                        <code className="text-xs text-green-700 break-all">{uploadedUrl}</code>
                                    </div>
                                )}
                            </div>

                            {/* Component Test 2: With Default Value */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                                    2. Với ảnh có sẵn (defaultValue)
                                </h2>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nhập URL ảnh để test defaultValue:
                                    </label>
                                    <input
                                        type="url"
                                        value={defaultImageUrl}
                                        onChange={(e) => setDefaultImageUrl(e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>
                                <ImageUploadCloudinary
                                    onUpload={(url) => { }}
                                    defaultValue={defaultImageUrl}
                                    label="Ảnh có sẵn (có thể thay đổi)"
                                />
                            </div>

                            {/* Component Test 3: Disabled State */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                                    3. Trạng thái disabled
                                </h2>
                                <ImageUploadCloudinary
                                    onUpload={() => { }}
                                    defaultValue="https://via.placeholder.com/300x200/f3f4f6/6b7280?text=Disabled+Image"
                                    label="Không thể chỉnh sửa"
                                    disabled={true}
                                />
                            </div>

                            {/* Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                                    � Hướng dẫn cấu hình Cloudinary (Signed Upload)
                                </h3>
                                <div className="space-y-3 text-sm text-blue-700">
                                    <div>
                                        <strong>Bước 1:</strong> Tạo tài khoản tại{' '}
                                        <a
                                            href="https://cloudinary.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline hover:text-blue-900"
                                        >
                                            cloudinary.com
                                        </a>
                                    </div>
                                    <div>
                                        <strong>Bước 2:</strong> Vào Dashboard → Settings → Security
                                    </div>
                                    <div>
                                        <strong>Bước 3:</strong> Copy Cloud Name, API Key và API Secret
                                    </div>
                                    <div>
                                        <strong>Bước 4:</strong> Cập nhật file <code>.env.local</code>:
                                        <div className="mt-2 p-3 bg-white border border-blue-300 rounded font-mono text-xs">
                                            NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name<br />
                                            CLOUDINARY_API_KEY=your-api-key<br />
                                            CLOUDINARY_API_SECRET=your-api-secret
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Bước 5:</strong> Restart development server
                                    </div>
                                    <div className="mt-4 p-3 bg-green-50 border border-green-300 rounded">
                                        <div className="flex items-start space-x-2">
                                            <span className="text-green-600">🔒</span>
                                            <div>
                                                <strong className="text-green-800">Bảo mật:</strong>
                                                <span className="text-green-700"> Upload được thực hiện qua server API với signed upload, đảm bảo API secret không bị expose ra client.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
