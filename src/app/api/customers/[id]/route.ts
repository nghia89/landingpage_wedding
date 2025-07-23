import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Customer from '@/models/Customer';

// PUT: Update customer by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectMongo();

        const body = await request.json();
        const { id } = params;

        // Update customer
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedCustomer) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Customer not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: updatedCustomer
        });
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update customer'
            },
            { status: 500 }
        );
    }
}

// DELETE: Delete customer by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectMongo();

        const { id } = params;

        // Delete customer
        const deletedCustomer = await Customer.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Customer not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Customer deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting customer:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to delete customer'
            },
            { status: 500 }
        );
    }
}

// GET: Get customer by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectMongo();

        const { id } = params;

        // Get customer by ID
        const customer = await Customer.findById(id);

        if (!customer) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Customer not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: customer
        });
    } catch (error) {
        console.error('Error fetching customer:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch customer'
            },
            { status: 500 }
        );
    }
}
