'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

// Booking status type
type BookingStatus = 'pending' | 'confirmed' | 'consulted' | 'cancelled';

// Booking interface (using _id for MongoDB)
interface Booking {
    _id: string;
    customerName: string;
    phone: string;
    consultationDate: string;
    consultationTime: string;
    requirements?: string;
    status: BookingStatus;
    createdAt: string;
    updatedAt: string;
}

// Form data interface for booking
interface BookingFormData {
    customerName: string;
    phone: string;
    consultationDate: string;
    consultationTime: string;
    requirements: string;
    status: BookingStatus;
}

// Status options
const statusOptions: { value: BookingStatus | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'Tất cả', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Chưa liên hệ', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
    { value: 'consulted', label: 'Đã tư vấn', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Hủy', color: 'bg-red-100 text-red-800' },
];

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<BookingFormData>({
        customerName: '',
        phone: '',
        consultationDate: '',
        consultationTime: '',
        requirements: '',
        status: 'pending'
    });
    const itemsPerPage = 10;

    // API functions
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (debouncedSearchTerm.trim()) params.append('search', debouncedSearchTerm.trim());

            const response = await fetch(`/api/bookings?${params.toString()}`);
            const result = await response.json();

            if (result.success) {
                setBookings(result.data);
                setFilteredBookings(result.data);
            } else {
                throw new Error(result.error || 'Failed to fetch bookings');
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError(error instanceof Error ? error.message : 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, debouncedSearchTerm]);

    const createBooking = async (bookingData: BookingFormData) => {
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();

            if (result.success) {
                await fetchBookings(); // Refresh the list
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to create booking');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    };

    const updateBooking = async (id: string, bookingData: Partial<Booking>) => {
        try {
            const response = await fetch(`/api/bookings/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            const result = await response.json();

            if (result.success) {
                await fetchBookings(); // Refresh the list
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to update booking');
            }
        } catch (error) {
            console.error('Error updating booking:', error);
            throw error;
        }
    };

    const deleteBooking = async (id: string) => {
        try {
            const response = await fetch(`/api/bookings/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                await fetchBookings(); // Refresh the list
            } else {
                throw new Error(result.error || 'Failed to delete booking');
            }
        } catch (error) {
            console.error('Error deleting booking:', error);
            throw error;
        }
    };

    // Load bookings on mount and when filters change
    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Client-side filtering is no longer needed as API handles it
    useEffect(() => {
        setFilteredBookings(bookings);
    }, [bookings]);

    // Pagination
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle status change
    const handleStatusChange = async (bookingId: string, newStatus: BookingStatus) => {
        setLoading(true);
        try {
            await updateBooking(bookingId, { status: newStatus });
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật trạng thái');
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.customerName.trim() || !formData.phone.trim() ||
            !formData.consultationDate || !formData.consultationTime) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setLoading(true);
        try {
            if (editingBooking) {
                // Update existing booking
                await updateBooking(editingBooking._id, formData);
            } else {
                // Create new booking
                await createBooking(formData);
            }
            handleCloseModal();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    // Handle opening modal for new booking
    const handleAddNew = () => {
        setEditingBooking(null);
        setFormData({
            customerName: '',
            phone: '',
            consultationDate: '',
            consultationTime: '',
            requirements: '',
            status: 'pending'
        });
        setIsModalOpen(true);
    };

    // Handle opening modal for editing
    const handleEdit = (booking: Booking) => {
        setEditingBooking(booking);
        setFormData({
            customerName: booking.customerName,
            phone: booking.phone,
            consultationDate: booking.consultationDate,
            consultationTime: booking.consultationTime,
            requirements: booking.requirements || '',
            status: booking.status
        });
        setIsModalOpen(true);
    };

    // Handle closing modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBooking(null);
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await deleteBooking(id);
            setDeleteConfirmId(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa');
        } finally {
            setLoading(false);
        }
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
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center mb-2">
                            <svg className="w-8 h-8 text-rose-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch hẹn tư vấn</h1>
                        </div>
                        <p className="text-gray-600">Danh sách các lịch hẹn tư vấn cưới từ khách hàng</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        disabled={loading}
                        className="bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>{loading ? 'Đang xử lý...' : 'Thêm lịch hẹn'}</span>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex">
                            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-red-800">Có lỗi xảy ra</h3>
                                <p className="text-sm text-red-700 mt-1">{error}</p>
                                <button
                                    onClick={fetchBookings}
                                    className="text-sm text-red-600 hover:text-red-500 mt-2 underline"
                                >
                                    Thử lại
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                        <p className="text-gray-600 mt-2">Đang tải...</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {statusOptions.slice(1).map((status) => {
                        const count = bookings.filter(booking => booking.status === status.value).length;
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
                                        <tr key={booking._id} className="hover:bg-gray-50 transition-colors duration-150">
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
                                                <div className="text-sm text-gray-600 max-w-xs truncate" title={booking.requirements || 'Không có yêu cầu'}>
                                                    {booking.requirements || 'Không có yêu cầu'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                                                    {statusDisplay.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(booking)}
                                                        disabled={loading}
                                                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(booking._id)}
                                                        disabled={loading}
                                                        className="text-red-600 hover:text-red-900 disabled:opacity-50 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                    <select
                                                        value={booking.status}
                                                        onChange={(e) => handleStatusChange(booking._id, e.target.value as BookingStatus)}
                                                        disabled={loading}
                                                        className="text-sm border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                                                    >
                                                        {statusOptions.slice(1).map((option) => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
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
                            <p className="text-gray-600 mb-4">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Không tìm thấy lịch hẹn nào phù hợp với bộ lọc hiện tại.'
                                    : 'Chưa có lịch hẹn tư vấn nào. Hãy thêm lịch hẹn đầu tiên!'
                                }
                            </p>
                            {(!searchTerm && statusFilter === 'all') && (
                                <button
                                    onClick={handleAddNew}
                                    className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300 inline-flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Thêm lịch hẹn đầu tiên</span>
                                </button>
                            )}
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

                {/* Add/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
                            {/* Modal Header - Fixed */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingBooking ? 'Chỉnh sửa lịch hẹn' : 'Thêm lịch hẹn mới'}
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-6">
                                    {/* Customer Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
                                                Tên khách hàng *
                                            </label>
                                            <input
                                                type="text"
                                                id="customerName"
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="Nguyễn Văn A"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Số điện thoại *
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="0901234567"
                                            />
                                        </div>
                                    </div>

                                    {/* Consultation Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="consultationDate" className="block text-sm font-medium text-gray-700 mb-2">
                                                Ngày tư vấn *
                                            </label>
                                            <input
                                                type="date"
                                                id="consultationDate"
                                                value={formData.consultationDate}
                                                onChange={(e) => setFormData({ ...formData, consultationDate: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="consultationTime" className="block text-sm font-medium text-gray-700 mb-2">
                                                Giờ tư vấn *
                                            </label>
                                            <input
                                                type="time"
                                                id="consultationTime"
                                                value={formData.consultationTime}
                                                onChange={(e) => setFormData({ ...formData, consultationTime: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                            Trạng thái
                                        </label>
                                        <select
                                            id="status"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as BookingStatus })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                        >
                                            {statusOptions.slice(1).map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                                            Yêu cầu tư vấn
                                        </label>
                                        <textarea
                                            id="requirements"
                                            value={formData.requirements}
                                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            placeholder="Mô tả chi tiết về yêu cầu tư vấn cưới..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer - Fixed */}
                            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={loading}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:bg-gray-400 transition-colors duration-300 flex items-center space-x-2"
                                >
                                    {loading && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    )}
                                    <span>{loading ? 'Đang xử lý...' : (editingBooking ? 'Cập nhật' : 'Thêm mới')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteConfirmId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-md w-full">
                            <div className="p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
                                        <p className="text-gray-600 mt-1">Bạn có chắc chắn muốn xóa lịch hẹn này không? Hành động này không thể hoàn tác.</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end space-x-4">
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        disabled={loading}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-300"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={() => handleDelete(deleteConfirmId)}
                                        disabled={loading}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors duration-300 flex items-center space-x-2"
                                    >
                                        {loading && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        )}
                                        <span>{loading ? 'Đang xóa...' : 'Xóa'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
