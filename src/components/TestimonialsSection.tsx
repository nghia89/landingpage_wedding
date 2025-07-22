import Image from "next/image";

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Anh Minh & Chị Hương",
            image: "/bride1.svg",
            location: "Tiệc cưới tại Q.1, TP.HCM",
            content: "Chúng tôi rất hài lòng với dịch vụ của công ty. Từ khâu tư vấn đến thực hiện, mọi thứ đều được chăm chút tỉ mỉ. Ngày cưới của chúng tôi thật sự hoàn hảo và đáng nhớ.",
            content2: "Đội ngũ nhân viên rất chuyên nghiệp, nhiệt tình và luôn sẵn sàng hỗ trợ. Không gian tiệc cưới được trang trí rất đẹp, vượt xa mong đợi của chúng tôi.",
            rating: 5
        },
        {
            name: "Anh Tuấn & Chị Linh",
            image: "/bride2.svg",
            location: "Tiệc cưới tại Q.7, TP.HCM",
            content: "Lựa chọn gói cao cấp là quyết định đúng đắn nhất của chúng tôi. Menu phong phú, không gian sang trọng và dịch vụ chu đáo đã khiến khách mời của chúng tôi rất ấn tượng.",
            content2: "Cảm ơn team đã tạo ra một ngày cưới thật sự ý nghĩa. Chúng tôi sẽ giới thiệu dịch vụ này cho bạn bè và người thân.",
            rating: 5
        },
        {
            name: "Anh Khang & Chị Mai",
            image: "/bride1.svg",
            location: "Tiệc cưới tại Q.3, TP.HCM",
            content: "Dịch vụ tuyệt vời từ A đến Z. Ekip làm việc rất chuyên nghiệp và tận tâm. Mọi chi tiết đều được chuẩn bị kỹ lưỡng.",
            content2: "Không gian tiệc cưới được bố trí đẹp mắt, âm thanh ánh sáng chất lượng cao. Chúng tôi và gia đình đều rất hài lòng.",
            rating: 5
        },
        {
            name: "Anh Việt & Chị Thảo",
            image: "/bride2.svg",
            location: "Tiệc cưới tại Q.10, TP.HCM",
            content: "Giá cả hợp lý, chất lượng dịch vụ vượt mong đợi. Từ khâu trang trí đến menu ăn uống đều rất xuất sắc.",
            content2: "Đặc biệt ấn tượng với sự nhiệt tình và chu đáo của đội ngũ nhân viên. Cảm ơn các bạn đã tạo nên ngày cưới đáng nhớ.",
            rating: 5
        }
    ];

    return (
        <section className="py-20 lg:py-32 bg-gradient-to-b from-rose-50/30 to-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-40 h-40 bg-pink-200 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute bottom-20 right-16 w-32 h-32 bg-rose-200 rounded-full opacity-15 animate-pulse delay-700"></div>

            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <span className="text-sm font-medium tracking-widest text-rose-600 uppercase mb-2 block">
                        Phản hồi từ khách hàng
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                        Khách hàng nói gì về chúng tôi?
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-8 rounded-full"></div>
                    <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
                        Lắng nghe chia sẻ từ những cặp đôi đã tin tưởng dịch vụ của chúng tôi và có những trải nghiệm tuyệt vời.
                    </p>
                </div>

                {/* Testimonials Grid - Responsive for multiple testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto mb-16">
                    {testimonials.slice(0, 4).map((testimonial, index) => (
                        <div
                            key={index}
                            className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-700 border border-pink-100/50 overflow-hidden"
                        >
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10">
                                {/* Quote icon */}
                                <div className="absolute -top-2 -left-2 w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-200 rounded-full flex items-center justify-center shadow-lg opacity-80">
                                    <svg className="w-8 h-8 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                                    </svg>
                                </div>

                                {/* Header with image and info */}
                                <div className="flex items-start mb-8 pt-6">
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-pink-100 shadow-lg mr-6 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl lg:text-2xl font-serif font-semibold text-gray-900 mb-1">
                                            {testimonial.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3 font-medium">
                                            {testimonial.location}
                                        </p>
                                        <div className="flex space-x-1">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial content */}
                                <div className="space-y-5 text-gray-700 leading-relaxed">
                                    <p className="text-lg font-medium italic relative">
                                        "{testimonial.content}"
                                    </p>
                                    <p className="text-lg font-medium italic relative">
                                        "{testimonial.content2}"
                                    </p>
                                </div>

                                {/* Decorative bottom accent */}
                                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-rose-400 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View More Button - Shows if there are more than 4 testimonials */}
                {testimonials.length > 4 && (
                    <div className="text-center mb-16">
                        <button className="group bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            <span className="mr-2">Xem thêm phản hồi</span>
                            <svg className="w-4 h-4 inline-block group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <p className="text-gray-500 text-sm mt-3">
                            Còn {testimonials.length - 4}+ phản hồi khác từ khách hàng
                        </p>
                    </div>
                )}

                {/* Video Testimonial Section */}
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl md:text-4xl font-serif font-semibold text-gray-900 mb-4">
                            Xem video chia sẻ từ khách hàng
                        </h3>
                        <p className="text-gray-600 text-lg font-light">
                            Cảm nhận trực tiếp từ những cặp đôi đã trải nghiệm dịch vụ của chúng tôi
                        </p>
                    </div>

                    <div className="relative aspect-video bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
                        {/* Video placeholder */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50">
                            <div className="text-center group-hover:scale-105 transition-transform duration-300">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mb-6 mx-auto group-hover:shadow-3xl transition-shadow duration-300">
                                    <svg className="w-10 h-10 text-rose-500 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-serif font-semibold text-gray-800 mb-2">Video testimonial</h4>
                                <p className="text-gray-600 font-medium">Sẽ được cập nhật sớm</p>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-6 right-6 w-20 h-20 bg-white/20 rounded-full"></div>
                        <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/30 rounded-full"></div>
                    </div>
                </div>

                {/* Stats section */}
                <div className="mt-20 pt-16 border-t border-pink-200/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                        <div className="group">
                            <div className="text-4xl lg:text-5xl font-bold text-rose-500 mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
                            <div className="text-gray-600 font-medium">Cặp đôi hạnh phúc</div>
                        </div>
                        <div className="group">
                            <div className="text-4xl lg:text-5xl font-bold text-rose-500 mb-2 group-hover:scale-110 transition-transform duration-300">5★</div>
                            <div className="text-gray-600 font-medium">Đánh giá trung bình</div>
                        </div>
                        <div className="group">
                            <div className="text-4xl lg:text-5xl font-bold text-rose-500 mb-2 group-hover:scale-110 transition-transform duration-300">98%</div>
                            <div className="text-gray-600 font-medium">Khách hàng hài lòng</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
