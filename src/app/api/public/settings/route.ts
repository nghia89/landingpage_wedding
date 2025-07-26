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

// Prevent recompilation during development
const GeneralSettings = mongoose.models.GeneralSettings || mongoose.model<IGeneralSettings>('GeneralSettings', generalSettingsSchema);

// Response interface
interface PublicSettingsResponse {
    success: boolean;
    data?: {
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
    };
    error?: string;
}

// GET handler - Fetch public settings
export const GET = withMongo(async (request: NextRequest): Promise<NextResponse<PublicSettingsResponse>> => {
    try {
        // Get the first (and should be only) settings document
        let settings = await GeneralSettings.findOne().lean() as IGeneralSettings | null;

        // If no settings exist, create default settings
        if (!settings) {
            const defaultSettings = new GeneralSettings({});
            settings = await defaultSettings.save() as IGeneralSettings;
        }

        // Return only public fields (exclude sensitive data)
        const publicSettings = {
            brandName: settings!.brandName,
            logoUrl: settings!.logoUrl || undefined,
            description: settings!.description || undefined,
            address: settings!.address,
            phone: settings!.phone,
            email: settings!.email,
            openTime: settings!.openTime,
            closeTime: settings!.closeTime,
            facebookPage: settings!.facebookPage || undefined,
            instagram: settings!.instagram || undefined,
            website: settings!.website || undefined,
            zaloUrl: settings!.zaloUrl || undefined,
            slogan: settings!.slogan || undefined
        };

        return NextResponse.json({
            success: true,
            data: publicSettings
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' // Cache for 5 minutes
            }
        });

    } catch (error) {
        console.error('Error fetching public settings:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Lỗi tải cài đặt'
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
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}
