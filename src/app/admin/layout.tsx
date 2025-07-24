import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin - Thư viện ảnh',
    description: 'Quản lý thư viện ảnh cho website wedding',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Admin Panel
                                </h1>
                            </div>

                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <a
                                    href="/admin/gallery"
                                    className="border-pink-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Thư viện ảnh
                                </a>
                                <a
                                    href="/review-test"
                                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Test Reviews
                                </a>
                                <a
                                    href="/"
                                    className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Về trang chủ
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
