import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <motion.div
      className={`glass p-6 rounded-2xl ${className}`}
      whileHover={hover ? { y: -4, borderColor: 'rgba(16,185,129,0.3)' } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
