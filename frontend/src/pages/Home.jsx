import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🏠 Trang chính</h1>

      <button onClick={() => navigate('/tasks')}>
        📋 Đi tới Tasks
      </button>

      <br /><br />

      <button onClick={() => navigate('/about')}>
        👤 Thông tin sinh viên
      </button>
    </div>
  );
}

export default Home;