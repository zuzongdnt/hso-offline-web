# Thời Đại Hiệp Sĩ Offline

Trang giới thiệu HSO Offline của Zuzong. Link tải dẫn đến [bản phát hành HSO Offline](https://github.com/zuzongdnt/hso-offline-tools/releases/tag/offline-37). Sáu ảnh trong thư viện lấy từ các lượt kiểm thử những bản HSO Offline trước đây.

## Chạy trên máy

Mục **HSO Skin Mới V5** là bản Android riêng dựa trên 37, thêm shop Pháp trận với 23 món, sửa phân biệt từng hoạt ảnh và bỏ ảnh skin hiện thêm phía dưới shop. APK phát hành riêng tại [skin-moi-37-v5](https://github.com/zuzongdnt/hso-offline-tools/releases/tag/skin-moi-37-v5), giữ các liên kết bản 37 thường. Cài đè HSO SOS37HD V1–V4 để giữ save. Gói web nén không mất dữ liệu một số khung hình hoạt ảnh để dưới giới hạn phát hành; pixel RGBA, độ phân giải, mã game và danh mục trùng V5 gốc.

Với Node.js 24 và pnpm 12, chạy `pnpm install`, rồi `pnpm dev`. Dùng `pnpm build` để xuất thư mục `dist`. GitHub Actions phát hành thư mục này lên GitHub Pages khi đẩy thay đổi lên `main`.

## Giao diện ThreeUI

Trang dùng nguồn [SublevelStudioLandingPage](https://threeui.com/source-code/sublevel-studio-landing-page.json), revision `91db5c1bb779`. Bốn tệp gốc đã được đối chiếu SHA-256 trước khi chỉnh nội dung. Trang giữ dock, menu, màn hình thông tin CRT và các hiệu ứng nội dung của mẫu. Ảnh vùng tuyết HSO Max là nền đầu trang. Bản HTML gốc được giữ trong checkout phát triển.

Module ThreeUI được ánh xạ trong Vite vì gói npm Community 1.2.0 chưa xuất component này. [Giấy phép ThreeUI](public/THREEUI-LICENSE.txt).

## Hiệu ứng và giao diện điện thoại

Lobby có tuyết pixel, chuyển cảnh mở đầu và parallax trên desktop. Hiệu ứng hạt áp dụng thêm cho các mục HSO Skin Mới, Java và Max; thẻ tải và ảnh có chuyển động khi xuất hiện. Tuyết dừng khi cuộn qua lobby hoặc mở menu; lớp VHS giới hạn 30 FPS và giảm độ phân giải trên thiết bị cảm ứng.

Menu giữ nguyên tấm 3D và cách xoay của mẫu trên cả desktop lẫn điện thoại; chỉ dùng menu phẳng dự phòng khi thiếu WebGL. Thanh điều hướng và nút tải có vùng chạm tối thiểu 44px, ảnh hỗ trợ vuốt ngang, menu giữ focus và trả focus khi đóng. Chế độ giảm chuyển động luôn giữ nội dung hiển thị.

Chạy `pnpm build`, `pnpm preview`, rồi `node scripts/verify-ui.cjs` với Playwright có sẵn trong môi trường (hoặc đặt `PLAYWRIGHT_MODULE` tới thư mục module). Script kiểm tra bảy kích thước từ 320px tới 1440px, menu/bàn phím, link cuộn, gallery và tùy chọn giảm chuyển động; lưu ảnh và kết quả vào `output/playwright/`. Đây là kiểm tra Chromium mô phỏng, không thay thế kiểm tra điện thoại thật.

PC 37 có hai bộ cài EXE tại release `pc-click-37`: bản thường đầy đủ và bản Skin/Sea of Stars tự tải các phần dữ liệu nhỏ trong lần đầu. Các lối tắt Desktop tự khởi động Java/server kèm sẵn. Bộ cài Skin nhúng bản sửa mã ảnh shop của 91 thú cưỡi; ảnh nguồn giữ nguyên byte. Save cá nhân không được đóng gói hoặc tự chuyển từ thư mục cũ.
