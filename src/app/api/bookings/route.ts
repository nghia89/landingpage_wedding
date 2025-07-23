import { NextRequest, NextResponse } from 'next/server';
import withMongo from '@/lib/withMongo';
import Booking from '@/models/Booking';

// GET - Retrieve all bookings
async function getBookings(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const date = searchParams.get('date');
        const search = searchParams.get('search');

        // Build query object
        const query: Record<string, unknown> = {};

        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }

        // Filter by date
        if (date) {
            query.consultationDate = date;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { requirements: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get bookings with pagination
        const bookings = await Booking.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const total = await Booking.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: bookings,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch bookings' },
            { status: 500 }
        );
    }
}

// POST - Create new booking
async function createBooking(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['customerName', 'phone', 'consultationDate', 'consultationTime'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create new booking
        const booking = await Booking.create({
            customerName: body.customerName,
            phone: body.phone,
            consultationDate: body.consultationDate,
            consultationTime: body.consultationTime,
            requirements: body.requirements,
            status: body.status || 'pending'
        });

        return NextResponse.json({
            success: true,
            data: booking
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating booking:', error);

        // Handle validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, error: 'Invalid booking data', details: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}

// PUT - Update booking
async function updateBooking(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Booking ID is required' },
                { status: 400 }
            );
        }

        // Update booking
        const booking = await Booking.findByIdAndUpdate(
            id,
            updateData,
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

// DELETE - Delete booking
async function deleteBooking(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Booking ID is required' },
                { status: 400 }
            );
        }

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
export const GET = withMongo(async (request: NextRequest) => {
    return getBookings(request);
});

export const POST = withMongo(async (request: NextRequest) => {
    return createBooking(request);
});

export const PUT = withMongo(async (request: NextRequest) => {
    return updateBooking(request);
});

export const DELETE = withMongo(async (request: NextRequest) => {
    return deleteBooking(request);
});
