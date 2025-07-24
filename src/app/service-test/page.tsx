'use client';

import DynamicServicePackages from '@/components/DynamicServicePackages';

export default function ServiceTestPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        🧪 Dynamic Service Packages Test
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Test trang services packages với dynamic data từ API
                    </p>
                </div>
            </div>

            {/* Services Component */}
            <DynamicServicePackages />

            {/* Debug Info */}
            <div className="bg-white border-t mt-16">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <h3 className="font-semibold text-blue-900 mb-4">📋 Tính năng đã implement:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                            <div>
                                <h4 className="font-medium mb-2">✅ API Integration:</h4>
                                <ul className="space-y-1">
                                    <li>• Fetch từ <code>/api/services</code></li>
                                    <li>• Filter <code>isActive: true</code></li>
                                    <li>• Sort theo category order</li>
                                    <li>• Fallback to default data</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">✅ UI Features:</h4>
                                <ul className="space-y-1">
                                    <li>• Chỉ hiển thị 3 gói: Basic, Premium, Luxury</li>
                                    <li>• Responsive design</li>
                                    <li>• Loading states</li>
                                    <li>• Error handling</li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-white rounded border">
                            <h4 className="font-medium text-blue-900 mb-2">🔧 API Endpoints:</h4>
                            <div className="space-y-1 text-sm font-mono">
                                <div>GET <code>/api/services</code> - Lấy danh sách services</div>
                                <div>GET <code>/api/services/seed</code> - Tạo sample data</div>
                                <div>POST <code>/api/services</code> - Tạo service mới (admin)</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <a
                            href="/test"
                            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            ← Back to Test Hub
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
