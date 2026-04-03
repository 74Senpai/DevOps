SET NAMES 'utf8mb4';

-- Xóa DB cũ nếu tồn tại (cẩn thận)
DROP DATABASE IF EXISTS DevOps;

-- Tạo DB mới
CREATE DATABASE DevOps
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE DevOps;

-- Tạo bảng tasks
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) 
        CHARACTER SET utf8mb4 
        COLLATE utf8mb4_unicode_ci 
        NOT NULL,
    description TEXT 
        CHARACTER SET utf8mb4 
        COLLATE utf8mb4_unicode_ci,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu mẫu
INSERT INTO tasks (title, description) VALUES
('Học CI/CD', 'Tìm hiểu pipeline CI/CD'),
('Triển khai Docker', 'Build và deploy container'),
('Viết API NodeJS', 'Kết nối MySQL');