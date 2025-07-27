'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface AdminAuthGuardProps {
    children: React.ReactNode;
}

interface ExtendedUser {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (status === 'loading') return; // Still loading

        const sessionUser = session?.user as ExtendedUser;

        // If no session or user is not admin, redirect to login
        if (!session || !sessionUser || sessionUser.role !== 'admin') {
            router.push('/admin/login');
            return;
        }

        setIsChecking(false);
    }, [session, status, router]);

    // Show loading while checking auth or redirecting
    if (status === 'loading' || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                    <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }

    const sessionUser = session?.user as ExtendedUser;

    // If user is not admin, show nothing (will redirect)
    if (!session || !sessionUser || sessionUser.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                    <p className="text-gray-600">Đang chuyển hướng...</p>
                </div>
            </div>
        );
    }

    // User is authenticated and is admin, show the page
    return <>{children}</>;
}