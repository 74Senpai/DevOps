import { useState, useEffect } from 'react';

function App() {
  const [nodeTasks, setNodeTasks] = useState([]);
  const [about, setAbout] = useState(null);
  const [health, setHealth] = useState(null);

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
  // Load data
  // =======================
  const fetchTasks = () => {
    fetch('/api-node/tasks')
      .then(res => res.json())
      .then(setNodeTasks);
  };

  const fetchAbout = () => {
    fetch('/about')
      .then(res => res.json())
      .then(setAbout);
  };

  useEffect(() => {
    fetchTasks();
    fetchAbout();

    fetch('/health')
      .then(res => res.json())
      .then(setHealth);
  }, []);

  // =======================
  // Submit TASK
  // =======================
  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api-node/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    if (res.ok) {
      setTitle('');
      setDescription('');
      fetchTasks();
    } else {
      alert("Lỗi khi thêm task");
    }
  };

  // =======================
  // Submit STUDENT (chỉ 1 lần)
  // =======================
  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    });

    const data = await res.json();

    if (res.ok) {
      fetchAbout(); // reload info
    } else {
      alert(data.error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Manager - NodeJS API</h1>

      {/* Health */}
      <h3>Health:</h3>
      <p>{health?.status}</p>

      {/* ======================= */}
      {/* Student */}
      {/* ======================= */}
      <h3>Thông tin sinh viên:</h3>

      {about ? (
        <ul>
          <li>Họ tên: {about.hoTen}</li>
          <li>MSSV: {about.maSoSinhVien}</li>
          <li>Lớp: {about.lop}</li>
        </ul>
      ) : (
        <>
          <h4>Nhập thông tin (chỉ 1 lần)</h4>
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
            <button type="submit">Lưu thông tin</button>
          </form>
        </>
      )}

      {/* ======================= */}
      {/* Task */}
      {/* ======================= */}
      <h3>Thêm Task</h3>
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
        <button type="submit">Thêm</button>
      </form>

      {/* List tasks */}
      <h2>Danh sách tasks:</h2>
      <ul>
        {nodeTasks.map(t => (
          <li key={t.id}>
            <b>{t.title}</b> - {t.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;