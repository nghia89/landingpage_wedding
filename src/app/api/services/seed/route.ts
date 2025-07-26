import { NextRequest, NextResponse } from 'next/server';
import { withMongo } from '@/lib/withMongo';
import Service from '@/models/Service';

async function seedServices() {
    try {
        // Check if services already exist
        const existingCount = await Service.countDocuments();
        if (existingCount > 0) {
            return NextResponse.json({
                success: true,
                message: `Services already exist (${existingCount} services found)`,
                data: await Service.find().sort({ category: 1 })
            });
        }

        // Sample services data
        const servicesData = [
            {
                name: 'Gói Cơ Bản',
                description: 'Hoàn hảo cho tiệc cưới nhỏ',
                price: 15000000,
                features: [
                    'Trang trí cơ bản theo chủ đề',
                    'Menu 5 món chính + tráng miệng',
                    'MC dẫn chương trình',
                    'Âm thanh ánh sáng cơ bản',
                    'Hoa cưới cô dâu',
                    'Quà cưới cho khách'
                ],
                category: 'basic',
                isActive: true
            },
            {
                name: 'Gói Tiêu Chuẩn',
                description: 'Cân bằng giữa chất lượng và chi phí',
                price: 20000000,
                features: [
                    'Trang trí tiêu chuẩn đẹp mắt',
                    'Menu 6 món + buffet nhẹ',
                    'MC + hệ thống âm thanh tốt',
                    'Hoa cưới + trang trí bàn',
                    'Chụp ảnh cơ bản',
                    'Xe hoa trang trí',
                    'Quà tặng tiêu chuẩn'
                ],
                category: 'standard',
                isActive: true
            },
            {
                name: 'Gói Cao Cấp',
                description: 'Lựa chọn phổ biến nhất',
                price: 28000000,
                features: [
                    'Trang trí sang trọng cao cấp',
                    'Menu 7 món + buffet tráng miệng',
                    'MC chuyên nghiệp + DJ',
                    'Hệ thống âm thanh ánh sáng hiện đại',
                    'Hoa cưới + trang trí sân khấu',
                    'Chụp ảnh cưới trong ngày',
                    'Xe hoa trang trí',
                    'Quà tặng cao cấp'
                ],
                category: 'premium',
                isActive: true
            },
            {
                name: 'Gói Luxury VIP',
                description: 'Dành cho tiệc cưới đặc biệt',
                price: 45000000,
                features: [
                    'Thiết kế theo ý tưởng riêng',
                    'Menu tùy chọn không giới hạn',
                    'Đội ngũ tổ chức chuyên biệt',
                    'Trang trí độc đáo theo concept',
                    'Dịch vụ photography/videography',
                    'Wedding planner cá nhân',
                    'Các dịch vụ bổ sung tùy chọn',
                    'Limousine đón dâu',
                    'Phòng nghỉ cho cô dâu chú rể'
                ],
                category: 'luxury',
                isActive: true
            }
        ];

        // Create services
        const createdServices = await Service.create(servicesData);

        return NextResponse.json({
            success: true,
            message: `Successfully created ${createdServices.length} services`,
            data: createdServices
        });

    } catch (error) {
        console.error('Error seeding services:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed services' },
            { status: 500 }
        );
    }
}

export const POST = withMongo(async (request: NextRequest) => {
    return await seedServices();
});

export const GET = withMongo(async (request: NextRequest) => {
    return await seedServices();
});
