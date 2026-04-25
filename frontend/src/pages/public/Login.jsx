import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi'
import BackgroundAnimation from '../../components/ui/BackgroundAnimation'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to sign in. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <BackgroundAnimation />

      <motion.div
        className="glass-card p-10 w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-xl font-black tracking-widest text-emerald-400">KS</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Welcome <span className="gradient-text">Back</span></h1>
          <p className="text-text-secondary font-medium">Continue your autonomous farming journey</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-primary ml-1 uppercase tracking-wider">Email Address</label>
            <div className="relative group">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-emerald-400 transition-colors" />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="farmer@krishisutra.ai"
                required
                className="w-full pl-12 pr-4 py-4 glass bg-white/5 border-white/5 focus:border-emerald-500/30 focus:outline-none rounded-2xl transition-all font-medium"
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-text-primary uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" size="sm" className="text-xs text-emerald-400 font-bold hover:underline">Forgot?</Link>
            </div>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-emerald-400 transition-colors" />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                required
                placeholder="Enter your password"
                className="w-full pl-12 pr-4 py-4 glass bg-white/5 border-white/5 focus:border-emerald-500/30 focus:outline-none rounded-2xl transition-all font-medium"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm font-medium text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg mt-4 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiLogIn className="text-xl" /> {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-text-secondary">
          New to KrishiSutra?{' '}
          <Link to="/register" className="text-emerald-400 font-bold hover:underline">Create Account</Link>
        </div>
      </motion.div>
    </div>
  )
}
