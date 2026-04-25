import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaArrowLeft, FaCheck } from 'react-icons/fa'
import { useState } from 'react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-gray-950 to-gray-950" />
      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition mb-6">
            <FaArrowLeft /> Back to Login
          </Link>
          <h1 className="text-3xl font-bold gradient-text mb-2">Reset Password</h1>
          <p className="text-gray-400">Enter your email to receive reset instructions</p>
        </div>

        <div className="glass p-8 rounded-2xl">
          {submitted ? (
            <motion.div className="text-center py-6" initial={{opacity:0}} animate={{opacity:1}}>
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-2xl text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Check Your Email</h3>
              <p className="text-sm text-gray-400 mb-6">If {email} exists in our system, you'll receive reset instructions.</p>
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 text-sm">
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email" required
                    className="w-full pl-10 pr-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
                    placeholder="you@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition"
              >
                Send Reset Link
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
