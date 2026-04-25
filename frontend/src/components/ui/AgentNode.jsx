import { motion } from 'framer-motion'
import { FiCpu, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

const statusIcon = { running: FiClock, completed: FiCheckCircle, error: FiAlertCircle, idle: FiCpu }
const statusColor = { running: 'text-yellow-400', completed: 'text-emerald-400', error: 'text-red-400', idle: 'text-gray-400' }

export default function AgentNode({ name, status = 'idle', confidence, lastRun, tasksCompleted, delay = 0 }) {
  const Icon = statusIcon[status] || FiCpu
  const color = statusColor[status] || 'text-gray-400'
  return (
    <motion.div
      className="agent-node p-4 rounded-xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={status === 'running' ? { rotate: 360 } : {}}
            transition={status === 'running' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
          >
            <Icon className={`text-lg ${color}`} />
          </motion.div>
          <span className="font-medium text-sm">{name}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${status === 'running' ? 'bg-yellow-500/20 text-yellow-400' : status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
          {status}
        </span>
      </div>
      {confidence !== null && confidence !== undefined && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Confidence</span>
            <span>{Math.round(confidence * 100)}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${confidence * 100}%` }}
              transition={{ duration: 1, delay }}
            />
          </div>
        </div>
      )}
      <div className="text-xs text-gray-500 flex justify-between">
        <span>{lastRun}</span>
        {tasksCompleted !== undefined && <span>{tasksCompleted} tasks</span>}
      </div>
    </motion.div>
  )
}
