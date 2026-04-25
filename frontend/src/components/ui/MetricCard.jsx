import { motion } from 'framer-motion'

export default function MetricCard({ icon: Icon, label, value, sub, color = 'emerald' }) {
  return (
    <motion.div
      className="glass-card !p-0 overflow-hidden relative group hover:border-emerald-500/50 transition-all duration-500"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500">
            {Icon && <Icon size={24} />}
          </div>
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-lg">Live</div>
        </div>
        <div className="text-3xl font-extrabold mb-1 tracking-tight text-text-primary">{value}</div>
        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">{label}</div>
        {sub && <div className="text-xs font-medium text-emerald-400/80">{sub}</div>}
      </div>
    </motion.div>
  )
}
