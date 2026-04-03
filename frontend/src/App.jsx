import { useState, useEffect } from 'react';

function App() {
  const [nodeTasks, setNodeTasks] = useState([]);
  const [about, setAbout] = useState(null);
  const [health, setHealth] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Load data
  const fetchTasks = () => {
    fetch('/api-node/tasks')
      .then(res => res.json())
      .then(setNodeTasks);
  };

  useEffect(() => {
    fetchTasks();

    fetch('/about')
      .then(res => res.json())
      .then(setAbout);

    fetch('/health')
      .then(res => res.json())
      .then(setHealth);

  }, []);

  // Submit POST
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api-node/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });

    if (res.ok) {
      setTitle('');
      setDescription('');
      fetchTasks(); // reload list
    } else {
      alert("Lỗi khi thêm task");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Task Manager - NodeJS API</h1>

      {/* Health */}
      <h3>Health:</h3>
      <p>{health?.status}</p>

      {/* About */}
      <h3>Thông tin sinh viên:</h3>
      {about && (
        <ul>
          <li>Họ tên: {about.hoTen}</li>
          <li>MSSV: {about.maSoSinhVien}</li>
          <li>Lớp: {about.lop}</li>
        </ul>
      )}

      {/* Form thêm task */}
      <h3>Thêm Task</h3>
      <form onSubmit={handleSubmit}>
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