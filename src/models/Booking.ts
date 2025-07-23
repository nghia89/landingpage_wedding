import mongoose, { Document, Schema } from 'mongoose';

// Booking interface matching the frontend
export interface IBooking extends Document {
    customerName: string;
    phone: string;
    consultationDate: string;
    consultationTime: string;
    requirements?: string;
    status: 'pending' | 'confirmed' | 'consulted' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

// Booking schema
const bookingSchema = new Schema<IBooking>({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    consultationDate: {
        type: String,
        required: true
    },
    consultationTime: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: false,
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'consulted', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Index for better query performance
bookingSchema.index({ consultationDate: 1, consultationTime: 1 });
bookingSchema.index({ phone: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Prevent recompilation during development
const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
