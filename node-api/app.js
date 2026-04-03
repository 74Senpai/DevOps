const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json()); // để đọc body JSON

// Kết nối DB
const db = mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: "root",
    password: "root",
    database: "appdb"
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
    res.json({
        hoTen: "Nguyễn Văn A",      // sửa lại của bạn
        maSoSinhVien: "12345678",   // sửa lại
        lop: "CNTT01"               // sửa lại
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


// =======================
app.listen(3000, () => {
    console.log("NodeJS chạy ở port 3000");
});
