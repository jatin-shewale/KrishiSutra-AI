import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiPhone, FiUserCheck } from 'react-icons/fi'
import BackgroundAnimation from '../../components/ui/BackgroundAnimation'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'farmer',
    password: '',
  })
  const [error, setError] = useState('')

  const handleChange = ({ target: { name, value } }) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await register(formData)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to create account. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden py-10">
      <BackgroundAnimation />

      <motion.div
        className="glass-card p-10 w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-xl font-black tracking-widest text-emerald-400">KS</span>
          </div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Create <span className="gradient-text">Account</span></h1>
          <p className="text-text-secondary font-medium">Join the world's most advanced autonomous farming platform</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-primary ml-1 uppercase tracking-wider">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-emerald-400 transition-colors" />
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-4 glass bg-white/5 border-white/5 focus:border-emerald-500/30 focus:outline-none rounded-2xl transition-all font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-primary ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-emerald-400 transition-colors" />
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="john@example.com"
                  required
                  className="w-full pl-12 pr-4 py-4 glass bg-white/5 border-white/5 focus:border-emerald-500/30 focus:outline-none rounded-2xl transition-all font-medium"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-primary ml-1 uppercase tracking-wider">Phone Number</label>
              <div className="relative group">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-emerald-400 transition-colors" />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full pl-12 pr-4 py-4 glass bg-white/5 border-white/5 focus:border-emerald-500/30 focus:outline-none rounded-2xl transition-all font-medium"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-text-primary ml-1 uppercase tracking-wider">User Role</label>
              <div className="relative group">
                <FiUserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-emerald-400 transition-colors" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 glass bg-white/5 border-white/5 focus:border-emerald-500/30 focus:outline-none rounded-2xl transition-all font-medium appearance-none"
                >
                  <option value="farmer" className="bg-slate-900">Farmer</option>
                  <option value="expert" className="bg-slate-900">Agricultural Expert</option>
                  <option value="admin" className="bg-slate-900">Administrator</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-primary ml-1 uppercase tracking-wider">Password</label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-emerald-400 transition-colors" />
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                minLength="6"
                required
                placeholder="Enter at least 6 characters"
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
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  )
}
