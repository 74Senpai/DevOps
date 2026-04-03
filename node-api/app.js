const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json()); // để đọc body JSON

// Kết nối DB
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Kết nối DB
db.connect(err => {
    if (err) {
        console.error("Lỗi kết nối DB:", err);
        return;
    }
    console.log("Đã kết nối MySQL");
});

// Auto-reconnect (cơ bản)
db.on('error', (err) => {
    console.error('DB error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Mất kết nối DB...');
    }
});


// =======================
// API có sẵn
// =======================

// GET danh sách tasks
app.get('/api-node/tasks', (req, res) => {
    db.query("SELECT * FROM tasks", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(result);
    });
});


// =======================
// 1. Trang thông tin cá nhân (/about)
// =======================
app.get('/about', (req, res) => {
    db.query("SELECT hoTen, maSoSinhVien, lop FROM students LIMIT 1", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            return res.json(null);
        }
        res.json(result[0]);
    });
});

// =======================
// 2. Health Check (/health)
// =======================
app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});


// =======================
// 3. API POST (thêm task)
// =======================
app.post('/api-node/tasks', (req, res) => {
    const { title, description } = req.body;

    // validate đơn giản
    if (!title) {
        return res.status(400).json({ error: "Thiếu title" });
    }

    const sql = "INSERT INTO tasks (title, description) VALUES (?, ?)";
    db.query(sql, [title, description || null], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.status(201).json({
            message: "Tạo task thành công",
            taskId: result.insertId
        });
    });
});

app.post('/students', (req, res) => {
    const { hoTen, maSoSinhVien, lop } = req.body;

    if (!hoTen || !maSoSinhVien || !lop) {
        return res.status(400).json({ error: "Thiếu dữ liệu" });
    }

    db.query("SELECT COUNT(*) as count FROM students", (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result[0].count > 0) {
            return res.status(400).json({ error: "Student đã tồn tại" });
        }

        const sql = "INSERT INTO students (hoTen, maSoSinhVien, lop) VALUES (?, ?, ?)";
        db.query(sql, [hoTen, maSoSinhVien, lop], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({ message: "Tạo student thành công" });
        });
    });
});

// =======================
app.listen(3000, () => {
    console.log("NodeJS chạy ở port 3000");
});
