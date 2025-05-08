import { useEffect, useState } from "react";
import { api }                 from "../api";
import { useAuth }             from "../context/AuthContext";
import { useNavigate }         from "react-router-dom";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [text, setText]   = useState('');
  const { token, logout } = useAuth();
  const navigate          = useNavigate();

  useEffect(() => {
  
    if (!token) {
      return navigate('/login', { replace: true });
    }
   
    api.get('/tasks')
      .then(res => setTasks(res.data))
      .catch(err => {
        console.error(err);
        
      });
  }, [token, navigate]);

  async function addTask(e) {
    e.preventDefault();
    await api.post('/tasks', { text });
    setText('');
    const res = await api.get('/tasks');
    setTasks(res.data);
  }


  return (
    <div>
      <button onClick={() => { logout(); navigate('/login'); }}>
        Log Out
      </button>
      <h1>Your Tasks</h1>
      <form onSubmit={addTask}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="New task"
          required
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <input
              type="checkbox"
              checked={t.completed}
              onChange={e => toggle(t._id, e.target.checked)}
            />
            <span>{t.text}</span>
            <button onClick={() => remove(t._id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
