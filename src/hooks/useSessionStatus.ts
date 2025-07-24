'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface SessionStatus {
    isValid: boolean;
    timeRemaining: number;
    timeRemainingMinutes: number;
    nextRefreshIn: string;
    error?: string;
}

export function useSessionStatus() {
    const { data: session } = useSession();
    const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
    const [loading, setLoading] = useState(false);

    const checkSession = async () => {
        if (!session) {
            setSessionStatus(null);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/auth/session-check', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for session
            });
            const data = await response.json();

            console.log('Session check response:', {
                ok: response.ok,
                status: response.status,
                data
            });

            if (response.ok) {
                setSessionStatus({
                    isValid: data.tokenStatus.accessTokenValid,
                    timeRemaining: data.session.timeRemaining,
                    timeRemainingMinutes: data.tokenStatus.timeRemainingMinutes,
                    nextRefreshIn: data.tokenStatus.nextRefreshIn,
                });
            } else {
                setSessionStatus({
                    isValid: false,
                    timeRemaining: 0,
                    timeRemainingMinutes: 0,
                    nextRefreshIn: 'Expired',
                    error: data.error,
                });
            }
        } catch (error) {
            console.error('Session check failed:', error);
            setSessionStatus({
                isValid: false,
                timeRemaining: 0,
                timeRemainingMinutes: 0,
                nextRefreshIn: 'Error',
                error: 'Network error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            checkSession();
            // Check session status every 30 seconds
            const interval = setInterval(checkSession, 30000);
            return () => clearInterval(interval);
        }
    }, [session]);

    return { sessionStatus, loading, refetch: checkSession };
}
