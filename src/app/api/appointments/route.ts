import { NextRequest, NextResponse } from 'next/server';
import { withMongo } from '@/lib/withMongo';
import Appointment from '@/models/Appointment';

// GET - Retrieve all appointments
async function getAppointments(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const status = searchParams.get('status');
        const type = searchParams.get('type');
        const date = searchParams.get('date');
        const search = searchParams.get('search');

        // Build query object
        const query: any = {};

        // Filter by status
        if (status && status !== 'all') {
            query.status = status;
        }

        // Filter by type
        if (type && type !== 'all') {
            query.type = type;
        }

        // Filter by date
        if (date) {
            query.appointmentDate = date;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { customerPhone: { $regex: search, $options: 'i' } },
                { customerEmail: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get appointments with pagination
        const appointments = await Appointment.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const total = await Appointment.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: appointments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching appointments:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch appointments' },
            { status: 500 }
        );
    }
}

// POST - Create new appointment
async function createAppointment(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['customerName', 'customerPhone', 'appointmentDate', 'appointmentTime', 'location'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create new appointment
        const appointment = await Appointment.create({
            customerName: body.customerName,
            customerPhone: body.customerPhone,
            customerEmail: body.customerEmail,
            appointmentDate: body.appointmentDate,
            appointmentTime: body.appointmentTime,
            duration: body.duration || 60,
            type: body.type || 'consultation',
            status: body.status || 'scheduled',
            notes: body.notes,
            location: body.location
        });

        return NextResponse.json({
            success: true,
            data: appointment
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating appointment:', error);

        // Handle validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, error: 'Invalid appointment data', details: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to create appointment' },
            { status: 500 }
        );
    }
}

// PUT - Update appointment
async function updateAppointment(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Appointment ID is required' },
                { status: 400 }
            );
        }

        // Update appointment
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            updateData,
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
}

// DELETE - Delete appointment
async function deleteAppointment(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Appointment ID is required' },
                { status: 400 }
            );
        }

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
}

// Export with MongoDB connection wrapper
export const GET = withMongo(getAppointments);
export const POST = withMongo(createAppointment);
export const PUT = withMongo(updateAppointment);
export const DELETE = withMongo(deleteAppointment);
