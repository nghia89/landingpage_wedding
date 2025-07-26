import { NextRequest, NextResponse } from 'next/server';
import withMongo from '@/lib/withMongo';
import Promotion from '@/models/Promotion';

// Response interface
interface ActivePromotionsResponse {
    success: boolean;
    data?: unknown[];
    error?: string;
}

// GET handler - Fetch active promotions for a specific page
export const GET = withMongo(async (
    request: NextRequest,
    { params }: { params: { page: string } }
): Promise<NextResponse<ActivePromotionsResponse>> => {
    try {
        const { page } = params;
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // Optional filter by type

        // Validate target page
        if (!['landing', 'booking', 'homepage'].includes(page)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Trang không hợp lệ'
                },
                { status: 400 }
            );
        }

        // Build query for active promotions
        const now = new Date();
        const query: Record<string, unknown> = {
            targetPage: page,
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        };

        // Optional type filter
        if (type && ['popup', 'banner', 'slide'].includes(type)) {
            query.type = type;
        }

        // Find active promotions, sorted by creation date (newest first)
        const promotions = await Promotion.find(query)
            .sort({ createdAt: -1 })
            .select('title description imageUrl type ctaText ctaLink startDate endDate')
            .lean();

        return NextResponse.json({
            success: true,
            data: promotions
        });

    } catch (error) {
        console.error('Error fetching active promotions:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Lỗi tải khuyến mãi'
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
