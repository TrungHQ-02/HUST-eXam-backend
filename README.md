# HUST-eXam-backend

#Hướng dẫn chạy dự án Express

#Để chạy dự án, hãy làm theo các bước sau:

-Tải và cài đặt XAMPP từ trang web chính thức của xampp

-Sau khi cài đặt, hãy khởi động XAMPP bằng cách chạy apache và mysql. Nhấn vào admin của mysql và tạo một database mới với tên "hust_exam".

-Clone dự án từ repository này

-Mở terminal và di chuyển đến thư mục của dự án.

-Chạy lệnh npm install để cài đặt các gói phụ thuộc (sau khi chạy lệnh này các node_modules sẽ được cài đặt)

-Chạy lệnh npm start.

-Nếu thành công, terminal sẽ hiển thị thông báo "Our server is running on port 8001" và "Connection to database has been established successfully."

-Trong môi trường development, khi chạy npm start + bật server (server có tạo một db tên là hust_exam) thì db sẽ được tạo
 cd vào src, chạy câu lệnh node fakeDataEngine.js để tạo mock data
---
**LƯU Ý**:
- File ENV sẽ để các biến môi trường, trong thực tế file ENV sẽ được giấu đi. Tuy nhiên, trong dự án nhà làm thì Trung chọn cách public file này lên
- Các api sẽ được viết trong file web.js
- Folder models để định nghĩa các models cho database
- Folder migrations để tạo database tương ứng trong database "hust_exam"
- Seeders không cần thiết
- Services sử dụng sequelize, tương tác thông qua model instance để kết nối với database
