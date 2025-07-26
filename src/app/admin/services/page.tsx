'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

// Service Package interface
interface ServicePackage {
    _id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    category: 'basic' | 'standard' | 'premium' | 'luxury';
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

// Form data interface
interface ServiceFormData {
    name: string;
    price: string;
    description: string;
    features: string[];
    category: 'basic' | 'standard' | 'premium' | 'luxury';
    isActive: boolean;
}

export default function ServicesPage() {
    const [services, setServices] = useState<ServicePackage[]>([]);
    const [filteredServices, setFilteredServices] = useState<ServicePackage[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServicePackage | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState<ServiceFormData>({
        name: '',
        price: '',
        description: '',
        features: [''],
        category: 'basic',
        isActive: true
    });

    // Fetch services from API
    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (categoryFilter !== 'all') params.append('category', categoryFilter);
            params.append('limit', '100'); // Get all services for admin

            const response = await fetch(`/api/services?${params}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Lỗi tải dữ liệu');
            }

            setServices(data.data);
            setFilteredServices(data.data);
        } catch (error) {
            console.error('Error fetching services:', error);
            setError(error instanceof Error ? error.message : 'Lỗi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    }, [search, categoryFilter]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Get category display
    const getCategoryDisplay = (category: string) => {
        const categories = {
            basic: { label: 'Cơ Bản', color: 'bg-gray-100 text-gray-800' },
            standard: { label: 'Tiêu Chuẩn', color: 'bg-blue-100 text-blue-800' },
            premium: { label: 'Cao Cấp', color: 'bg-purple-100 text-purple-800' },
            luxury: { label: 'Luxury', color: 'bg-amber-100 text-amber-800' }
        };
        return categories[category as keyof typeof categories] || { label: category, color: 'bg-gray-100 text-gray-800' };
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError('');

            // Validate required fields
            if (!formData.name.trim() || !formData.price.trim() || !formData.description.trim()) {
                setError('Vui lòng điền đầy đủ thông tin bắt buộc (Tên gói, Giá, Mô tả)');
                return;
            }

            // Validate features
            const validFeatures = formData.features.filter(feature => feature.trim() !== '');
            if (validFeatures.length === 0) {
                setError('Vui lòng thêm ít nhất một tính năng cho gói dịch vụ');
                return;
            }

            const serviceData = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                features: validFeatures,
                category: formData.category,
                isActive: formData.isActive
            };

            let response;
            if (editingService) {
                // Update existing service
                response = await fetch('/api/services', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingService._id, ...serviceData })
                });
            } else {
                // Create new service
                response = await fetch('/api/services', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(serviceData)
                });
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Lỗi lưu dữ liệu');
            }

            // Refresh services list
            await fetchServices();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving service:', error);
            setError(error instanceof Error ? error.message : 'Lỗi lưu dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Handle opening modal for new service
    const handleAddNew = () => {
        setEditingService(null);
        setFormData({
            name: '',
            price: '',
            description: '',
            features: [''],
            category: 'basic',
            isActive: true
        });
        setError('');
        setIsModalOpen(true);
    };

    // Handle opening modal for editing
    const handleEdit = (service: ServicePackage) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            price: service.price.toString(),
            description: service.description,
            features: service.features.length > 0 ? service.features : [''],
            category: service.category,
            isActive: service.isActive
        });
        setError('');
        setIsModalOpen(true);
    };

    // Handle closing modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setError('');
        setFormData({
            name: '',
            price: '',
            description: '',
            features: [''],
            category: 'basic',
            isActive: true
        });
    };

    // Handle delete
    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(`/api/services?id=${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Lỗi xóa dữ liệu');
            }

            // Refresh services list
            await fetchServices();
            setDeleteConfirmId(null);
        } catch (error) {
            console.error('Error deleting service:', error);
            setError(error instanceof Error ? error.message : 'Lỗi xóa dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Handle toggle active status
    const handleToggleActive = async (id: string) => {
        try {
            setLoading(true);
            setError('');

            const service = services.find(s => s._id === id);
            if (!service) return;

            const response = await fetch('/api/services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: service._id,
                    isActive: !service.isActive
                })
            });

            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Lỗi cập nhật trạng thái');
            }

            // Refresh services list
            await fetchServices();
        } catch (error) {
            console.error('Error toggling service status:', error);
            setError(error instanceof Error ? error.message : 'Lỗi cập nhật trạng thái');
        } finally {
            setLoading(false);
        }
    };

    // Handle feature changes
    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    // Add new feature field
    const handleAddFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    // Remove feature field
    const handleRemoveFeature = (index: number) => {
        if (formData.features.length > 1) {
            const newFeatures = formData.features.filter((_, i) => i !== index);
            setFormData({ ...formData, features: newFeatures });
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center mb-2">
                            <svg className="w-8 h-8 text-rose-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <h1 className="text-3xl font-bold text-gray-900">Quản lý dịch vụ</h1>
                        </div>
                        <p className="text-gray-600">Quản lý các gói dịch vụ tiệc cưới</p>
                    </div>
                    <button
                        onClick={handleAddNew}
                        disabled={loading}
                        className="bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Thêm gói dịch vụ</span>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && services.length === 0 && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
                        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
                    </div>
                )}

                {/* Stats Cards */}
                {services.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h6m-6 4h6m-2 4h2" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Tổng gói dịch vụ</p>
                                    <p className="text-2xl font-bold text-gray-900">{services.length}</p>
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
                                    <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                                    <p className="text-2xl font-bold text-gray-900">{services.filter(s => s.isActive).length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Giá thấp nhất</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {services.filter(s => s.isActive).length > 0
                                            ? formatPrice(Math.min(...services.filter(s => s.isActive).map(s => s.price)))
                                            : '0'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Giá cao nhất</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {services.filter(s => s.isActive).length > 0
                                            ? formatPrice(Math.max(...services.filter(s => s.isActive).map(s => s.price)))
                                            : '0'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filter Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* <h3 className="text-lg font-semibold text-gray-900">Tìm kiếm và lọc</h3> */}

                        {/* Search Input */}
                        {/* <div className="flex-1 max-w-md">
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                tìm kiếm
                            </label>
                            <input
                                type="text"
                                id="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tìm kiếm gói dịch vụ..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            />
                        </div> */}

                        {/* Category Filter */}
                        <div className="flex items-center space-x-4">
                            {[
                                { value: 'all', label: 'Tất cả' },
                                { value: 'basic', label: 'Cơ Bản' },
                                { value: 'standard', label: 'Tiêu Chuẩn' },
                                { value: 'premium', label: 'Cao Cấp' },
                                { value: 'luxury', label: 'Luxury' }
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setCategoryFilter(option.value)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${categoryFilter === option.value
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {option.label}
                                    {option.value !== 'all' && (
                                        <span className="ml-2 text-xs">
                                            ({services.filter(s => s.category === option.value).length})
                                        </span>
                                    )}
                                    {option.value === 'all' && (
                                        <span className="ml-2 text-xs">
                                            ({services.length})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <div key={service._id} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 ${!service.isActive ? 'opacity-60' : ''}`}>
                            <div className="p-6">
                                {/* Service Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center mb-2">
                                            <h3 className="text-xl font-bold text-gray-900 mr-3">{service.name}</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryDisplay(service.category).color}`}>
                                                {getCategoryDisplay(service.category).label}
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-rose-600">{formatPrice(service.price)}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {service.isActive ? 'Hoạt động' : 'Tạm dừng'}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>

                                {/* Features */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-3">Bao gồm:</h4>
                                    <ul className="space-y-2">
                                        {service.features.slice(0, 4).map((feature, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                        {service.features.length > 4 && (
                                            <li className="text-sm text-gray-500 ml-6">
                                                +{service.features.length - 4} tính năng khác
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(service)}
                                            disabled={loading}
                                            className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                                            title="Chỉnh sửa"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(service._id)}
                                            disabled={loading}
                                            className={`p-2 rounded-lg transition-colors duration-300 disabled:text-gray-400 ${service.isActive ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
                                            title={service.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                                        >
                                            {service.isActive ? (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m2-10v18a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2z" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirmId(service._id)}
                                            disabled={loading}
                                            className="text-red-600 hover:text-red-700 disabled:text-gray-400 p-2 hover:bg-red-50 rounded-lg transition-colors duration-300"
                                            title="Xóa"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {!loading && services.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h6m-6 4h6m-2 4h2" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có gói dịch vụ nào</h3>
                        <p className="text-gray-500 mb-4">Bắt đầu bằng cách thêm gói dịch vụ đầu tiên</p>
                        <button
                            onClick={handleAddNew}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                        >
                            Thêm gói dịch vụ
                        </button>
                    </div>
                )}

                {/* Add/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl">
                            {/* Modal Header - Fixed */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {editingService ? 'Chỉnh sửa gói dịch vụ' : 'Thêm gói dịch vụ mới'}
                                </h3>
                                <button
                                    onClick={handleCloseModal}
                                    disabled={loading}
                                    className="text-gray-400 hover:text-gray-600 disabled:text-gray-300 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {/* Error message in modal */}
                                {error && (
                                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                        <div className="flex">
                                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{error}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {/* Service Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Tên gói dịch vụ *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            disabled={loading}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100"
                                            placeholder="Ví dụ: Gói Cơ Bản"
                                        />
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                            Giá (VND) *
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                            min="0"
                                            disabled={loading}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100"
                                            placeholder="15000000"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phân loại gói *
                                        </label>
                                        <select
                                            id="category"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as 'basic' | 'standard' | 'premium' | 'luxury' })}
                                            required
                                            disabled={loading}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100"
                                        >
                                            <option value="basic">Cơ Bản</option>
                                            <option value="standard">Tiêu Chuẩn</option>
                                            <option value="premium">Cao Cấp</option>
                                            <option value="luxury">Luxury</option>
                                        </select>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Mô tả *
                                        </label>
                                        <textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                            rows={3}
                                            disabled={loading}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100"
                                            placeholder="Mô tả ngắn về gói dịch vụ"
                                        />
                                    </div>

                                    {/* Features */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tính năng / Dịch vụ bao gồm *
                                        </label>
                                        {formData.features.map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                    disabled={loading}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 disabled:bg-gray-100"
                                                    placeholder="Ví dụ: Trang trí sân khấu cơ bản"
                                                />
                                                {formData.features.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFeature(index)}
                                                        disabled={loading}
                                                        className="text-red-600 hover:text-red-700 disabled:text-gray-400 p-2"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleAddFeature}
                                            disabled={loading}
                                            className="text-rose-600 hover:text-rose-700 disabled:text-gray-400 text-sm font-medium flex items-center space-x-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            <span>Thêm tính năng</span>
                                        </button>
                                    </div>

                                    {/* Active Status */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            disabled={loading}
                                            className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 disabled:bg-gray-100"
                                        />
                                        <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                                            Kích hoạt gói dịch vụ
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer - Fixed */}
                            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={loading}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-300"
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
                                    <span>{editingService ? 'Cập nhật' : 'Thêm mới'}</span>
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
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa</h3>
                                        <p className="text-sm text-gray-500">Bạn có chắc chắn muốn xóa gói dịch vụ này?</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end space-x-4">
                                    <button
                                        onClick={() => setDeleteConfirmId(null)}
                                        disabled={loading}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 transition-colors duration-300"
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
                                        <span>Xóa</span>
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
