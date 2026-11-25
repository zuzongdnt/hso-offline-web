# Thời Đại Hiệp Sĩ Offline

Trang giới thiệu HSO Offline của Zuzong. Link tải dẫn đến [bản phát hành HSO Offline](https://github.com/zuzongdnt/hso-offline-tools/releases/tag/offline-37). Sáu ảnh trong thư viện lấy từ các lượt kiểm thử những bản HSO Offline trước đây.

## Chạy trên máy

Mục **HSO Skin Mới V4** là bản Android riêng dựa trên 37, có nút tải và bốn ảnh PNG chụp trực tiếp từ bản QA V4. APK được phát hành riêng tại [skin-moi-37-v4](https://github.com/zuzongdnt/hso-offline-tools/releases/tag/skin-moi-37-v4), giữ các liên kết bản 37 thường. Cài đè HSO SOS37HD V1–V3 để giữ save của cùng ứng dụng.

Với Node.js 24 và pnpm 12, chạy `pnpm install`, rồi `pnpm dev`. Dùng `pnpm build` để xuất thư mục `dist`. GitHub Actions phát hành thư mục này lên GitHub Pages khi đẩy thay đổi lên `main`.

## Giao diện ThreeUI

Trang dùng nguồn [SublevelStudioLandingPage](https://threeui.com/source-code/sublevel-studio-landing-page.json), revision `91db5c1bb779`. Bốn tệp gốc đã được đối chiếu SHA-256 trước khi chỉnh nội dung. Trang giữ dock, menu, màn hình thông tin CRT và các hiệu ứng nội dung của mẫu. Ảnh vùng tuyết HSO Max là nền đầu trang. Bản HTML gốc được giữ trong checkout phát triển.

Module ThreeUI được ánh xạ trong Vite vì gói npm Community 1.2.0 chưa xuất component này. [Giấy phép ThreeUI](public/THREEUI-LICENSE.txt).

## Hiệu ứng và giao diện điện thoại

Lobby có tuyết pixel, chuyển cảnh mở đầu và parallax trên desktop. Hiệu ứng hạt áp dụng thêm cho các mục HSO Skin Mới, Java và Max; thẻ tải và ảnh có chuyển động khi xuất hiện. Tuyết dừng khi cuộn qua lobby hoặc mở menu; lớp VHS giới hạn 30 FPS và giảm độ phân giải trên thiết bị cảm ứng.

Menu giữ nguyên tấm 3D và cách xoay của mẫu trên cả desktop lẫn điện thoại; chỉ dùng menu phẳng dự phòng khi thiếu WebGL. Thanh điều hướng và nút tải có vùng chạm tối thiểu 44px, ảnh hỗ trợ vuốt ngang, menu giữ focus và trả focus khi đóng. Chế độ giảm chuyển động luôn giữ nội dung hiển thị.

Chạy `pnpm build`, `pnpm preview`, rồi `node scripts/verify-ui.cjs` với Playwright có sẵn trong môi trường (hoặc đặt `PLAYWRIGHT_MODULE` tới thư mục module). Script kiểm tra bảy kích thước từ 320px tới 1440px, menu/bàn phím, link cuộn, gallery và tùy chọn giảm chuyển động; lưu ảnh và kết quả vào `output/playwright/`. Đây là kiểm tra Chromium mô phỏng, không thay thế kiểm tra điện thoại thật.
