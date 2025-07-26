"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { PublicSettings } from "@/types/settings";

interface HeroSectionProps {
    settings?: PublicSettings | null;
}

export default function HeroSection({ settings }: HeroSectionProps) {
    const backgroundRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (backgroundRef.current && contentRef.current) {
                        const scrolled = window.pageYOffset;
                        const parallaxSpeed = 0.5;
                        const contentSpeed = 0.2;

                        // Sử dụng transform3d để kích hoạt hardware acceleration
                        backgroundRef.current.style.transform = `translate3d(0, ${scrolled * parallaxSpeed}px, 0)`;
                        contentRef.current.style.transform = `translate3d(0, ${scrolled * contentSpeed}px, 0)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Throttle scroll events
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
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

    const handleScrollToServicePackages = () => {
        const serviceSection = document.getElementById('bang-gia-dich-vu');
        if (serviceSection) {
            serviceSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <section id="hero" className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden pt-20">
            {/* Navbar will have fixed positioning, so add top padding to prevent overlap */}
            {/* Background Image with elegant gradient overlay and parallax */}
            <div ref={backgroundRef} className="absolute inset-0 z-0 will-change-transform">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 opacity-90"></div>
                <Image
                    src="/background-wedding.jpeg"
                    alt="Wedding background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Sophisticated overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
            </div>

            {/* Floating decoration elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-32 right-16 w-16 h-16 bg-amber-200 rounded-full opacity-30 animate-pulse delay-1000"></div>

            {/* Content Container with parallax */}
            <div ref={contentRef} className="relative z-10 container mx-auto px-6 text-center text-white will-change-transform">
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                    {/* Main Title */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold leading-[1.1] tracking-tight">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-100">
                            Biến giấc mơ cưới
                        </span>
                        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-100 to-amber-100">
                            thành hiện thực
                        </span>
                    </h1>

                    {/* Elegant divider */}
                    <div className="flex items-center justify-center my-8">
                        <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent w-32"></div>
                        <div className="mx-4 w-3 h-3 bg-pink-300 rounded-full shadow-lg"></div>
                        <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent w-32"></div>
                    </div>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-light max-w-4xl mx-auto leading-relaxed tracking-wide text-gray-100">
                        {settings?.slogan || 'Tổ chức tiệc cưới trọn gói – Tư vấn cá nhân hóa – Không gian sang trọng'}
                    </p>

                    {/* Call to Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 pt-4">
                        {/* Primary CTA Button */}
                        <button
                            onClick={handleScrollToContact}
                            className="group relative bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white font-semibold px-10 py-5 rounded-full shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 w-full sm:w-auto overflow-hidden"
                        >
                            <span className="relative z-10 text-lg tracking-wide">Đặt lịch tư vấn miễn phí</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </button>

                        {/* Secondary CTA Button */}
                        <button
                            onClick={handleScrollToServicePackages}
                            className="group relative border-2 border-white/80 backdrop-blur-sm bg-white/10 hover:bg-white hover:text-gray-800 text-white font-semibold px-10 py-5 rounded-full transition-all duration-500 w-full sm:w-auto hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <span className="text-lg tracking-wide">Xem bảng giá dịch vụ</span>
                        </button>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-16 pt-8 border-t border-white/20">
                        <p className="text-sm text-gray-300 mb-4 font-light tracking-wider">
                            Đã phục vụ hơn 500+ cặp đôi hạnh phúc
                        </p>
                        <div className="flex justify-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
                    <div className="w-1 h-3 bg-white/70 rounded-full mx-auto animate-pulse"></div>
                </div>
            </div>
        </section>
    );
}
