'use client';

import { useState } from 'react';
import BookingForm from '@/components/BookingForm';
import ContactForm from '@/components/ContactForm';
import PromotionsList from '@/components/PromotionsList';
import { useNewsletterSubscribe } from '@/hooks/useApi';

export default function ApiIntegrationExample() {
    const [activeTab, setActiveTab] = useState<'booking' | 'contact' | 'promotions' | 'newsletter'>('booking');
    const { subscribe, loading: newsletterLoading } = useNewsletterSubscribe();
    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            await subscribe(email);
            setEmail('');
        }
    };

    const tabs = [
        { id: 'booking', label: 'Đặt lịch', icon: '📅' },
        { id: 'contact', label: 'Liên hệ', icon: '💬' },
        { id: 'promotions', label: 'Khuyến mãi', icon: '🎁' },
        { id: 'newsletter', label: 'Newsletter', icon: '📧' },
    ] as const;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    API Integration Examples
                </h1>
                <p className="text-gray-600">
                    Ví dụ tích hợp API với các form và component
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                            ${activeTab === tab.id
                                ? 'bg-rose-500 text-white border-b-2 border-rose-500'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }
                        `}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                {activeTab === 'booking' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Form Đặt Lịch Tư Vấn</h2>
                        <p className="text-gray-600 mb-6">
                            Form này sử dụng hook <code className="bg-gray-100 px-2 py-1 rounded">useBookingSubmit()</code>
                            để gửi dữ liệu đến API <code className="bg-gray-100 px-2 py-1 rounded">/api/bookings</code>
                        </p>
                        <BookingForm
                            onSuccess={() => { }}
                        />
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Form Liên Hệ</h2>
                        <p className="text-gray-600 mb-6">
                            Form này sử dụng hook <code className="bg-gray-100 px-2 py-1 rounded">useContactSubmit()</code>
                            để gửi dữ liệu đến API <code className="bg-gray-100 px-2 py-1 rounded">/api/contact</code>
                        </p>
                        <ContactForm
                            onSuccess={() => { }}
                        />
                    </div>
                )}

                {activeTab === 'promotions' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Danh Sách Khuyến Mãi</h2>
                        <p className="text-gray-600 mb-6">
                            Component này sử dụng hook <code className="bg-gray-100 px-2 py-1 rounded">usePromotions()</code>
                            để load dữ liệu từ API <code className="bg-gray-100 px-2 py-1 rounded">/api/promo</code>
                        </p>
                        <PromotionsList limit={6} showOnlyActive={true} />
                    </div>
                )}

                {activeTab === 'newsletter' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Đăng Ký Newsletter</h2>
                        <p className="text-gray-600 mb-6">
                            Form này sử dụng hook <code className="bg-gray-100 px-2 py-1 rounded">useNewsletterSubscribe()</code>
                            để gửi email đến API <code className="bg-gray-100 px-2 py-1 rounded">/api/newsletter</code>
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="max-w-md">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập email của bạn"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={newsletterLoading}
                                    className={`
                                        px-6 py-3 rounded-lg font-medium transition-colors
                                        ${newsletterLoading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-rose-500 hover:bg-rose-600'
                                        } text-white
                                    `}
                                >
                                    {newsletterLoading ? 'Đang gửi...' : 'Đăng ký'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* API Documentation */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">📚 Cách sử dụng API Integration</h3>

                <div className="space-y-4 text-sm">
                    <div>
                        <h4 className="font-medium text-gray-900">1. Import hooks:</h4>
                        <pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
                            {`import { 
  useBookingSubmit, 
  useContactSubmit, 
  usePromotions,
  useNewsletterSubscribe 
} from '@/hooks/useApi';`}
                        </pre>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900">2. Sử dụng trong component:</h4>
                        <pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
                            {`const { submitBooking, loading, error } = useBookingSubmit();

const handleSubmit = async (formData) => {
  const result = await submitBooking(formData);
  if (result) {
    // Success handling
  }
};`}
                        </pre>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900">3. Features:</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                            <li>✅ TypeScript đầy đủ với type safety</li>
                            <li>✅ Error handling tự động với toast notifications</li>
                            <li>✅ Loading states cho UI</li>
                            <li>✅ Form validation</li>
                            <li>✅ Retry logic và error recovery</li>
                            <li>✅ Real-time data fetching</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
