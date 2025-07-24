import { NextRequest, NextResponse } from 'next/server';
import { withMongo } from '@/lib/withMongo';
import Gallery from '@/models/Gallery';
import mongoose from 'mongoose';

// GET - Lấy thông tin ảnh theo ID
async function getGalleryById(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: 'ID ảnh không hợp lệ'
            }, { status: 400 });
        }

        const gallery = await Gallery.findById(id).lean();

        if (!gallery) {
            return NextResponse.json({
                success: false,
                message: 'Không tìm thấy ảnh'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Lấy thông tin ảnh thành công',
            data: gallery
        });

    } catch (error: any) {
        console.error('Lỗi khi lấy thông tin ảnh:', error);
        return NextResponse.json({
            success: false,
            message: 'Lỗi server khi lấy thông tin ảnh',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

// PUT - Cập nhật ảnh
async function updateGallery(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await request.json();
        const { title, description, imageUrl } = body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: 'ID ảnh không hợp lệ'
            }, { status: 400 });
        }

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

        // Update gallery
        const updatedGallery = await Gallery.findByIdAndUpdate(
            id,
            {
                title: title.trim(),
                description: description.trim(),
                imageUrl: imageUrl.trim(),
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedGallery) {
            return NextResponse.json({
                success: false,
                message: 'Không tìm thấy ảnh để cập nhật'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Cập nhật ảnh thành công',
            data: updatedGallery
        });

    } catch (error: any) {
        console.error('Lỗi khi cập nhật ảnh:', error);

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
            message: 'Lỗi server khi cập nhật ảnh',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

// DELETE - Xóa ảnh
async function deleteGallery(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: 'ID ảnh không hợp lệ'
            }, { status: 400 });
        }

        const deletedGallery = await Gallery.findByIdAndDelete(id).lean();

        if (!deletedGallery) {
            return NextResponse.json({
                success: false,
                message: 'Không tìm thấy ảnh để xóa'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Xóa ảnh thành công',
            data: deletedGallery
        });

    } catch (error: any) {
        console.error('Lỗi khi xóa ảnh:', error);
        return NextResponse.json({
            success: false,
            message: 'Lỗi server khi xóa ảnh',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

export const GET = withMongo(getGalleryById);
export const PUT = withMongo(updateGallery);
export const DELETE = withMongo(deleteGallery);
