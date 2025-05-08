// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { setAuthHeader } from '../api'     

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem('authToken') || ''
  )

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
    
  }, [token])

  const login  = t => setToken(t)
  const logout = () => setToken('')

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
