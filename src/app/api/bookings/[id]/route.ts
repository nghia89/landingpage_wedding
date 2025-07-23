import { NextRequest, NextResponse } from 'next/server';
import { withMongo } from '@/lib/withMongo';
import Booking from '@/models/Booking';

// GET - Get single booking by ID
async function getBooking(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const booking = await Booking.findById(id);

        if (!booking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: booking
        });

    } catch (error) {
        console.error('Error fetching booking:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch booking' },
            { status: 500 }
        );
    }
}

// PUT - Update booking by ID
async function updateBooking(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Update booking
        const booking = await Booking.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!booking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: booking
        });

    } catch (error) {
        console.error('Error updating booking:', error);

        // Handle validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, error: 'Invalid booking data', details: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to update booking' },
            { status: 500 }
        );
    }
}

// DELETE - Delete booking by ID
async function deleteBooking(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Delete booking
        const booking = await Booking.findByIdAndDelete(id);

        if (!booking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Booking deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting booking:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete booking' },
            { status: 500 }
        );
    }
}

// Export with MongoDB connection wrapper
export const GET = withMongo(getBooking);
export const PUT = withMongo(updateBooking);
export const DELETE = withMongo(deleteBooking);
