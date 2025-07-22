'use client';

import { useState, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

// Booking status type
type BookingStatus = 'pending' | 'confirmed' | 'consulted' | 'cancelled';

// Booking interface
interface Booking {
    id: string;
    customerName: string;
    phone: string;
    consultationDate: string;
    consultationTime: string;
    requirements: string;
    status: BookingStatus;
    createdAt: string;
}

// Mock booking data
const mockBookings: Booking[] = [
    {
        id: '1',
        customerName: 'Trần Thị Hoa',
        phone: '0901234567',
        consultationDate: '2025-07-25',
        consultationTime: '14:00',
        requirements: 'Cần tư vấn về trang trí tiệc cưới ngoài trời, khoảng 150 khách',
        status: 'confirmed',
        createdAt: '2025-07-20T09:30:00'
    },
    {
        id: '2',
        customerName: 'Nguyễn Văn Minh',
        phone: '0912345678',
        consultationDate: '2025-07-26',
        consultationTime: '10:30',
        requirements: 'Muốn tổ chức tiệc cưới tại khách sạn 5 sao, khoảng 200 khách. Yêu cầu phong cách hiện đại',
        status: 'pending',
        createdAt: '2025-07-21T14:15:00'
    },
    {
        id: '3',
        customerName: 'Lê Thị Mai',
        phone: '0923456789',
        consultationDate: '2025-07-24',
        consultationTime: '16:00',
        requirements: 'Cưới truyền thống Việt Nam, cần tư vấn về lễ phục và nghi thức',
        status: 'consulted',
        createdAt: '2025-07-19T11:20:00'
    },
    {
        id: '4',
        customerName: 'Phạm Văn Đức',
        phone: '0934567890',
        consultationDate: '2025-07-28',
        consultationTime: '09:00',
        requirements: 'Tiệc cưới ven biển tại Đà Nẵng, khoảng 80 khách, phong cách boho chic',
        status: 'confirmed',
        createdAt: '2025-07-22T08:45:00'
    },
    {
        id: '5',
        customerName: 'Võ Thị Lan',
        phone: '0945678901',
        consultationDate: '2025-07-23',
        consultationTime: '11:30',
        requirements: 'Cần hủy lịch hẹn do có việc đột xuất',
        status: 'cancelled',
        createdAt: '2025-07-18T16:30:00'
    },
    {
        id: '6',
        customerName: 'Hoàng Thị Thu',
        phone: '0956789012',
        consultationDate: '2025-07-30',
        consultationTime: '15:30',
        requirements: 'Tư vấn về album cưới và chụp ảnh cưới tại studio',
        status: 'pending',
        createdAt: '2025-07-22T10:00:00'
    },
    {
        id: '7',
        customerName: 'Đặng Văn Hùng',
        phone: '0967890123',
        consultationDate: '2025-08-01',
        consultationTime: '13:00',
        requirements: 'Tiệc cưới sân vườn, phong cách rustic, khoảng 120 khách',
        status: 'confirmed',
        createdAt: '2025-07-21T09:15:00'
    },
    {
        id: '8',
        customerName: 'Bùi Thị Nga',
        phone: '0978901234',
        consultationDate: '2025-07-27',
        consultationTime: '14:30',
        requirements: 'Cưới tại nhà, cần tư vấn về trang trí và menu tiệc',
        status: 'consulted',
        createdAt: '2025-07-20T15:45:00'
    },
    {
        id: '9',
        customerName: 'Trịnh Văn Tài',
        phone: '0989012345',
        consultationDate: '2025-08-03',
        consultationTime: '10:00',
        requirements: 'Đám cưới phong cách Âu châu tại resort, khoảng 300 khách',
        status: 'pending',
        createdAt: '2025-07-22T13:20:00'
    },
    {
        id: '10',
        customerName: 'Ngô Thị Hương',
        phone: '0990123456',
        consultationDate: '2025-08-05',
        consultationTime: '16:30',
        requirements: 'Cưới minimalist, tông màu trắng - xanh mint, khoảng 100 khách',
        status: 'confirmed',
        createdAt: '2025-07-22T11:30:00'
    },
    {
        id: '11',
        customerName: 'Lý Văn Nam',
        phone: '0901234560',
        consultationDate: '2025-08-07',
        consultationTime: '09:30',
        requirements: 'Tiệc cưới ngoài trời tại farm, phong cách vintage',
        status: 'pending',
        createdAt: '2025-07-22T14:00:00'
    },
    {
        id: '12',
        customerName: 'Đỗ Thị Linh',
        phone: '0912345671',
        consultationDate: '2025-07-29',
        consultationTime: '11:00',
        requirements: 'Cần tư vấn về make-up và trang phục cô dâu',
        status: 'confirmed',
        createdAt: '2025-07-21T16:10:00'
    },
    {
        id: '13',
        customerName: 'Vũ Văn Quang',
        phone: '0923456782',
        consultationDate: '2025-08-02',
        consultationTime: '15:00',
        requirements: 'Đám cưới tại quê nhà, cần tư vấn về logistics và tổ chức',
        status: 'pending',
        createdAt: '2025-07-22T07:30:00'
    },
    {
        id: '14',
        customerName: 'Mai Thị Xuân',
        phone: '0934567893',
        consultationDate: '2025-07-31',
        consultationTime: '13:30',
        requirements: 'Tiệc cưới mùa đông, trang trí theme Christmas',
        status: 'consulted',
        createdAt: '2025-07-19T12:15:00'
    },
    {
        id: '15',
        customerName: 'Phan Văn Long',
        phone: '0945678904',
        consultationDate: '2025-08-04',
        consultationTime: '10:30',
        requirements: 'Cưới tại biệt thự riêng, phong cách luxury, khoảng 250 khách',
        status: 'confirmed',
        createdAt: '2025-07-22T09:45:00'
    }
];

// Status options
const statusOptions: { value: BookingStatus | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'Tất cả', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Chưa liên hệ', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
    { value: 'consulted', label: 'Đã tư vấn', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Hủy', color: 'bg-red-100 text-red-800' },
];

export default function BookingsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter bookings based on search term and status
    const filteredBookings = useMemo(() => {
        let filtered = mockBookings;

        // Filter by search term (name or phone)
        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.phone.includes(searchTerm)
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        return filtered;
    }, [searchTerm, statusFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle status change
    const handleStatusChange = (bookingId: string, newStatus: BookingStatus) => {
        // In a real app, this would update the database
        console.log(`Changing booking ${bookingId} status to ${newStatus}`);
    };

    // Get status display
    const getStatusDisplay = (status: BookingStatus) => {
        const statusOption = statusOptions.find(option => option.value === status);
        return statusOption || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    // Format date and time
    const formatDateTime = (date: string, time: string) => {
        const dateObj = new Date(date);
        const dateStr = dateObj.toLocaleDateString('vi-VN');
        return `${dateStr} lúc ${time}`;
    };

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-2">
                        <svg className="w-8 h-8 text-rose-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch hẹn tư vấn</h1>
                    </div>
                    <p className="text-gray-600">Danh sách các lịch hẹn tư vấn cưới từ khách hàng</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {statusOptions.slice(1).map((status) => {
                        const count = mockBookings.filter(booking => booking.status === status.value).length;
                        return (
                            <div key={status.value} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full ${status.color} mr-3`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{status.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo tên hoặc SĐT..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors duration-300"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <div className="lg:w-64">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors duration-300 bg-white"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Table Header */}
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Danh sách lịch hẹn ({filteredBookings.length})
                        </h3>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Số điện thoại
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày giờ hẹn
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Yêu cầu
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {paginatedBookings.map((booking) => {
                                    const statusDisplay = getStatusDisplay(booking.status);
                                    return (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {booking.customerName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900 font-mono">
                                                    {booking.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {formatDateTime(booking.consultationDate, booking.consultationTime)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-600 max-w-xs truncate" title={booking.requirements}>
                                                    {booking.requirements}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                                                    {statusDisplay.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                                                    className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors duration-300"
                                                >
                                                    {statusOptions.slice(1).map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {paginatedBookings.length === 0 && (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch hẹn</h3>
                            <p className="text-gray-600">Không tìm thấy lịch hẹn nào phù hợp với bộ lọc hiện tại.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredBookings.length)} trong {filteredBookings.length} kết quả
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-300"
                                    >
                                        Trước
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`px-3 py-1 border rounded-lg text-sm transition-colors duration-300 ${currentPage === i + 1
                                                ? 'bg-rose-600 text-white border-rose-600'
                                                : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-300"
                                    >
                                        Sau
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
