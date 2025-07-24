'use client';

import { useToast } from '@/components/ToastProvider';
import { showToast } from '@/utils/toast';

export default function ToastTestPage() {
    const { showToast: showToastProvider } = useToast();

    const testMessages = [
        {
            title: "Ngắn",
            message: "Toast ngắn",
            type: 'success' as const
        },
        {
            title: "Dài một chút",
            message: "Đây là toast message dài một chút để test xem hiển thị có ổn không",
            type: 'info' as const
        },
        {
            title: "Rất dài",
            message: "Đây là một toast message rất dài để test xem khi text quá dài thì layout có bị vỡ không và có wrap text đúng cách không. Nội dung này được tạo ra để kiểm tra responsive design của toast component",
            type: 'warning' as const
        },
        {
            title: "Cực kỳ dài với nhiều từ khóa kỹ thuật",
            message: "Tạo khuyến mãi thành công với mã WEDDING2024! Chương trình ưu đãi đặc biệt dành cho các cặp đôi đăng ký dịch vụ trang trí tiệc cưới trong tháng này. Bạn sẽ được giảm 25% tổng giá trị hợp đồng và nhận thêm gói chụp ảnh cưới miễn phí trị giá 5.000.000 VNĐ",
            type: 'error' as const
        }
    ];

    const handleTestToastProvider = (test: typeof testMessages[0]) => {
        showToastProvider({
            type: test.type,
            title: test.title,
            message: test.message,
            duration: 8000
        });
    };

    const handleTestToastUtils = (test: typeof testMessages[0]) => {
        showToast(`${test.title}: ${test.message}`, test.type);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🧪 Toast Message Test
                    </h1>
                    <p className="text-gray-600">
                        Test toast messages với độ dài khác nhau để kiểm tra layout
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ToastProvider Tests */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            📧 ToastProvider (React Context)
                        </h2>
                        <div className="space-y-4">
                            {testMessages.map((test, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleTestToastProvider(test)}
                                    className={`w-full p-4 rounded-lg text-white font-medium hover:opacity-90 transition-opacity text-left ${test.type === 'success' ? 'bg-green-500' :
                                            test.type === 'error' ? 'bg-red-500' :
                                                test.type === 'warning' ? 'bg-yellow-500' :
                                                    'bg-blue-500'
                                        }`}
                                >
                                    <div className="font-semibold">{test.title}</div>
                                    <div className="text-sm opacity-90 mt-1 line-clamp-2">
                                        {test.message}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-900 mb-2">Đặc điểm:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Có title và message riêng biệt</li>
                                <li>• Icon theo type</li>
                                <li>• Nút đóng</li>
                                <li>• Animation mượt</li>
                            </ul>
                        </div>
                    </div>

                    {/* Utils Toast Tests */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            🛠️ Utils Toast (Vanilla JS)
                        </h2>
                        <div className="space-y-4">
                            {testMessages.map((test, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleTestToastUtils(test)}
                                    className={`w-full p-4 rounded-lg text-white font-medium hover:opacity-90 transition-opacity text-left ${test.type === 'success' ? 'bg-green-600' :
                                            test.type === 'error' ? 'bg-red-600' :
                                                test.type === 'warning' ? 'bg-yellow-600' :
                                                    'bg-blue-600'
                                        }`}
                                >
                                    <div className="font-semibold">{test.title}</div>
                                    <div className="text-sm opacity-90 mt-1 line-clamp-2">
                                        {test.message}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-green-50 rounded-lg">
                            <h3 className="font-medium text-green-900 mb-2">Đặc điểm:</h3>
                            <ul className="text-sm text-green-800 space-y-1">
                                <li>• Đơn giản, nhẹ</li>
                                <li>• Không cần React context</li>
                                <li>• Auto remove sau 3s</li>
                                <li>• Vanilla JS implementation</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-12 text-center">
                    <a
                        href="/test"
                        className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        ← Back to Test Hub
                    </a>
                </div>

                {/* Usage Notes */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold text-yellow-900 mb-3">📝 Cải tiến đã áp dụng:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
                        <div>
                            <h4 className="font-medium mb-2">ToastProvider:</h4>
                            <ul className="space-y-1">
                                <li>• <code>max-w-md w-full</code> thay vì <code>max-w-sm</code></li>
                                <li>• <code>break-words leading-relaxed</code> cho text</li>
                                <li>• <code>flex-1 min-w-0</code> cho content area</li>
                                <li>• Better spacing với <code>gap-3</code></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Utils Toast:</h4>
                            <ul className="space-y-1">
                                <li>• <code>max-w-md w-full mr-4</code> container</li>
                                <li>• <code>break-words leading-relaxed</code></li>
                                <li>• Separate content div cho better control</li>
                                <li>• Responsive positioning</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
