"use client";

import { useState } from 'react';
import { useBookingSubmit } from '@/hooks/useApi';
import { BookingFormData } from '@/types/api';
import { PublicSettings } from '@/types/settings';

interface FormData {
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    service: string;
    message: string;
}

interface ContactFormSectionProps {
    settings?: PublicSettings | null;
}

export default function ContactFormSection({ settings }: ContactFormSectionProps) {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        service: 'consultation',
        message: ''
    });

    const { submitBooking, loading, error } = useBookingSubmit();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Convert form data to API format
            const bookingData: BookingFormData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                date: formData.date,
                time: formData.time,
                service: formData.service,
                message: formData.message
            };

            await submitBooking(bookingData);

            // Reset form on success
            setFormData({
                name: '',
                phone: '',
                email: '',
                date: '',
                time: '',
                service: 'consultation',
                message: ''
            });
        } catch (err) {
            // Error is handled by the hook and toast
            console.error('Booking submission failed:', err);
        }
    };
    return (
        <section id="dat-lich-tu-van" className="py-20 lg:py-32 bg-gradient-to-br from-rose-50 via-pink-25 to-amber-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-sm font-medium tracking-widest text-rose-600 uppercase mb-2 block">
                        Liên hệ với chúng tôi
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                        Đặt lịch tư vấn miễn phí
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-8 rounded-full"></div>
                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
                        Chúng tôi sẽ liên hệ bạn trong vòng 24h để tư vấn chi tiết về dịch vụ phù hợp nhất.
                    </p>
                </div>

                {/* Contact Form */}
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 border border-pink-100/50 relative overflow-hidden">
                        {/* Background gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50 opacity-60"></div>

                        <div className="relative z-10 space-y-8">
                            {/* Form Title */}
                            <div className="text-center mb-10">
                                <h3 className="text-2xl lg:text-3xl font-serif font-semibold text-gray-900 mb-3">
                                    Thông tin liên hệ
                                </h3>
                                <p className="text-gray-600 font-light">
                                    Vui lòng điền thông tin để nhận tư vấn chi tiết
                                </p>
                            </div>

                            {/* Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Full Name */}
                                <div className="md:col-span-1">
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide">
                                        Họ và tên <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nhập họ và tên của bạn"
                                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-gray-800 placeholder-gray-500 bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="md:col-span-1">
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide">
                                        Số điện thoại <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="0xxx xxx xxx"
                                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-gray-800 placeholder-gray-500 bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    // required
                                    placeholder="your.email@example.com"
                                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-gray-800 placeholder-gray-500 bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium"
                                />
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Wedding Date */}
                                <div>
                                    <label htmlFor="date" className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide">
                                        Ngày tư vấn <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        min={new Date().toISOString().split('T')[0]} // Không cho chọn ngày quá khứ
                                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-gray-800 bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium"
                                    />
                                </div>

                                {/* Time */}
                                <div>
                                    <label htmlFor="time" className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide">
                                        Giờ tư vấn <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        id="time"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-gray-800 bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium"
                                    />
                                </div>
                            </div>

                            {/* Service Type */}
                            {/* <div>
                                <label htmlFor="service" className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide">
                                    Loại dịch vụ quan tâm
                                </label>
                                <select
                                    id="service"
                                    name="service"
                                    value={formData.service}
                                    onChange={handleInputChange}
                                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-gray-800 bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium"
                                >
                                    <option value="consultation">Tư vấn chung</option>
                                    <option value="venue">Địa điểm tổ chức</option>
                                    <option value="decoration">Trang trí tiệc cưới</option>
                                    <option value="photography">Chụp ảnh cưới</option>
                                    <option value="makeup">Trang điểm cô dâu</option>
                                    <option value="catering">Tiệc cưới</option>
                                    <option value="full-package">Gói trọn gói</option>
                                </select>
                            </div> */}

                            {/* Special Requirements */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide">
                                    Ghi chú thêm
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows={5}
                                    placeholder="Chia sẻ với chúng tôi về ý tưởng, phong cách, số lượng khách mời, ngân sách hoặc yêu cầu đặc biệt khác..."
                                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-gray-800 placeholder-gray-500 bg-white/80 backdrop-blur-sm hover:shadow-lg resize-vertical font-medium"
                                ></textarea>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800">
                                    <p className="text-center font-medium">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`group w-full ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
                                        } text-white font-semibold py-5 px-8 rounded-2xl shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 text-lg tracking-wide relative overflow-hidden`}
                                >
                                    <span className="relative z-10 flex items-center justify-center space-x-3">
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Đang gửi...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Đặt lịch tư vấn</span>
                                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0V9a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2v-9a2 2 0 00-2-2V7" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                    {!loading && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    )}
                                </button>
                            </div>

                            {/* Contact Methods */}
                            <div className="pt-8 border-t border-pink-200/50">
                                <p className="text-center text-gray-600 mb-6 font-medium">
                                    Hoặc liên hệ trực tiếp qua:
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
                                    <a href={`tel:${settings?.phone || '0123456789'}`} className="flex items-center space-x-3 text-rose-600 hover:text-rose-700 transition-colors duration-300 group">
                                        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center group-hover:bg-rose-200 transition-colors duration-300">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                        </div>
                                        <span className="font-semibold">{settings?.phone || '0123 456 789'}</span>
                                    </a>
                                    <a href={`mailto:${settings?.email || 'info@weddingdreams.vn'}`} className="flex items-center space-x-3 text-rose-600 hover:text-rose-700 transition-colors duration-300 group">
                                        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center group-hover:bg-rose-200 transition-colors duration-300">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                        <span className="font-semibold">{settings?.email || 'info@weddingdreams.vn'}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Additional Info */}
                    <div className="text-center mt-10 text-gray-600">
                        <p className="text-sm font-light">
                            Bằng cách gửi form này, bạn đồng ý với{" "}
                            <a href="#" className="text-rose-600 hover:text-rose-700 underline underline-offset-2 hover:no-underline transition-all duration-300 font-medium">
                                chính sách bảo mật
                            </a>{" "}
                            của chúng tôi.
                        </p>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-20 pt-16 border-t border-pink-200/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Phản hồi nhanh</h4>
                                <p className="text-gray-600 text-sm font-light">Trong vòng 24 giờ</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Tư vấn miễn phí</h4>
                                <p className="text-gray-600 text-sm font-light">Không mất phí ban đầu</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Chuyên nghiệp</h4>
                                <p className="text-gray-600 text-sm font-light">Đội ngũ giàu kinh nghiệm</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
