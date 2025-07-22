export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 lg:py-20 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-pink-900/5"></div>
            </div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="mb-8">
                            <h3 className="text-3xl lg:text-4xl font-serif font-bold mb-4 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                                Wedding Dreams
                            </h3>
                            <div className="w-16 h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full mb-6"></div>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-6 text-lg font-light max-w-md">
                            Chúng tôi chuyên tổ chức những đám cưới hoàn hảo, biến giấc mơ của bạn thành hiện thực
                            với dịch vụ chuyên nghiệp và tận tâm. Mỗi khoảnh khắc đều trở thành kỷ niệm đáng nhớ.
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <svg className="w-4 h-4 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Được cấp phép hoạt động</span>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-xl font-serif font-semibold mb-6 text-white">
                            Thông tin liên hệ
                        </h4>
                        <div className="space-y-5">
                            <div className="flex items-start group">
                                <div className="w-6 h-6 bg-rose-500 rounded-lg flex items-center justify-center mr-4 mt-1 group-hover:bg-rose-400 transition-colors duration-300 shadow-lg">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-gray-300 font-medium leading-relaxed">
                                        123 Đường ABC, Quận 1<br />
                                        TP. Hồ Chí Minh
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center group">
                                <div className="w-6 h-6 bg-rose-500 rounded-lg flex items-center justify-center mr-4 group-hover:bg-rose-400 transition-colors duration-300 shadow-lg">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                </div>
                                <a href="tel:0123456789" className="text-gray-300 hover:text-rose-400 transition-colors duration-300 font-medium">
                                    0123 456 789
                                </a>
                            </div>
                            <div className="flex items-center group">
                                <div className="w-6 h-6 bg-rose-500 rounded-lg flex items-center justify-center mr-4 group-hover:bg-rose-400 transition-colors duration-300 shadow-lg">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <a href="mailto:info@weddingdreams.vn" className="text-gray-300 hover:text-rose-400 transition-colors duration-300 font-medium">
                                    info@weddingdreams.vn
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links & Social Media */}
                    <div>
                        <h4 className="text-xl font-serif font-semibold mb-6 text-white">
                            Kết nối với chúng tôi
                        </h4>

                        {/* Quick Links */}
                        <ul className="space-y-3 mb-8">
                            <li><a href="#services" className="text-gray-300 hover:text-rose-400 transition-colors duration-300 font-medium">Dịch vụ</a></li>
                            <li><a href="#gallery" className="text-gray-300 hover:text-rose-400 transition-colors duration-300 font-medium">Thư viện ảnh</a></li>
                            <li><a href="#testimonials" className="text-gray-300 hover:text-rose-400 transition-colors duration-300 font-medium">Đánh giá</a></li>
                            <li><a href="#contact" className="text-gray-300 hover:text-rose-400 transition-colors duration-300 font-medium">Liên hệ</a></li>
                        </ul>

                        {/* Social Media */}
                        <div>
                            <p className="text-gray-400 text-sm mb-4 font-medium">Theo dõi chúng tôi:</p>
                            <div className="flex space-x-4">
                                {/* Facebook */}
                                <a href="#" className="group relative w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-110 hover:-translate-y-1">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>

                                {/* Instagram */}
                                <a href="#" className="group relative w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center hover:from-pink-400 hover:via-purple-400 hover:to-indigo-400 transition-all duration-300 shadow-lg hover:shadow-pink-500/25 hover:scale-110 hover:-translate-y-1">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348 2.348 1.051 2.348 2.348-1.051 2.348-2.348 2.348z" />
                                    </svg>
                                </a>

                                {/* Zalo */}
                                <a href="#" className="group relative w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center hover:from-blue-400 hover:to-cyan-400 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-110 hover:-translate-y-1">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm-1 4v12l8-6-8-6z" />
                                    </svg>
                                </a>

                                {/* YouTube */}
                                <a href="#" className="group relative w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-110 hover:-translate-y-1">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="border-t border-gray-700 pt-12 mb-12">
                    <div className="max-w-2xl mx-auto text-center">
                        <h4 className="text-2xl font-serif font-semibold mb-4 text-white">
                            Nhận thông tin ưu đãi mới nhất
                        </h4>
                        <p className="text-gray-400 mb-8 font-light">
                            Đăng ký để không bỏ lỡ các chương trình khuyến mãi và tips tổ chức tiệc cưới
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="flex-1 px-6 py-3 bg-gray-800 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-300"
                            />
                            <button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-700 pt-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                        <div className="text-gray-400 text-sm font-light">
                            <p>© 2025 Wedding Dreams - Công ty Tổ Chức Cưới. Đã đăng ký bản quyền.</p>
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors duration-300">Chính sách bảo mật</a>
                            <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors duration-300">Điều khoản dịch vụ</a>
                            <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors duration-300">Sitemap</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
