"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface GalleryImage {
    imageUrl: string;
    title?: string;
    description?: string;
}

interface GalleryApiResponse {
    success: boolean;
    message: string;
    data: GalleryImage[];
}

export default function GallerySection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<HTMLDivElement>(null);

    // State for API data
    const [galleries, setGalleries] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Display settings
    const [showAll, setShowAll] = useState(false);
    const displayLimit = 8;

    // Lightbox state
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Fetch galleries from API
    useEffect(() => {
        const fetchGalleries = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/gallery?limit=100');
                const data: GalleryApiResponse = await response.json();

                if (data.success && data.data) {
                    setGalleries(data.data);
                } else {
                    setError('Không thể tải thư viện ảnh');
                }
            } catch (err) {
                console.error('Error fetching galleries:', err);
                setError('Không thể tải thư viện ảnh');
            } finally {
                setLoading(false);
            }
        };

        fetchGalleries();
    }, []);

    // Determine which images to display
    const displayedGalleries = showAll ? galleries : galleries.slice(0, displayLimit);

    // Lightbox functions
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
        const nextIndex = (selectedIndex + 1) % displayedGalleries.length;
        setSelectedIndex(nextIndex);
        setSelectedImage(displayedGalleries[nextIndex]);
    };

    const goToPrevious = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const prevIndex = selectedIndex === 0 ? displayedGalleries.length - 1 : selectedIndex - 1;
        setSelectedIndex(prevIndex);
        setSelectedImage(displayedGalleries[prevIndex]);
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isLightboxOpen) {
                switch (e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        goToNext();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        goToPrevious();
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, selectedIndex, displayedGalleries]);

    return (
        <section
            id='gallery'
            ref={sectionRef}
            className="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Thư Viện{" "}
                        <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            Khoảnh Khắc
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Những khoảnh khắc đẹp nhất từ các tiệc cưới mà chúng tôi đã thực hiện
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
                        <span className="ml-4 text-gray-600 text-lg">Đang tải thư viện ảnh...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-20">
                        <div className="text-red-600 text-lg mb-4">
                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Gallery Grid */}
                {!loading && !error && displayedGalleries.length > 0 && (
                    <>
                        <div
                            ref={imagesRef}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
                        >
                            {displayedGalleries.map((image, index) => (
                                <div
                                    key={index}
                                    className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                                    onClick={() => openLightbox(image, index)}
                                >
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.title || `Gallery image ${index + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        {image.title && (
                                            <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                                                {image.title}
                                            </h3>
                                        )}
                                        {image.description && (
                                            <p className="text-xs opacity-90 line-clamp-2">
                                                {image.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Show More/Less Button */}
                        {galleries.length > displayLimit && (
                            <div className="text-center">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    {showAll ? (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                            Thu gọn
                                        </>
                                    ) : (
                                        <>
                                            Xem thêm ({galleries.length - displayLimit} ảnh)
                                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Empty State */}
                {!loading && !error && displayedGalleries.length === 0 && (
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">Chưa có ảnh nào</h3>
                        <p className="text-gray-600">Thư viện ảnh đang được cập nhật</p>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {isLightboxOpen && selectedImage && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
                    <div className="relative max-w-4xl max-h-full">
                        <Image
                            src={selectedImage.imageUrl}
                            alt={selectedImage.title || 'Gallery image'}
                            width={800}
                            height={600}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />
                        {(selectedImage.title || selectedImage.description) && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 rounded-b-lg">
                                {selectedImage.title && (
                                    <h3 className="font-semibold text-lg mb-1">{selectedImage.title}</h3>
                                )}
                                {selectedImage.description && (
                                    <p className="text-sm opacity-90">{selectedImage.description}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    {displayedGalleries.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                        {selectedIndex + 1} / {displayedGalleries.length}
                    </div>
                </div>
            )}
        </section>
    );
}
