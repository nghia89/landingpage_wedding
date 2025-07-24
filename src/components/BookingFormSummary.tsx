'use client';

export default function BookingFormSummary() {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-green-600 mb-6">
                ✅ Form Đặt Lịch Tư Vấn Hoàn Thành
            </h1>

            <div className="space-y-6">
                {/* Form Fields */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-blue-800 mb-3">
                        📋 Các trường dữ liệu
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-blue-700 mb-2">Required Fields:</h3>
                            <ul className="list-disc list-inside text-blue-600 text-sm space-y-1">
                                <li><strong>Họ tên</strong> - text input</li>
                                <li><strong>Email</strong> - email input với validation</li>
                                <li><strong>Số điện thoại</strong> - tel input</li>
                                <li><strong>Ngày tư vấn</strong> - date picker (không cho chọn quá khứ)</li>
                                <li><strong>Giờ tư vấn</strong> - time picker</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-blue-700 mb-2">Optional Fields:</h3>
                            <ul className="list-disc list-inside text-blue-600 text-sm space-y-1">
                                <li><strong>Loại dịch vụ</strong> - select dropdown</li>
                                <li><strong>Ghi chú thêm</strong> - textarea</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* API Integration */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-green-800 mb-3">
                        🔌 API Integration
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-green-700">Endpoint:</h3>
                            <code className="bg-green-100 px-2 py-1 rounded text-green-800">
                                POST /api/bookings
                            </code>
                        </div>
                        <div>
                            <h3 className="font-semibold text-green-700">Data Format:</h3>
                            <pre className="bg-green-100 p-3 rounded text-sm text-green-800 overflow-x-auto">
                                {`{
  "name": "Nguyễn Văn A",
  "email": "user@example.com", 
  "phone": "0123456789",
  "date": "2024-12-25",
  "time": "14:30",
  "service": "consultation",
  "message": "Ghi chú thêm..."
}`}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-purple-800 mb-3">
                        ✨ Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold text-purple-700 mb-2">User Experience:</h3>
                            <ul className="list-disc list-inside text-purple-600 text-sm space-y-1">
                                <li>Form validation tự động</li>
                                <li>Loading states với spinner</li>
                                <li>Toast notifications thành công/lỗi</li>
                                <li>Auto reset form sau khi submit thành công</li>
                                <li>Responsive design cho mobile</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-purple-700 mb-2">Technical:</h3>
                            <ul className="list-disc list-inside text-purple-600 text-sm space-y-1">
                                <li>TypeScript với type safety</li>
                                <li>Custom hook useBookingSubmit</li>
                                <li>Error handling tự động</li>
                                <li>API client với debouncing</li>
                                <li>Consistent styling với TailwindCSS</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Service Options */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-yellow-800 mb-3">
                        🎯 Service Options
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div className="bg-yellow-100 p-2 rounded text-yellow-800">Tư vấn chung</div>
                        <div className="bg-yellow-100 p-2 rounded text-yellow-800">Địa điểm tổ chức</div>
                        <div className="bg-yellow-100 p-2 rounded text-yellow-800">Trang trí tiệc cưới</div>
                        <div className="bg-yellow-100 p-2 rounded text-yellow-800">Chụp ảnh cưới</div>
                        <div className="bg-yellow-100 p-2 rounded text-yellow-800">Trang điểm cô dâu</div>
                        <div className="bg-yellow-100 p-2 rounded text-yellow-800">Tiệc cưới</div>
                        <div className="bg-yellow-100 p-2 rounded text-yellow-800">Gói trọn gói</div>
                        <div className="bg-yellow-100 p-2 rounded text-yellow-800">...</div>
                    </div>
                </div>

                {/* Usage */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                        🚀 Cách sử dụng
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-semibold text-gray-700">1. Test Form:</h3>
                            <p className="text-gray-600 text-sm">
                                Truy cập <code className="bg-gray-200 px-1 rounded">/booking-test</code> để test form riêng biệt
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">2. Landing Page:</h3>
                            <p className="text-gray-600 text-sm">
                                Form đã được tích hợp vào <code className="bg-gray-200 px-1 rounded">ContactFormSection</code> trong trang chính
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">3. Customize:</h3>
                            <p className="text-gray-600 text-sm">
                                Có thể dễ dàng thay đổi service options, validation rules, hoặc styling
                            </p>
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
                    🧪 Test Form
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                    🏠 Landing Page
                </button>
                <button
                    onClick={() => window.location.href = '/test'}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                >
                    📊 All Tests
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
