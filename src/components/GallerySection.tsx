"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

interface GalleryImage {
    src: string;
    alt: string;
    category: string;
}

export default function GallerySection() {
    const galleryImages = useMemo<GalleryImage[]>(() => [
        {
            src: "/gallery/gallery1.jpeg",
            alt: "Tiệc cưới sang trọng trong sảnh lớn",
            category: "Sảnh tiệc"
        },
        {
            src: "/gallery/gallery2.jpeg",
            alt: "Không gian trang trí lãng mạn",
            category: "Trang trí"
        },
        {
            src: "/gallery/gallery3.jpeg",
            alt: "Bàn tiệc được trang trí tinh tế",
            category: "Thiết kế bàn"
        },
        {
            src: "/gallery/gallery3.jpeg",
            alt: "Khoảnh khắc hạnh phúc của cô dâu chú rể",
            category: "Khoảnh khắc"
        },
        {
            src: "/gallery/gallery3.jpeg",
            alt: "Sân khấu cưới đẹp lung linh",
            category: "Sân khấu"
        },
        {
            src: "/gallery/gallery3.jpeg",
            alt: "Tiệc cưới ngoài trời trong vườn",
            category: "Ngoài trời"
        },
        {
            src: "/gallery/gallery3.jpeg",
            alt: "Bánh cưới và trang trí ngọt ngào",
            category: "Bánh cưới"
        },
        {
            src: "/gallery/gallery3.jpeg",
            alt: "Khu vực chụp ảnh cưới lãng mạn",
            category: "Photo booth"
        }
    ], []);

    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const openLightbox = (image: GalleryImage, index: number) => {
        setSelectedImage(image);
        setSelectedIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        setSelectedImage(null);
    };

    const goToNext = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const nextIndex = (selectedIndex + 1) % galleryImages.length;
        setSelectedIndex(nextIndex);
        setSelectedImage(galleryImages[nextIndex]);
    };

    const goToPrevious = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const prevIndex = selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1;
        setSelectedIndex(prevIndex);
        setSelectedImage(galleryImages[prevIndex]);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isLightboxOpen) return;

            if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = (selectedIndex + 1) % galleryImages.length;
                setSelectedIndex(nextIndex);
                setSelectedImage(galleryImages[nextIndex]);
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1;
                setSelectedIndex(prevIndex);
                setSelectedImage(galleryImages[prevIndex]);
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                closeLightbox();
            }
        };

        if (isLightboxOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isLightboxOpen, selectedIndex, galleryImages]);

    return (
        <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-rose-50/50 relative">
            {/* Decorative elements */}
            <div className="absolute top-20 right-10 w-32 h-32 bg-pink-200 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute bottom-32 left-16 w-24 h-24 bg-amber-200 rounded-full opacity-20 animate-pulse delay-500"></div>

            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <span className="text-sm font-medium tracking-widest text-rose-600 uppercase mb-2 block">
                        Những khoảnh khắc đặc biệt
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                        Khoảnh khắc đáng nhớ
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-8 rounded-full"></div>
                    <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
                        Cùng ngắm nhìn những hình ảnh tuyệt đẹp từ các buổi tiệc cưới mà chúng tôi đã thực hiện,
                        mỗi khoảnh khắc đều là một tác phẩm nghệ thuật.
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-8xl mx-auto">
                    {galleryImages.map((image, index) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(image, index)}
                            className={`group relative bg-white rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-700 cursor-pointer ${index === 0 ? 'md:col-span-2 lg:col-span-2 md:row-span-2' :
                                index === 3 ? 'lg:col-span-2' : ''
                                }`}
                        >
                            <div className={`relative ${index === 0 ? 'aspect-[1/1] md:aspect-[1/1]' :
                                index === 3 ? 'aspect-[2/1]' :
                                    'aspect-square'
                                } bg-gradient-to-br from-rose-100 to-pink-100`}>
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />

                                {/* Elegant overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                                {/* Content overlay */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    <div className="text-white">
                                        <span className="text-sm font-medium text-pink-200 tracking-wide uppercase">
                                            {image.category}
                                        </span>
                                        <p className="font-serif text-lg font-medium mt-1 leading-tight">
                                            {image.alt}
                                        </p>
                                    </div>
                                </div>

                                {/* Zoom icon */}
                                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 delay-200">
                                    <svg
                                        className="w-5 h-5 text-gray-700"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Bottom accent */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                        </div>
                    ))}
                </div>

                {/* View More Button */}
                <div className="text-center mt-16 lg:mt-20">
                    <button
                        onClick={() => openLightbox(galleryImages[0], 0)}
                        className="group bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 text-lg tracking-wide"
                    >
                        <span className="flex items-center justify-center space-x-2">
                            <span>Xem thêm ảnh</span>
                            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
                    onClick={closeLightbox}
                >
                    <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Previous Button */}
                        <button
                            onClick={(e) => goToPrevious(e)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-300 hover:scale-110 group"
                        >
                            <svg className="w-8 h-8 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={(e) => goToNext(e)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-300 hover:scale-110 group"
                        >
                            <svg className="w-8 h-8 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 left-4 z-20 bg-black/50 text-white px-4 py-2 rounded-full text-lg font-medium">
                            {selectedIndex + 1} / {galleryImages.length}
                        </div>

                        {/* Image Container */}
                        <div
                            className="relative w-full h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                width={1920}
                                height={1080}
                                className="object-contain w-full h-full max-w-full max-h-full rounded-lg shadow-2xl"
                                priority
                            />

                            {/* Image Info Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4">
                                <div className="text-white">
                                    <span className="inline-block bg-rose-500 text-sm px-4 py-2 rounded-full mb-3 font-semibold">
                                        {selectedImage.category}
                                    </span>
                                    <p className="text-xl font-medium leading-relaxed">{selectedImage.alt}</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Hint */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 text-center">
                            <div className="bg-black/50 px-6 py-3 rounded-full">
                                <p className="text-lg font-medium">Bấm bên ngoài để đóng</p>
                                <p className="text-sm mt-1 opacity-75">← → để chuyển ảnh • ESC để đóng</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
