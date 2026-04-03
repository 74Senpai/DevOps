import { useEffect, useState } from 'react';

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch('/api-node/tasks');
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h1>📋 Tasks</h1>

      <button onClick={fetchTasks}>🔄 Reload</button>

      <ul>
        {tasks.map(t => (
          <li key={t.id}>
            <b>{t.title}</b> - {t.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;