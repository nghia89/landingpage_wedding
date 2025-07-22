'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Customer {
    id: string;
    fullName: string;
    phone: string;
    weddingDate: string;
    requirements: string;
    status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
    createdAt: string;
}

export default function AdminPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [stats, setStats] = useState({
        totalCustomers: 0,
        newRequests: 0,
        completedProjects: 0,
        revenue: '2.4M'
    });

    // Mock data - replace with actual API call
    useEffect(() => {
        const mockCustomers: Customer[] = [
            {
                id: '1',
                fullName: 'Nguyễn Văn An',
                phone: '0123456789',
                weddingDate: '2025-08-15',
                requirements: 'Cưới ngoài trời, khoảng 200 khách',
                status: 'new',
                createdAt: '2025-07-20',
            },
            {
                id: '2',
                fullName: 'Trần Thị Bình',
                phone: '0987654321',
                weddingDate: '2025-09-20',
                requirements: 'Gói cưới cao cấp, muốn trang trí hoa hồng',
                status: 'contacted',
                createdAt: '2025-07-18',
            },
            {
                id: '3',
                fullName: 'Lê Minh Cường',
                phone: '0369258147',
                weddingDate: '2025-10-10',
                requirements: 'Cưới trong nhà, 150 khách, phong cách hiện đại',
                status: 'in_progress',
                createdAt: '2025-07-15',
            },
            {
                id: '4',
                fullName: 'Phạm Thị Dung',
                phone: '0741852963',
                weddingDate: '2025-07-30',
                requirements: 'Cưới gấp, cần tư vấn ngay',
                status: 'completed',
                createdAt: '2025-07-10',
            },
            {
                id: '5',
                fullName: 'Hoàng Văn Em',
                phone: '0159753486',
                weddingDate: '2025-12-25',
                requirements: 'Cưới Giáng sinh, trang trí màu đỏ trắng',
                status: 'new',
                createdAt: '2025-07-22',
            },
        ];

        setCustomers(mockCustomers);
        setStats({
            totalCustomers: mockCustomers.length,
            newRequests: mockCustomers.filter(c => c.status === 'new').length,
            completedProjects: mockCustomers.filter(c => c.status === 'completed').length,
            revenue: '2.4M'
        });
    }, []);

    const getStatusColor = (status: string) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800',
            contacted: 'bg-yellow-100 text-yellow-800',
            in_progress: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            new: 'Mới',
            contacted: 'Đã liên hệ',
            in_progress: 'Đang xử lý',
            completed: 'Hoàn thành',
            cancelled: 'Hủy',
        };
        return labels[status as keyof typeof labels] || status;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const recentCustomers = customers.slice(0, 5); return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Tổng quan về hoạt động kinh doanh</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Yêu cầu mới</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.newRequests}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Dự án hoàn thành</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.completedProjects}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.revenue} VND</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Yêu cầu gần đây</h3>
                            <Link
                                href="/admin/customers"
                                className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                            >
                                Xem tất cả →
                            </Link>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentCustomers.map((customer) => (
                                    <div key={customer.id} className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{customer.fullName}</p>
                                            <p className="text-sm text-gray-600">{customer.phone}</p>
                                            <p className="text-xs text-gray-400">
                                                {customer.weddingDate ? `Cưới: ${formatDate(customer.weddingDate)}` : 'Chưa xác định ngày cưới'}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                                            {getStatusLabel(customer.status)}
                                        </span>
                                    </div>
                                ))}
                                {recentCustomers.length === 0 && (
                                    <p className="text-gray-500 text-sm text-center py-4">
                                        Chưa có yêu cầu nào
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Thống kê tuần này</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Khách hàng mới</span>
                                    <span className="font-semibold text-gray-900">+24</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Dự án hoàn thành</span>
                                    <span className="font-semibold text-gray-900">8</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Tỷ lệ chuyển đổi</span>
                                    <span className="font-semibold text-green-600">68%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Đánh giá trung bình</span>
                                    <div className="flex items-center">
                                        <span className="font-semibold text-gray-900 mr-1">4.8</span>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
