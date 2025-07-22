# Hướng dẫn cấu hình Email với Resend và Vercel

## 🚨 Lỗi hiện tại

Bạn đang gặp lỗi: `Missing API key. Pass it to the constructor new Resend("re_123")`

## ✅ Giải pháp

### Bước 1: Đăng ký Resend

1. Truy cập [Resend.com](https://resend.com)
2. Tạo tài khoản miễn phí
3. Verify email của bạn

### Bước 2: Tạo API Key

1. Đăng nhập vào Resend Dashboard
2. Vào phần **API Keys**
3. Click **Create API Key**
4. Đặt tên: `Wedding Landing Page`
5. Permission: **Sending access**
6. Copy API key (dạng: `re_xxxxxxxxxx`)

### Bước 3: Cấu hình Environment Variable trên Vercel

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project **landingpage_wedding**
3. Vào tab **Settings**
4. Chọn **Environment Variables**
5. Thêm variable mới:
   - **Name**: `RESEND_API_KEY`
   - **Value**: API key bạn vừa copy từ Resend
   - **Environment**: Production, Preview, Development

### Bước 4: Redeploy

1. Vào tab **Deployments**
2. Click menu **...** ở deployment mới nhất
3. Chọn **Redeploy**

## 🔧 Tính năng hiện tại (không có API key)

- Form vẫn hoạt động bình thường
- Thông tin được log ra console thay vì gửi email
- User vẫn nhận được thông báo thành công

## 📧 Sau khi setup Resend

- Email sẽ được gửi tự động đến: `ntnghia.dev@gmail.com`
- Thông tin khách hàng được format đẹp trong email
- HTML template chuyên nghiệp

## 💡 Gói miễn phí Resend

- 3,000 emails/tháng
- Hoàn toàn đủ cho wedding landing page

## 🚀 Test sau setup

1. Sau khi redeploy, test form trên website
2. Kiểm tra email inbox
3. Nếu không nhận được, check Spam folder
