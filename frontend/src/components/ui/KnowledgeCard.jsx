import { motion } from 'framer-motion'
import { FiExternalLink, FiCalendar, FiMapPin } from 'react-icons/fi'

export default function KnowledgeCard({ title, date, source, summary, tags = [], delay = 0 }) {
  return (
    <motion.div
      className="glass p-6 rounded-2xl hover:border-emerald-500/30 transition border border-white/5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 300 }}
      whileHover={{ y: -3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-base leading-snug">{title}</h3>
        <FiExternalLink className="text-emerald-400 flex-shrink-0 ml-2 cursor-pointer hover:text-emerald-300 transition" />
      </div>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{summary}</p>
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1"><FiCalendar /> {date}</span>
        <span className="flex items-center gap-1"><FiMapPin /> {source}</span>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
