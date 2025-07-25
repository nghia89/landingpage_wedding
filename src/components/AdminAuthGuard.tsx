'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminAuthGuardProps {
    children: React.ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Still loading

        // Check for session errors (token expired)
        if (session?.error === "RefreshTokenExpired" || session?.error === "RefreshAccessTokenError") {
            signOut({
                callbackUrl: '/admin/login?error=session_expired',
                redirect: true
            });
            return;
        }

        if (!session) {
            router.push('/admin/login');
            return;
        }

        if ((session.user as any)?.role !== 'admin') {
            router.push('/admin/login?error=unauthorized');
            return;
        }
    }, [session, status, router]);

    // Show loading spinner while checking auth
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    // Show nothing while redirecting
    if (!session || (session.user as any)?.role !== 'admin' || session?.error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
            </div>
        );
    }

    // User is authenticated and is admin, show the page
    return <>{children}</>;
}
