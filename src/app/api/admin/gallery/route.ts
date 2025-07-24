import { NextRequest, NextResponse } from 'next/server';
import { withMongo } from '@/lib/withMongo';
import Gallery from '@/models/Gallery';

// GET - Lấy danh sách ảnh
async function getGalleries(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search');

        // Build query object
        const query: any = {};

        // Search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get galleries with pagination
        const galleries = await Gallery.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const total = await Gallery.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            message: 'Lấy danh sách ảnh thành công',
            data: galleries,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error: any) {
        console.error('Lỗi khi lấy danh sách ảnh:', error);
        return NextResponse.json({
            success: false,
            message: 'Lỗi server khi lấy danh sách ảnh',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

// POST - Thêm ảnh mới
async function createGallery(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, imageUrl } = body;

        // Validation
        if (!title || !description || !imageUrl) {
            return NextResponse.json({
                success: false,
                message: 'Thiếu thông tin bắt buộc (title, description, imageUrl)'
            }, { status: 400 });
        }

        // Kiểm tra URL ảnh hợp lệ
        try {
            new URL(imageUrl);
        } catch {
            return NextResponse.json({
                success: false,
                message: 'URL ảnh không hợp lệ'
            }, { status: 400 });
        }

        // Tạo gallery mới
        const newGallery = new Gallery({
            title: title.trim(),
            description: description.trim(),
            imageUrl: imageUrl.trim()
        });

        const savedGallery = await newGallery.save();

        return NextResponse.json({
            success: true,
            message: 'Thêm ảnh thành công',
            data: savedGallery
        }, { status: 201 });

    } catch (error: any) {
        console.error('Lỗi khi thêm ảnh:', error);

        // Mongoose validation error
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: messages
            }, { status: 400 });
        }

        return NextResponse.json({
            success: false,
            message: 'Lỗi server khi thêm ảnh',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

export const GET = withMongo(getGalleries);
export const POST = withMongo(createGallery);
