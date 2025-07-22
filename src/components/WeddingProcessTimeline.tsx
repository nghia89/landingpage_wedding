"use client";

import {
    PhoneIcon,
    CalendarDaysIcon,
    PresentationChartLineIcon,
    DocumentCheckIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

export default function WeddingProcessTimeline() {
    const processSteps = [
        {
            step: 1,
            title: "Liên hệ tư vấn",
            description: "Gọi điện hoặc đặt lịch tư vấn để thảo luận về ý tưởng và yêu cầu của bạn",
            icon: PhoneIcon,
            details: [
                "Tư vấn miễn phí 24/7",
                "Lắng nghe ý tưởng của bạn",
                "Đưa ra những gợi ý phù hợp"
            ],
            color: "from-blue-500 to-cyan-500",
            bgColor: "from-blue-50 to-cyan-50"
        },
        {
            step: 2,
            title: "Khảo sát & Báo giá",
            description: "Chúng tôi sẽ khảo sát địa điểm, số lượng khách và đưa ra báo giá chi tiết",
            icon: PresentationChartLineIcon,
            details: [
                "Khảo sát không gian tổ chức",
                "Tính toán số lượng khách mời",
                "Báo giá minh bạch, chi tiết"
            ],
            color: "from-emerald-500 to-teal-500",
            bgColor: "from-emerald-50 to-teal-50"
        },
        {
            step: 3,
            title: "Chốt hợp đồng",
            description: "Ký kết hợp đồng và đặt cọc để đảm bảo dịch vụ cho ngày trọng đại",
            icon: DocumentCheckIcon,
            details: [
                "Hợp đồng rõ ràng, minh bạch",
                "Đặt cọc chỉ 30% giá trị",
                "Cam kết chất lượng dịch vụ"
            ],
            color: "from-amber-500 to-orange-500",
            bgColor: "from-amber-50 to-orange-50"
        },
        {
            step: 4,
            title: "Lên kế hoạch chi tiết",
            description: "Lập timeline chi tiết, chọn menu, trang trí và các dịch vụ kèm theo",
            icon: CalendarDaysIcon,
            details: [
                "Timeline chi tiết từng giờ",
                "Chọn menu và trang trí",
                "Phối hợp với các nhà cung cấp"
            ],
            color: "from-purple-500 to-pink-500",
            bgColor: "from-purple-50 to-pink-50"
        },
        {
            step: 5,
            title: "Thực hiện tiệc cưới",
            description: "Ngày trọng đại đã đến! Chúng tôi sẽ lo tất cả để bạn tận hưởng khoảnh khắc",
            icon: SparklesIcon,
            details: [
                "Đội ngũ hỗ trợ 24/7",
                "Kiểm soát chất lượng liên tục",
                "Đảm bảo mọi thứ diễn ra hoàn hảo"
            ],
            color: "from-rose-500 to-pink-500",
            bgColor: "from-rose-50 to-pink-50"
        }
    ];

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
        <section id="quy-trinh" className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <span className="text-sm font-medium tracking-widest text-rose-600 uppercase mb-2 block">
                        Quy trình đặt tiệc
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                        5 Bước Đơn Giản
                        <br />
                        <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                            Tiệc Cưới Hoàn Hảo
                        </span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-8 rounded-full"></div>
                    <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
                        Chúng tôi đồng hành cùng bạn từ ý tưởng đầu tiên đến khoảnh khắc hoàn hảo
                    </p>
                </div>

                {/* Timeline */}
                <div className="max-w-6xl mx-auto">
                    {/* Desktop Timeline */}
                    <div className="hidden lg:block">
                        <div className="relative">
                            {/* Timeline Line */}
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-emerald-200 via-amber-200 via-purple-200 to-rose-200 rounded-full transform -translate-y-1/2"></div>

                            {/* Timeline Steps */}
                            <div className="grid grid-cols-5 gap-8">
                                {processSteps.map((step, index) => (
                                    <div key={step.step} className="relative">
                                        {/* Step Circle */}
                                        <div className="flex justify-center mb-8">
                                            <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-500 relative z-10`}>
                                                <step.icon className="w-10 h-10 text-white" />
                                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-sm font-bold text-gray-700">{step.step}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step Content */}
                                        <div className={`bg-gradient-to-br ${step.bgColor} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-white/50`}>
                                            <h3 className="text-xl font-serif font-bold text-gray-900 mb-3">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-700 mb-4 leading-relaxed">
                                                {step.description}
                                            </p>
                                            <ul className="space-y-2">
                                                {step.details.map((detail, idx) => (
                                                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                                        <span>{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Timeline */}
                    <div className="lg:hidden">
                        <div className="relative">
                            {/* Vertical Timeline Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-emerald-200 via-amber-200 via-purple-200 to-rose-200 rounded-full"></div>

                            {/* Timeline Steps */}
                            <div className="space-y-12">
                                {processSteps.map((step, index) => (
                                    <div key={step.step} className="relative flex items-start space-x-6">
                                        {/* Step Circle */}
                                        <div className="flex-shrink-0 relative z-10">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-lg`}>
                                                <step.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                                                <span className="text-xs font-bold text-gray-700">{step.step}</span>
                                            </div>
                                        </div>

                                        {/* Step Content */}
                                        <div className={`flex-1 bg-gradient-to-br ${step.bgColor} p-6 rounded-2xl shadow-lg border border-white/50`}>
                                            <h3 className="text-lg font-serif font-bold text-gray-900 mb-3">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-700 mb-4 leading-relaxed">
                                                {step.description}
                                            </p>
                                            <ul className="space-y-2">
                                                {step.details.map((detail, idx) => (
                                                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                                        <span>{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center mt-20">
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-8 rounded-3xl shadow-xl max-w-2xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-4">
                            Sẵn sàng bắt đầu hành trình?
                        </h3>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                            Hãy để chúng tôi biến ước mơ tiệc cưới của bạn thành hiện thực
                        </p>
                        <button
                            onClick={handleScrollToContact}
                            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 text-lg"
                        >
                            Bắt đầu bước đầu tiên 🚀
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
