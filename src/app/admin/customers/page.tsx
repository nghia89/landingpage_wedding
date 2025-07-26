'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import CustomerDetailModal from '@/components/admin/CustomerDetailModal';
import { useState, useEffect } from 'react';

interface Customer {
    id: string;
    fullName: string;
    phone: string;
    weddingDate: string;
    requirements: string;
    status: 'new' | 'contacted' | 'deposited' | 'in_progress' | 'completed' | 'cancelled';
    createdAt: string;
    email?: string;
    guestCount?: number;
    budget?: string;
    venue?: string;
    notes?: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Pagination info from API
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Form data for adding new customer
    const [newCustomerForm, setNewCustomerForm] = useState({
        fullName: '',
        phone: '',
        email: '',
        weddingDate: '',
        requirements: '',
        guestCount: '',
        budget: '',
        venue: '',
        notes: ''
    });

    const statusOptions = [
        { value: 'all', label: 'Tất cả', color: 'gray' },
        { value: 'new', label: 'Mới', color: 'blue' },
        { value: 'contacted', label: 'Đã liên hệ', color: 'yellow' },
        { value: 'deposited', label: 'Đã đặt cọc', color: 'orange' },
        { value: 'in_progress', label: 'Đang xử lý', color: 'purple' },
        { value: 'completed', label: 'Hoàn thành', color: 'green' },
        { value: 'cancelled', label: 'Hủy', color: 'red' },
    ];

    const getStatusColor = (status: string) => {
        const colors = {
            new: 'bg-blue-100 text-blue-800',
            contacted: 'bg-yellow-100 text-yellow-800',
            deposited: 'bg-orange-100 text-orange-800',
            in_progress: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    // Fetch customers from API with pagination and filtering
    const fetchCustomers = async () => {
        try {
            setLoading(true);

            // Build query parameters
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
            });

            // Add filters if they exist
            if (selectedStatus !== 'all') {
                params.append('status', selectedStatus);
            }

            if (debouncedSearchTerm.trim()) {
                params.append('search', debouncedSearchTerm.trim());
            }

            const response = await fetch(`/api/customers?${params.toString()}`);
            const result = await response.json();

            if (result.success) {
                // Convert MongoDB _id to id for frontend compatibility
                const customersWithId = result.data.map((customer: any) => ({
                    ...customer,
                    id: customer._id,
                }));

                setCustomers(customersWithId);
                setTotalPages(result.pagination.totalPages);
                setTotalCount(result.pagination.totalCount);
            } else {
                console.error('Failed to fetch customers:', result.error);
                alert('Không thể tải danh sách khách hàng. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            alert('Lỗi kết nối. Vui lòng kiểm tra internet và thử lại!');
        } finally {
            setLoading(false);
        }
    };

    // Fetch customers when page, filters, or search changes
    useEffect(() => {
        fetchCustomers();
    }, [currentPage, itemsPerPage, selectedStatus, debouncedSearchTerm]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedStatus, debouncedSearchTerm, itemsPerPage]);    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleStatusChange = async (customerId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/customers/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const result = await response.json();

            if (result.success) {
                // Refresh the customer list to get updated data
                fetchCustomers();
            } else {
                console.error('Failed to update customer status:', result.error);
                alert('Không thể cập nhật trạng thái. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Error updating customer status:', error);
            alert('Lỗi kết nối. Vui lòng kiểm tra internet và thử lại!');
        }
    };

    const handleViewDetails = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    // Handle opening add customer modal
    const handleAddCustomer = () => {
        setIsAddModalOpen(true);
    };

    // Handle closing add customer modal
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setNewCustomerForm({
            fullName: '',
            phone: '',
            email: '',
            weddingDate: '',
            requirements: '',
            guestCount: '',
            budget: '',
            venue: '',
            notes: ''
        });
    };

    // Handle form input changes
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewCustomerForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle adding new customer
    const handleSubmitNewCustomer = async () => {
        // Validate required fields
        if (!newCustomerForm.fullName.trim() || !newCustomerForm.phone.trim() || !newCustomerForm.email.trim()) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Số điện thoại, Email)');
            return;
        }

        try {
            const newCustomerData = {
                fullName: newCustomerForm.fullName,
                phone: newCustomerForm.phone,
                email: newCustomerForm.email,
                weddingDate: newCustomerForm.weddingDate,
                requirements: newCustomerForm.requirements,
                guestCount: newCustomerForm.guestCount ? parseInt(newCustomerForm.guestCount) : undefined,
                budget: newCustomerForm.budget || undefined,
                venue: newCustomerForm.venue || undefined,
                notes: newCustomerForm.notes || undefined
            };

            const response = await fetch('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCustomerData),
            });

            const result = await response.json();

            if (result.success) {
                handleCloseAddModal();
                alert('Thêm khách hàng thành công!');
                // Refresh the customer list
                fetchCustomers();
            } else {
                console.error('Failed to create customer:', result.error);
                alert('Không thể thêm khách hàng. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Error creating customer:', error);
            alert('Lỗi kết nối. Vui lòng kiểm tra internet và thử lại!');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Khách hàng</h1>
                        <p className="text-gray-600">Quản lý yêu cầu tư vấn cưới từ khách hàng</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center gap-3">
                        <span className="bg-rose-100 text-rose-800 text-sm font-medium px-3 py-1 rounded-full">
                            {totalCount} khách hàng
                        </span>
                        <button
                            onClick={handleAddCustomer}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Thêm khách hàng
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <input
                                type="text"
                                id="search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm theo họ tên hoặc số điện thoại..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                Lọc theo trạng thái
                            </label>
                            <select
                                id="status"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Items per page */}
                        <div>
                            <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700 mb-2">
                                Số dòng mỗi trang
                            </label>
                            <select
                                id="itemsPerPage"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(parseInt(e.target.value));
                                    setCurrentPage(1); // Reset to first page when changing page size
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Customer List */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Table Header with Results Info */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Danh sách khách hàng
                            </h3>
                            <div className="text-sm text-gray-600">
                                {totalCount > 0 && (
                                    <span>
                                        Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} của {totalCount} khách hàng
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Khách hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Liên hệ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày cưới
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày gửi
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"></div>
                                            <p className="mt-2">Đang tải...</p>
                                        </td>
                                    </tr>
                                ) : customers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            Không tìm thấy khách hàng nào
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer: Customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {customer.fullName}
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">
                                                        {customer.requirements}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{customer.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {customer.weddingDate ? formatDate(customer.weddingDate) : 'Chưa xác định'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={customer.status}
                                                    onChange={(e) => handleStatusChange(customer.id, e.target.value)}
                                                    className={`text-xs font-medium px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-rose-500 ${getStatusColor(customer.status)}`}
                                                >
                                                    <option value="new">Mới</option>
                                                    <option value="contacted">Đã liên hệ</option>
                                                    <option value="deposited">Đã đặt cọc</option>
                                                    <option value="in_progress">Đang xử lý</option>
                                                    <option value="completed">Hoàn thành</option>
                                                    <option value="cancelled">Hủy</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(customer.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleViewDetails(customer)}
                                                    className="text-rose-600 hover:text-rose-900 mr-3"
                                                >
                                                    Xem chi tiết
                                                </button>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} trong {totalCount} khách hàng
                            </div>
                            <div className="flex space-x-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-300"
                                >
                                    Trước
                                </button>

                                {/* Page Numbers */}
                                {[...Array(totalPages)].map((_, i) => {
                                    const page = i + 1;
                                    // Show first page, last page, current page and one before/after current
                                    const shouldShow = page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1);

                                    if (!shouldShow && page === 2) {
                                        return <span key="ellipsis1" className="px-2 py-1 text-gray-400">...</span>;
                                    }

                                    if (!shouldShow && page === totalPages - 1) {
                                        return <span key="ellipsis2" className="px-2 py-1 text-gray-400">...</span>;
                                    }

                                    if (!shouldShow) {
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 border rounded-lg text-sm transition-colors duration-300 ${currentPage === page
                                                ? 'bg-rose-600 text-white border-rose-600'
                                                : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {/* Next Button */}
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

                {/* Stats Summary (Current Page) */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {statusOptions.slice(1).map((status) => {
                        const count = customers.filter(c => c.status === status.value).length;
                        return (
                            <div key={status.value} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
                                <div className="text-2xl font-bold text-gray-900">{count}</div>
                                <div className="text-sm text-gray-600">{status.label}</div>
                                <div className="text-xs text-gray-400 mt-1">Trang hiện tại</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Customer Detail Modal */}
            <CustomerDetailModal
                customer={selectedCustomer}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onStatusChange={handleStatusChange}
            />

            {/* Add Customer Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
                        {/* Modal Header - Fixed */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Thêm khách hàng mới</h3>
                            <button
                                onClick={handleCloseAddModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                            Họ và tên *
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={newCustomerForm.fullName}
                                            onChange={handleFormChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Số điện thoại *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={newCustomerForm.phone}
                                            onChange={handleFormChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={newCustomerForm.email}
                                            onChange={handleFormChange}
                                            required
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="weddingDate" className="block text-sm font-medium text-gray-700">
                                            Ngày cưới dự kiến
                                        </label>
                                        <input
                                            type="date"
                                            id="weddingDate"
                                            name="weddingDate"
                                            value={newCustomerForm.weddingDate}
                                            onChange={handleFormChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="guestCount" className="block text-sm font-medium text-gray-700">
                                            Số lượng khách
                                        </label>
                                        <input
                                            type="number"
                                            id="guestCount"
                                            name="guestCount"
                                            value={newCustomerForm.guestCount}
                                            onChange={handleFormChange}
                                            min="1"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                                            Ngân sách (VNĐ)
                                        </label>
                                        <input
                                            type="number"
                                            id="budget"
                                            name="budget"
                                            value={newCustomerForm.budget}
                                            onChange={handleFormChange}
                                            min="0"
                                            step="1000000"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                                        Địa điểm tổ chức
                                    </label>
                                    <input
                                        type="text"
                                        id="venue"
                                        name="venue"
                                        value={newCustomerForm.venue}
                                        onChange={handleFormChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                                        Yêu cầu dịch vụ
                                    </label>
                                    <textarea
                                        id="requirements"
                                        name="requirements"
                                        value={newCustomerForm.requirements}
                                        onChange={handleFormChange}
                                        rows={3}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={newCustomerForm.notes}
                                        onChange={handleFormChange}
                                        rows={2}
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer - Fixed */}
                        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                type="button"
                                onClick={handleCloseAddModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitNewCustomer}
                                className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors duration-200"
                            >
                                Thêm khách hàng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
