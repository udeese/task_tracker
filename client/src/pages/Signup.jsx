// src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Signup() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const navigate                = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await api.post('/signup', { email, password });
    navigate('/login');
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input type="email"    value={email}    onChange={e => setEmail(e.target.value)}      placeholder="Email"    required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Sign Up</button>
      <p>Already have account? <Link to="/login">Log In</Link></p>
    </form>
  );
}
