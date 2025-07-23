import { NextRequest, NextResponse } from 'next/server';
import { withMongo } from '@/lib/withMongo';
import Service from '@/models/Service';

// GET - Retrieve all services
async function getServices(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const category = searchParams.get('category');
        const isActive = searchParams.get('isActive');
        const search = searchParams.get('search');

        // Build query object
        const query: any = {};

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by active status
        if (isActive && isActive !== 'all') {
            query.isActive = isActive === 'true';
        }

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { features: { $elemMatch: { $regex: search, $options: 'i' } } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Get services with pagination
        const services = await Service.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const total = await Service.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: services,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch services' },
            { status: 500 }
        );
    }
}

// POST - Create new service
async function createService(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['name', 'price', 'description', 'features'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { success: false, error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Validate features array
        if (!Array.isArray(body.features) || body.features.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Features must be a non-empty array' },
                { status: 400 }
            );
        }

        // Validate price
        const price = parseFloat(body.price);
        if (isNaN(price) || price < 0) {
            return NextResponse.json(
                { success: false, error: 'Price must be a valid positive number' },
                { status: 400 }
            );
        }

        // Create new service
        const service = await Service.create({
            name: body.name,
            price: price,
            description: body.description,
            features: body.features.filter((f: string) => f.trim() !== ''), // Remove empty features
            category: body.category || 'basic',
            isActive: body.isActive !== undefined ? body.isActive : true
        });

        return NextResponse.json({
            success: true,
            data: service
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating service:', error);

        // Handle validation errors
        if (error instanceof Error && error.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, error: 'Invalid service data', details: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Failed to create service' },
            { status: 500 }
        );
    }
}

// PUT - Update service
async function updateService(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Service ID is required' },
                { status: 400 }
            );
        }

        // If price is being updated, validate it
        if (updateData.price !== undefined) {
            const price = parseFloat(updateData.price);
            if (isNaN(price) || price < 0) {
                return NextResponse.json(
                    { success: false, error: 'Price must be a valid positive number' },
                    { status: 400 }
                );
            }
            updateData.price = price;
        }

        // If features are being updated, validate and clean them
        if (updateData.features) {
            if (!Array.isArray(updateData.features)) {
                return NextResponse.json(
                    { success: false, error: 'Features must be an array' },
                    { status: 400 }
                );
            }
            updateData.features = updateData.features.filter((f: string) => f.trim() !== '');
            if (updateData.features.length === 0) {
                return NextResponse.json(
                    { success: false, error: 'At least one feature is required' },
                    { status: 400 }
                );
            }
        }

        // Update service
        const service = await Service.findByIdAndUpdate(
            id,
            updateData,
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

// DELETE - Delete service
async function deleteService(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

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
export const GET = withMongo(getServices);
export const POST = withMongo(createService);
export const PUT = withMongo(updateService);
export const DELETE = withMongo(deleteService);
