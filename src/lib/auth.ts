import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

export async function getSession() {
    return await getServerSession(authOptions);
}

export async function requireAuth() {
    const session = await getSession();

    if (!session) {
        throw new Error('Unauthorized');
    }

    return session;
}

export async function requireAdminAuth() {
    const session = await requireAuth();

    if ((session.user as any)?.role !== 'admin') {
        throw new Error('Forbidden: Admin access required');
    }

    return session;
}
