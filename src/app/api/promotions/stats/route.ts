import { NextRequest, NextResponse } from 'next/server';
import withMongo from '@/lib/withMongo';
import Promotion from '@/models/Promotion';

// Response interface
interface StatsResponse {
    success: boolean;
    data?: {
        totalPromotions: number;
        activePromotions: number;
        expiredPromotions: number;
        byType: Record<string, number>;
        byTargetPage: Record<string, number>;
    };
    error?: string;
}

// GET handler - Fetch promotion statistics
export const GET = withMongo(async (_request: NextRequest): Promise<NextResponse<StatsResponse>> => {
    try {
        const now = new Date();

        // Run all aggregation queries in parallel
        const [
            totalCount,
            activeCount,
            ,// inactiveCount (unused)
            expiredCount,
            ,// upcomingCount (unused)
            typeStats,
            targetPageStats
        ] = await Promise.all([
            // Total promotions
            Promotion.countDocuments(),

            // Active promotions (isActive = true and within date range)
            Promotion.countDocuments({
                isActive: true,
                startDate: { $lte: now },
                endDate: { $gte: now }
            }),

            // Inactive promotions (isActive = false)
            Promotion.countDocuments({ isActive: false }),

            // Expired promotions (end date passed)
            Promotion.countDocuments({ endDate: { $lt: now } }),

            // Upcoming promotions (start date in future)
            Promotion.countDocuments({ startDate: { $gt: now } }),

            // Count by type
            Promotion.aggregate([
                {
                    $group: {
                        _id: '$type',
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Count by target page
            Promotion.aggregate([
                {
                    $group: {
                        _id: '$targetPage',
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Process type statistics
        const byType = {
            popup: 0,
            banner: 0,
            slide: 0
        };

        typeStats.forEach(stat => {
            if (stat._id in byType) {
                byType[stat._id as keyof typeof byType] = stat.count;
            }
        });

        // Process target page statistics
        const byTargetPage = {
            landing: 0,
            booking: 0,
            homepage: 0
        };

        targetPageStats.forEach(stat => {
            if (stat._id in byTargetPage) {
                byTargetPage[stat._id as keyof typeof byTargetPage] = stat.count;
            }
        });

        const stats = {
            totalPromotions: totalCount,
            activePromotions: activeCount,
            expiredPromotions: expiredCount,
            byType,
            byTargetPage
        };

        return NextResponse.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Error fetching promotion statistics:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Lỗi tải thống kê khuyến mãi'
            },
            { status: 500 }
        );
    }
});

// OPTIONS handler for CORS
export async function OPTIONS(_request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
