'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

// Service Package interface
interface ServicePackage {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    category: 'basic' | 'standard' | 'premium' | 'luxury';
    isActive: boolean;
    createdAt: string;
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
    const [formData, setFormData] = useState<ServiceFormData>({
        name: '',
        price: '',
        description: '',
        features: [''],
        category: 'basic',
        isActive: true
    });

    // Mock service data
    const mockServices: ServicePackage[] = [
        {
            id: '1',
            name: 'Gói Cơ Bản',
            price: 15000000,
            description: 'Gói dịch vụ cưới cơ bản phù hợp cho 50-80 khách',
            features: [
                'Trang trí sân khấu cơ bản',
                'Âm thanh - ánh sáng',
                'MC dẫn chương trình',
                'Chụp ảnh phóng sự (200 ảnh)',
                '1 xe hoa cô dâu'
            ],
            category: 'basic',
            isActive: true,
            createdAt: '2025-07-01T10:00:00'
        },
        {
            id: '2',
            name: 'Gói Tiêu Chuẩn',
            price: 25000000,
            description: 'Gói dịch vụ cưới tiêu chuẩn cho 80-150 khách',
            features: [
                'Trang trí sân khấu cao cấp',
                'Hệ thống âm thanh chuyên nghiệp',
                'MC + ca sĩ',
                'Chụp ảnh + quay phim',
                '2 xe hoa + trang trí nhà',
                'Make-up cô dâu',
                'Phục vụ tiệc'
            ],
            category: 'standard',
            isActive: true,
            createdAt: '2025-07-01T10:00:00'
        },
        {
            id: '3',
            name: 'Gói Cao Cấp',
            price: 45000000,
            description: 'Gói dịch vụ cưới cao cấp cho 150-300 khách',
            features: [
                'Trang trí sân khấu sang trọng',
                'Hệ thống âm thanh, ánh sáng LED',
                'MC chuyên nghiệp + ban nhạc',
                'Chụp ảnh + quay phim 4K',
                '3 xe hoa + trang trí toàn bộ',
                'Make-up + làm tóc cô dâu',
                'Phục vụ tiệc VIP',
                'Thiết kế thiệp cưới',
                'Pháo hoa'
            ],
            category: 'premium',
            isActive: true,
            createdAt: '2025-07-01T10:00:00'
        },
        {
            id: '4',
            name: 'Gói Premium',
            price: 80000000,
            description: 'Gói dịch vụ cưới đẳng cấp cho 300+ khách',
            features: [
                'Thiết kế trang trí theo concept',
                'Hệ thống âm thanh, ánh sáng chuyên nghiệp',
                'MC + ban nhạc + vũ đoàn',
                'Chụp ảnh + quay phim cinematic',
                'Đoàn xe hoa + trang trí xa hoa',
                'Make-up artist chuyên nghiệp',
                'Phục vụ tiệc 5 sao',
                'Thiết kế thiệp + menu',
                'Pháo hoa + hiệu ứng đặc biệt',
                'Coordinator chuyên nghiệp',
                'Live streaming'
            ],
            category: 'luxury',
            isActive: true,
            createdAt: '2025-07-01T10:00:00'
        },
        {
            id: '5',
            name: 'Gói Truyền Thống',
            price: 20000000,
            description: 'Gói dịch vụ cưới theo phong cách truyền thống Việt Nam',
            features: [
                'Trang trí theo phong cách truyền thống',
                'Âm thanh - nhạc cổ điển',
                'MC dẫn lễ theo nghi thức',
                'Chụp ảnh phóng sự',
                'Xe hoa truyền thống',
                'Trang phục áo dài',
                'Lễ gia tiên'
            ],
            category: 'standard',
            isActive: false,
            createdAt: '2025-07-01T10:00:00'
        }
    ];

    useEffect(() => {
        // Load services (in real app, this would be an API call)
        setServices(mockServices);
        setFilteredServices(mockServices);
    }, []);

    // Filter services by category
    useEffect(() => {
        if (categoryFilter === 'all') {
            setFilteredServices(services);
        } else {
            setFilteredServices(services.filter(service => service.category === categoryFilter));
        }
    }, [services, categoryFilter]);

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
    const handleSubmit = () => {
        // Validate required fields
        if (!formData.name.trim() || !formData.price.trim() || !formData.description.trim()) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên gói, Giá, Mô tả)');
            return;
        }

        // Validate features
        const validFeatures = formData.features.filter(feature => feature.trim() !== '');
        if (validFeatures.length === 0) {
            alert('Vui lòng thêm ít nhất một tính năng cho gói dịch vụ');
            return;
        }

        const newService: ServicePackage = {
            id: editingService ? editingService.id : Date.now().toString(),
            name: formData.name,
            price: parseInt(formData.price),
            description: formData.description,
            features: validFeatures,
            category: formData.category,
            isActive: formData.isActive,
            createdAt: editingService ? editingService.createdAt : new Date().toISOString()
        };

        if (editingService) {
            // Update existing service
            setServices(services.map(service =>
                service.id === editingService.id ? newService : service
            ));
        } else {
            // Add new service
            setServices([...services, newService]);
        }

        // Reset form and close modal
        handleCloseModal();
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
        setIsModalOpen(true);
    };

    // Handle closing modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
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
    const handleDelete = (id: string) => {
        setServices(services.filter(service => service.id !== id));
        setDeleteConfirmId(null);
    };

    // Handle toggle active status
    const handleToggleActive = (id: string) => {
        setServices(services.map(service =>
            service.id === id ? { ...service, isActive: !service.isActive } : service
        ));
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
                        className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Thêm gói dịch vụ</span>
                    </button>
                </div>

                {/* Stats Cards */}
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
                                    {formatPrice(Math.min(...services.filter(s => s.isActive).map(s => s.price)))}
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
                                    {formatPrice(Math.max(...services.filter(s => s.isActive).map(s => s.price)))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Lọc theo phân loại</h3>
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
                        <div key={service.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 ${!service.isActive ? 'opacity-60' : ''}`}>
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
                                            className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-300"
                                            title="Chỉnh sửa"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(service.id)}
                                            className={`p-2 rounded-lg transition-colors duration-300 ${service.isActive ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' : 'text-green-600 hover:text-green-700 hover:bg-green-50'}`}
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
                                            onClick={() => setDeleteConfirmId(service.id)}
                                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors duration-300"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
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
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                                    placeholder="Ví dụ: Trang trí sân khấu cơ bản"
                                                />
                                                {formData.features.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFeature(index)}
                                                        className="text-red-600 hover:text-red-700 p-2"
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
                                            className="text-rose-600 hover:text-rose-700 text-sm font-medium flex items-center space-x-1"
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
                                            className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
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
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-300"
                                >
                                    {editingService ? 'Cập nhật' : 'Thêm mới'}
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
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={() => handleDelete(deleteConfirmId)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                                    >
                                        Xóa
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
