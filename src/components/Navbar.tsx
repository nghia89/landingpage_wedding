"use client";

import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
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
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div
                        onClick={() => scrollToSection('hero')}
                        className="flex items-center space-x-2 cursor-pointer group"
                    >
                        <div className={`flex items-center justify-center transition-all duration-300 ${isScrolled
                            ? 'w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500'
                            : 'w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600'
                            } rounded-full shadow-lg group-hover:shadow-xl group-hover:scale-110`}>
                            <HeartIcon className={`transition-all duration-300 text-white ${isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                                }`} />
                        </div>
                        <div>
                            <h1 className={`font-serif font-bold text-gray-900 transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'
                                }`}>
                                Wedding Dreams
                            </h1>
                            <p className={`text-rose-600 font-medium transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-sm'
                                }`}>
                                Mơ ước thành hiện thực
                            </p>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`font-medium transition-colors duration-300 relative group ${item.highlight
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

                    {/* CTA Button & Mobile Menu Button */}
                    <div className="flex items-center space-x-4">
                        {/* CTA Button */}
                        <button
                            onClick={() => scrollToSection('dat-lich-tu-van')}
                            className={`bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${isScrolled
                                ? 'px-4 py-2 text-sm'
                                : 'px-6 py-3 text-base'
                                }`}
                        >
                            Đặt lịch tư vấn
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-300"
                        >
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen
                    ? 'max-h-80 opacity-100 mt-4'
                    : 'max-h-0 opacity-0'
                    }`}>
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100/50 p-6">
                        <div className="space-y-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`block w-full text-left font-medium py-2 transition-colors duration-300 border-b border-gray-100 last:border-b-0 ${item.highlight
                                        ? 'text-amber-600 hover:text-amber-700 animate-pulse'
                                        : 'text-gray-700 hover:text-rose-600'
                                        }`}
                                >
                                    {item.highlight && '🎁 '}{item.name}
                                </button>
                            ))}
                            <button
                                onClick={() => scrollToSection('dat-lich-tu-van')}
                                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-4"
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
