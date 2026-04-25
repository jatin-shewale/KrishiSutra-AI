import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all disabled:opacity-50'
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-8 py-3 text-base' }
  const variants = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/25',
    secondary: 'glass border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/5',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  )
}
