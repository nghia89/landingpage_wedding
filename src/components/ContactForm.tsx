'use client';

import { useState } from 'react';
import { useContactSubmit } from '@/hooks/useApi';
import { ContactFormData } from '@/types/api';

interface ContactFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function ContactForm({ onSuccess, className = '' }: ContactFormProps) {
    const { submitContact, loading, error } = useContactSubmit();

    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    const [validationErrors, setValidationErrors] = useState<Partial<ContactFormData>>({});

    const validateForm = (): boolean => {
        const errors: Partial<ContactFormData> = {};

        if (!formData.name.trim()) {
            errors.name = 'Vui lòng nhập họ tên';
        }

        if (!formData.email.trim()) {
            errors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email không hợp lệ';
        }

        if (!formData.subject.trim()) {
            errors.subject = 'Vui lòng nhập chủ đề';
        }

        if (!formData.message.trim()) {
            errors.message = 'Vui lòng nhập nội dung tin nhắn';
        }

        if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = 'Số điện thoại không hợp lệ';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear validation error when user starts typing
        if (validationErrors[name as keyof ContactFormData]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const result = await submitContact(formData);

        if (result) {
            // Reset form on success
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
            setValidationErrors({});
            onSuccess?.();
        }
    };

    const subjects = [
        'Tư vấn dịch vụ',
        'Báo giá chi tiết',
        'Đặt lịch hẹn',
        'Khiếu nại',
        'Góp ý',
        'Khác',
    ];

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors
                        ${validationErrors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    `}
                    placeholder="Nhập họ và tên của bạn"
                />
                {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors
                        ${validationErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    `}
                    placeholder="email@example.com"
                />
                {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
            </div>

            {/* Phone (optional) */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors
                        ${validationErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    `}
                    placeholder="0901234567 (không bắt buộc)"
                />
                {validationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
            </div>

            {/* Subject */}
            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề <span className="text-red-500">*</span>
                </label>
                <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors
                        ${validationErrors.subject ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    `}
                >
                    <option value="">Chọn chủ đề</option>
                    {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                    ))}
                </select>
                {validationErrors.subject && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.subject}</p>
                )}
            </div>

            {/* Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung tin nhắn <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors resize-none
                        ${validationErrors.message ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    `}
                    placeholder="Chia sẻ chi tiết về nhu cầu của bạn..."
                />
                {validationErrors.message && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className={`
                    w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200
                    ${loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 transform hover:scale-[1.02]'
                    }
                    text-white shadow-lg
                `}
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Đang gửi...
                    </div>
                ) : (
                    'Gửi tin nhắn'
                )}
            </button>

            {/* General Error */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}
        </form>
    );
}
