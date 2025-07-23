import { NextRequest, NextResponse } from 'next/server';
import withMongo from '@/lib/withMongo';
import Promotion from '@/models/Promotion';
import mongoose from 'mongoose';

// Response interface
interface PromotionDetailResponse {
    success: boolean;
    data?: unknown;
    error?: string;
}

// Helper function to validate ObjectId
function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}

// GET handler - Fetch single promotion by ID
export const GET = withMongo(async (
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<PromotionDetailResponse>> => {
    try {
        const { id } = params;

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

        // Find promotion by ID
        const promotion = await Promotion.findById(id).lean();

        if (!promotion) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Không tìm thấy khuyến mãi'
                },
                { status: 404 }
            );
        }

        // Add computed fields
        const now = new Date();
        const promotionData = promotion as Record<string, unknown>;
        const promotionWithStatus = {
            ...promotion,
            isCurrentlyActive: promotionData.isActive &&
                (promotionData.startDate as Date) <= now &&
                (promotionData.endDate as Date) >= now,
            status: getPromotionStatus(promotionData, now)
        };

        return NextResponse.json({
            success: true,
            data: promotionWithStatus
        });

    } catch (error) {
        console.error('Error fetching promotion detail:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Lỗi tải chi tiết khuyến mãi'
            },
            { status: 500 }
        );
    }
});

// PUT handler - Update specific promotion
export const PUT = withMongo(async (
    request: NextRequest,
    { params }: { params: { id: string } }
): Promise<NextResponse<PromotionDetailResponse>> => {
    try {
        const { id } = params;
        const body = await request.json();

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

        // Prepare update data
        const updateData = {
            title: body.title?.trim(),
            description: body.description?.trim() || undefined,
            imageUrl: body.imageUrl?.trim(),
            type: body.type,
            targetPage: body.targetPage,
            startDate: body.startDate ? new Date(body.startDate) : undefined,
            endDate: body.endDate ? new Date(body.endDate) : undefined,
            ctaText: body.ctaText?.trim() || undefined,
            ctaLink: body.ctaLink?.trim() || undefined,
            isActive: body.isActive
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key as keyof typeof updateData] === undefined) {
                delete updateData[key as keyof typeof updateData];
            }
        });

        // Update promotion
        const updatedPromotion = await Promotion.findByIdAndUpdate(
            id,
            updateData,
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

// DELETE handler - Delete specific promotion
export const DELETE = withMongo(async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<PromotionDetailResponse>> => {
    try {
        const { id } = await params;

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
            data: {
                id: deletedPromotion._id,
                title: deletedPromotion.title
            }
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

// Helper function to get promotion status
function getPromotionStatus(promotion: Record<string, unknown>, now: Date): string {
    if (!(promotion.isActive as boolean)) {
        return 'inactive';
    }

    if ((promotion.startDate as Date) > now) {
        return 'upcoming';
    }

    if ((promotion.endDate as Date) < now) {
        return 'expired';
    }

    return 'active';
}

// Helper function to validate promotion data
function validatePromotionData(data: Record<string, unknown>): string | null {
    if (data.title !== undefined && (typeof data.title !== 'string' || !data.title.trim())) {
        return 'Tiêu đề là bắt buộc';
    }

    if (data.imageUrl !== undefined && (typeof data.imageUrl !== 'string' || !data.imageUrl.trim())) {
        return 'Hình ảnh là bắt buộc';
    }

    if (data.type !== undefined && !['popup', 'banner', 'slide'].includes(data.type as string)) {
        return 'Loại hiển thị không hợp lệ';
    }

    if (data.targetPage !== undefined && !['landing', 'booking', 'homepage'].includes(data.targetPage as string)) {
        return 'Trang áp dụng không hợp lệ';
    }

    if (data.startDate !== undefined && data.endDate !== undefined) {
        const startDate = new Date(data.startDate as string);
        const endDate = new Date(data.endDate as string);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return 'Định dạng ngày không hợp lệ';
        }

        if (endDate <= startDate) {
            return 'Ngày kết thúc phải sau ngày bắt đầu';
        }
    }

    return null;
}

// OPTIONS handler for CORS
export async function OPTIONS(_request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
