import mongoose, { Document, Schema } from 'mongoose';

// Appointment interface matching the frontend
export interface IAppointment extends Document {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    appointmentDate: string;
    appointmentTime: string;
    duration: number; // in minutes
    type: 'consultation' | 'venue_visit' | 'contract_signing' | 'follow_up';
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
    notes?: string;
    location: string;
    createdAt: Date;
    updatedAt: Date;
}

// Appointment schema
const appointmentSchema = new Schema<IAppointment>({
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerPhone: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    appointmentDate: {
        type: String,
        required: true
    },
    appointmentTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        default: 60
    },
    type: {
        type: String,
        required: true,
        enum: ['consultation', 'venue_visit', 'contract_signing', 'follow_up'],
        default: 'consultation'
    },
    status: {
        type: String,
        required: true,
        enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'],
        default: 'scheduled'
    },
    notes: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// Index for better query performance
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
appointmentSchema.index({ customerPhone: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ createdAt: -1 });

// Prevent recompilation during development
const Appointment = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', appointmentSchema);

export default Appointment;
