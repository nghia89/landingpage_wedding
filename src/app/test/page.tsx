export default function TestIndexPage() {
    const testPages = [
        {
            title: "📋 Booking Form Test",
            description: "Test form đặt lịch tư vấn với API /api/bookings",
            url: "/booking-test",
            status: "✅ Ready",
            features: ["Form validation", "API integration", "Toast notifications", "Auto reset"]
        },
        {
            title: "🛠️ Booking Form Debug",
            description: "Debug version với advanced controls",
            url: "/booking-debug",
            status: "🔧 Debug",
            features: ["Mock API toggle", "Debug controls", "Response logging"]
        },
        {
            title: "📊 Booking Summary",
            description: "Tổng hợp tất cả tính năng booking form",
            url: "/booking-summary",
            status: "📝 Summary",
            features: ["Component overview", "API details", "Usage guide"]
        },
        {
            title: "🎯 Promotions Test",
            description: "Test trang promotions với debounced API",
            url: "/test-promotions",
            status: "✅ Fixed",
            features: ["Debounced API calls", "Memoized params", "Loading states"]
        },
        {
            title: "🔧 API Debug Page",
            description: "Debug tools và mock data testing",
            url: "/api-debug",
            status: "✅ Advanced",
            features: ["Mock API toggle", "Debug controls", "Console monitoring"]
        },
        {
            title: "📊 API Integration Demo",
            description: "Tổng hợp tất cả API components",
            url: "/api-test",
            status: "✅ Complete",
            features: ["All API hooks", "Form examples", "Error handling"]
        },
        {
            title: "📧 Email Integration Summary",
            description: "Tóm tắt tích hợp email notification cho booking",
            url: "/email-summary",
            status: "✅ Integrated",
            features: ["Auto email sending", "HTML template", "Resend integration", "Error handling"]
        },
        {
            title: "🛠️ API Fix Summary",
            description: "Tóm tắt các vấn đề đã được sửa",
            url: "/api-fix",
            status: "📝 Documentation",
            features: ["Problem analysis", "Solutions applied", "Testing guide"]
        },
        {
            title: "🍞 Toast Message Test",
            description: "Test toast messages với text dài và layout responsive",
            url: "/toast-test",
            status: "✅ Fixed",
            features: ["Long text handling", "Responsive layout", "Break words", "Better spacing"]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        🧪 Test Pages Hub
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Trang tổng hợp tất cả các test pages và debug tools cho wedding landing page project
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center border border-blue-100">
                        <div className="text-2xl font-bold text-blue-600">{testPages.length}</div>
                        <div className="text-sm text-gray-600">Total Pages</div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center border border-green-100">
                        <div className="text-2xl font-bold text-green-600">
                            {testPages.filter(page => page.status.includes('✅')).length}
                        </div>
                        <div className="text-sm text-gray-600">Ready</div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center border border-orange-100">
                        <div className="text-2xl font-bold text-orange-600">
                            {testPages.filter(page => page.status.includes('🔧')).length}
                        </div>
                        <div className="text-sm text-gray-600">Debug</div>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center border border-purple-100">
                        <div className="text-2xl font-bold text-purple-600">
                            {testPages.filter(page => page.status.includes('📝')).length}
                        </div>
                        <div className="text-sm text-gray-600">Docs</div>
                    </div>
                </div>

                {/* Test Pages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testPages.map((page, index) => (
                        <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            {/* Status Badge */}
                            <div className="flex justify-between items-start mb-4">
                                <span className={`
                                    px-3 py-1 rounded-full text-xs font-medium
                                    ${page.status.includes('✅') ? 'bg-green-100 text-green-800' : ''}
                                    ${page.status.includes('🔧') ? 'bg-orange-100 text-orange-800' : ''}
                                    ${page.status.includes('📝') ? 'bg-purple-100 text-purple-800' : ''}
                                `}>
                                    {page.status}
                                </span>
                            </div>

                            {/* Title & Description */}
                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                {page.title}
                            </h3>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                {page.description}
                            </p>

                            {/* Features */}
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {page.features.map((feature, featureIndex) => (
                                        <span key={featureIndex} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Action Button */}
                            <a
                                href={page.url}
                                className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 group-hover:shadow-lg"
                            >
                                Visit Page →
                            </a>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            🚀 Quick Actions
                        </h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="/" className="px-6 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors">
                                ← Back to Home
                            </a>
                            <a href="/api-test" className="px-6 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors">
                                API Demo
                            </a>
                            <a href="/booking-test" className="px-6 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors">
                                Booking Test
                            </a>
                            <a href="/toast-test" className="px-6 py-2 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition-colors">
                                Toast Test
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
