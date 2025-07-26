import mongoose, { Schema, Document } from 'mongoose';

// Customer interface
export interface ICustomer extends Document {
    fullName: string;
    phone: string;
    email?: string;
    weddingDate: string;
    requirements: string;
    status: 'new' | 'contacted' | 'deposited' | 'in_progress' | 'completed' | 'cancelled';
    guestCount?: number;
    budget?: string;
    venue?: string;
    notes?: string;
    createdAt: Date;
}

// Customer schema
const CustomerSchema: Schema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    weddingDate: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'deposited', 'in_progress', 'completed', 'cancelled'],
        default: 'new'
    },
    guestCount: {
        type: Number,
        min: 0
    },
    budget: {
        type: String,
        trim: true
    },
    venue: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Export Customer model, check if it already exists
const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;