import { NextRequest, NextResponse } from 'next/server';
import withMongo from '@/lib/withMongo';
import Promotion from '@/models/Promotion';
import mongoose from 'mongoose';

// Response interface
interface PromotionResponse {
    success: boolean;
    data?: unknown;
    pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    error?: string;
}

// Helper function to validate ObjectId
function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}

// Helper function to validate promotion data
function validatePromotionData(data: Record<string, unknown>): string | null {
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
        return 'Tiêu đề là bắt buộc';
    }

    if (!data.imageUrl || typeof data.imageUrl !== 'string' || !data.imageUrl.trim()) {
        return 'Hình ảnh là bắt buộc';
    }

    if (!data.type || !['popup', 'banner', 'slide'].includes(data.type as string)) {
        return 'Loại hiển thị không hợp lệ';
    }

    if (!data.targetPage || !['landing', 'booking', 'homepage'].includes(data.targetPage as string)) {
        return 'Trang áp dụng không hợp lệ';
    }

    if (!data.startDate) {
        return 'Ngày bắt đầu là bắt buộc';
    }

    if (!data.endDate) {
        return 'Ngày kết thúc là bắt buộc';
    }

    const startDate = new Date(data.startDate as string);
    const endDate = new Date(data.endDate as string);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 'Định dạng ngày không hợp lệ';
    }

    if (endDate <= startDate) {
        return 'Ngày kết thúc phải sau ngày bắt đầu';
    }

    return null;
}

// GET handler - Fetch promotions with filtering and pagination
export const GET = withMongo(async (request: NextRequest): Promise<NextResponse<PromotionResponse>> => {
    try {
        const { searchParams } = new URL(request.url);

        // Query parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status'); // 'active', 'inactive', 'expired', 'upcoming'
        const type = searchParams.get('type'); // 'popup', 'banner', 'slide'
        const targetPage = searchParams.get('targetPage'); // 'landing', 'booking', 'homepage'
        const search = searchParams.get('search'); // Text search
        const sortBy = searchParams.get('sortBy') || 'createdAt'; // Sort field
        const sortOrder = searchParams.get('sortOrder') || 'desc'; // 'asc' or 'desc'

        // Build query
        const query: Record<string, unknown> = {};

        // Filter by type
        if (type && ['popup', 'banner', 'slide'].includes(type)) {
            query.type = type;
        }

        // Filter by target page
        if (targetPage && ['landing', 'booking', 'homepage'].includes(targetPage)) {
            query.targetPage = targetPage;
        }

        // Filter by status
        const now = new Date();
        if (status) {
            switch (status) {
                case 'active':
                    query.isActive = true;
                    query.startDate = { $lte: now };
                    query.endDate = { $gte: now };
                    break;
                case 'inactive':
                    query.isActive = false;
                    break;
                case 'expired':
                    query.endDate = { $lt: now };
                    break;
                case 'upcoming':
                    query.startDate = { $gt: now };
                    break;
            }
        }

        // Text search
        if (search) {
            query.$text = { $search: search };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Build sort object
        const sort: Record<string, 1 | -1> = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute queries in parallel
        const [promotions, total] = await Promise.all([
            Promotion.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            Promotion.countDocuments(query)
        ]);

        // Calculate pagination info
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: promotions,
            pagination: {
                total,
                page,
                limit,
                totalPages
            }
        });

    } catch (error) {
        console.error('Error fetching promotions:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Lỗi tải danh sách khuyến mãi'
            },
            { status: 500 }
        );
    }
});

// POST handler - Create new promotion
export const POST = withMongo(async (request: NextRequest): Promise<NextResponse<PromotionResponse>> => {
    try {
        const body = await request.json();

        // Validate input data
        const validationError = validatePromotionData(body);
        if (validationError) {
            return NextResponse.json(
                {
                    success: false,
                    error: validationError
                },
                { status: 400 }
            );
        }

        // Prepare promotion data
        const promotionData = {
            title: body.title.trim(),
            description: body.description?.trim() || undefined,
            imageUrl: body.imageUrl.trim(),
            type: body.type,
            targetPage: body.targetPage,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            ctaText: body.ctaText?.trim() || undefined,
            ctaLink: body.ctaLink?.trim() || undefined,
            isActive: body.isActive !== undefined ? body.isActive : true
        };

        // Create new promotion
        const promotion = new Promotion(promotionData);
        const savedPromotion = await promotion.save();

        return NextResponse.json({
            success: true,
            data: savedPromotion
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating promotion:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Lỗi tạo khuyến mãi'
            },
            { status: 500 }
        );
    }
});

// PUT handler - Update promotion
export const PUT = withMongo(async (request: NextRequest): Promise<NextResponse<PromotionResponse>> => {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        // Validate promotion ID
        if (!id || !isValidObjectId(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'ID khuyến mãi không hợp lệ'
                },
                { status: 400 }
            );
        }

        // Validate input data
        const validationError = validatePromotionData(updateData);
        if (validationError) {
            return NextResponse.json(
                {
                    success: false,
                    error: validationError
                },
                { status: 400 }
            );
        }

        // Prepare update data
        const promotionUpdateData = {
            title: updateData.title.trim(),
            description: updateData.description?.trim() || undefined,
            imageUrl: updateData.imageUrl.trim(),
            type: updateData.type,
            targetPage: updateData.targetPage,
            startDate: new Date(updateData.startDate),
            endDate: new Date(updateData.endDate),
            ctaText: updateData.ctaText?.trim() || undefined,
            ctaLink: updateData.ctaLink?.trim() || undefined,
            isActive: updateData.isActive !== undefined ? updateData.isActive : true
        };

        // Update promotion
        const updatedPromotion = await Promotion.findByIdAndUpdate(
            id,
            promotionUpdateData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedPromotion) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy khuyến mãi'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: updatedPromotion
        });

    } catch (error) {
        console.error('Error updating promotion:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Lỗi cập nhật khuyến mãi'
            },
            { status: 500 }
        );
    }
});

// DELETE handler - Delete promotion
export const DELETE = withMongo(async (request: NextRequest): Promise<NextResponse<PromotionResponse>> => {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        // Validate promotion ID
        if (!id || !isValidObjectId(id)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'ID khuyến mãi không hợp lệ'
                },
                { status: 400 }
            );
        }

        // Delete promotion
        const deletedPromotion = await Promotion.findByIdAndDelete(id);

        if (!deletedPromotion) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy khuyến mãi'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: { id: deletedPromotion._id }
        });

    } catch (error) {
        console.error('Error deleting promotion:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Lỗi xóa khuyến mãi'
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
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
