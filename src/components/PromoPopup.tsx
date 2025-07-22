"use client";

import { useState, useEffect } from 'react';
import { XMarkIcon, GiftIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function PromoPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Only set to true on client side

        // Check if popup was already shown in this session
        const popupShown = sessionStorage.getItem('promoPopupShown');

        if (!popupShown) {
            // Show popup after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(true);
                sessionStorage.setItem('promoPopupShown', 'true');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            setIsClosing(false);
        }, 300);
    };

    const handleScrollToContact = () => {
        const contactSection = document.getElementById('dat-lich-tu-van');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        handleClose();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'
                    }`}
                onClick={handleClose}
            />

            {/* Popup Content */}
            <div className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto overflow-hidden transform transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                }`}>
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                    <XMarkIcon className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
                </button>

                {/* Header with gradient */}
                <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 p-8 text-center relative overflow-hidden">
                    {/* Animated background elements - Only render on client */}
                    {isClient && (
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute animate-pulse"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                        animationDuration: `${2 + Math.random()}s`
                                    }}
                                >
                                    <SparklesIcon className="w-3 h-3 text-white/30" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Gift icon with animation */}
                    <div className="relative z-10 mb-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                            <GiftIcon className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-white mb-2 relative z-10">
                        🎊 Ưu Đãi Đặc Biệt 🎊
                    </h2>
                    <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-amber-400 to-orange-400 text-black px-4 py-1 rounded-full text-sm font-bold relative z-10">
                        <span>GIẢM TỚI 30%</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                            Chào mừng đến với Wedding Dreams!
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Nhận ngay ưu đãi <strong className="text-rose-600">giảm 30%</strong> cho gói dịch vụ cao cấp khi đăng ký tư vấn hôm nay.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 mb-6">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-gray-700">Tư vấn miễn phí 1-1</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-100"></div>
                                <span className="text-sm text-gray-700">Tặng chụp ảnh cưới</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                                <span className="text-sm text-gray-700">Hỗ trợ 24/7</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleScrollToContact}
                            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 text-center"
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <HeartIcon className="w-5 h-5" />
                                <span>Nhận ưu đãi ngay</span>
                            </div>
                        </button>

                        <button
                            onClick={handleClose}
                            className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors duration-200 text-sm"
                        >
                            Để sau, cảm ơn
                        </button>
                    </div>

                    {/* Fine print */}
                    <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                        * Ưu đãi có thời hạn. Áp dụng cho khách hàng mới. Không áp dụng đồng thời với khuyến mãi khác.
                    </p>
                </div>

                {/* Decorative bottom border */}
                <div className="h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400"></div>
            </div>
        </div>
    );
}
