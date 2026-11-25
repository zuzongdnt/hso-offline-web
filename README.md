# Thời Đại Hiệp Sĩ Offline

Trang giới thiệu HSO Offline của Zuzong. Link tải dẫn đến [bản phát hành HSO Offline](https://github.com/zuzongdnt/hso-offline-tools/releases/tag/offline-37). Sáu ảnh trong thư viện lấy từ các lượt kiểm thử những bản HSO Offline trước đây.

## Chạy trên máy

Mục **HSO Skin Mới V4** là bản Android riêng dựa trên 37, có nút tải và bốn ảnh PNG chụp trực tiếp từ bản QA V4. APK được phát hành riêng tại [skin-moi-37-v4](https://github.com/zuzongdnt/hso-offline-tools/releases/tag/skin-moi-37-v4), giữ các liên kết bản 37 thường. Cài đè HSO SOS37HD V1–V3 để giữ save của cùng ứng dụng.

Với Node.js 24 và pnpm 12, chạy `pnpm install`, rồi `pnpm dev`. Dùng `pnpm build` để xuất thư mục `dist`. GitHub Actions phát hành thư mục này lên GitHub Pages khi đẩy thay đổi lên `main`.

## Giao diện ThreeUI

Trang dùng nguồn [SublevelStudioLandingPage](https://threeui.com/source-code/sublevel-studio-landing-page.json), revision `91db5c1bb779`. Bốn tệp gốc đã được đối chiếu SHA-256 trước khi chỉnh nội dung. Trang giữ dock, menu, màn hình thông tin CRT và các hiệu ứng nội dung của mẫu. Ảnh vùng tuyết HSO Max là nền đầu trang. Bản HTML gốc được giữ trong checkout phát triển.

Module ThreeUI được ánh xạ trong Vite vì gói npm Community 1.2.0 chưa xuất component này. [Giấy phép ThreeUI](public/THREEUI-LICENSE.txt).
