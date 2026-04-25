import { createContext, useCallback, useContext, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const normalizeUser = (user) => ({
  ...user,
  name: user?.name ?? user?.full_name ?? '',
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('krishisutra_user')
    return saved ? normalizeUser(JSON.parse(saved)) : null
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', { email, password })
      const token = data?.access_token

      if (token) {
        localStorage.setItem('krishisutra_token', token)
      }

      const meResponse = await api.get('/auth/me')
      const normalizedUser = normalizeUser(meResponse.data)

      setUser(normalizedUser)
      localStorage.setItem('krishisutra_user', JSON.stringify(normalizedUser))

      return normalizedUser
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async ({ full_name, email, password, phone, role }) => {
    setLoading(true)

    try {
      await api.post('/auth/register', {
        full_name,
        email,
        password,
        phone: phone || null,
        role,
      })

      return await login(email, password)
    } finally {
      setLoading(false)
    }
  }, [login])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('krishisutra_token')
    localStorage.removeItem('krishisutra_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
