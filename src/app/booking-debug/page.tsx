import BookingFormDebug from '@/components/BookingFormDebug';

export default function BookingDebugPage() {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        🐛 Booking Form Debug
                    </h1>
                    <p className="text-gray-600">
                        Debug form với API mapping và console logging
                    </p>
                </div>

                <BookingFormDebug />
            </div>
        </div>
    );
}
