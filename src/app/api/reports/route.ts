import { NextRequest, NextResponse } from 'next/server';
import withMongo from '@/lib/withMongo';
import Appointment from '@/models/Appointment';
import Booking from '@/models/Booking';
import Customer from '@/models/Customer';

// Interface for the reports response
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

// Status color mapping
const statusColors = {
    // Appointment statuses
    scheduled: '#3B82F6', // blue
    confirmed: '#10B981', // green
    completed: '#059669', // emerald
    cancelled: '#EF4444', // red
    no_show: '#9CA3AF', // gray

    // Booking statuses
    pending: '#F59E0B', // amber
    consulted: '#8B5CF6', // violet

    // Customer statuses
    new: '#3B82F6', // blue
    contacted: '#10B981', // green
    deposited: '#8B5CF6', // violet
    in_progress: '#F59E0B', // amber
    // completed: '#059669', // emerald (already defined)
    // cancelled: '#EF4444', // red (already defined)
};

// Status label mapping for Vietnamese
const statusLabels = {
    // Appointment statuses
    scheduled: 'Đã lên lịch',
    confirmed: 'Đã xác nhận',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    no_show: 'Không đến',

    // Booking statuses
    pending: 'Chờ xử lý',
    consulted: 'Đã tư vấn',

    // Customer statuses
    new: 'Mới',
    contacted: 'Đã liên hệ',
    deposited: 'Đã đặt cọc',
    in_progress: 'Đang thực hiện',
    // completed: 'Hoàn thành', (handled above)
    // cancelled: 'Đã hủy', (handled above)
};

// Helper function to get last N days
function getLastNDays(n: number): string[] {
    const dates: string[] = [];
    const today = new Date();

    for (let i = n - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD format
    }

    return dates;
}

// Helper function to format date for display
function formatDateForDisplay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
        month: 'short',
        day: 'numeric'
    });
}

// Helper function to estimate revenue from customer budget
function estimateRevenueFromBudget(budget: string): number {
    if (!budget) return 0;

    // Remove non-numeric characters and parse
    const numericBudget = budget.replace(/[^\d]/g, '');
    const budgetValue = parseInt(numericBudget);

    if (isNaN(budgetValue)) return 0;

    // If budget seems to be in millions (less than 1000), multiply by 1M
    if (budgetValue < 1000) {
        return budgetValue * 1000000;
    }

    return budgetValue;
}

// GET handler for reports
export const GET = withMongo(async (request: NextRequest): Promise<NextResponse<ReportsData>> => {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '7');

        // Get date range for the last N days
        const last7Days = getLastNDays(days);
        const startDate = new Date(last7Days[0]);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999); // End of today

        // 1. Get appointments data for the last N days
        const appointmentsAggregation = await Appointment.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $addFields: {
                    dateOnly: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$dateOnly",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Create appointments chart data
        const appointmentCounts = last7Days.map(date => {
            const found = appointmentsAggregation.find(item => item._id === date);
            return found ? found.count : 0;
        });

        const appointmentsChart = {
            dates: last7Days.map(formatDateForDisplay),
            counts: appointmentCounts,
            total: appointmentCounts.reduce((sum, count) => sum + count, 0)
        };

        // 2. Get appointment status distribution
        const appointmentStatusData = await Appointment.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const appointmentStatusChart = {
            labels: appointmentStatusData.map(item => statusLabels[item._id as keyof typeof statusLabels] || item._id),
            data: appointmentStatusData.map(item => item.count),
            colors: appointmentStatusData.map(item => statusColors[item._id as keyof typeof statusColors] || '#6B7280')
        };

        // 3. Get booking status distribution
        const bookingStatusData = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const bookingStatusChart = {
            labels: bookingStatusData.map(item => statusLabels[item._id as keyof typeof statusLabels] || item._id),
            data: bookingStatusData.map(item => item.count),
            colors: bookingStatusData.map(item => statusColors[item._id as keyof typeof statusColors] || '#6B7280')
        };

        // 4. Get customer status distribution
        const customerStatusData = await Customer.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        const customerStatusChart = {
            labels: customerStatusData.map(item => statusLabels[item._id as keyof typeof statusLabels] || item._id),
            data: customerStatusData.map(item => item.count),
            colors: customerStatusData.map(item => statusColors[item._id as keyof typeof statusColors] || '#6B7280')
        };

        // 5. Get summary statistics
        const [
            totalAppointments,
            totalBookings,
            totalCustomers,
            activeCustomers,
            completedCustomers,
            customersWithBudget
        ] = await Promise.all([
            Appointment.countDocuments(),
            Booking.countDocuments(),
            Customer.countDocuments(),
            Customer.countDocuments({
                status: { $in: ['new', 'contacted', 'deposited', 'in_progress'] }
            }),
            Customer.countDocuments({ status: 'completed' }),
            Customer.find({ budget: { $exists: true, $ne: '' } }, 'budget status').lean()
        ]);

        // Calculate estimated revenue from completed customers with budgets
        const revenueEstimate = customersWithBudget
            .filter(customer => customer.status === 'completed')
            .reduce((total, customer) => {
                return total + estimateRevenueFromBudget(customer.budget);
            }, 0);

        // 6. Get recent activity (last 7 days)
        const recentStartDate = new Date();
        recentStartDate.setDate(recentStartDate.getDate() - 7);

        const [newAppointments, newBookings, newCustomers] = await Promise.all([
            Appointment.countDocuments({ createdAt: { $gte: recentStartDate } }),
            Booking.countDocuments({ createdAt: { $gte: recentStartDate } }),
            Customer.countDocuments({ createdAt: { $gte: recentStartDate } })
        ]);

        // Prepare response data
        const responseData: ReportsData = {
            success: true,
            data: {
                appointmentsChart,
                appointmentStatusChart,
                bookingStatusChart,
                customerStatusChart,
                summary: {
                    totalAppointments,
                    totalBookings,
                    totalCustomers,
                    activeCustomers,
                    completedCustomers,
                    revenueEstimate
                },
                recentActivity: {
                    newAppointments,
                    newBookings,
                    newCustomers
                }
            }
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Error generating reports:', error);

        return NextResponse.json(
            {
                success: false,
                data: {
                    appointmentsChart: { dates: [], counts: [], total: 0 },
                    appointmentStatusChart: { labels: [], data: [], colors: [] },
                    bookingStatusChart: { labels: [], data: [], colors: [] },
                    customerStatusChart: { labels: [], data: [], colors: [] },
                    summary: {
                        totalAppointments: 0,
                        totalBookings: 0,
                        totalCustomers: 0,
                        activeCustomers: 0,
                        completedCustomers: 0,
                        revenueEstimate: 0
                    },
                    recentActivity: {
                        newAppointments: 0,
                        newBookings: 0,
                        newCustomers: 0
                    }
                },
                error: error instanceof Error ? error.message : 'Lỗi tạo báo cáo'
            },
            { status: 500 }
        );
    }
});

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
