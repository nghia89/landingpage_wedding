import ContactFormSection from '@/components/ContactFormSection';

export default function BookingTestPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="py-8">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            🎯 Test Form Đặt Lịch Tư Vấn
                        </h1>
                        <p className="text-gray-600">
                            Test tích hợp API <code className="bg-gray-200 px-2 py-1 rounded">POST /api/bookings</code> với toast notifications
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">📋 Form Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>Họ tên (required)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>Email (required)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>Số điện thoại (required)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>Ngày tư vấn (required)</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span>Giờ tư vấn (required)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span>Loại dịch vụ (optional)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span>Ghi chú thêm (optional)</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                    <span>Toast notifications</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 text-sm">
                                <strong>Note:</strong> Form sẽ gửi dữ liệu tới API endpoint
                                <code className="bg-yellow-200 px-1 rounded">/api/bookings</code>.
                                Nếu API trả về lỗi, bạn sẽ thấy toast notification màu đỏ.
                                Nếu thành công, form sẽ reset và hiện toast màu xanh.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <ContactFormSection />
        </div>
    );
}
