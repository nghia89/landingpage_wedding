"use client";

export default function ServicePackages() {
    const handleScrollToContact = () => {
        const contactSection = document.getElementById('dat-lich-tu-van');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const packages = [
        {
            title: "Gói Tiêu Chuẩn",
            subtitle: "Hoàn hảo cho tiệc cưới nhỏ",
            price: "từ 1.800.000đ",
            priceUnit: "/bàn",
            features: [
                "Trang trí cơ bản theo chủ đề",
                "Menu 5 món chính + tráng miệng",
                "MC dẫn chương trình",
                "Âm thanh ánh sáng cơ bản",
                "Hoa cưới cô dâu",
                "Quà cưới cho khách"
            ],
            buttonText: "Tư vấn ngay",
            isPopular: false,
            gradient: "from-rose-100 to-pink-100",
            accentColor: "rose-500"
        },
        {
            title: "Gói Cao Cấp",
            subtitle: "Lựa chọn phổ biến nhất",
            price: "từ 2.800.000đ",
            priceUnit: "/bàn",
            features: [
                "Trang trí sang trọng cao cấp",
                "Menu 7 món + buffet tráng miệng",
                "MC chuyên nghiệp + DJ",
                "Hệ thống âm thanh ánh sáng hiện đại",
                "Hoa cưới + trang trí sân khấu",
                "Chụp ảnh cưới trong ngày",
                "Xe hoa trang trí",
                "Quà tặng cao cấp"
            ],
            buttonText: "Tư vấn ngay",
            isPopular: true,
            gradient: "from-rose-50 to-pink-100",
            accentColor: "rose-600"
        },
        {
            title: "Gói Tùy Chỉnh",
            subtitle: "Dành cho tiệc cưới đặc biệt",
            price: "Linh hoạt",
            priceUnit: "theo yêu cầu",
            features: [
                "Thiết kế theo ý tưởng riêng",
                "Menu tùy chọn không giới hạn",
                "Đội ngũ tổ chức chuyên biệt",
                "Trang trí độc đáo theo concept",
                "Dịch vụ photography/videography",
                "Wedding planner cá nhân",
                "Các dịch vụ bổ sung tùy chọn"
            ],
            buttonText: "Tư vấn ngay",
            isPopular: false,
            gradient: "from-purple-50 to-pink-100",
            accentColor: "purple-500"
        }
    ];

    return (
        <section id="bang-gia-dich-vu" className="min-h-screen py-8 lg:py-12 bg-gradient-to-br from-rose-50/50 via-white to-pink-50/50 relative overflow-hidden flex flex-col justify-center">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-pink-100/20"></div>
            </div>

            <div className="container mx-auto px-4 lg:px-6 relative z-10 max-w-7xl">
                {/* Section Header - Compact */}
                <div className="text-center mb-8 lg:mb-12">
                    <span className="text-xs lg:text-sm font-medium tracking-widest text-rose-600 uppercase mb-1 block">
                        Chọn gói dịch vụ phù hợp
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                        Gói dịch vụ tiệc cưới
                    </h2>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-4 lg:mb-6 rounded-full"></div>
                    <p className="text-base lg:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
                        Chúng tôi cung cấp nhiều lựa chọn linh hoạt, phù hợp với mọi ngân sách và phong cách.
                    </p>
                </div>

                {/* Packages Grid - Optimized for viewport */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 max-w-6xl mx-auto pt-4">
                    {packages.map((pkg, index) => (
                        <div
                            key={index}
                            className={`group relative bg-white/95 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-visible border border-white/60 ${pkg.isPopular
                                ? 'transform lg:scale-105 ring-2 ring-rose-400/50 shadow-xl mt-3'
                                : 'hover:scale-[1.02] hover:-translate-y-1 mt-3'
                                }`}
                        >
                            {/* Popular Badge */}
                            {pkg.isPopular && (
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-20">
                                    <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-1.5 rounded-full shadow-md text-xs font-semibold tracking-wide whitespace-nowrap">
                                        ⭐ Phổ biến nhất
                                    </div>
                                </div>
                            )}

                            {/* Background gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient} opacity-40`}></div>

                            <div className="relative z-10 p-4 lg:p-6">
                                {/* Package Header - Compact */}
                                <div className="text-center mb-4 lg:mb-6">
                                    <h3 className="text-xl lg:text-2xl font-serif font-bold text-gray-900 mb-1">
                                        {pkg.title}
                                    </h3>
                                    <p className="text-gray-600 font-medium text-sm mb-3">
                                        {pkg.subtitle}
                                    </p>
                                    <div className="space-y-0.5">
                                        <div className={`text-2xl lg:text-3xl font-bold text-${pkg.accentColor}`}>
                                            {pkg.price}
                                        </div>
                                        <div className="text-gray-600 text-sm font-medium">
                                            {pkg.priceUnit}
                                        </div>
                                    </div>
                                </div>

                                {/* Features List - Compact */}
                                <ul className="space-y-2 lg:space-y-3 mb-6 lg:mb-8">
                                    {pkg.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start group/item">
                                            {pkg.isPopular ? (
                                                // Special icon for popular package
                                                <div className={`w-5 h-5 rounded-full bg-gradient-to-r from-${pkg.accentColor} to-pink-600 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 shadow-lg ring-2 ring-rose-200/50`}>
                                                    <svg
                                                        className="w-3 h-3 text-white"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                // Regular icon for other packages
                                                <div className={`w-4 h-4 rounded-full bg-${pkg.accentColor} flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 shadow-sm`}>
                                                    <svg
                                                        className="w-2.5 h-2.5 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={3}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                            <span className="text-gray-700 leading-relaxed text-sm lg:text-base font-medium group-hover/item:text-gray-900 transition-colors duration-200">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button - Compact */}
                                <button
                                    onClick={pkg.buttonText === "Tư vấn ngay" ? handleScrollToContact : undefined}
                                    className={`w-full py-2 px-4 rounded-lg font-semibold text-sm tracking-wide transition-all duration-300 text-white ${pkg.isPopular
                                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700'
                                        : pkg.accentColor === 'rose-500'
                                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
                                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                                        }`}
                                >
                                    {pkg.buttonText}
                                </button>
                            </div>

                            {/* Bottom accent line */}
                            {/* <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-${pkg.accentColor} to-pink-500 rounded-b-2xl lg:rounded-b-3xl`}></div> */}
                        </div>
                    ))}
                </div>

                {/* Simplified bottom info */}
                <div className="text-center mt-8 lg:mt-12">
                    <p className="text-gray-600 text-sm mb-4">
                        Tư vấn miễn phí và hỗ trợ 24/7
                    </p>
                    <button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-6 py-2 rounded-full text-sm transition-all duration-300">
                        Liên hệ tư vấn
                    </button>
                </div>
            </div>
        </section>
    );
}
