'use client';

export default function EmailIntegrationSummary() {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-green-600 mb-6">
                ✅ Email Integration Hoàn Thành
            </h1>

            <div className="space-y-6">
                {/* Integration Overview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-blue-800 mb-3">
                        📧 Email Workflow
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</span>
                            <span className="text-blue-700">User điền form đặt lịch tư vấn</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">2</span>
                            <span className="text-blue-700">POST /api/bookings - Lưu booking vào database</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">3</span>
                            <span className="text-blue-700">Tự động gửi email notification về nghia891996@gmail.com</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">4</span>
                            <span className="text-blue-700">Frontend hiển thị toast thành công</span>
                        </div>
                    </div>
                </div>

                {/* Implementation Details */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-green-800 mb-3">
                        🔧 Implementation
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-green-700">Backend Integration:</h3>
                            <ul className="list-disc list-inside text-green-600 text-sm space-y-1 ml-4">
                                <li>Tích hợp Resend email service vào <code>/api/bookings</code></li>
                                <li>Email tự động gửi sau khi booking được tạo thành công</li>
                                <li>Fallback: Nếu email fail, booking vẫn thành công</li>
                                <li>Email template đẹp với HTML styling</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-700">Email Content:</h3>
                            <ul className="list-disc list-inside text-green-600 text-sm space-y-1 ml-4">
                                <li>Tên khách hàng, số điện thoại</li>
                                <li>Ngày và giờ tư vấn</li>
                                <li>Ghi chú yêu cầu (nếu có)</li>
                                <li>Thời gian đặt lịch</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Email Template Preview */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-purple-800 mb-3">
                        📄 Email Template
                    </h2>
                    <div className="bg-white border rounded-lg p-4 max-w-md mx-auto">
                        <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white p-4 rounded-t-lg text-center">
                            <h3 className="text-lg font-bold">💒 Wedding Dreams</h3>
                            <p className="text-sm opacity-90">Lịch tư vấn mới</p>
                        </div>
                        <div className="p-4 space-y-3 text-sm">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Khách hàng</div>
                                <div className="font-semibold">Nguyễn Văn Test</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Số điện thoại</div>
                                <div className="font-semibold text-rose-600">0987654321</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Ngày tư vấn</div>
                                <div className="font-semibold">30 tháng 12, 2024</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Giờ tư vấn</div>
                                <div className="font-semibold">15:00</div>
                            </div>
                        </div>
                        <div className="px-4 pb-4 text-center text-xs text-gray-500">
                            Hãy liên hệ với khách hàng để xác nhận lịch hẹn! 💝
                        </div>
                    </div>
                </div>

                {/* Configuration */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-yellow-800 mb-3">
                        ⚙️ Configuration
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-yellow-700">Environment Variables:</h3>
                            <code className="block bg-yellow-100 p-2 rounded text-yellow-800 text-sm">
                                RESEND_API_KEY=your_resend_api_key_here
                            </code>
                        </div>
                        <div>
                            <h3 className="font-semibold text-yellow-700">Email Settings:</h3>
                            <ul className="list-disc list-inside text-yellow-600 text-sm space-y-1 ml-4">
                                <li><strong>From:</strong> Wedding Dreams &lt;onboarding@resend.dev&gt;</li>
                                <li><strong>To:</strong> nghia891996@gmail.com</li>
                                <li><strong>Subject:</strong> Đặt lịch tư vấn mới từ [Customer Name]</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-indigo-800 mb-3">
                        🎯 Benefits
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-indigo-700 mb-2">Automated:</h3>
                            <ul className="list-disc list-inside text-indigo-600 text-sm space-y-1">
                                <li>Không cần manual check database</li>
                                <li>Instant notification khi có booking mới</li>
                                <li>Reliable email delivery với Resend</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-indigo-700 mb-2">Professional:</h3>
                            <ul className="list-disc list-inside text-indigo-600 text-sm space-y-1">
                                <li>HTML email template đẹp</li>
                                <li>Structured data layout</li>
                                <li>Consistent branding</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
                <button
                    onClick={() => window.location.href = '/booking-test'}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    🧪 Test Booking Form
                </button>
                <button
                    onClick={() => window.location.href = '/booking-debug'}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                >
                    🐛 Debug Form
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                    🏠 Landing Page
                </button>
                <button
                    onClick={() => console.clear()}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    🧹 Clear Console
                </button>
            </div>
        </div>
    );
}
