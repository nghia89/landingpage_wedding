'use client';

import { useState } from 'react';
import PromotionsList from '@/components/PromotionsList';
import { MockApiProvider, MockApiToggle } from '@/components/MockApiProvider';

export default function ApiDebugPage() {
    const [limit, setLimit] = useState(6);
    const [showOnlyActive, setShowOnlyActive] = useState(true);
    const [key, setKey] = useState(0);

    return (
        <MockApiProvider>
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        API Debug & Test Page
                    </h1>

                    {/* Controls */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Limit
                                </label>
                                <select
                                    value={limit}
                                    onChange={(e) => setLimit(Number(e.target.value))}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                >
                                    <option value={3}>3</option>
                                    <option value={6}>6</option>
                                    <option value={9}>9</option>
                                    <option value={12}>12</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Show Active Only
                                </label>
                                <select
                                    value={showOnlyActive.toString()}
                                    onChange={(e) => setShowOnlyActive(e.target.value === 'true')}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Force Re-render
                                </label>
                                <button
                                    onClick={() => setKey(prev => prev + 1)}
                                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Re-render
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Open Console
                                </label>
                                <button
                                    onClick={() => {
                                        console.clear();
                                        console.log('🚀 Console cleared. Watch for API calls...');
                                    }}
                                    className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                >
                                    Clear Console
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600">
                            <p><strong>Instructions:</strong></p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>Open browser console (F12) to monitor API calls</li>
                                <li>Toggle the controls above and watch for excessive API calls</li>
                                <li>Use Mock API toggle to test without real backend</li>
                                <li>Re-render button forces component to re-mount</li>
                            </ul>
                        </div>
                    </div>

                    {/* Debug Info */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">Current State</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <strong>Limit:</strong> {limit}
                            </div>
                            <div>
                                <strong>Show Only Active:</strong> {showOnlyActive ? 'Yes' : 'No'}
                            </div>
                            <div>
                                <strong>Component Key:</strong> {key}
                            </div>
                            <div>
                                <strong>Timestamp:</strong> {new Date().toLocaleTimeString()}
                            </div>
                        </div>
                    </div>

                    {/* Promotions Component */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Promotions List</h2>
                        <PromotionsList
                            key={key}
                            limit={limit}
                            showOnlyActive={showOnlyActive}
                            className=""
                        />
                    </div>
                </div>

                {/* Mock API Toggle */}
                <MockApiToggle />
            </div>
        </MockApiProvider>
    );
}
