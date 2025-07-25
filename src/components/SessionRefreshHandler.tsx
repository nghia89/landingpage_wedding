'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionRefreshHandler() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.error === "RefreshTokenExpired" || session?.error === "RefreshAccessTokenError") {
            // Both access and refresh tokens expired, or refresh failed
            signOut({
                callbackUrl: '/admin/login',
                redirect: true
            });
        }
    }, [session?.error, router]);

    // This component doesn't render anything
    return null;
}
