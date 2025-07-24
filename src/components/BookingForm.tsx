'use client';

import { useState } from 'react';
import { useBookingSubmit } from '@/hooks/useApi';
import { BookingFormData } from '@/types/api';

interface BookingFormProps {
    onSuccess?: () => void;
    className?: string;
}

export default function BookingForm({ onSuccess, className = '' }: BookingFormProps) {
    const { submitBooking, loading, error } = useBookingSubmit();

    const [formData, setFormData] = useState<BookingFormData>({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        service: '',
        message: '',
    });

    const [validationErrors, setValidationErrors] = useState<Partial<BookingFormData>>({});

    const validateForm = (): boolean => {
        const errors: Partial<BookingFormData> = {};

        if (!formData.name.trim()) {
            errors.name = 'Vui lòng nhập họ tên';
        }

        if (!formData.email.trim()) {
            errors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email không hợp lệ';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.date) {
            errors.date = 'Vui lòng chọn ngày';
        }

        if (!formData.time) {
            errors.time = 'Vui lòng chọn giờ';
        }

        if (!formData.service) {
            errors.service = 'Vui lòng chọn dịch vụ';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear validation error when user starts typing
        if (validationErrors[name as keyof BookingFormData]) {
            setValidationErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const result = await submitBooking(formData);

        if (result) {
            // Reset form on success
            setFormData({
                name: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                service: '',
                message: '',
            });
            setValidationErrors({});
            onSuccess?.();
        }
    };

    const services = [
        'Tư vấn chụp ảnh cưới',
        'Chụp ảnh cưới studio',
        'Chụp ảnh cưới ngoại cảnh',
        'Quay video cưới',
        'Trang trí tiệc cưới',
        'MC tiệc cưới',
        'Dịch vụ combo',
    ];

    const timeSlots = [
        '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
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

            {/* Phone */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
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
                    placeholder="0901234567"
                />
                {validationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày hẹn <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className={`
                            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors
                            ${validationErrors.date ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                        `}
                    />
                    {validationErrors.date && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.date}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                        Giờ hẹn <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className={`
                            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors
                            ${validationErrors.time ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                        `}
                    >
                        <option value="">Chọn giờ</option>
                        {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                    {validationErrors.time && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.time}</p>
                    )}
                </div>
            </div>

            {/* Service */}
            <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Dịch vụ quan tâm <span className="text-red-500">*</span>
                </label>
                <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className={`
                        w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors
                        ${validationErrors.service ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                    `}
                >
                    <option value="">Chọn dịch vụ</option>
                    {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                    ))}
                </select>
                {validationErrors.service && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.service}</p>
                )}
            </div>

            {/* Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú thêm
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors resize-none"
                    placeholder="Chia sẻ thêm về yêu cầu của bạn..."
                />
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
                    'Đặt lịch tư vấn'
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
