import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function AuthPage(){
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async e => {
    e.preventDefault();
    setError('');
    try {
      const url = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      const res = await API.post(url, payload);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/todos');
    } catch (err) {
      const msg = err?.response?.data?.msg || 'Error occured';
      setError(msg);
    }
  };

  return (
    <div className="center-screen p-3">
      <div className="card card-custom p-4 text-center" style={{ width: 420 }}>
        
        {/* Heading box */}
        <div className="mb-4 p-3 border rounded bg-light">
          <h2 className="fw-bold m-0">Welcome to My TaskKeeper</h2>
        </div>

        <h4 className="mb-3">{isLogin ? 'Login' : 'Register'}</h4>
        
        <form onSubmit={submit}>
          {!isLogin && (
            <div className="mb-3 text-start">
              <label className="form-label">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
            </div>
          )}
          <div className="mb-3 text-start">
            <label className="form-label">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3 text-start">
            <label className="form-label">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="form-control" required minLength={6} />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-grid gap-2">
            <button className="btn btn-primary" type="submit">{isLogin ? 'Login' : 'Sign up'}</button>
            <button type="button" className="btn btn-link" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
