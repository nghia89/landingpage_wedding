import { NextRequest, NextResponse } from 'next/server';
import withMongo from '@/lib/withMongo';
import mongoose, { Document, Schema } from 'mongoose';

// General Settings interface
export interface IGeneralSettings extends Document {
    brandName: string;
    logoUrl?: string;
    description?: string;
    address: string;
    phone: string;
    email: string;
    openTime: string;
    closeTime: string;
    facebookPage?: string;
    instagram?: string;
    website?: string;
    zaloUrl?: string;
    slogan?: string;
    createdAt: Date;
    updatedAt: Date;
}

// General Settings schema
const generalSettingsSchema = new Schema<IGeneralSettings>({
    brandName: {
        type: String,
        required: true,
        trim: true,
        default: 'Wedding Dreams'
    },
    logoUrl: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: 'Chúng tôi tạo ra những đám cưới trong mơ với dịch vụ chuyên nghiệp và tận tâm.'
    },
    address: {
        type: String,
        required: true,
        trim: true,
        default: 'Hà Nội, Việt Nam'
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        default: '0123456789'
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        default: 'contact@weddingdreams.vn'
    },
    openTime: {
        type: String,
        required: true,
        default: '09:00'
    },
    closeTime: {
        type: String,
        required: true,
        default: '18:00'
    },
    facebookPage: {
        type: String,
        trim: true
    },
    instagram: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    zaloUrl: {
        type: String,
        trim: true
    },
    slogan: {
        type: String,
        trim: true,
        default: 'Tạo nên những khoảnh khắc đáng nhớ nhất trong ngày trọng đại của bạn'
    }
}, {
    timestamps: true
});

// Create indexes for better performance
generalSettingsSchema.index({ createdAt: -1 });

// Prevent recompilation during development
const GeneralSettings = mongoose.models.GeneralSettings || mongoose.model<IGeneralSettings>('GeneralSettings', generalSettingsSchema);

// Response interface
interface GeneralSettingsResponse {
    success: boolean;
    data?: any;
    error?: string;
}

// GET handler - Fetch general settings
export const GET = withMongo(async (request: NextRequest): Promise<NextResponse<GeneralSettingsResponse>> => {
    try {
        // Get the first (and should be only) settings document
        let settings = await GeneralSettings.findOne().lean();

        // If no settings exist, create default settings
        if (!settings) {
            const defaultSettings = new GeneralSettings({});
            settings = await defaultSettings.save();
        }

        return NextResponse.json({
            success: true,
            data: settings
        });

    } catch (error) {
        console.error('Error fetching general settings:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Lỗi tải cài đặt'
            },
            { status: 500 }
        );
    }
});

// PUT handler - Update general settings
export const PUT = withMongo(async (request: NextRequest): Promise<NextResponse<GeneralSettingsResponse>> => {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['brandName', 'address', 'phone', 'email', 'openTime', 'closeTime'];
        for (const field of requiredFields) {
            if (!body[field]?.trim()) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `Trường ${field} là bắt buộc`
                    },
                    { status: 400 }
                );
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Email không hợp lệ'
                },
                { status: 400 }
            );
        }

        // Validate phone format (basic Vietnamese phone number validation)
        const phoneRegex = /^(\+84|84|0)[1-9]\d{8,9}$/;
        if (!phoneRegex.test(body.phone.replace(/\s/g, ''))) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Số điện thoại không hợp lệ'
                },
                { status: 400 }
            );
        }

        // Validate time format (HH:MM)
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(body.openTime) || !timeRegex.test(body.closeTime)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Định dạng giờ không hợp lệ (HH:MM)'
                },
                { status: 400 }
            );
        }

        // Prepare update data
        const updateData = {
            brandName: body.brandName.trim(),
            logoUrl: body.logoUrl?.trim() || undefined,
            description: body.description?.trim() || undefined,
            address: body.address.trim(),
            phone: body.phone.trim(),
            email: body.email.trim().toLowerCase(),
            openTime: body.openTime,
            closeTime: body.closeTime,
            facebookPage: body.facebookPage?.trim() || undefined,
            instagram: body.instagram?.trim() || undefined,
            website: body.website?.trim() || undefined,
            zaloUrl: body.zaloUrl?.trim() || undefined,
            slogan: body.slogan?.trim() || undefined
        };

        // Update or create settings (upsert)
        const settings = await GeneralSettings.findOneAndUpdate(
            {}, // Find the first document (should be only one)
            updateData,
            {
                upsert: true, // Create if doesn't exist
                new: true, // Return updated document
                runValidators: true // Run schema validation
            }
        );

        return NextResponse.json({
            success: true,
            data: settings
        });

    } catch (error) {
        console.error('Error updating general settings:', error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Lỗi cập nhật cài đặt'
            },
            { status: 500 }
        );
    }
});

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
