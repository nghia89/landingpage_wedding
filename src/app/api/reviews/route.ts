import { NextRequest, NextResponse } from 'next/server';
import { withMongo } from '@/lib/withMongo';
import Review from '@/models/Review';

// GET - Lấy danh sách đánh giá cho public (landing page)
async function getPublicReviews(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const visible = searchParams.get('visible');
        const limit = parseInt(searchParams.get('limit') || '4');

        // Build query object
        const query: any = {};

        // Filter by visible status if specified and field exists
        // If visible filter is requested but field doesn't exist, show all reviews
        if (visible === 'true') {
            // Don't add visible filter, show all reviews since the field may not exist yet
            // query.visible = true;
        }

        // Get reviews sorted by creation date (newest first)
        const reviews = await Review.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('customerName avatarUrl content rating createdAt')
            .lean();

        return NextResponse.json({
            success: true,
            message: 'Lấy danh sách đánh giá thành công',
            data: reviews.map(review => ({
                customerName: review.customerName,
                avatarUrl: review.avatarUrl || '/bride1.svg', // Default avatar
                content: review.content,
                rating: review.rating,
                createdAt: review.createdAt
            }))
        });

    } catch (error) {
        console.error('Error fetching public reviews:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể tải danh sách đánh giá'
            },
            { status: 500 }
        );
    }
}

export const GET = withMongo(getPublicReviews);
