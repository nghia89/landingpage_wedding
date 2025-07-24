import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tiêu đề ảnh là bắt buộc'],
        trim: true,
        maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
    },
    description: {
        type: String,
        required: [true, 'Mô tả ảnh là bắt buộc'],
        trim: true,
        maxlength: [500, 'Mô tả không được quá 500 ký tự']
    },
    imageUrl: {
        type: String,
        required: [true, 'Đường dẫn ảnh là bắt buộc'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Tự động cập nhật createdAt và updatedAt
});

// Middleware để cập nhật updatedAt khi save
GallerySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Middleware để cập nhật updatedAt khi findOneAndUpdate
GallerySchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
    this.set({ updatedAt: new Date() });
    next();
});

const Gallery = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);

export default Gallery;
