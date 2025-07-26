import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Review from '@/models/Review';

// GET /api/admin/reviews - Lấy danh sách đánh giá
export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const rating = searchParams.get('rating');

        // Tạo query filter
        let query: any = {};

        // Tìm kiếm theo tên khách hàng hoặc nội dung
        if (search) {
            query.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // Lọc theo số sao
        if (rating && !isNaN(parseInt(rating))) {
            query.rating = parseInt(rating);
        }

        // Tính pagination
        const skip = (page - 1) * limit;

        // Lấy dữ liệu với pagination
        const [reviews, total] = await Promise.all([
            Review.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Review.countDocuments(query)
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            message: 'Lấy danh sách đánh giá thành công',
            data: reviews,
            pagination: {
                page,
                limit,
                total,
                pages: totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error: any) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({
            success: false,
            message: 'Lỗi server khi lấy danh sách đánh giá',
            error: error.message
        }, { status: 500 });
    }
}

// POST /api/admin/reviews - Tạo đánh giá mới
export async function POST(request: NextRequest) {
    try {
        await connectMongo();

        const body = await request.json();
        const { customerName, avatarUrl, content, rating, eventDate } = body;

        // Validation
        if (!customerName || !avatarUrl || !content || !rating || !eventDate) {
            return NextResponse.json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            }, { status: 400 });
        }

        // Kiểm tra rating hợp lệ
        if (rating < 1 || rating > 5) {
            return NextResponse.json({
                success: false,
                message: 'Số sao đánh giá phải từ 1 đến 5'
            }, { status: 400 });
        }

        // Kiểm tra eventDate hợp lệ
        const eventDateObj = new Date(eventDate);
        if (isNaN(eventDateObj.getTime())) {
            return NextResponse.json({
                success: false,
                message: 'Ngày diễn ra sự kiện không hợp lệ'
            }, { status: 400 });
        }

        // Tạo review mới
        const newReview = new Review({
            customerName: customerName.trim(),
            avatarUrl: avatarUrl.trim(),
            content: content.trim(),
            rating: parseInt(rating),
            eventDate: eventDateObj
        });

        const savedReview = await newReview.save();

        return NextResponse.json({
            success: true,
            message: 'Tạo đánh giá thành công',
            data: savedReview
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating review:', error);

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
            message: 'Lỗi server khi tạo đánh giá',
            error: error.message
        }, { status: 500 });
    }
}
