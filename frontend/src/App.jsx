import { useState, useEffect } from 'react';

function App() {
  const [nodeTasks, setNodeTasks] = useState([]);
  const [about, setAbout] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);

  // Task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Student form
  const [student, setStudent] = useState({
    hoTen: '',
    maSoSinhVien: '',
    lop: ''
  });

  // =======================
  // API CALL
  // =======================
  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch('/api-node/tasks');
    const data = await res.json();
    setNodeTasks(data);
    setLoading(false);
  };

  const fetchAbout = async () => {
    const res = await fetch('/about');
    const data = await res.json();
    setAbout(data);
  };

  const fetchHealth = async () => {
    const res = await fetch('/health');
    const data = await res.json();
    setHealth(data);
  };

  useEffect(() => {
    fetchTasks();
    fetchAbout();
    fetchHealth();
  }, []);

  // =======================
  // Submit TASK
  // =======================
  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title không được rỗng");
      return;
    }

    const res = await fetch('/api-node/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    if (res.ok) {
      alert("Thêm task thành công!");
      setTitle('');
      setDescription('');
      fetchTasks();
    } else {
      alert("Lỗi khi thêm task");
    }
  };

  // =======================
  // Submit STUDENT
  // =======================
  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    const { hoTen, maSoSinhVien, lop } = student;

    if (!hoTen || !maSoSinhVien || !lop) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const res = await fetch('/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Lưu sinh viên thành công!");
      fetchAbout();
    } else {
      alert(data.error);
    }
  };

  // =======================
  // UI
  // =======================
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>🚀 Task Manager</h1>

      {/* HEALTH */}
      <h3>Health:</h3>
      <p style={{ color: health?.status === "ok" ? "green" : "red" }}>
        {health?.status || "Loading..."}
      </p>

      {/* ======================= */}
      {/* STUDENT */}
      {/* ======================= */}
      <h3>👤 Thông tin sinh viên:</h3>

      {about ? (
        <div style={{ background: '#eee', padding: '10px', borderRadius: '8px' }}>
          <p><b>Họ tên:</b> {about.hoTen}</p>
          <p><b>MSSV:</b> {about.maSoSinhVien}</p>
          <p><b>Lớp:</b> {about.lop}</p>
        </div>
      ) : (
        <form onSubmit={handleStudentSubmit}>
          <input
            placeholder="Họ tên"
            value={student.hoTen}
            onChange={e => setStudent({ ...student, hoTen: e.target.value })}
          />
          <br />

          <input
            placeholder="MSSV"
            value={student.maSoSinhVien}
            onChange={e => setStudent({ ...student, maSoSinhVien: e.target.value })}
          />
          <br />

          <input
            placeholder="Lớp"
            value={student.lop}
            onChange={e => setStudent({ ...student, lop: e.target.value })}
          />
          <br />

          <button type="submit">💾 Lưu thông tin</button>
        </form>
      )}

      {/* ======================= */}
      {/* TASK */}
      {/* ======================= */}
      <h3>➕ Thêm Task</h3>
      <form onSubmit={handleTaskSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <br />

        <input
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <br />

        <button type="submit">Thêm Task</button>
      </form>

      <br />

      {/* Reload button */}
      <button onClick={fetchTasks}>🔄 Reload Tasks</button>

      {/* ======================= */}
      {/* LIST TASK */}
      {/* ======================= */}
      <h2>📋 Danh sách tasks:</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : nodeTasks.length === 0 ? (
        <p>Chưa có task nào</p>
      ) : (
        <ul>
          {nodeTasks.map(t => (
            <li key={t.id}>
              <b>{t.title}</b> - {t.description || "Không có mô tả"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;