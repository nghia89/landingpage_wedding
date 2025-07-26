import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Tên khách hàng là bắt buộc'],
        trim: true,
        maxlength: [100, 'Tên khách hàng không được quá 100 ký tự']
    },
    avatarUrl: {
        type: String,
        required: [true, 'Ảnh đại diện là bắt buộc'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Nội dung đánh giá là bắt buộc'],
        trim: true,
        maxlength: [1000, 'Nội dung đánh giá không được quá 1000 ký tự']
    },
    rating: {
        type: Number,
        required: [true, 'Số sao đánh giá là bắt buộc'],
        min: [1, 'Số sao tối thiểu là 1'],
        max: [5, 'Số sao tối đa là 5']
    },
    eventDate: {
        type: Date,
        required: [true, 'Ngày diễn ra sự kiện là bắt buộc']
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

// Middleware để cập nhật updatedAt trước khi lưu
ReviewSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Middleware để cập nhật updatedAt khi findOneAndUpdate
ReviewSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() });
    next();
});

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

export default Review;
