'use client';

import { useState } from 'react';
import { useBookingSubmit } from '@/hooks/useApi';
import { BookingFormData } from '@/types/api';

export default function BookingFormDebug() {
    const [formData, setFormData] = useState<BookingFormData>({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '0123456789',
        date: '2024-12-25',
        time: '14:30',
        service: 'consultation',
        message: 'Test booking message'
    });

    const { submitBooking, loading, error } = useBookingSubmit();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await submitBooking(formData);
        } catch (err) {
            console.error('❌ Booking submission failed:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                🧪 Booking Form Debug
            </h2>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Debug Info:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
                    <p><strong>Error:</strong> {error || 'null'}</p>
                    <p><strong>API Endpoint:</strong> POST /api/bookings</p>
                    <p><strong>Expected Backend Fields:</strong> customerName, phone, consultationDate, consultationTime, requirements</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service
                        </label>
                        <select
                            name="service"
                            value={formData.service}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                        >
                            <option value="consultation">Consultation</option>
                            <option value="venue">Venue</option>
                            <option value="decoration">Decoration</option>
                            <option value="photography">Photography</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time
                        </label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="Additional requirements..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-md font-medium ${loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        } text-white transition-colors`}
                >
                    {loading ? 'Submitting...' : 'Submit Booking'}
                </button>
            </form>

            {/* Current Form Data Preview */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Current Form Data:</h3>
                <pre className="text-xs text-gray-600 overflow-x-auto">
                    {JSON.stringify(formData, null, 2)}
                </pre>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                    <strong>Instructions:</strong>
                    <br />1. Open browser console (F12) to see debug logs
                    <br />2. Submit the form and check API calls
                    <br />3. Form data is auto-converted to backend format
                    <br />4. Check toast notifications for success/error
                </p>
            </div>
        </div>
    );
}
