import PromotionsList from '@/components/PromotionsList';

export default function TestPromotionsPage() {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    🎯 Test Promotions API
                </h1>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Danh sách Khuyến mãi (Limit: 6, Active Only)
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Mở console (F12) để theo dõi API calls. Nếu không có lỗi infinite loop,
                        bạn sẽ chỉ thấy 1 API call duy nhất.
                    </p>

                    <PromotionsList
                        limit={6}
                        showOnlyActive={true}
                    />
                </div>
            </div>
        </div>
    );
}
