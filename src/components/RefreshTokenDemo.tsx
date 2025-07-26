'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function RefreshTokenDemo() {
    const { data: session, update } = useSession();
    const [isSimulating, setIsSimulating] = useState(false);

    const simulateTokenExpiry = async () => {
        setIsSimulating(true);

        // Force update session to trigger token check
        await update();

        // Simulate access token expiry by forcing a session refresh
        setTimeout(() => {
            setIsSimulating(false);
        }, 2000);
    };

    const forceLogout = () => {
        signOut({ callbackUrl: '/admin/login?error=session_expired' });
    };

    if (!session) return null;

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-3">
                🔄 Refresh Token Demo
            </h3>

            <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-gray-600">Current Status:</span>
                        <div className="flex items-center mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                                Active Session
                            </span>
                        </div>
                    </div>

                    <div>
                        <span className="text-gray-600">Session Strategy:</span>
                        <div className="text-blue-700 font-medium">JWT with Refresh</div>
                    </div>
                </div>

                <div className="border-t pt-3">
                    <div className="text-gray-600 mb-2">Token Configuration:</div>
                    <ul className="text-xs space-y-1 text-gray-500">
                        <li>• Access Token: 30 minutes</li>
                        <li>• Refresh Token: 7 days</li>
                        <li>• Auto-refresh: Enabled</li>
                        <li>• Error handling: Active</li>
                    </ul>
                </div>

                <div className="border-t pt-3 flex space-x-2">
                    <button
                        onClick={simulateTokenExpiry}
                        disabled={isSimulating}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isSimulating ? 'Testing...' : 'Test Refresh'}
                    </button>

                    <button
                        onClick={forceLogout}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                        Force Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
