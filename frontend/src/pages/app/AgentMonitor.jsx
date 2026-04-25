import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaBell, FaBrain, FaChartLine, FaCheckCircle, FaClock, FaExclamationTriangle, FaFileAlt, FaGlobe, FaLeaf, FaTint } from 'react-icons/fa'
import { FiCpu } from 'react-icons/fi'
import GlassCard from '../../components/ui/GlassCard'

const agents = [
  { id: 'planner', name: 'Planner Agent', icon: FaBrain, color: 'from-purple-500/20 to-purple-600/5', status: 'running', confidence: 0.95, lastRun: 'Just now', tasksCompleted: 142 },
  { id: 'crop', name: 'Crop Agent', icon: FaLeaf, color: 'from-emerald-500/20 to-emerald-600/5', status: 'running', confidence: 0.92, lastRun: 'Just now', tasksCompleted: 89 },
  { id: 'disease', name: 'Disease Agent', icon: FaExclamationTriangle, color: 'from-red-500/20 to-red-600/5', status: 'idle', confidence: null, lastRun: '5 min ago', tasksCompleted: 67 },
  { id: 'market', name: 'Market Agent', icon: FaChartLine, color: 'from-blue-500/20 to-blue-600/5', status: 'running', confidence: 0.87, lastRun: 'Just now', tasksCompleted: 112 },
  { id: 'subsidy', name: 'Subsidy Agent', icon: FaFileAlt, color: 'from-yellow-500/20 to-yellow-600/5', status: 'idle', confidence: 0.78, lastRun: '10 min ago', tasksCompleted: 54 },
  { id: 'rag', name: 'RAG Agent', icon: FaGlobe, color: 'from-cyan-500/20 to-cyan-600/5', status: 'running', confidence: 0.88, lastRun: 'Just now', tasksCompleted: 203 },
  { id: 'irrigation', name: 'Irrigation Agent', icon: FaTint, color: 'from-blue-400/20 to-blue-500/5', status: 'idle', confidence: null, lastRun: '15 min ago', tasksCompleted: 78 },
  { id: 'alert', name: 'Alert Agent', icon: FaBell, color: 'from-orange-500/20 to-orange-600/5', status: 'idle', confidence: null, lastRun: '30 min ago', tasksCompleted: 156 },
]

export default function AgentMonitor() {
  const [agentStates] = useState(agents)
  const [flowSteps] = useState([
    { text: 'Query received: "Best crop for my farm"', active: true },
    { text: 'Planner Agent: Routing to Crop + Market + Subsidy', active: true },
    { text: 'Crop Agent: Analyzing soil NPK + weather patterns', active: true },
    { text: 'Market Agent: Fetching mandi prices for Cotton, Rice, Wheat', active: true },
    { text: 'RAG Agent: Checking subsidy eligibility in circulars', active: false },
    { text: 'Planner: Aggregating results with confidence weighting', active: false },
  ])

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Agent Monitor</h1>
        <p className="text-gray-400 mb-8">Visualize multi-agent parallel execution</p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Agents', value: agentStates.filter(a => a.status === 'running').length, icon: FiCpu, color: 'text-emerald-400' },
          { label: 'Tasks Today', value: '412', icon: FaCheckCircle, color: 'text-blue-400' },
          { label: 'Avg Confidence', value: '89%', icon: FaBrain, color: 'text-purple-400' },
          { label: 'Response Time', value: '1.2s', icon: FaClock, color: 'text-yellow-400' },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            className="glass p-4 rounded-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <metric.icon className={`text-xl mb-2 ${metric.color}`} />
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="text-xs text-gray-400">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Agent Network</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {agentStates.map((agent, index) => (
              <motion.div
                key={agent.id}
                className={`glass p-4 rounded-xl bg-gradient-to-br ${agent.color} border border-white/5`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <agent.icon className="text-lg text-emerald-400" />
                    <span className="font-medium text-sm">{agent.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    agent.status === 'running' ? 'bg-yellow-500/20 text-yellow-400 animate-pulse' :
                    agent.status === 'idle' ? 'bg-gray-500/20 text-gray-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                {agent.confidence !== null && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Confidence</span>
                      <span>{Math.round(agent.confidence * 100)}%</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.confidence * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{agent.lastRun}</span>
                  <span>{agent.tasksCompleted} tasks</span>
                </div>
              </motion.div>
            ))}
          </div>

          <GlassCard className="mt-6 !p-4">
            <h3 className="font-semibold mb-4">Execution Flow</h3>
            <div className="space-y-2">
              {flowSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg ${step.active ? 'bg-emerald-500/5 border border-emerald-500/20' : 'opacity-40'}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {step.active ? <FaCheckCircle /> : index + 1}
                  </div>
                  <span className="text-sm">{step.text}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="!p-4">
            <h3 className="font-semibold mb-3 text-sm">Parallel Execution</h3>
            <div className="space-y-3">
              {agentStates.filter(agent => agent.status === 'running').map((agent) => (
                <div key={agent.id} className="flex items-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                    <agent.icon className="text-emerald-400" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="text-xs font-medium">{agent.name}</div>
                    <div className="h-1 bg-gray-800 rounded-full mt-1 overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-500"
                        animate={{ width: ['0%', '60%', '90%'] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="!p-4">
            <h3 className="font-semibold mb-3 text-sm">Agent Communication</h3>
            <div className="space-y-2 text-xs">
              {[
                'Planner -> Crop: Analyze NPK:90,42,43',
                'Crop -> Planner: Cotton 92% confidence',
                'Planner -> Market: Check Cotton prices',
                'Market -> Planner: Trending +12%',
                'Planner -> RAG: Check Cotton subsidies',
              ].map((message, index) => (
                <motion.div
                  key={index}
                  className="p-2 glass rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.3 }}
                >
                  {message}
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
