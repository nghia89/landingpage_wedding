'use client';

import { useSession } from 'next-auth/react';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import SessionDebug from './SessionDebug';

export default function TokenStatus() {
    const { data: session } = useSession();
    const { sessionStatus, loading } = useSessionStatus();

    if (!session || loading) return null;

    if (!sessionStatus) {
        return (
            <div className="text-xs text-gray-500 mt-1">
                <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1"></span>
                        Checking...
                    </span>
                </div>
            </div>
        );
    }

    const getStatusColor = () => {
        if (sessionStatus.error || !sessionStatus.isValid) return 'red';
        if (sessionStatus.timeRemainingMinutes < 5) return 'yellow';
        return 'green';
    };

    const statusColor = getStatusColor();
    const statusText = sessionStatus.isValid ? 'Active' : 'Expired';

    return (
        <div className="text-xs text-gray-500 mt-1">
            <SessionDebug />
            <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor === 'green' ? 'bg-green-100 text-green-800' :
                    statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1 ${statusColor === 'green' ? 'bg-green-400' :
                        statusColor === 'yellow' ? 'bg-yellow-400' :
                            'bg-red-400'
                        }`}></span>
                    {statusText}
                </span>
                <span>
                    {sessionStatus.isValid
                        ? `${sessionStatus.timeRemainingMinutes}m left`
                        : sessionStatus.error || 'Expired'
                    }
                </span>
            </div>
            {sessionStatus.isValid && (
                <div className="text-xs text-gray-400 mt-1">
                    Next refresh: {sessionStatus.nextRefreshIn}
                </div>
            )}
        </div>
    );
}
