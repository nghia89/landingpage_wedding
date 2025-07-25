import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return <>{children}</>;
}