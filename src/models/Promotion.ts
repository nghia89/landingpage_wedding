import mongoose, { Document, Schema } from 'mongoose';

// Promotion interface
export interface IPromotion extends Document {
    title: string;
    description?: string;
    imageUrl: string;
    type: 'popup' | 'banner' | 'slide';
    targetPage: 'landing' | 'booking' | 'homepage';
    startDate: Date;
    endDate: Date;
    ctaText?: string;
    ctaLink?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Promotion schema
const promotionSchema = new Schema<IPromotion>({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['popup', 'banner', 'slide'],
        default: 'banner'
    },
    targetPage: {
        type: String,
        required: true,
        enum: ['landing', 'booking', 'homepage'],
        default: 'homepage'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (this: IPromotion, value: Date) {
                return value > this.startDate;
            },
            message: 'Ngày kết thúc phải sau ngày bắt đầu'
        }
    },
    ctaText: {
        type: String,
        trim: true,
        maxlength: 50
    },
    ctaLink: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
promotionSchema.index({ isActive: 1 });
promotionSchema.index({ targetPage: 1 });
promotionSchema.index({ type: 1 });
promotionSchema.index({ startDate: 1, endDate: 1 });
promotionSchema.index({ createdAt: -1 });
promotionSchema.index({ title: 'text', description: 'text' }); // Text search index

// Virtual to check if promotion is currently valid
promotionSchema.virtual('isCurrentlyActive').get(function (this: IPromotion) {
    const now = new Date();
    return this.isActive && this.startDate <= now && this.endDate >= now;
});

// Prevent recompilation during development
const Promotion = mongoose.models.Promotion || mongoose.model<IPromotion>('Promotion', promotionSchema);

export default Promotion;
