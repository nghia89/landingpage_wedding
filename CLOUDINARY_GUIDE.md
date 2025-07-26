# Hướng dẫn sử dụng ImageUploadCloudinary (Signed Upload)

## 🎯 Mục đích

Component `ImageUploadCloudinary` cho phép upload ảnh an toàn lên Cloudinary thông qua backend API với signed upload, đảm bảo bảo mật cao.

## 🚀 Cài đặt và cấu hình

### 1. Dependencies đã được cài đặt:

- `axios` - Để gọi API backend
- `clsx` - Để xử lý className conditional
- `cloudinary` - SDK cho signed upload trên server

### 2. Cấu hình Environment Variables

Cập nhật file `.env.local`:

```bash
# Cloudinary Configuration (Signed Upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Lấy Cloudinary Credentials:

1. Đăng nhập vào [Cloudinary Dashboard](https://cloudinary.com)
2. Vào Dashboard → Settings → Security
3. Copy **Cloud Name**, **API Key**, và **API Secret**
4. Paste vào file `.env.local`
5. **LƯU Ý**: API Secret chỉ được sử dụng trên server, không expose ra client

## 📖 Cách sử dụng

### Import component:

```tsx
import ImageUploadCloudinary from "@/components/admin/ImageUploadCloudinary";
```

### Sử dụng trong form:

```tsx
const [formData, setFormData] = useState({
  // ... other fields
  imageUrl: "",
});

// Trong JSX
<ImageUploadCloudinary
  onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
  defaultValue={formData.imageUrl}
  label="Chọn ảnh"
  className="w-full"
  disabled={false}
/>;
```

## 📋 Props API

| Prop           | Type                    | Required | Default         | Mô tả                          |
| -------------- | ----------------------- | -------- | --------------- | ------------------------------ |
| `onUpload`     | `(url: string) => void` | ✅       | -               | Callback khi upload thành công |
| `defaultValue` | `string`                | ❌       | `''`            | URL ảnh có sẵn để hiển thị     |
| `label`        | `string`                | ❌       | `"Tải ảnh lên"` | Label cho input                |
| `className`    | `string`                | ❌       | `''`            | CSS class tùy chỉnh            |
| `disabled`     | `boolean`               | ❌       | `false`         | Vô hiệu hóa upload             |

## ✨ Tính năng

- ✅ **Drag & Drop**: Kéo thả file vào vùng upload
- ✅ **Click to Select**: Bấm để chọn file từ máy tính
- ✅ **Image Preview**: Hiển thị preview ảnh sau khi upload
- ✅ **File Validation**: Kiểm tra loại file (chỉ nhận image/\*) và kích thước (max 10MB)
- ✅ **Loading State**: Hiển thị spinner trong quá trình upload
- ✅ **Error Handling**: Hiển thị lỗi nếu upload thất bại
- ✅ **Replace Image**: Cho phép thay đổi ảnh đã upload
- ✅ **Remove Image**: Xóa ảnh và reset URL
- ✅ **Responsive Design**: Tự động responsive trên mobile/desktop

## 🎨 UI/UX Features

- Modern gradient design phù hợp với admin theme
- Smooth animations và transitions
- Clear visual feedback cho các trạng thái
- Accessible với proper ARIA labels
- Toast notifications cho success/error

## 🛠️ Đã tích hợp vào:

1. **Settings Page** (`/admin/settings`):
   - Thay thế input "Logo URL" → ImageUploadCloudinary

2. **Gallery Page** (`/admin/gallery`):
   - Thay thế input "URL ảnh" → ImageUploadCloudinary

3. **Reviews Page** (`/admin/reviews`):
   - Thay thế input "URL Avatar" → ImageUploadCloudinary

## 🔧 Test Component

Để test component, vào: [http://localhost:3000/admin/test-upload](http://localhost:3000/admin/test-upload)

## 📝 Ví dụ thêm vào form mới

```tsx
"use client";

import { useState } from "react";
import ImageUploadCloudinary from "@/components/admin/ImageUploadCloudinary";

export default function MyFormPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    thumbnailUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // formData.imageUrl và formData.thumbnailUrl sẽ chứa URL từ Cloudinary
    console.log("Form data:", formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tiêu đề
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
        />
      </div>

      {/* Main Image */}
      <ImageUploadCloudinary
        onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
        defaultValue={formData.imageUrl}
        label="Ảnh chính"
      />

      {/* Thumbnail */}
      <ImageUploadCloudinary
        onUpload={(url) => setFormData({ ...formData, thumbnailUrl: url })}
        defaultValue={formData.thumbnailUrl}
        label="Ảnh thumbnail"
      />

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700"
      >
        Lưu
      </button>
    </form>
  );
}
```

## 🔒 Bảo mật với Signed Upload

- ✅ **Signed Upload**: Sử dụng API Key và Secret trên server
- ✅ **No Direct Client Access**: Client không trực tiếp gọi Cloudinary API
- ✅ **Server-side Validation**: File được validate trên server trước khi upload
- ✅ **Organized Storage**: Tự động lưu vào folder `wedding-uploads`
- ✅ **Auto Optimization**: Tự động tối ưu chất lượng và format
- ✅ **Secure Credentials**: API Secret chỉ được lưu trên server

## 🚨 Lưu ý quan trọng

1. **Environment Variables**: Đảm bảo cấu hình đúng các credentials:
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloud name (public, có thể expose)
   - `CLOUDINARY_API_KEY`: API key (server-only)
   - `CLOUDINARY_API_SECRET`: API secret (server-only, bảo mật cao)

2. **API Security**: API key và secret chỉ được sử dụng trên server, không bao giờ expose ra client

3. **File Validation**: Upload được validate 2 lần (client và server) để đảm bảo bảo mật

4. **Error Handling**: Component tự động xử lý lỗi và hiển thị message cho user

5. **Restart Server**: Sau khi cập nhật `.env.local`, cần restart development server

## 📞 Hỗ trợ

Nếu gặp vấn đề:

1. Kiểm tra console.log để xem error details
2. Verify Cloudinary credentials trong Dashboard → Settings → Security
3. Đảm bảo API key và secret được cấu hình đúng trong `.env.local`
4. Check network tab để xem API calls tới `/api/upload/cloudinary`
5. Kiểm tra server logs nếu có lỗi 500
