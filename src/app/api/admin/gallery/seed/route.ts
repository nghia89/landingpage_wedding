import { NextRequest, NextResponse } from 'next/server';
import { withMongo } from '@/lib/withMongo';
import Gallery from '@/models/Gallery';

async function seedGalleries() {
    try {
        // Xóa dữ liệu cũ
        await Gallery.deleteMany({});

        // Dữ liệu mẫu cho gallery
        const sampleGalleries = [
            {
                title: "Tiệc cưới lãng mạn tại resort biển",
                description: "Một tiệc cưới đầy lãng mạn với khung cảnh hoàng hôn tuyệt đẹp bên bờ biển",
                imageUrl: "/gallery/gallery1.jpeg"
            },
            {
                title: "Trang trí tiệc cưới vintage elegant",
                description: "Phong cách vintage cổ điển với tông màu pastel nhẹ nhàng và hoa tươi",
                imageUrl: "/gallery/gallery2.jpeg"
            },
            {
                title: "Ceremony outdoor trong vườn",
                description: "Lễ cưới ngoài trời trong khuôn viên vườn xanh mát với ánh nến lung linh",
                imageUrl: "/gallery/gallery3.jpeg"
            },
            {
                title: "Reception hall sang trọng",
                description: "Không gian tiệc cưới trong nhà với thiết kế luxury và ánh sáng ấm áp",
                imageUrl: "/gallery/gallery4.jpeg"
            },
            {
                title: "Booth chụp ảnh cưới độc đáo",
                description: "Góc chụp ảnh cưới được trang trí theo phong cách boho chic hiện đại",
                imageUrl: "/gallery/gallery5.jpeg"
            },
            {
                title: "Tiệc cưới minimalist hiện đại",
                description: "Thiết kế tối giản với tông màu trắng chủ đạo và điểm nhấn vàng gold",
                imageUrl: "/gallery/gallery6.jpeg"
            },
            {
                title: "Trang trí backdrop ceremonial",
                description: "Backdrop lễ cưới với hoa tươi và vải voan tạo nên không gian thiêng liêng",
                imageUrl: "/gallery/gallery7.jpeg"
            },
            {
                title: "Table setting cho tiệc cưới",
                description: "Cách bày trí bàn tiệc với chất liệu cao cấp và màu sắc hài hòa",
                imageUrl: "/gallery/gallery8.jpeg"
            }
        ];

        // Thêm dữ liệu mẫu
        const createdGalleries = await Gallery.insertMany(sampleGalleries);

        return NextResponse.json({
            success: true,
            message: `Đã tạo ${createdGalleries.length} ảnh mẫu thành công`,
            data: {
                count: createdGalleries.length,
                galleries: createdGalleries
            }
        });

    } catch (error: any) {
        console.error('Lỗi khi tạo dữ liệu mẫu gallery:', error);
        return NextResponse.json({
            success: false,
            message: 'Lỗi khi tạo dữ liệu mẫu gallery',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

export const GET = withMongo(seedGalleries);
