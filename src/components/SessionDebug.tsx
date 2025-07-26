'use client';

import { useSession } from 'next-auth/react';

export default function SessionDebug() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div className="text-xs text-gray-500">Loading session...</div>;
    }

    return (
        <div className="bg-gray-100 p-2 rounded text-xs space-y-1">
            <div><strong>Status:</strong> {status}</div>
            <div><strong>Session:</strong> {session ? 'Yes' : 'No'}</div>
            {session && (
                <>
                    <div><strong>User:</strong> {session.user?.email}</div>
                    <div><strong>Role:</strong> {(session.user as any)?.role}</div>
                    <div><strong>Expires:</strong> {session.expires}</div>
                    <div><strong>Error:</strong> {(session as any)?.error || 'None'}</div>
                </>
            )}
        </div>
    );
}
