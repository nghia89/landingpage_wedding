import mongoose, { Document, Schema } from 'mongoose';

// Service interface matching the frontend
export interface IService extends Document {
    name: string;
    price: number;
    description: string;
    features: string[];
    category: 'basic' | 'standard' | 'premium' | 'luxury';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Service schema
const serviceSchema = new Schema<IService>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    features: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr: string[]) {
                return arr.length > 0;
            },
            message: 'At least one feature is required'
        }
    },
    category: {
        type: String,
        required: true,
        enum: ['basic', 'standard', 'premium', 'luxury'],
        default: 'basic'
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
});

// Index for better query performance
serviceSchema.index({ category: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ price: 1 });
serviceSchema.index({ createdAt: -1 });

// Prevent recompilation during development
const Service = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);

export default Service;
