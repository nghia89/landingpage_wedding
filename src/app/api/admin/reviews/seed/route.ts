import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Review from '@/models/Review';

// GET /api/admin/reviews/seed - Tạo dữ liệu mẫu cho đánh giá
export async function GET(request: NextRequest) {
    try {
        await connectMongo();

        // Xóa tất cả đánh giá hiện tại (chỉ để testing)
        await Review.deleteMany({});

        // Dữ liệu mẫu đánh giá
        const sampleReviews = [
            {
                customerName: 'Nguyễn Thị Hằng',
                avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b056b8dd?w=150&h=150&fit=crop&crop=face',
                content: 'Dịch vụ tổ chức tiệc cưới tuyệt vời! Đội ngũ rất chuyên nghiệp và tận tâm. Ngày cưới của chúng tôi thật hoàn hảo và đáng nhớ. Cảm ơn team rất nhiều!',
                rating: 5,
                eventDate: new Date('2024-06-15')
            },
            {
                customerName: 'Lê Văn Minh',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                content: 'Chất lượng dịch vụ vượt ngoài mong đợi. Không gian trang trí đẹp, âm thanh ánh sáng chuyên nghiệp. Sẽ giới thiệu cho bạn bè khi có dịp.',
                rating: 5,
                eventDate: new Date('2024-07-20')
            },
            {
                customerName: 'Trần Thị Mai',
                avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                content: 'Đặc biệt ấn tượng với dịch vụ trang trí và chụp ảnh cưới. Những khoảnh khắc được ghi lại rất tự nhiên và đẹp. Giá cả hợp lý, dịch vụ chất lượng.',
                rating: 4,
                eventDate: new Date('2024-08-10')
            },
            {
                customerName: 'Phạm Đức Thành',
                avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                content: 'Team hỗ trợ rất nhiệt tình và chu đáo. Từ lúc tư vấn đến khi thực hiện đều rất chuyên nghiệp. Cô dâu chú rể và gia đình đều rất hài lòng.',
                rating: 5,
                eventDate: new Date('2024-09-05')
            },
            {
                customerName: 'Hoàng Thị Lan',
                avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
                content: 'Dịch vụ tốt, giá cả phải chăng. Nhân viên làm việc nhanh gọn và hiệu quả. Tiệc cưới diễn ra suôn sẻ, khách mời đều khen ngợi.',
                rating: 4,
                eventDate: new Date('2024-05-25')
            },
            {
                customerName: 'Đỗ Văn Hùng',
                avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
                content: 'Rất hài lòng với dịch vụ MC và âm thanh. Chương trình được dẫn dắt sôi động và vui nhộn. Tất cả khách mời đều có những giây phút vui vẻ.',
                rating: 5,
                eventDate: new Date('2024-10-12')
            },
            {
                customerName: 'Ngô Thị Thu',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
                content: 'Dịch vụ ổn, đúng cam kết. Một vài chi tiết nhỏ cần cải thiện nhưng nhìn chung vẫn hài lòng với chất lượng tổng thể.',
                rating: 4,
                eventDate: new Date('2024-04-18')
            },
            {
                customerName: 'Bùi Minh Tuấn',
                avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
                content: 'Đội ngũ rất chuyên nghiệp và có kinh nghiệm. Tư vấn chi tiết và thực hiện đúng cam kết. Ngày cưới diễn ra thành công tốt đẹp.',
                rating: 5,
                eventDate: new Date('2024-11-08')
            }
        ];

        // Tạo các đánh giá mẫu
        const createdReviews = await Review.insertMany(sampleReviews);

        return NextResponse.json({
            success: true,
            message: `Đã tạo ${createdReviews.length} đánh giá mẫu thành công`,
            data: createdReviews
        });

    } catch (error: any) {
        console.error('Error seeding reviews:', error);
        return NextResponse.json({
            success: false,
            message: 'Lỗi khi tạo dữ liệu mẫu đánh giá',
            error: error.message
        }, { status: 500 });
    }
}
