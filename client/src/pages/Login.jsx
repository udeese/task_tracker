// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth }       from "../context/AuthContext";

import { api } from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
const [email, setEmail]       = useState('');
const [password, setPassword] = useState('');
const { login }               = useAuth();
const navigate                = useNavigate();

async function handleSubmit(e) {
    e.preventDefault();
    const res = await api.post('/login', { email, password });
    login(res.data.token);
    navigate('/tasks');
}

return (
    <form onSubmit={handleSubmit}>
    <h2>Log In</h2>
    <input type="email"    value={email}    onChange={e => setEmail(e.target.value)}      placeholder="Email"    required />
    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
    <button type="submit">Log In</button>
    <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </form>
);
}
