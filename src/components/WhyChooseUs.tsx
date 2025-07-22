"use client";

import { HeartIcon, SparklesIcon, UserGroupIcon, CakeIcon, GiftIcon, StarIcon } from '@heroicons/react/24/outline';

export default function WhyChooseUs() {
    const handleScrollToPackages = () => {
        const packagesSection = document.getElementById('bang-gia-dich-vu');
        if (packagesSection) {
            packagesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
    const benefits = [
        {
            icon: SparklesIcon,
            title: "Không gian sang trọng",
            description: "Sảnh tiệc được thiết kế trang nhã, sang trọng với đầy đủ tiện nghi hiện đại phục vụ ngày trọng đại của bạn."
        },
        {
            icon: CakeIcon,
            title: "Menu phong phú",
            description: "Thực đơn đa dạng với các món ăn hấp dẫn được chế biến bởi đội ngũ đầu bếp chuyên nghiệp."
        },
        {
            icon: HeartIcon,
            title: "Tư vấn cá nhân hóa",
            description: "Đội ngũ tư vấn nhiệt tình, tận tâm sẽ hỗ trợ bạn từ khâu lên kế hoạch đến thực hiện."
        },
        {
            icon: UserGroupIcon,
            title: "Trang trí theo phong cách riêng",
            description: "Thiết kế và trang trí theo ý tưởng riêng của bạn để tạo nên một không gian cưới độc đáo."
        },
        {
            icon: StarIcon,
            title: "Đội ngũ chuyên nghiệp",
            description: "Nhân viên được đào tạo bài bản, phục vụ chu đáo để đảm bảo mọi thứ diễn ra hoàn hảo."
        },
        {
            icon: GiftIcon,
            title: "Ưu đãi hấp dẫn theo mùa",
            description: "Chương trình khuyến mãi đặc biệt và các gói dịch vụ ưu đãi cho từng mùa trong nău."
        }
    ];

    return (
        <section className="py-20 lg:py-32 bg-gradient-to-br from-rose-50 via-pink-25 to-amber-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <div className="inline-block">
                        <span className="text-sm font-medium tracking-widest text-rose-600 uppercase mb-2 block">
                            Lợi ích vượt trội
                        </span>
                        <h2
                            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight cursor-pointer hover:text-rose-600 transition-colors duration-300"
                            onClick={handleScrollToPackages}
                            title="Click để xem gói dịch vụ"
                        >
                            Tại sao chọn chúng tôi?
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-8 rounded-full"></div>
                    </div>
                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
                        Chúng tôi đồng hành để mang đến ngày cưới hoàn hảo nhất cho bạn với những giá trị độc đáo.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="group bg-white/80 backdrop-blur-sm p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 border border-pink-100/50 relative overflow-hidden"
                        >
                            {/* Hover gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50 opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-3xl"></div>

                            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                                {/* Icon */}
                                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                                    <benefit.icon className="w-10 h-10 lg:w-12 lg:h-12 text-rose-600 group-hover:text-rose-700 transition-colors duration-300" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl lg:text-2xl font-serif font-semibold text-gray-900 leading-tight">
                                    {benefit.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 leading-relaxed text-base lg:text-lg font-light">
                                    {benefit.description}
                                </p>

                                {/* Decorative element */}
                                <div className="w-12 h-px bg-gradient-to-r from-rose-300 to-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to action */}
                <div className="text-center mt-16 lg:mt-20">
                    <button
                        onClick={handleScrollToPackages}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 text-lg tracking-wide"
                    >
                        Khám phá thêm dịch vụ
                    </button>
                </div>
            </div>
        </section>
    );
}
