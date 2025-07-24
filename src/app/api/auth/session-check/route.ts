import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        console.log('Session check - session:', session ? 'Found' : 'Not found');
        if (session) {
            console.log('Session expires:', session.expires);
            console.log('Session error:', session.error);
        }

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

        // If session.expires is undefined, calculate based on session maxAge (30 minutes)
        let sessionExpiry: number;
        if (session.expires) {
            sessionExpiry = new Date(session.expires).getTime();
        } else {
            // Fallback: assume session was created recently and expires in 30 minutes
            // This is not ideal but better than NaN
            sessionExpiry = now + (30 * 60 * 1000); // 30 minutes from now
        }

        const timeRemaining = Math.max(0, sessionExpiry - now);
        const isValid = timeRemaining > 0 && !session.error;

        console.log('Session expires field:', session.expires);
        console.log('Calculated session expiry:', new Date(sessionExpiry));
        console.log('Time remaining:', timeRemaining, 'ms');
        console.log('Is valid:', isValid);

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
                nextRefreshIn: timeRemaining > 1800000 ? '~30 minutes' : 'Soon', // 30 min = 1800000ms
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
