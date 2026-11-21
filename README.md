# Thời Đại Hiệp Sĩ Offline

Trang giới thiệu HSO Offline của Zuzong. Link tải dẫn đến [bản phát hành HSO Offline](https://github.com/zuzongdnt/hso-offline-tools/releases/tag/offline-37). Sáu ảnh trong thư viện lấy từ các lượt kiểm thử những bản HSO Offline trước đây.

## Chạy trên máy

Với Node.js 24 và pnpm 12, chạy `pnpm install`, rồi `pnpm dev`. Dùng `pnpm build` để xuất thư mục `dist`. GitHub Actions phát hành thư mục này lên GitHub Pages khi đẩy thay đổi lên `main`.

## Giao diện ThreeUI

Trang dùng nguồn [SublevelStudioLandingPage](https://threeui.com/source-code/sublevel-studio-landing-page.json), revision `91db5c1bb779`. Bốn tệp gốc đã được đối chiếu SHA-256 trước khi chỉnh nội dung. Tệp HTML trong `public/landing-pages` giữ sảnh 3D, dock, menu, CRT và hiệu ứng của mẫu, với nội dung và ảnh HSO. Bản HTML gốc được giữ trong checkout phát triển và media mẫu không được đưa vào thư viện ảnh.

Module ThreeUI được ánh xạ trong Vite vì gói npm Community 1.2.0 chưa xuất component này. Cảnh 3D dùng Three.js 0.160.0. [Giấy phép ThreeUI](public/THREEUI-LICENSE.txt).
