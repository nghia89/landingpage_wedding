import { NextRequest, NextResponse } from 'next/server';
import { withMongo } from '@/lib/withMongo';
import Gallery from '@/models/Gallery';

// GET - Lấy danh sách ảnh cho public (landing page)
async function getPublicGalleries(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '100');

        // Get galleries sorted by creation date (newest first)
        const galleries = await Gallery.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('imageUrl title description')
            .lean();

        return NextResponse.json({
            success: true,
            message: 'Lấy danh sách ảnh thành công',
            data: galleries.map(gallery => ({
                imageUrl: gallery.imageUrl,
                title: gallery.title,
                description: gallery.description
            }))
        });

    } catch (error) {
        console.error('Error fetching public galleries:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Không thể tải danh sách ảnh'
            },
            { status: 500 }
        );
    }
}

export const GET = withMongo(getPublicGalleries);
