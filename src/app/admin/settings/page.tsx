'use client';

import { useState, useEffect } from 'react';
import { useGeneralSettings, GeneralSettings } from '@/hooks/useGeneralSettings';
import AdminLayout from '@/components/admin/AdminLayout';
import clsx from 'clsx';

export default function GeneralSettingsPage() {
    const { settings, loading, error, updateSettings } = useGeneralSettings();
    const [formData, setFormData] = useState<GeneralSettings>({
        brandName: '',
        logoUrl: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        openTime: '09:00',
        closeTime: '18:00',
        facebookPage: '',
        instagram: '',
        website: '',
        zaloUrl: '',
        slogan: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string>('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // Update form data when settings are loaded
    useEffect(() => {
        if (settings) {
            setFormData({
                brandName: settings.brandName || '',
                logoUrl: settings.logoUrl || '',
                description: settings.description || '',
                address: settings.address || '',
                phone: settings.phone || '',
                email: settings.email || '',
                openTime: settings.openTime || '09:00',
                closeTime: settings.closeTime || '18:00',
                facebookPage: settings.facebookPage || '',
                instagram: settings.instagram || '',
                website: settings.website || '',
                zaloUrl: settings.zaloUrl || '',
                slogan: settings.slogan || ''
            });
        }
    }, [settings]);

    // Handle input changes
    const handleInputChange = (field: keyof GeneralSettings, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear submit error when user starts typing
        if (submitError) {
            setSubmitError('');
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            setSubmitError('');

            const success = await updateSettings(formData);

            if (success) {
                setShowSuccessToast(true);
                // Hide toast after 3 seconds
                setTimeout(() => setShowSuccessToast(false), 3000);
            }

        } catch (err) {
            console.error('Error submitting form:', err);
            setSubmitError(err instanceof Error ? err.message : 'Lỗi cập nhật cài đặt');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="p-6 lg:p-8 max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Cấu hình chung</h1>
                                    <p className="text-gray-600 mt-1">Quản lý thông tin cơ bản và liên hệ của doanh nghiệp</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
                            <span className="ml-3 text-gray-600">Đang tải cài đặt...</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <div className="flex">
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    {/* Success Toast */}
                    {showSuccessToast && (
                        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Cập nhật thành công!</span>
                        </div>
                    )}

                    {/* Form */}
                    {!loading && settings && (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Company Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h6m-6 4h6m-2 4h2" />
                                            </svg>
                                        </div>
                                        Thông tin doanh nghiệp
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1 ml-11">Cập nhật thông tin cơ bản và liên hệ của công ty</p>
                                </div>
                                <div className="p-6">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Brand Name */}
                                        <div>
                                            <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
                                                Tên thương hiệu *
                                            </label>
                                            <input
                                                type="text"
                                                id="brandName"
                                                value={formData.brandName}
                                                onChange={(e) => handleInputChange('brandName', e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 hover:border-gray-400 bg-gray-50 focus:bg-white"
                                                placeholder="Ví dụ: Wedding Dreams"
                                            />
                                        </div>

                                        {/* Logo URL */}
                                        <div>
                                            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                                Logo URL
                                            </label>
                                            <input
                                                type="url"
                                                id="logoUrl"
                                                value={formData.logoUrl}
                                                onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="https://example.com/logo.png"
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="mt-6">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Giới thiệu ngắn
                                        </label>
                                        <textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            placeholder="Mô tả ngắn về doanh nghiệp của bạn..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        Thông tin liên hệ
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1 ml-11">Địa chỉ, số điện thoại và email của doanh nghiệp</p>
                                </div>
                                <div className="p-6">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Address */}
                                        <div>
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                                Địa chỉ *
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="Địa chỉ của bạn"
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Số điện thoại *
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="0123456789"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email liên hệ *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="contact@example.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Business Hours */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                        <svg className="w-6 h-6 text-rose-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Giờ hoạt động
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Open Time */}
                                        <div>
                                            <label htmlFor="openTime" className="block text-sm font-medium text-gray-700 mb-2">
                                                Giờ mở cửa *
                                            </label>
                                            <input
                                                type="time"
                                                id="openTime"
                                                value={formData.openTime}
                                                onChange={(e) => handleInputChange('openTime', e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            />
                                        </div>

                                        {/* Close Time */}
                                        <div>
                                            <label htmlFor="closeTime" className="block text-sm font-medium text-gray-700 mb-2">
                                                Giờ đóng cửa *
                                            </label>
                                            <input
                                                type="time"
                                                id="closeTime"
                                                value={formData.closeTime}
                                                onChange={(e) => handleInputChange('closeTime', e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        Mạng xã hội & Website
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1 ml-11">Liên kết mạng xã hội và website của doanh nghiệp</p>
                                </div>
                                <div className="p-6">

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Facebook */}
                                        <div>
                                            <label htmlFor="facebookPage" className="block text-sm font-medium text-gray-700 mb-2">
                                                Facebook Page
                                            </label>
                                            <input
                                                type="url"
                                                id="facebookPage"
                                                value={formData.facebookPage}
                                                onChange={(e) => handleInputChange('facebookPage', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="https://facebook.com/yourpage"
                                            />
                                        </div>

                                        {/* Instagram */}
                                        <div>
                                            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                                                Instagram
                                            </label>
                                            <input
                                                type="url"
                                                id="instagram"
                                                value={formData.instagram}
                                                onChange={(e) => handleInputChange('instagram', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="https://instagram.com/youraccount"
                                            />
                                        </div>

                                        {/* Website */}
                                        <div className="md:col-span-2">
                                            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                                                Website (tùy chọn)
                                            </label>
                                            <input
                                                type="url"
                                                id="website"
                                                value={formData.website}
                                                onChange={(e) => handleInputChange('website', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>

                                        {/* Zalo URL */}
                                        <div>
                                            <label htmlFor="zaloUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                                Zalo URL (tùy chọn)
                                            </label>
                                            <input
                                                type="url"
                                                id="zaloUrl"
                                                value={formData.zaloUrl}
                                                onChange={(e) => handleInputChange('zaloUrl', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="https://zalo.me/yourphone"
                                            />
                                        </div>

                                        {/* Slogan */}
                                        <div>
                                            <label htmlFor="slogan" className="block text-sm font-medium text-gray-700 mb-2">
                                                Slogan (tùy chọn)
                                            </label>
                                            <input
                                                type="text"
                                                id="slogan"
                                                value={formData.slogan}
                                                onChange={(e) => handleInputChange('slogan', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="Câu slogan của công ty..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Error */}
                            {submitError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <div className="flex">
                                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{submitError}</span>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={clsx(
                                            'px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-3 shadow-lg',
                                            isSubmitting
                                                ? 'bg-gray-400 text-white cursor-not-allowed shadow-gray-200'
                                                : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-200 hover:shadow-rose-300 hover:scale-105 transform'
                                        )}
                                    >
                                        {isSubmitting && (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        )}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>{isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
