import { PublicSettings, PublicSettingsResponse } from '@/types/settings';
import { IGeneralSettings } from '@/app/api/settings/general/route';
import withMongo from '@/lib/withMongo';
import mongoose from 'mongoose';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Client-side function to fetch settings
export async function fetchPublicSettings(): Promise<PublicSettings | null> {
    try {
        const response = await fetch('/api/settings/general', {
            method: 'GET',
            cache: 'force-cache',
        });

        if (!response.ok) {
            console.error('Failed to fetch settings:', response.statusText);
            return null;
        }

        const result: PublicSettingsResponse = await response.json();

        if (result.success && result.data) {
            return result.data;
        }

        return null;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

// Server-side function to fetch settings directly from database
export async function fetchPublicSettingsServer(): Promise<PublicSettings | null> {
    try {
        // Import the model here to avoid circular dependencies
        const { default: mongoose } = await import('mongoose');

        // Use the existing connection
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        // Get the model
        const GeneralSettings = mongoose.models.GeneralSettings || (() => {
            const { Schema } = mongoose;
            const generalSettingsSchema = new Schema({
                brandName: { type: String, required: true, default: 'Wedding Dreams' },
                logoUrl: { type: String },
                description: { type: String, default: 'Chúng tôi tạo ra những đám cưới trong mơ với dịch vụ chuyên nghiệp và tận tâm.' },
                address: { type: String, required: true, default: 'Hà Nội, Việt Nam' },
                phone: { type: String, required: true, default: '0123456789' },
                email: { type: String, required: true, default: 'contact@weddingdreams.vn' },
                openTime: { type: String, required: true, default: '09:00' },
                closeTime: { type: String, required: true, default: '18:00' },
                facebookPage: { type: String },
                instagram: { type: String },
                website: { type: String },
                zaloUrl: { type: String },
                slogan: { type: String, default: 'Tạo nên những khoảnh khắc đáng nhớ nhất trong ngày trọng đại của bạn' }
            }, { timestamps: true });

            return mongoose.model('GeneralSettings', generalSettingsSchema);
        })();

        // Get the first (and should be only) settings document
        const settings = await GeneralSettings.findOne().lean();

        if (!settings) {
            // Return default settings if none exist
            return {
                brandName: 'Wedding Dreams',
                description: 'Chúng tôi tạo ra những đám cưới trong mơ với dịch vụ chuyên nghiệp và tận tâm.',
                address: 'Hà Nội, Việt Nam',
                phone: '0123456789',
                email: 'contact@weddingdreams.vn',
                openTime: '09:00',
                closeTime: '18:00',
                slogan: 'Tạo nên những khoảnh khắc đáng nhớ nhất trong ngày trọng đại của bạn'
            };
        }

        // Return the settings with proper type casting and serialization
        const result = settings as any;
        return {
            brandName: result.brandName || 'Wedding Dreams',
            logoUrl: result.logoUrl || undefined,
            description: result.description || 'Chúng tôi tạo ra những đám cưới trong mơ với dịch vụ chuyên nghiệp và tận tâm.',
            address: result.address || 'Hà Nội, Việt Nam',
            phone: result.phone || '0123456789',
            email: result.email || 'contact@weddingdreams.vn',
            openTime: result.openTime || '09:00',
            closeTime: result.closeTime || '18:00',
            facebookPage: result.facebookPage || undefined,
            instagram: result.instagram || undefined,
            website: result.website || undefined,
            zaloUrl: result.zaloUrl || undefined,
            slogan: result.slogan || 'Tạo nên những khoảnh khắc đáng nhớ nhất trong ngày trọng đại của bạn'
        };
    } catch (error) {
        console.error('Error fetching settings from database:', error);
        return null;
    }
}
