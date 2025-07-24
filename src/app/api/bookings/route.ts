import { NextRequest, NextResponse } from 'next/server';
import withMongo from '@/lib/withMongo';
import Booking from '@/models/Booking';
import { Resend } from 'resend';

// Initialize Resend for email notifications
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Email sending function
async function sendBookingNotificationEmail(bookingData: {
    customerName: string;
    phone: string;
    consultationDate: string;
    consultationTime: string;
    requirements?: string;
}) {
    if (!resend) {
        console.log('📧 Email would be sent (Resend API key not configured):');
        console.log('Booking notification for:', bookingData.customerName);
        return;
    }

    try {
        // Format date for display
        const formattedDate = new Date(bookingData.consultationDate).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        await resend.emails.send({
            from: 'Wedding Dreams <onboarding@resend.dev>',
            to: ['nghia891996@gmail.com'],
            subject: `Đặt lịch tư vấn mới từ ${bookingData.customerName}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #fff5f5 0%, #fef7f7 100%); border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">💒 Wedding Dreams</h1>
                        <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">Lịch tư vấn mới</p>
                    </div>
                    
                    <div style="padding: 30px;">
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                            <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 20px; font-weight: 600;">Thông tin lịch hẹn</h2>
                            
                            <div style="margin-bottom: 16px;">
                                <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Khách hàng</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${bookingData.customerName}</div>
                            </div>

                            <div style="margin-bottom: 16px;">
                                <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Số điện thoại</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">
                                    <a href="tel:${bookingData.phone}" style="color: #f43f5e; text-decoration: none;">${bookingData.phone}</a>
                                </div>
                            </div>

                            <div style="margin-bottom: 16px;">
                                <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Ngày tư vấn</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${formattedDate}</div>
                            </div>

                            <div style="margin-bottom: 16px;">
                                <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Giờ tư vấn</div>
                                <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${bookingData.consultationTime}</div>
                            </div>

                            ${bookingData.requirements ? `
                            <div style="margin-bottom: 16px;">
                                <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Ghi chú</div>
                                <div style="font-size: 14px; line-height: 1.6; color: #4b5563; background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #f43f5e;">${bookingData.requirements}</div>
                            </div>
                            ` : ''}

                            <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                                <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Thời gian đặt</div>
                                <div style="font-size: 14px; color: #6b7280;">${new Date().toLocaleString('vi-VN')}</div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 24px; text-align: center; color: #6b7280; font-size: 14px;">
                            <p style="margin: 0;">Hãy liên hệ với khách hàng để xác nhận lịch hẹn! 💝</p>
                        </div>
                    </div>
                </div>
            `,
        });

        console.log('📧 Booking notification email sent successfully');
    } catch (emailError) {
        console.error('📧 Email sending failed:', emailError);
        // Don't throw error - booking should still succeed even if email fails
    }
}

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

        // Send email notification after successful booking creation
        await sendBookingNotificationEmail({
            customerName: body.customerName,
            phone: body.phone,
            consultationDate: body.consultationDate,
            consultationTime: body.consultationTime,
            requirements: body.requirements
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
