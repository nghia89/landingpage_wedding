"use client";

import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';
import { PublicSettings } from '@/types/settings';

interface NavbarProps {
    settings?: PublicSettings | null;
}

export default function Navbar({ settings }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        setIsMobileMenuOpen(false); // Close mobile menu after navigation
    };

    const navItems = [
        { name: 'Trang chủ', id: 'hero' },
        { name: 'Khuyến mãi', id: 'khuyen-mai', highlight: true },
        { name: 'Quy trình', id: 'quy-trinh' },
        { name: 'Về chúng tôi', id: 'tai-sao-chon' },
        { name: 'Gói dịch vụ', id: 'bang-gia-dich-vu' },
        { name: 'Thư viện', id: 'gallery' },
        { name: 'Đánh giá', id: 'testimonials' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'py-2 bg-white/95 backdrop-blur-md shadow-lg border-b border-rose-100/50'
            : 'py-4 bg-white/90 backdrop-blur-sm'
            }`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div
                        onClick={() => scrollToSection('hero')}
                        className="flex items-center space-x-2 cursor-pointer group flex-shrink-0"
                    >
                        <div className={`flex items-center justify-center transition-all duration-300 ${isScrolled
                            ? 'w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-rose-400 to-pink-500'
                            : 'w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-500 to-pink-600'
                            } rounded-full shadow-lg group-hover:shadow-xl group-hover:scale-110`}>
                            {settings?.logoUrl ? (
                                <img
                                    src={settings.logoUrl}
                                    alt={settings.brandName}
                                    className={`transition-all duration-300 rounded-full object-cover ${isScrolled ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-12 sm:h-12'}`}
                                />
                            ) : (
                                <HeartIcon className={`transition-all duration-300 text-white ${isScrolled ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-5 h-5 sm:w-6 sm:h-6'
                                    }`} />
                            )}
                        </div>
                        <div>
                            <h1 className={`font-serif font-bold text-gray-900 transition-all duration-300 ${isScrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
                                }`}>
                                {settings?.brandName || 'Wedding Dreams'}
                            </h1>
                            <p className={`text-rose-600 font-medium transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-xs sm:text-sm'
                                }`}>
                                {settings?.slogan || 'Mơ ước thành hiện thực'}
                            </p>
                        </div>
                    </div>

                    {/* Desktop Menu - Show on larger screens */}
                    <div className="hidden xl:flex items-center space-x-6 2xl:space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`font-medium transition-colors duration-300 relative group text-sm 2xl:text-base ${item.highlight
                                    ? 'text-amber-600 hover:text-amber-700 animate-pulse'
                                    : 'text-gray-700 hover:text-rose-600'
                                    }`}
                            >
                                {item.highlight && '🎁 '}{item.name}
                                <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${item.highlight ? 'bg-amber-600' : 'bg-rose-600'
                                    }`}></span>
                            </button>
                        ))}
                    </div>

                    {/* Medium Desktop Menu - Show abbreviated menu */}
                    <div className="hidden lg:flex xl:hidden items-center space-x-4">
                        {navItems.slice(0, 5).map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`font-medium transition-colors duration-300 relative group text-sm ${item.highlight
                                    ? 'text-amber-600 hover:text-amber-700 animate-pulse'
                                    : 'text-gray-700 hover:text-rose-600'
                                    }`}
                            >
                                {item.highlight && '🎁 '}{item.name}
                                <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${item.highlight ? 'bg-amber-600' : 'bg-rose-600'
                                    }`}></span>
                            </button>
                        ))}
                        {/* More menu for remaining items */}
                        <div className="relative group">
                            <button className="font-medium text-gray-700 hover:text-rose-600 transition-colors duration-300 text-sm">
                                Thêm ▼
                            </button>
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-rose-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                                <div className="py-2">
                                    {navItems.slice(5).map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-300"
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button & Mobile Menu Button */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* CTA Button - Responsive sizing */}
                        <button
                            onClick={() => scrollToSection('dat-lich-tu-van')}
                            className={`bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${isScrolled
                                ? 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm'
                                : 'px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base'
                                }`}
                        >
                            <span className="hidden sm:inline">Đặt lịch tư vấn</span>
                            <span className="sm:hidden">Tư vấn</span>
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-300"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                                <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen
                    ? 'max-h-screen opacity-100 mt-4'
                    : 'max-h-0 opacity-0'
                    }`}>
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100/50 p-4 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`block w-full text-left font-medium py-2.5 sm:py-3 px-2 transition-colors duration-300 border-b border-gray-100 last:border-b-0 rounded-lg hover:bg-rose-50 text-sm sm:text-base ${item.highlight
                                        ? 'text-amber-600 hover:text-amber-700 animate-pulse'
                                        : 'text-gray-700 hover:text-rose-600'
                                        }`}
                                >
                                    {item.highlight && '🎁 '}{item.name}
                                </button>
                            ))}
                            <button
                                onClick={() => scrollToSection('dat-lich-tu-van')}
                                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-4 sm:mt-6 text-sm sm:text-base"
                            >
                                Đặt lịch tư vấn ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
