import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
    format: string;
    bytes: number;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'File must be an image' },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size must be less than 10MB' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary using signed upload
        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'wedding-uploads', // Organize uploads in a folder
                    transformation: [
                        { quality: 'auto' }, // Auto optimize quality
                        { fetch_format: 'auto' } // Auto format (WebP, AVIF when supported)
                    ]
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(buffer);
        });

        return NextResponse.json({
            success: true,
            url: (uploadResponse as CloudinaryUploadResult).secure_url,
            public_id: (uploadResponse as CloudinaryUploadResult).public_id,
            width: (uploadResponse as CloudinaryUploadResult).width,
            height: (uploadResponse as CloudinaryUploadResult).height,
            format: (uploadResponse as CloudinaryUploadResult).format,
            bytes: (uploadResponse as CloudinaryUploadResult).bytes
        });

    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json(
            {
                error: 'Upload failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
