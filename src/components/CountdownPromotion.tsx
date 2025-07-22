"use client";

import { useState, useEffect } from 'react';
import { SparklesIcon, GiftIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function CountdownPromotion() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isClient, setIsClient] = useState(false);

    // Set countdown end date (7 days from now for demo)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);

    useEffect(() => {
        setIsClient(true); // Only set to true on client side

        const calculateTimeLeft = (): TimeLeft => {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;

            if (distance > 0) {
                return {
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                };
            }

            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Set initial state
        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, []);

    const handleScrollToContact = () => {
        const contactSection = document.getElementById('dat-lich-tu-van');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <section id="khuyen-mai" className="relative py-16 lg:py-24 bg-gradient-to-br from-rose-900 via-pink-800 to-purple-900 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-rose-400/20 to-pink-400/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-amber-400/10 to-orange-400/10 rounded-full mix-blend-overlay filter blur-2xl animate-pulse delay-500"></div>
            </div>

            {/* Sparkles Animation - Only render on client to avoid hydration mismatch */}
            {isClient && (
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 2}s`
                            }}
                        >
                            <SparklesIcon className="w-4 h-4 text-amber-300 opacity-60" />
                        </div>
                    ))}
                </div>
            )}

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-400 text-black px-6 py-2 rounded-full font-bold text-sm mb-6 animate-bounce">
                        <GiftIcon className="w-5 h-5" />
                        <span>ƯU ĐÃI ĐỶC BIỆT</span>
                        <GiftIcon className="w-5 h-5" />
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                        <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                            Khuyến Mãi Cuối Năm
                        </span>
                        <br />
                        <span className="text-white">Giảm đến 30%</span>
                    </h2>

                    <p className="text-lg md:text-xl text-rose-100 max-w-2xl mx-auto leading-relaxed mb-8">
                        Đặt ngay hôm nay để nhận ưu đãi khủng cho ngày cưới hoàn hảo của bạn!
                    </p>

                    <div className="flex items-center justify-center space-x-2 text-rose-200 mb-8">
                        <ClockIcon className="w-5 h-5 animate-spin" />
                        <span className="font-medium">Thời gian có hạn - Đừng bỏ lỡ!</span>
                    </div>
                </div>

                {/* Countdown Timer */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {[
                            { value: timeLeft.days, label: 'Ngày' },
                            { value: timeLeft.hours, label: 'Giờ' },
                            { value: timeLeft.minutes, label: 'Phút' },
                            { value: timeLeft.seconds, label: 'Giây' }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 text-center border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-500 group"
                            >
                                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 font-mono group-hover:scale-110 transition-transform duration-300">
                                    {item.value.toString().padStart(2, '0')}
                                </div>
                                <div className="text-sm md:text-base font-medium text-rose-200 uppercase tracking-widest">
                                    {item.label}
                                </div>

                                {/* Animated border */}
                                <div className="w-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mt-3 group-hover:w-full transition-all duration-500 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Promotion Details */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/20 shadow-2xl">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
                                🎊 Ưu Đãi Bao Gồm 🎊
                            </h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                    <span className="text-white">Giảm 30% gói dịch vụ cao cấp</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-100"></div>
                                    <span className="text-white">Tặng kèm chụp ảnh cưới</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-200"></div>
                                    <span className="text-white">Miễn phí trang trí xe hoa</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-300"></div>
                                    <span className="text-white">Ưu tiên đặt lịch cuối tuần</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-400"></div>
                                    <span className="text-white">Tặng thêm 2 bàn tiệc</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-500"></div>
                                    <span className="text-white">Hỗ trợ 24/7 trong ngày cưới</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="text-center">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={handleScrollToContact}
                            className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-black font-bold text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 animate-pulse"
                        >
                            🎯 Đăng Ký Ngay - Tiết Kiệm 30%
                        </button>

                        <div className="flex items-center space-x-2 text-rose-200">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium">Còn {timeLeft.days + timeLeft.hours + timeLeft.minutes} slot trống</span>
                        </div>
                    </div>

                    <p className="text-rose-300 text-sm mt-4 max-w-lg mx-auto">
                        * Áp dụng cho các đơn hàng đặt trong thời gian khuyến mãi. Không áp dụng đồng thời với ưu đãi khác.
                    </p>
                </div>
            </div>

            {/* Bottom gradient border */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400"></div>
        </section>
    );
}
