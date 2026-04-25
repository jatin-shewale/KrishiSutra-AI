import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('krishisutra_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api

// Mock API delay helper
export const mockDelay = (ms = 800) => new Promise(r => setTimeout(r, ms))
