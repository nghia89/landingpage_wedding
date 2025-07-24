'use client';

import React, { createContext, useContext, useState } from 'react';
import { Promotion, Service, Booking, Contact } from '@/types/api';

interface MockData {
    promotions: Promotion[];
    services: Service[];
    bookings: Booking[];
    contacts: Contact[];
}

interface MockApiContextType {
    mockData: MockData;
    setMockData: (data: Partial<MockData>) => void;
    isEnabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

const MockApiContext = createContext<MockApiContextType | undefined>(undefined);

// Mock data mẫu
const defaultMockData: MockData = {
    promotions: [
        {
            _id: '1',
            title: 'Ưu đãi cưới mùa xuân',
            description: 'Giảm 20% cho gói cưới hoàn hảo',
            discount: 20,
            discountType: 'percentage' as const,
            validFrom: '2024-03-01',
            validTo: '2024-05-31',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            _id: '2',
            title: 'Combo trang trí + chụp ảnh',
            description: 'Tiết kiệm 15% khi đặt combo',
            discount: 15,
            discountType: 'percentage' as const,
            validFrom: '2024-01-01',
            validTo: '2024-12-31',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    services: [],
    bookings: [],
    contacts: []
};

export function MockApiProvider({ children }: { children: React.ReactNode }) {
    const [mockData, setMockDataState] = useState<MockData>(defaultMockData);
    const [isEnabled, setEnabled] = useState(false);

    const setMockData = (data: Partial<MockData>) => {
        setMockDataState(prev => ({ ...prev, ...data }));
    };

    return (
        <MockApiContext.Provider value={{
            mockData,
            setMockData,
            isEnabled,
            setEnabled
        }}>
            {children}
        </MockApiContext.Provider>
    );
}

export function useMockApi() {
    const context = useContext(MockApiContext);
    if (context === undefined) {
        throw new Error('useMockApi must be used within a MockApiProvider');
    }
    return context;
}

// Component để toggle mock mode
export function MockApiToggle() {
    const { isEnabled, setEnabled } = useMockApi();

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                onClick={() => setEnabled(!isEnabled)}
                className={`px-4 py-2 rounded-lg font-medium shadow-lg transition-colors ${isEnabled
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
            >
                {isEnabled ? '🟢 Mock API ON' : '🔴 Mock API OFF'}
            </button>
        </div>
    );
}
