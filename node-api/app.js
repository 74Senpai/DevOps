require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// ✅ DB: dùng POOL (quan trọng)
// =======================
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test kết nối DB
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Lỗi kết nối DB:", err);
    } else {
        console.log("✅ MySQL connected");
        connection.release();
    }
});

// =======================
// API
// =======================

// 🔹 Health check
app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

// =======================
// TASK APIs
// =======================

// GET all tasks
app.get('/api-node/tasks', (req, res) => {
    db.query("SELECT * FROM tasks", (err, result) => {
        if (err) {
            console.error("Lỗi tasks:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(result);
    });
});

// POST create task
app.post('/api-node/tasks', (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Thiếu title" });
    }

    const sql = "INSERT INTO tasks (title, description) VALUES (?, ?)";

    db.query(sql, [title, description || null], (err, result) => {
        if (err) {
            console.error("Lỗi insert task:", err);
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: "Tạo task thành công",
            taskId: result.insertId
        });
    });
});

// =======================
// STUDENT APIs
// =======================

// GET student
app.get('/about', (req, res) => {
    db.query(
        "SELECT hoTen, maSoSinhVien, lop FROM students LIMIT 1",
        (err, result) => {
            if (err) {
                console.error("Lỗi /about:", err);
                return res.status(500).json({ error: err.message });
            }

            if (result.length === 0) {
                return res.json(null);
            }

            res.json(result[0]);
        }
    );
});

// POST create student (chỉ 1 record)
app.post('/students', (req, res) => {
    const { hoTen, maSoSinhVien, lop } = req.body;

    if (!hoTen || !maSoSinhVien || !lop) {
        return res.status(400).json({ error: "Thiếu dữ liệu" });
    }

    // check tồn tại
    db.query("SELECT COUNT(*) as count FROM students", (err, result) => {
        if (err) {
            console.error("Lỗi check student:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result[0].count > 0) {
            return res.status(400).json({ error: "Student đã tồn tại" });
        }

        // insert
        const sql = "INSERT INTO students (hoTen, maSoSinhVien, lop) VALUES (?, ?, ?)";

        db.query(sql, [hoTen, maSoSinhVien, lop], (err) => {
            if (err) {
                console.error("Lỗi insert student:", err);
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: "Tạo student thành công" });
        });
    });
});

// =======================
// OPTIONAL (nên có)
// =======================

// DELETE student (reset)
app.delete('/students', (req, res) => {
    db.query("DELETE FROM students", (err) => {
        if (err) {
            console.error("Lỗi delete student:", err);
            return res.status(500).json({ error: err.message });
        }

        res.json({ message: "Đã xóa student" });
    });
});

// =======================
// START SERVER
// =======================
app.listen(3000, () => {
    console.log("🚀 Server chạy tại http://localhost:3000");
});