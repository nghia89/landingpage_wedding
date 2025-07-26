import { NextRequest, NextResponse } from 'next/server';
import { withMongo } from '@/lib/withMongo';
import Service from '@/models/Service';

interface ServiceParams {
    params: Promise<{
        id: string;
    }>
}

// GET - Retrieve single service
async function getService(request: NextRequest, { params }: ServiceParams) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Service ID is required' },
                { status: 400 }
            );
        }

        const service = await Service.findById(id);

        if (!service) {
            return NextResponse.json(
                { success: false, error: 'Service not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: service
        });

    } catch (error) {
        console.error('Error fetching service:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch service' },
            { status: 500 }
        );
    }
}

// PUT - Update single service
async function updateService(request: NextRequest, { params }: ServiceParams) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Service ID is required' },
                { status: 400 }
            );
        }

        // If price is being updated, validate it
        if (body.price !== undefined) {
            const price = parseFloat(body.price);
            if (isNaN(price) || price < 0) {
                return NextResponse.json(
                    { success: false, error: 'Price must be a valid positive number' },
                    { status: 400 }
                );
            }
            body.price = price;
        }

        // If features are being updated, validate and clean them
        if (body.features) {
            if (!Array.isArray(body.features)) {
                return NextResponse.json(
                    { success: false, error: 'Features must be an array' },
                    { status: 400 }
                );
            }
            body.features = body.features.filter((f: string) => f.trim() !== '');
            if (body.features.length === 0) {
                return NextResponse.json(
                    { success: false, error: 'At least one feature is required' },
                    { status: 400 }
                );
            }
        }

        // Update service
        const service = await Service.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!service) {
            return NextResponse.json(
                { success: false, error: 'Service not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: service
        });

    } catch (error) {
        console.error('Error updating service:', error);

        // Handle validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, error: 'Invalid service data', details: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to update service' },
            { status: 500 }
        );
    }
}

// DELETE - Delete single service
async function deleteService(request: NextRequest, { params }: ServiceParams) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Service ID is required' },
                { status: 400 }
            );
        }

        // Delete service
        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return NextResponse.json(
                { success: false, error: 'Service not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Service deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete service' },
            { status: 500 }
        );
    }
}

// Export with MongoDB connection wrapper
export const GET = withMongo(getService);
export const PUT = withMongo(updateService);
export const DELETE = withMongo(deleteService);
