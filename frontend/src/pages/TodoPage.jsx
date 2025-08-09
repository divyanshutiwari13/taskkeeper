import React, { useEffect, useState, useRef } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [dateTime, setDateTime] = useState(new Date());

  const navigate = useNavigate();
  const listRef = useRef();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const fetchUser = async () => {
    try {
      const res = await API.get('/me');
      setUsername(res.data.username);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) logout();
    }
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await API.get('/todos');
      setTodos(res.data);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchTodos();

    // Live clock
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const createTodo = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      if (editingId) {
        const res = await API.put(`/todos/${editingId}`, { title, notes });
        setTodos(todos.map(t => t._id === editingId ? res.data : t));
        setEditingId(null);
      } else {
        const res = await API.post('/todos', { title, notes });
        setTodos([res.data, ...todos]);
      }
      setTitle('');
      setNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const res = await API.put(`/todos/${todo._id}`, { completed: !todo.completed });
      setTodos(todos.map(t => t._id === todo._id ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const removeTodo = async (id) => {
    if (!confirm('Delete this todo?')) return;
    try {
      await API.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setTitle(todo.title);
    setNotes(todo.notes || '');
  };

  const exportPDF = () => {
    const element = listRef.current;
    const opt = {
      filename: `todos-${new Date().toISOString().slice(0, 10)}.pdf`,
      margin: 10,
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const formattedDate = dateTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = dateTime.toLocaleTimeString();

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Welcome, {username} 👋</h2>
          <small>{formattedDate} | {formattedTime}</small>
        </div>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={fetchTodos}>Refresh</button>
          <button className="btn btn-outline-danger me-2" onClick={logout}>Logout</button>
          <button className="btn btn-success" onClick={exportPDF}>Export PDF</button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card card-custom p-4 mb-4">
            <form onSubmit={createTodo}>
              <div className="mb-3">
                <input
                  className="form-control"
                  placeholder="Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Notes (optional)"
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">
                  {editingId ? 'Update' : 'Add'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => { setEditingId(null); setTitle(''); setNotes(''); }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div ref={listRef}>
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : todos.length === 0 ? (
              <div className="text-center text-muted">No todos yet</div>
            ) : (
              <div className="list-group">
                {todos.map(todo => (
                  <div
                    key={todo._id}
                    className={`list-group-item d-flex justify-content-between align-items-start ${todo.completed ? 'list-group-item-success' : ''}`}
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{todo.title}</div>
                      {todo.notes && <small className="d-block text-muted">{todo.notes}</small>}
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => toggleComplete(todo)}>
                        {todo.completed ? 'Undo' : 'Done'}
                      </button>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(todo)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => removeTodo(todo._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
