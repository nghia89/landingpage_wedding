import { NextRequest, NextResponse } from 'next/server';
import withMongo from '@/lib/withMongo';
import Customer from '@/models/Customer';

// Internal GET handler (without MongoDB connection logic)
async function getCustomers(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Filter parameters
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build filter query
    const filter: any = {};

    // Status filter
    if (status && status !== 'all') {
        filter.status = status;
    }

    // Search filter (fullName or phone)
    if (search) {
        filter.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
        ];
    }

    // Get total count for pagination
    const totalCount = await Customer.countDocuments(filter);

    // Get customers with pagination
    const customers = await Customer.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
        success: true,
        data: customers,
        pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            limit,
            hasNextPage,
            hasPrevPage
        }
    });
}

// Internal POST handler (without MongoDB connection logic)
async function createCustomer(request: NextRequest) {
    const body = await request.json();

    // Create new customer
    const newCustomer = new Customer(body);
    const savedCustomer = await newCustomer.save();

    return NextResponse.json({
        success: true,
        data: savedCustomer
    }, { status: 201 });
}

// Export handlers wrapped with withMongo
export const GET = withMongo(async (request: NextRequest) => {
    try {
        return await getCustomers(request);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch customers'
            },
            { status: 500 }
        );
    }
});

export const POST = withMongo(async (request: NextRequest) => {
    try {
        return await createCustomer(request);
    } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create customer'
            },
            { status: 500 }
        );
    }
});
