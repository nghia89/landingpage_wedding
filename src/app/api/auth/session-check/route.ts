import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized', message: 'No session found' },
                { status: 401 }
            );
        }

        if (session.error === 'RefreshTokenExpired') {
            return NextResponse.json(
                { error: 'RefreshTokenExpired', message: 'Refresh token has expired' },
                { status: 401 }
            );
        }

        if (session.error === 'RefreshAccessTokenError') {
            return NextResponse.json(
                { error: 'RefreshAccessTokenError', message: 'Error refreshing access token' },
                { status: 401 }
            );
        }

        // Calculate token expiry times
        const now = Date.now();

        // If session.expires is undefined, calculate based on session maxAge (1 day)
        let sessionExpiry: number;
        if (session.expires) {
            sessionExpiry = new Date(session.expires).getTime();
        } else {
            // Fallback: assume session was created recently and expires in 1 day
            // This is not ideal but better than NaN
            sessionExpiry = now + (24 * 60 * 60 * 1000); // 1 day from now
        }

        const timeRemaining = Math.max(0, sessionExpiry - now);
        const isValid = timeRemaining > 0 && !session.error;

        return NextResponse.json({
            success: true,
            session: {
                user: session.user,
                expires: session.expires,
                timeRemaining: Math.floor(timeRemaining / 1000), // in seconds
            },
            tokenStatus: {
                accessTokenValid: isValid,
                timeRemainingMinutes: Math.floor(timeRemaining / (1000 * 60)),
                timeRemainingDays: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
                nextRefreshIn: timeRemaining > 3600000 ? `~${Math.ceil(timeRemaining / (1000 * 60 * 60))} hours` : 'Soon', // 1 hour = 3600000ms
            }
        });
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to check session' },
            { status: 500 }
        );
    }
}
