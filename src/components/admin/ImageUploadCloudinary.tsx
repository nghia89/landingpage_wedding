'use client';

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import axios from 'axios';
import clsx from 'clsx';

interface ImageUploadCloudinaryProps {
    onUpload: (url: string) => void;
    defaultValue?: string;
    className?: string;
    label?: string;
    disabled?: boolean;
}

export default function ImageUploadCloudinary({
    onUpload,
    defaultValue,
    className,
    label = "Tải ảnh lên",
    disabled = false
}: ImageUploadCloudinaryProps) {
    const [imageUrl, setImageUrl] = useState<string>(defaultValue || '');
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Update imageUrl when defaultValue changes
    useEffect(() => {
        if (defaultValue !== imageUrl) {
            setImageUrl(defaultValue || '');
        }
    }, [defaultValue, imageUrl]);

    const uploadToCloudinary = async (file: File) => {
        setIsUploading(true);
        setError('');

        try {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                throw new Error('Vui lòng chọn file ảnh');
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('Kích thước file không được vượt quá 10MB');
            }

            // Upload through our backend API (signed upload)
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/upload/cloudinary', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                const uploadedImageUrl = response.data.url;
                setImageUrl(uploadedImageUrl);
                onUpload(uploadedImageUrl);
            } else {
                throw new Error(response.data.error || 'Upload failed');
            }
        } catch (error: unknown) {
            console.error('Upload error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Lỗi upload ảnh';
            setError(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            uploadToCloudinary(files[0]);
        }
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFileSelect(e.target.files);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        if (!disabled) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const handleClick = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveImage = () => {
        setImageUrl('');
        setError('');
        onUpload('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={clsx('space-y-3', className)}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <div className="space-y-4">
                {/* Upload Area */}
                <div
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={clsx(
                        'relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200',
                        {
                            'border-rose-300 bg-rose-50 hover:border-rose-400 hover:bg-rose-100': !disabled && !isDragOver && !imageUrl,
                            'border-rose-500 bg-rose-100': isDragOver && !disabled,
                            'border-gray-300 bg-gray-50 cursor-not-allowed': disabled,
                            'border-green-300 bg-green-50': imageUrl && !isUploading,
                        }
                    )}
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center space-y-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
                            <p className="text-sm text-gray-600">Đang tải ảnh lên...</p>
                        </div>
                    ) : imageUrl ? (
                        <div className="space-y-4">
                            {/* Image Preview */}
                            <div className="relative inline-block">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="max-h-48 max-w-full rounded-lg shadow-md object-cover"
                                />
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage();
                                        }}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={handleClick}
                                    className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-sm font-medium">Thay ảnh</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="mx-auto w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {isDragOver ? 'Thả ảnh vào đây' : 'Bấm để chọn ảnh hoặc kéo thả'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG, JPEG tối đa 10MB
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Hidden File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                        disabled={disabled}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-red-700">{error}</span>
                        </div>
                    </div>
                )}

                {/* Success Message */}
                {imageUrl && !isUploading && !error && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-green-700">Tải ảnh lên thành công!</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
