'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

// Appointment interface (using _id for MongoDB)
interface Appointment {
    _id: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    appointmentDate: string;
    appointmentTime: string;
    duration: number; // in minutes
    type: 'consultation' | 'venue_visit' | 'contract_signing' | 'follow_up';
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    notes?: string;
    location: string;
    createdAt: string;
    updatedAt: string;
}

// Form data interface
interface AppointmentFormData {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    appointmentDate: string;
    appointmentTime: string;
    duration: number;
    type: 'consultation' | 'venue_visit' | 'contract_signing' | 'follow_up';
    location: string;
    notes: string;
}

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<AppointmentFormData>({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        appointmentDate: '',
        appointmentTime: '',
        duration: 60,
        type: 'consultation',
        location: 'Showroom chính',
        notes: ''
    });

    // API functions
    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (typeFilter !== 'all') params.append('type', typeFilter);
            if (dateFilter) params.append('date', dateFilter);
            if (debouncedSearchQuery.trim()) params.append('search', debouncedSearchQuery.trim());

            const response = await fetch(`/api/appointments?${params.toString()}`);
            const result = await response.json();

            if (result.success) {
                setAppointments(result.data);
                setFilteredAppointments(result.data);
            } else {
                throw new Error(result.error || 'Failed to fetch appointments');
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError(error instanceof Error ? error.message : 'Failed to load appointments');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, typeFilter, dateFilter, debouncedSearchQuery]);

    const createAppointment = async (appointmentData: AppointmentFormData) => {
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            const result = await response.json();

            if (result.success) {
                await fetchAppointments(); // Refresh the list
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to create appointment');
            }
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    };

    const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
        try {
            const response = await fetch(`/api/appointments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            });

            const result = await response.json();

            if (result.success) {
                await fetchAppointments(); // Refresh the list
                return result.data;
            } else {
                throw new Error(result.error || 'Failed to update appointment');
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
            throw error;
        }
    };

    const deleteAppointment = async (id: string) => {
        try {
            const response = await fetch(`/api/appointments/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                await fetchAppointments(); // Refresh the list
            } else {
                throw new Error(result.error || 'Failed to delete appointment');
            }
        } catch (error) {
            console.error('Error deleting appointment:', error);
            throw error;
        }
    };

    // Load appointments on mount and when filters change
    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Client-side filtering is no longer needed as API handles it
    useEffect(() => {
        setFilteredAppointments(appointments);
    }, [appointments]);

    // Format date and time
    const formatDateTime = (date: string, time: string) => {
        const dateObj = new Date(`${date}T${time}`);
        return {
            date: dateObj.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
            time: dateObj.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            dayOfWeek: dateObj.toLocaleDateString('vi-VN', {
                weekday: 'long'
            })
        };
    };

    // Get status display
    const getStatusDisplay = (status: string) => {
        const statuses = {
            scheduled: { label: 'Đã lên lịch', color: 'bg-blue-100 text-blue-800' },
            confirmed: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-800' },
            completed: { label: 'Hoàn thành', color: 'bg-gray-100 text-gray-800' },
            cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
            no_show: { label: 'Không đến', color: 'bg-yellow-100 text-yellow-800' }
        };
        return statuses[status as keyof typeof statuses] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    // Get type display
    const getTypeDisplay = (type: string) => {
        const types = {
            consultation: { label: 'Tư vấn', color: 'bg-purple-100 text-purple-800' },
            venue_visit: { label: 'Xem địa điểm', color: 'bg-indigo-100 text-indigo-800' },
            contract_signing: { label: 'Ký hợp đồng', color: 'bg-emerald-100 text-emerald-800' },
            follow_up: { label: 'Theo dõi', color: 'bg-orange-100 text-orange-800' }
        };
        return types[type as keyof typeof types] || { label: type, color: 'bg-gray-100 text-gray-800' };
    };

    // Handle form submission
    const handleSubmit = async () => {
        // Validate required fields
        if (!formData.customerName.trim() || !formData.customerPhone.trim() ||
            !formData.appointmentDate || !formData.appointmentTime) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setLoading(true);
        try {
            if (editingAppointment) {
                // Update existing appointment
                await updateAppointment(editingAppointment._id, formData);
            } else {
                // Create new appointment
                await createAppointment(formData);
            }
            handleCloseModal();
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    // Handle opening modal for new appointment
    const handleAddNew = () => {
        setEditingAppointment(null);
        setFormData({
            customerName: '',
            customerPhone: '',
            customerEmail: '',
            appointmentDate: '',
            appointmentTime: '',
            duration: 60,
            type: 'consultation',
            location: 'Showroom chính',
            notes: ''
        });
        setIsModalOpen(true);
    };

    // Handle opening modal for editing
    const handleEdit = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setFormData({
            customerName: appointment.customerName,
            customerPhone: appointment.customerPhone,
            customerEmail: appointment.customerEmail || '',
            appointmentDate: appointment.appointmentDate,
            appointmentTime: appointment.appointmentTime,
            duration: appointment.duration,
            type: appointment.type,
            location: appointment.location,
            notes: appointment.notes || ''
        });
        setIsModalOpen(true);
    };

    // Handle closing modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAppointment(null);
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await deleteAppointment(id);
            setDeleteConfirmId(null);
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa');
        } finally {
            setLoading(false);
        }
    };

    // Handle status change
    const handleStatusChange = async (id: string, newStatus: string) => {
        setLoading(true);
        try {
            await updateAppointment(id, { status: newStatus as any });
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Có lỗi xảy ra khi cập nhật trạng thái');
        } finally {
            setLoading(false);
        }
    };

    // Handle view details
    const handleViewDetails = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setIsDetailModalOpen(true);
    };

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center mb-2">
                            <svg className="w-8 h-8 text-rose-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-4 8v4m0-4a6 6 0 100-12 6 6 0 000 12z" />
                            </svg>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch hẹn</h1>
                        </div>
                        <p className="text-gray-600">Quản lý các cuộc hẹn tư vấn với khách hàng</p>
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
                                    onClick={fetchAppointments}
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
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8v2a2 2 0 002 2h4a2 2 0 002-2v-2M8 7a6 6 0 108 0M8 7v4m8-4v4" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Tổng lịch hẹn</p>
                                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đã xác nhận</p>
                                <p className="text-2xl font-bold text-gray-900">{appointments.filter(a => a.status === 'confirmed').length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Chờ xác nhận</p>
                                <p className="text-2xl font-bold text-gray-900">{appointments.filter(a => a.status === 'scheduled').length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                                <p className="text-2xl font-bold text-gray-900">{appointments.filter(a => a.status === 'completed').length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Đã hủy/Vắng</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {appointments.filter(a => a.status === 'cancelled' || a.status === 'no_show').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <input
                                type="text"
                                id="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                placeholder="Tên khách hàng, số điện thoại..."
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái
                            </label>
                            <select
                                id="status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            >
                                <option value="all">Tất cả</option>
                                <option value="scheduled">Đã lên lịch</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                                <option value="no_show">Không đến</option>
                            </select>
                        </div>

                        {/* Type Filter */}
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                Loại hẹn
                            </label>
                            <select
                                id="type"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            >
                                <option value="all">Tất cả</option>
                                <option value="consultation">Tư vấn</option>
                                <option value="venue_visit">Xem địa điểm</option>
                                <option value="contract_signing">Ký hợp đồng</option>
                                <option value="follow_up">Theo dõi</option>
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày hẹn
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Appointments Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày & Giờ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Loại hẹn
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Địa điểm
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAppointments.map((appointment) => {
                                    const dateTime = formatDateTime(appointment.appointmentDate, appointment.appointmentTime);
                                    return (
                                        <tr key={appointment._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {appointment.customerName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {appointment.customerPhone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {dateTime.date}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {dateTime.time} ({appointment.duration}p)
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeDisplay(appointment.type).color}`}>
                                                    {getTypeDisplay(appointment.type).label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {appointment.location}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={appointment.status}
                                                    onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                                                    disabled={loading}
                                                    className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-rose-500 disabled:opacity-50 ${getStatusDisplay(appointment.status).color}`}
                                                >
                                                    <option value="scheduled">Đã lên lịch</option>
                                                    <option value="confirmed">Đã xác nhận</option>
                                                    <option value="completed">Hoàn thành</option>
                                                    <option value="cancelled">Đã hủy</option>
                                                    <option value="no_show">Không đến</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewDetails(appointment)}
                                                        disabled={loading}
                                                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="Xem chi tiết"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(appointment)}
                                                        disabled={loading}
                                                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(appointment._id)}
                                                        disabled={loading}
                                                        className="text-red-600 hover:text-red-900 disabled:opacity-50 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredAppointments.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 8v2a2 2 0 002 2h4a2 2 0 002-2v-2M8 7a6 6 0 108 0M8 7v4m8-4v4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lịch hẹn</h3>
                        <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo lịch hẹn đầu tiên.</p>
                    </div>
                )}

                {/* Add/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
                            {/* Modal Header - Fixed */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingAppointment ? 'Chỉnh sửa lịch hẹn' : 'Thêm lịch hẹn mới'}
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
                                                placeholder="Nguyễn Văn A & Trần Thị B"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                                                Số điện thoại *
                                            </label>
                                            <input
                                                type="tel"
                                                id="customerPhone"
                                                value={formData.customerPhone}
                                                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="0901234567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email (tùy chọn)
                                        </label>
                                        <input
                                            type="email"
                                            id="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            placeholder="email@example.com"
                                        />
                                    </div>

                                    {/* Appointment Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-2">
                                                Ngày hẹn *
                                            </label>
                                            <input
                                                type="date"
                                                id="appointmentDate"
                                                value={formData.appointmentDate}
                                                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-2">
                                                Giờ hẹn *
                                            </label>
                                            <input
                                                type="time"
                                                id="appointmentTime"
                                                value={formData.appointmentTime}
                                                onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                                                Thời gian (phút)
                                            </label>
                                            <select
                                                id="duration"
                                                value={formData.duration}
                                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            >
                                                <option value={30}>30 phút</option>
                                                <option value={45}>45 phút</option>
                                                <option value={60}>60 phút</option>
                                                <option value={90}>90 phút</option>
                                                <option value={120}>120 phút</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                                Loại hẹn *
                                            </label>
                                            <select
                                                id="type"
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            >
                                                <option value="consultation">Tư vấn</option>
                                                <option value="venue_visit">Xem địa điểm</option>
                                                <option value="contract_signing">Ký hợp đồng</option>
                                                <option value="follow_up">Theo dõi</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                                Địa điểm *
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                placeholder="Showroom chính"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                            Ghi chú
                                        </label>
                                        <textarea
                                            id="notes"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                            placeholder="Ghi chú về cuộc hẹn..."
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
                                    <span>{loading ? 'Đang xử lý...' : (editingAppointment ? 'Cập nhật' : 'Thêm mới')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detail Modal */}
                {isDetailModalOpen && selectedAppointment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
                            {/* Modal Header - Fixed */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900">Chi tiết lịch hẹn</h3>
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Customer Info */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Thông tin khách hàng</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Tên khách hàng</label>
                                            <p className="mt-1 text-sm text-gray-900">{selectedAppointment.customerName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                <a href={`tel:${selectedAppointment.customerPhone}`} className="text-rose-600 hover:text-rose-700">
                                                    {selectedAppointment.customerPhone}
                                                </a>
                                            </p>
                                        </div>
                                        {selectedAppointment.customerEmail && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                                <p className="mt-1 text-sm text-gray-900">
                                                    <a href={`mailto:${selectedAppointment.customerEmail}`} className="text-rose-600 hover:text-rose-700">
                                                        {selectedAppointment.customerEmail}
                                                    </a>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Appointment Info */}
                                <div className="bg-rose-50 rounded-lg p-4">
                                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Thông tin cuộc hẹn</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Ngày & Giờ</label>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {formatDateTime(selectedAppointment.appointmentDate, selectedAppointment.appointmentTime).date} - {formatDateTime(selectedAppointment.appointmentDate, selectedAppointment.appointmentTime).time}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Thời gian</label>
                                            <p className="mt-1 text-sm text-gray-900">{selectedAppointment.duration} phút</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Loại hẹn</label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeDisplay(selectedAppointment.type).color}`}>
                                                {getTypeDisplay(selectedAppointment.type).label}
                                            </span>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600">Trạng thái</label>
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusDisplay(selectedAppointment.status).color}`}>
                                                {getStatusDisplay(selectedAppointment.status).label}
                                            </span>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600">Địa điểm</label>
                                            <p className="mt-1 text-sm text-gray-900">{selectedAppointment.location}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedAppointment.notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Ghi chú</label>
                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedAppointment.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer - Fixed */}
                            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDetailModalOpen(false);
                                        handleEdit(selectedAppointment);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-md hover:bg-rose-700 transition-colors"
                                >
                                    Chỉnh sửa
                                </button>
                                <a
                                    href={`tel:${selectedAppointment.customerPhone}`}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Gọi ngay
                                </a>
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa</h3>
                                        <p className="text-sm text-gray-500">Bạn có chắc chắn muốn xóa lịch hẹn này?</p>
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
                                        onClick={() => handleDelete(deleteConfirmId!)}
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
