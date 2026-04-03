import { useEffect, useState } from 'react';

function About() {
  const [about, setAbout] = useState(null);

  const [student, setStudent] = useState({
    hoTen: '',
    maSoSinhVien: '',
    lop: ''
  });

  const fetchAbout = async () => {
    const res = await fetch('/about');
    const data = await res.json();
    setAbout(data);
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // =======================
  // SUBMIT STUDENT
  // =======================
  const handleSubmit = async (e) => {
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
      alert("✅ Thêm sinh viên thành công");
      setStudent({ hoTen: '', maSoSinhVien: '', lop: '' });
      fetchAbout();
    } else {
      alert("❌ " + data.error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <h1>👤 Thông tin sinh viên</h1>

      {/* ======================= */}
      {/* HIỂN THỊ */}
      {/* ======================= */}
      {about ? (
        <div style={{ background: '#eee', padding: '15px', borderRadius: '10px' }}>
          <p><b>Họ tên:</b> {about.hoTen}</p>
          <p><b>MSSV:</b> {about.maSoSinhVien}</p>
          <p><b>Lớp:</b> {about.lop}</p>
        </div>
      ) : (
        <>
          {/* ======================= */}
          {/* FORM NHẬP */}
          {/* ======================= */}
          <h3>Nhập thông tin sinh viên (chỉ 1 lần)</h3>

          <form onSubmit={handleSubmit}>
            <input
              placeholder="Họ tên"
              value={student.hoTen}
              onChange={e => setStudent({ ...student, hoTen: e.target.value })}
            />
            <br /><br />

            <input
              placeholder="MSSV"
              value={student.maSoSinhVien}
              onChange={e => setStudent({ ...student, maSoSinhVien: e.target.value })}
            />
            <br /><br />

            <input
              placeholder="Lớp"
              value={student.lop}
              onChange={e => setStudent({ ...student, lop: e.target.value })}
            />
            <br /><br />

            <button type="submit">💾 Lưu thông tin</button>
          </form>
        </>
      )}
    </div>
  );
}

export default About;