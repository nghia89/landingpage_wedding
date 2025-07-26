'use client';

import { useMemo, useEffect, memo } from 'react';
import { useServices } from '@/hooks/useApi';
import { Service } from '@/types/api';

// Default fallback data nếu API chưa có dữ liệu
const defaultServices = [
    {
        _id: 'default-basic',
        name: 'Gói Cơ Bản',
        description: 'Hoàn hảo cho tiệc cưới nhỏ',
        price: 15000000,
        features: [
            'Trang trí cơ bản theo chủ đề',
            'Menu 5 món chính + tráng miệng',
            'MC dẫn chương trình',
            'Âm thanh ánh sáng cơ bản',
            'Hoa cưới cô dâu',
            'Quà cưới cho khách'
        ],
        category: 'basic' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: 'default-premium',
        name: 'Gói Cao Cấp',
        description: 'Lựa chọn phổ biến nhất',
        price: 25000000,
        features: [
            'Trang trí sang trọng cao cấp',
            'Menu 7 món + buffet tráng miệng',
            'MC chuyên nghiệp + DJ',
            'Hệ thống âm thanh ánh sáng hiện đại',
            'Hoa cưới + trang trí sân khấu',
            'Chụp ảnh cưới trong ngày',
            'Xe hoa trang trí',
            'Quà tặng cao cấp'
        ],
        category: 'premium' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        _id: 'default-luxury',
        name: 'Gói Luxury',
        description: 'Dành cho tiệc cưới đặc biệt',
        price: 45000000,
        features: [
            'Thiết kế theo ý tưởng riêng',
            'Menu tùy chọn không giới hạn',
            'Đội ngũ tổ chức chuyên biệt',
            'Trang trí độc đáo theo concept',
            'Dịch vụ photography/videography',
            'Wedding planner cá nhân',
            'Các dịch vụ bổ sung tùy chọn'
        ],
        category: 'luxury' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

interface ServiceCardProps {
    service: Service;
    isPopular?: boolean;
    onScrollToContact: () => void;
}

function ServiceCard({ service, isPopular = false, onScrollToContact }: ServiceCardProps) {
    // Mapping category sang style
    const getPackageStyle = (category: string) => {
        switch (category) {
            case 'basic':
                return {
                    gradient: 'from-rose-100 to-pink-100',
                    accentColor: 'rose-500',
                    borderColor: 'border-rose-200'
                };
            case 'premium':
                return {
                    gradient: 'from-rose-50 to-pink-100',
                    accentColor: 'rose-600',
                    borderColor: 'border-rose-300'
                };
            case 'luxury':
                return {
                    gradient: 'from-purple-50 to-pink-100',
                    accentColor: 'purple-500',
                    borderColor: 'border-purple-200'
                };
            default:
                return {
                    gradient: 'from-gray-50 to-gray-100',
                    accentColor: 'gray-500',
                    borderColor: 'border-gray-200'
                };
        }
    };

    const style = getPackageStyle(service.category);

    // Format price
    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1)}tr`;
        }
        return price.toLocaleString('vi-VN');
    };

    return (
        <div className={`
            relative bg-gradient-to-br ${style.gradient} rounded-2xl p-4 lg:p-6 
            shadow-lg hover:shadow-xl transition-all duration-500 
            transform hover:-translate-y-1 border ${style.borderColor}
            ${isPopular ? 'ring-2 ring-rose-400 ring-opacity-50 scale-[1.02]' : ''}
            group overflow-visible h-full flex flex-col
        `}>
            {/* Popular Badge */}
            {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl whitespace-nowrap">
                        PHỔ BIẾN NHẤT
                    </div>
                </div>
            )}

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>

            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="text-center mb-4">
                    <h3 className="text-xl lg:text-2xl font-serif font-bold text-gray-900 mb-2">
                        {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm font-medium mb-3">
                        {service.description}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                        <div className={`text-2xl lg:text-3xl font-bold mb-1 ${style.accentColor === 'rose-500' ? 'text-rose-500' :
                            style.accentColor === 'rose-600' ? 'text-rose-600' :
                                style.accentColor === 'purple-500' ? 'text-purple-500' :
                                    'text-gray-500'
                            }`}>
                            {formatPrice(service.price)}đ
                        </div>
                        <div className="text-gray-500 text-xs">
                            /gói dịch vụ
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-2.5 mb-6 flex-grow">
                    {service.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-2.5">
                            <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${style.accentColor === 'rose-500' ? 'bg-rose-500' :
                                style.accentColor === 'rose-600' ? 'bg-rose-600' :
                                    style.accentColor === 'purple-500' ? 'bg-purple-500' :
                                        'bg-gray-500'
                                }`}>
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-gray-700 text-sm leading-relaxed">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <button
                    onClick={onScrollToContact}
                    className={`
                        w-full text-white font-semibold py-3 px-4 rounded-xl shadow-md 
                        hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-opacity-50 text-sm
                        ${style.accentColor === 'rose-500' ?
                            'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 focus:ring-rose-500' :
                            style.accentColor === 'rose-600' ?
                                'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 focus:ring-rose-600' :
                                style.accentColor === 'purple-500' ?
                                    'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:ring-purple-500' :
                                    'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 focus:ring-gray-500'
                        }
                    `}
                >
                    <span className="flex items-center justify-center space-x-2">
                        <span>Tư vấn ngay</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0V9a2 2 0 00-2 2v9a2 2 0 002 2h8a2 2 0 002-2v-9a2 2 0 00-2-2V7" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    );
}

function DynamicServicePackages() {
    // Memoize params để tránh re-render
    const serviceParams = useMemo(() => ({ active: true }), []);
    const { data: services, loading, error, execute } = useServices(serviceParams);

    // Chỉ gọi API một lần khi component mount
    useEffect(() => {
        execute();
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

    // Process services data
    const getDisplayServices = () => {
        // Nếu đang loading hoặc có lỗi, dùng default data
        if (loading || error || !services || services.length === 0) {
            return defaultServices;
        }

        // Lọc và sắp xếp services theo thứ tự mong muốn
        const categoryOrder: Array<Service['category']> = ['basic', 'premium', 'luxury'];
        const filteredServices: Service[] = [];

        // Tìm service cho mỗi category theo thứ tự
        categoryOrder.forEach(category => {
            const service = services.find(s => s.category === category && s.isActive);
            if (service) {
                filteredServices.push(service);
            } else {
                // Nếu không có service cho category này, dùng default
                const defaultService = defaultServices.find(s => s.category === category);
                if (defaultService) {
                    filteredServices.push(defaultService);
                }
            }
        });

        return filteredServices;
    };

    const displayServices = getDisplayServices();

    return (
        <section id="bang-gia-dich-vu" className="min-h-screen py-12 lg:py-16 bg-gradient-to-br from-rose-50/30 via-white to-pink-50/30 relative overflow-hidden flex flex-col justify-center">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/10 via-transparent to-rose-100/10"></div>
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-200/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-200/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-8 lg:mb-12">
                    <span className="text-xs lg:text-sm font-medium tracking-widest text-rose-600 uppercase mb-2 block">
                        Chọn gói dịch vụ phù hợp
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                        Gói dịch vụ tiệc cưới
                    </h2>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-4 lg:mb-6 rounded-full"></div>
                    <p className="text-base lg:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
                        Chúng tôi cung cấp nhiều lựa chọn linh hoạt, phù hợp với mọi ngân sách và phong cách.
                    </p>

                    {/* Loading/Error indicators */}
                    {loading && (
                        <div className="mt-4 text-sm text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang tải dữ liệu gói dịch vụ...</span>
                            </div>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="mt-4 text-sm text-orange-600 bg-orange-50 rounded-lg p-3 inline-block">
                            Đang hiển thị gói dịch vụ mặc định
                        </div>
                    )}
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto pt-8">
                    {displayServices.map((service, index) => (
                        <ServiceCard
                            key={service._id}
                            service={service}
                            isPopular={service.category === 'premium'} // Premium package is popular
                            onScrollToContact={handleScrollToContact}
                        />
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center mt-12 lg:mt-16">
                    <p className="text-gray-600 mb-6 text-sm lg:text-base">
                        Cần tư vấn thêm về gói dịch vụ phù hợp với ngân sách của bạn?
                    </p>
                    <button
                        onClick={handleScrollToContact}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50"
                    >
                        Liên hệ tư vấn miễn phí
                    </button>
                </div>
            </div>
        </section>
    );
}

// Memoize component để tránh re-render không cần thiết
export default memo(DynamicServicePackages);
