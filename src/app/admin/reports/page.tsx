'use client';

import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import clsx from 'clsx';
import AdminLayout from '@/components/admin/AdminLayout';

// Types for the API response
interface ReportsData {
    success: boolean;
    data: {
        appointmentsChart: {
            dates: string[];
            counts: number[];
            total: number;
        };
        appointmentStatusChart: {
            labels: string[];
            data: number[];
            colors: string[];
        };
        bookingStatusChart: {
            labels: string[];
            data: number[];
            colors: string[];
        };
        customerStatusChart: {
            labels: string[];
            data: number[];
            colors: string[];
        };
        summary: {
            totalAppointments: number;
            totalBookings: number;
            totalCustomers: number;
            activeCustomers: number;
            completedCustomers: number;
            revenueEstimate: number;
        };
        recentActivity: {
            newAppointments: number;
            newBookings: number;
            newCustomers: number;
        };
    };
    error?: string;
}

// Chart data interfaces
interface LineChartData {
    date: string;
    appointments: number;
}

interface PieChartData {
    name: string;
    value: number;
    color: string;
}

export default function ReportsPage() {
    const [data, setData] = useState<ReportsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [selectedPeriod, setSelectedPeriod] = useState<number>(7);

    // Fetch reports data
    const fetchReports = async (days: number = 7) => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(`/api/reports?days=${days}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Lỗi tải dữ liệu báo cáo');
            }

            setData(result);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu báo cáo');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(selectedPeriod);
    }, [selectedPeriod]);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Format number with commas
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    // Prepare chart data
    const lineChartData: LineChartData[] = data ?
        data.data.appointmentsChart.dates.map((date, index) => ({
            date,
            appointments: data.data.appointmentsChart.counts[index]
        })) : [];

    const appointmentPieData: PieChartData[] = data ?
        data.data.appointmentStatusChart.labels.map((label, index) => ({
            name: label,
            value: data.data.appointmentStatusChart.data[index],
            color: data.data.appointmentStatusChart.colors[index]
        })) : [];

    const bookingPieData: PieChartData[] = data ?
        data.data.bookingStatusChart.labels.map((label, index) => ({
            name: label,
            value: data.data.bookingStatusChart.data[index],
            color: data.data.bookingStatusChart.colors[index]
        })) : [];

    const customerPieData: PieChartData[] = data ?
        data.data.customerStatusChart.labels.map((label, index) => ({
            name: label,
            value: data.data.customerStatusChart.data[index],
            color: data.data.customerStatusChart.colors[index]
        })) : [];

    // Loading component
    if (loading) {
        return (
            <AdminLayout>
                <div className="p-6 lg:p-8">
                    <div className="flex items-center justify-center min-h-96">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
                            <p className="text-gray-600">Đang tải báo cáo...</p>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-6 lg:p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center mb-2">
                            <svg className="w-8 h-8 text-rose-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h1 className="text-3xl font-bold text-gray-900">Báo cáo tổng quan</h1>
                        </div>
                        <p className="text-gray-600">Thống kê và phân tích dữ liệu kinh doanh</p>
                    </div>

                    {/* Period Selector */}
                    <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                        <span className="text-sm font-medium text-gray-700">Thời gian:</span>
                        {[
                            { value: 7, label: '7 ngày' },
                            { value: 14, label: '14 ngày' },
                            { value: 30, label: '30 ngày' }
                        ].map((period) => (
                            <button
                                key={period.value}
                                onClick={() => setSelectedPeriod(period.value)}
                                className={clsx(
                                    'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
                                    selectedPeriod === period.value
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                )}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <div className="flex">
                            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {data && (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Total Appointments */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Tổng lịch hẹn</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatNumber(data.data.summary.totalAppointments)}</p>
                                        <p className="text-xs text-green-600 mt-1">
                                            +{data.data.recentActivity.newAppointments} trong {selectedPeriod} ngày
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Bookings */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Tổng đặt chỗ</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatNumber(data.data.summary.totalBookings)}</p>
                                        <p className="text-xs text-green-600 mt-1">
                                            +{data.data.recentActivity.newBookings} trong {selectedPeriod} ngày
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Total Customers */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Tổng khách hàng</p>
                                        <p className="text-2xl font-bold text-gray-900">{formatNumber(data.data.summary.totalCustomers)}</p>
                                        <p className="text-xs text-green-600 mt-1">
                                            +{data.data.recentActivity.newCustomers} trong {selectedPeriod} ngày
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Revenue Estimate */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-amber-100 rounded-lg">
                                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Doanh thu ước tính</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {data.data.summary.revenueEstimate > 0
                                                ? formatCurrency(data.data.summary.revenueEstimate).replace('₫', '').trim() + ' VNĐ'
                                                : 'Chưa có dữ liệu'
                                            }
                                        </p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            Từ {data.data.summary.completedCustomers} khách hoàn thành
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Line Chart - Appointments Trend */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Xu hướng lịch hẹn</h3>
                                    <div className="text-sm text-gray-500">
                                        {selectedPeriod} ngày gần nhất
                                    </div>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={lineChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis
                                                dataKey="date"
                                                stroke="#6b7280"
                                                fontSize={12}
                                            />
                                            <YAxis
                                                stroke="#6b7280"
                                                fontSize={12}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                                labelStyle={{ color: '#374151' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="appointments"
                                                stroke="#e11d48"
                                                strokeWidth={3}
                                                dot={{ fill: '#e11d48', strokeWidth: 2, r: 4 }}
                                                activeDot={{ r: 6, stroke: '#e11d48', strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Pie Chart - Appointment Status */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Trạng thái lịch hẹn</h3>
                                    <div className="text-sm text-gray-500">
                                        Tổng: {data.data.summary.totalAppointments}
                                    </div>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={appointmentPieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={120}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {appointmentPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                iconType="circle"
                                                wrapperStyle={{ fontSize: '12px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Pie Chart - Booking Status */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Trạng thái đặt chỗ</h3>
                                    <div className="text-sm text-gray-500">
                                        Tổng: {data.data.summary.totalBookings}
                                    </div>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={bookingPieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={120}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {bookingPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                iconType="circle"
                                                wrapperStyle={{ fontSize: '12px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Pie Chart - Customer Status */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Trạng thái khách hàng</h3>
                                    <div className="text-sm text-gray-500">
                                        Tổng: {data.data.summary.totalCustomers}
                                    </div>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={customerPieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={120}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {customerPieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                iconType="circle"
                                                wrapperStyle={{ fontSize: '12px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Activity Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Hoạt động gần đây</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{data.data.recentActivity.newAppointments}</p>
                                    <p className="text-sm text-gray-600">Lịch hẹn mới</p>
                                </div>
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-3">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{data.data.recentActivity.newBookings}</p>
                                    <p className="text-sm text-gray-600">Đặt chỗ mới</p>
                                </div>
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-3">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{data.data.recentActivity.newCustomers}</p>
                                    <p className="text-sm text-gray-600">Khách hàng mới</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}
