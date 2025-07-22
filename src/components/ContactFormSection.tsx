"use client";

import { useState } from 'react';

interface FormData {
    fullName: string;
    phone: string;
    weddingDate: string;
    requirements: string;
}

export default function ContactFormSection() {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        phone: '',
        weddingDate: '',
        requirements: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');
        setSubmitStatus(null);

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                setSubmitMessage(result.message);
                // Reset form
                setFormData({
                    fullName: '',
                    phone: '',
                    weddingDate: '',
                    requirements: ''
                });
            } else {
                setSubmitStatus('error');
                setSubmitMessage(result.error || 'Có lỗi xảy ra khi gửi yêu cầu');
            }
        } catch {
            setSubmitStatus('error');
            setSubmitMessage('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <section id="dat-lich-tu-van" className="py-6 md:py-10 bg-gradient-to-br from-rose-50 via-pink-25 to-amber-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

            <div className="container mx-auto px-2 sm:px-4 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-6 lg:mb-8">
                    <span className="text-sm font-medium tracking-widest text-rose-600 uppercase mb-2 block">
                        Liên hệ với chúng tôi
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-3 leading-tight">
                        Đặt lịch tư vấn miễn phí
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-4 rounded-full"></div>
                    <p className="text-sm md:text-base text-gray-700 max-w-xl mx-auto leading-relaxed font-light">
                        Chúng tôi sẽ liên hệ bạn trong vòng 24h để tư vấn chi tiết.
                    </p>
                </div>

                {/* Contact Form */}
                <div className="max-w-lg mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 md:p-6 border border-pink-100/50 relative overflow-hidden">
                        {/* Background gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 to-pink-50/30 opacity-60"></div>

                        <div className="relative z-10 space-y-5">
                            {/* Form Title */}
                            <div className="text-center mb-6">
                                <h3 className="text-xl lg:text-2xl font-serif font-semibold text-gray-900 mb-2">
                                    Thông tin liên hệ
                                </h3>
                                <p className="text-gray-600 font-light text-sm">
                                    Vui lòng điền thông tin để nhận tư vấn chi tiết
                                </p>
                            </div>

                            {/* Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                                {/* Full Name */}
                                <div className="md:col-span-1">
                                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 mb-2 tracking-wide">
                                        Họ và tên <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Nhập họ và tên"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-gray-800 placeholder-gray-500 bg-white/90 backdrop-blur-sm hover:shadow-md font-medium text-sm"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="md:col-span-1">
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2 tracking-wide">
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
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-gray-800 placeholder-gray-500 bg-white/90 backdrop-blur-sm hover:shadow-md font-medium text-sm"
                                    />
                                </div>
                            </div>

                            {/* Wedding Date */}
                            <div>
                                <label htmlFor="weddingDate" className="block text-sm font-semibold text-gray-800 mb-2 tracking-wide">
                                    Ngày dự kiến cưới
                                </label>
                                <input
                                    type="date"
                                    id="weddingDate"
                                    name="weddingDate"
                                    value={formData.weddingDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-gray-800 bg-white/90 backdrop-blur-sm hover:shadow-md font-medium text-sm"
                                />
                            </div>

                            {/* Special Requirements */}
                            <div>
                                <label htmlFor="requirements" className="block text-sm font-semibold text-gray-800 mb-2 tracking-wide">
                                    Yêu cầu riêng
                                </label>
                                <textarea
                                    id="requirements"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Chia sẻ về ý tưởng, số lượng khách, ngân sách hoặc yêu cầu đặc biệt..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300 text-gray-800 placeholder-gray-500 bg-white/90 backdrop-blur-sm hover:shadow-md resize-vertical font-medium text-sm"
                                ></textarea>
                            </div>

                            {/* Submit Message */}
                            {submitMessage && (
                                <div className={`p-3 rounded-xl text-sm ${submitStatus === 'success'
                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                    : 'bg-red-50 border border-red-200 text-red-800'
                                    }`}>
                                    <p className="text-center font-medium">{submitMessage}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`group w-full ${isSubmitting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
                                        } text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-pink-500/25 transform hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 text-base tracking-wide relative overflow-hidden`}
                                >
                                    <span className="relative z-10 flex items-center justify-center space-x-2">
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Đang gửi...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Gửi yêu cầu tư vấn</span>
                                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>

                            {/* Contact Methods */}
                            <div className="pt-3 border-t border-pink-200/50">
                                <p className="text-center text-gray-600 mb-3 font-medium text-xs">
                                    Hoặc liên hệ trực tiếp:
                                </p>
                                <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                    <a href="tel:0123456789" className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 transition-colors duration-300 group">
                                        <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center group-hover:bg-rose-200 transition-colors duration-300">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                            </svg>
                                        </div>
                                        <span className="font-semibold text-xs">0123 456 789</span>
                                    </a>
                                    <a href="mailto:info@weddingdreams.vn" className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 transition-colors duration-300 group">
                                        <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center group-hover:bg-rose-200 transition-colors duration-300">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                        <span className="font-semibold text-xs">info@weddingdreams.vn</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Additional Info */}
                    <div className="text-center mt-4 text-gray-600">
                        <p className="text-[11px] font-light">
                            Bằng cách gửi form, bạn đồng ý với{" "}
                            <a href="#" className="text-rose-600 hover:text-rose-700 underline underline-offset-2 hover:no-underline transition-all duration-300 font-medium">
                                chính sách bảo mật
                            </a>{" "}
                            của chúng tôi.
                        </p>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 pt-6 border-t border-pink-200/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-center">
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center shadow-md">
                                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 text-xs">Phản hồi nhanh</h4>
                                <p className="text-gray-600 text-[11px] font-light">Trong vòng 24 giờ</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center shadow-md">
                                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 text-xs">Tư vấn miễn phí</h4>
                                <p className="text-gray-600 text-[11px] font-light">Không mất phí ban đầu</p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center shadow-md">
                                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 text-xs">Chuyên nghiệp</h4>
                                <p className="text-gray-600 text-[11px] font-light">Đội ngũ giàu kinh nghiệm</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
