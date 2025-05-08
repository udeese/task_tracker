import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { setAuthHeader }         from './api';
import Login  from './pages/Login';
import Signup from './pages/Signup';
import Tasks  from './pages/Tasks';


export default function App() {
  const { token } = useAuth();

  useEffect(() => {
    setAuthHeader(token);
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/tasks" 
          element={ token ? <Tasks /> : <Navigate to="/login" replace /> } 
        />
        <Route path="*" element={<Navigate to={ token ? "/tasks" : "/login" } replace />} />
      </Routes>
    </BrowserRouter>
  );
}
