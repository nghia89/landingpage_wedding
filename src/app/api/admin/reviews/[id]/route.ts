import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Review from '@/models/Review';
import mongoose from 'mongoose';

// GET /api/admin/reviews/[id] - Lấy thông tin đánh giá theo ID
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectMongo();
        const { id } = await context.params;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: 'ID đánh giá không hợp lệ'
            }, { status: 400 });
        }

        // Tìm đánh giá theo ID
        const review = await Review.findById(id).lean();

        if (!review) {
            return NextResponse.json({
                success: false,
                message: 'Không tìm thấy đánh giá'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Lấy thông tin đánh giá thành công',
            data: review
        });

    } catch (error: any) {
        console.error('Error fetching review:', error);
        return NextResponse.json({
            success: false,
            message: 'Lỗi server khi lấy thông tin đánh giá',
            error: error.message
        }, { status: 500 });
    }
}

// PUT /api/admin/reviews/[id] - Cập nhật đánh giá
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectMongo();

        const { id } = await context.params;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: 'ID đánh giá không hợp lệ'
            }, { status: 400 });
        }

        const body = await request.json();
        const { customerName, avatarUrl, content, rating, eventDate } = body;

        // Validation cho các trường bắt buộc nếu được cung cấp
        const updateData: any = {};

        if (customerName !== undefined) {
            if (!customerName.trim()) {
                return NextResponse.json({
                    success: false,
                    message: 'Tên khách hàng không được để trống'
                }, { status: 400 });
            }
            updateData.customerName = customerName.trim();
        }

        if (avatarUrl !== undefined) {
            if (!avatarUrl.trim()) {
                return NextResponse.json({
                    success: false,
                    message: 'Ảnh đại diện không được để trống'
                }, { status: 400 });
            }
            updateData.avatarUrl = avatarUrl.trim();
        }

        if (content !== undefined) {
            if (!content.trim()) {
                return NextResponse.json({
                    success: false,
                    message: 'Nội dung đánh giá không được để trống'
                }, { status: 400 });
            }
            updateData.content = content.trim();
        }

        if (rating !== undefined) {
            const ratingNum = parseInt(rating);
            if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
                return NextResponse.json({
                    success: false,
                    message: 'Số sao đánh giá phải từ 1 đến 5'
                }, { status: 400 });
            }
            updateData.rating = ratingNum;
        }

        if (eventDate !== undefined) {
            const eventDateObj = new Date(eventDate);
            if (isNaN(eventDateObj.getTime())) {
                return NextResponse.json({
                    success: false,
                    message: 'Ngày diễn ra sự kiện không hợp lệ'
                }, { status: 400 });
            }
            updateData.eventDate = eventDateObj;
        }

        // Cập nhật updatedAt
        updateData.updatedAt = new Date();

        // Cập nhật đánh giá
        const updatedReview = await Review.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).lean();

        if (!updatedReview) {
            return NextResponse.json({
                success: false,
                message: 'Không tìm thấy đánh giá để cập nhật'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Cập nhật đánh giá thành công',
            data: updatedReview
        });

    } catch (error: any) {
        console.error('Error updating review:', error);

        // Xử lý lỗi validation từ Mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: 'Lỗi server khi cập nhật đánh giá',
            error: error.message
        }, { status: 500 });
    }
}

// DELETE /api/admin/reviews/[id] - Xóa đánh giá
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectMongo();

        const { id } = await context.params;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: 'ID đánh giá không hợp lệ'
            }, { status: 400 });
        }

        // Xóa đánh giá
        const deletedReview = await Review.findByIdAndDelete(id).lean();

        if (!deletedReview) {
            return NextResponse.json({
                success: false,
                message: 'Không tìm thấy đánh giá để xóa'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Xóa đánh giá thành công',
            data: deletedReview
        });

    } catch (error: any) {
        console.error('Error deleting review:', error);
        return NextResponse.json({
            success: false,
            message: 'Lỗi server khi xóa đánh giá',
            error: error.message
        }, { status: 500 });
    }
}
