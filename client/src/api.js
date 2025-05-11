// src/api.js
import axios from 'axios';

const baseURL = import.meta.env.DEV
  ? 'http://localhost:3000/api'
  : '/api';
  
export const api = axios.create({
baseURL: '/api',
headers: { 'Content-Type': 'application/json' }
});

export function setAuthHeader(token) {
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
    delete api.defaults.headers.common['Authorization'];
}
}
