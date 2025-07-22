import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key validation
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn('⚠️ RESEND_API_KEY is not set. Email sending will be disabled.');
}

const resend = apiKey ? new Resend(apiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, weddingDate, requirements } = body;

    // Validate required fields
    if (!fullName || !phone) {
      return NextResponse.json(
        { error: 'Họ tên và số điện thoại là bắt buộc' },
        { status: 400 }
      );
    }

    // Format wedding date for display
    const formattedWeddingDate = weddingDate
      ? new Date(weddingDate).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      : 'Chưa xác định';

    try {
      // Check if Resend is available
      if (!resend) {
        console.log('📧 Email would be sent (Resend API key not configured):');
        console.log('From:', fullName);
        console.log('Phone:', phone);
        console.log('Wedding Date:', formattedWeddingDate);
        console.log('Requirements:', requirements);

        return NextResponse.json({
          success: true,
          message: 'Yêu cầu đã được ghi nhận thành công!'
        });
      }

      // Send email using Resend
      const emailResult = await resend.emails.send({
        from: 'Wedding Dreams <onboarding@resend.dev>', // You'll need to setup your own domain
        to: ['ntnghia.dev@gmail.com'],
        subject: `Yêu cầu tư vấn cưới mới từ ${fullName}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #fff5f5 0%, #fef7f7 100%); border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">💒 Wedding Dreams</h1>
              <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">Yêu cầu tư vấn cưới mới</p>
            </div>
            
            <div style="padding: 30px;">
              <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                <h2 style="color: #1f2937; margin: 0 0 20px; font-size: 20px; font-weight: 600;">Thông tin khách hàng</h2>
                
                <div style="margin-bottom: 16px;">
                  <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Họ và tên</div>
                  <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${fullName}</div>
                </div>

                <div style="margin-bottom: 16px;">
                  <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Số điện thoại</div>
                  <div style="font-size: 16px; font-weight: 600; color: #1f2937;">
                    <a href="tel:${phone}" style="color: #f43f5e; text-decoration: none;">${phone}</a>
                  </div>
                </div>

                <div style="margin-bottom: 16px;">
                  <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Ngày dự kiến cưới</div>
                  <div style="font-size: 16px; font-weight: 600; color: #1f2937;">${formattedWeddingDate}</div>
                </div>

                ${requirements ? `
                <div style="margin-bottom: 16px;">
                  <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Yêu cầu riêng</div>
                  <div style="font-size: 14px; line-height: 1.6; color: #4b5563; background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #f43f5e;">${requirements}</div>
                </div>
                ` : ''}

                <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Thời gian gửi</div>
                  <div style="font-size: 14px; color: #6b7280;">${new Date().toLocaleString('vi-VN')}</div>
                </div>
              </div>
              
              <div style="margin-top: 24px; text-align: center; color: #6b7280; font-size: 14px;">
                <p style="margin: 0;">Hãy liên hệ với khách hàng trong vòng 24h để đảm bao chất lượng dịch vụ tốt nhất! 💝</p>
              </div>
            </div>
          </div>
        `,
        text: `
Yêu cầu tư vấn cưới mới

Họ và tên: ${fullName}
Số điện thoại: ${phone}
Ngày dự kiến cưới: ${formattedWeddingDate}
Yêu cầu riêng: ${requirements || 'Không có yêu cầu đặc biệt'}

Thời gian gửi: ${new Date().toLocaleString('vi-VN')}
        `
      });

      console.log('Email sent successfully:', emailResult);

      return NextResponse.json({
        success: true,
        message: 'Đã gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24h.'
      });

    } catch (emailError) {
      console.error('Email sending error:', emailError);

      // Fallback - still log the request and return success to user
      console.log('Fallback - Email content for ntnghia.dev@gmail.com:');
      console.log({
        fullName,
        phone,
        weddingDate: formattedWeddingDate,
        requirements,
        timestamp: new Date().toLocaleString('vi-VN')
      });

      return NextResponse.json({
        success: true,
        message: 'Đã gửi yêu cầu tư vấn thành công! Chúng tôi sẽ liên hệ với bạn trong vòng 24h.'
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}
