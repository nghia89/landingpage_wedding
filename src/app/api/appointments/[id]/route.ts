import { NextRequest, NextResponse } from 'next/server';
import withMongo from '@/lib/withMongo';
import Appointment from '@/models/Appointment';

// GET - Get single appointment by ID
export const GET = withMongo(async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
    try {
        const { id } = await context.params;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return NextResponse.json(
                { success: false, error: 'Appointment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: appointment
        });

    } catch (error) {
        console.error('Error fetching appointment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch appointment' },
            { status: 500 }
        );
    }
});

// PUT - Update appointment by ID
export const PUT = withMongo(async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
    try {
        const { id } = await context.params;
        const body = await request.json();

        // Update appointment
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!appointment) {
            return NextResponse.json(
                { success: false, error: 'Appointment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: appointment
        });

    } catch (error) {
        console.error('Error updating appointment:', error);

        // Handle validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, error: 'Invalid appointment data', details: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to update appointment' },
            { status: 500 }
        );
    }
});

// DELETE - Delete appointment by ID
export const DELETE = withMongo(async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
    try {
        const { id } = await context.params;

        // Delete appointment
        const appointment = await Appointment.findByIdAndDelete(id);

        if (!appointment) {
            return NextResponse.json(
                { success: false, error: 'Appointment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Appointment deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting appointment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete appointment' },
            { status: 500 }
        );
    }
});
