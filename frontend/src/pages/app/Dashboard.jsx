import { motion } from 'framer-motion'
import { FiMap, FiActivity, FiTrendingUp, FiBell, FiCpu, FiUsers, FiMessageCircle } from 'react-icons/fi'
import MetricCard from '../../components/ui/MetricCard'

const metrics = [
  { icon: FiMap, label: 'Recommended Crops', value: '3', sub: 'Cotton, Rice, Wheat', color: 'emerald' },
  { icon: FiActivity, label: 'Disease Risk', value: 'Low', sub: 'No outbreaks detected', color: 'green' },
  { icon: FiTrendingUp, label: 'Market Trend', value: 'Rising', sub: 'Cotton +12% this week', color: 'blue' },
  { icon: FiBell, label: 'Active Alerts', value: '2', sub: '1 subsidy, 1 weather', color: 'orange' },
]

const recentAgents = [
  { name: 'Crop Intelligence', status: 'completed', confidence: 0.92 },
  { name: 'Market Forecast', status: 'completed', confidence: 0.87 },
  { name: 'RAG Knowledge', status: 'running', confidence: null },
  { name: 'Subsidy Discovery', status: 'completed', confidence: 0.78 },
]

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Farm <span className="gradient-text">Overview</span></h1>
        <p className="text-text-secondary font-medium">Real-time intelligence from your autonomous agents</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card !p-0 overflow-hidden relative group hover:border-emerald-500/50 transition-all duration-500"
          >
            <div className={`absolute top-0 left-0 w-1 h-full bg-emerald-500`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                  <m.icon size={24} />
                </div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-lg">Live</div>
              </div>
              <div className="text-3xl font-extrabold mb-1 tracking-tight">{m.value}</div>
              <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">{m.label}</div>
              <div className="text-xs font-medium text-emerald-400/80">{m.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2 glass-card border-white/5" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold flex items-center gap-3">
               <FiCpu className="text-emerald-400" /> Recent Agent Activity
            </h2>
            <button className="text-xs font-bold text-emerald-400 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentAgents.map((agent, i) => (
              <motion.div 
                key={agent.name} 
                className="flex items-center justify-between p-4 glass bg-white/5 border-white/5 rounded-2xl group hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${agent.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    <FiActivity size={18} className={agent.status !== 'completed' ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{agent.name}</div>
                    <div className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">{agent.status === 'completed' ? 'Task Finished' : 'Processing Data...'}</div>
                  </div>
                </div>
                <div className="text-right">
                  {agent.confidence && (
                    <div className="text-sm font-extrabold text-emerald-400">{Math.round(agent.confidence * 100)}% <span className="text-[10px] opacity-60 font-medium">Confidence</span></div>
                  )}
                  <div className="text-[10px] font-medium opacity-40">2 mins ago</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="glass-card border-white/5" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-extrabold mb-8 flex items-center gap-3">
             <FiTrendingUp className="text-emerald-400" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Run Crop Analysis', desc: 'NPK + Satellite Data', icon: FiMap },
              { label: 'Check Market Prices', desc: 'Live Mandi Updates', icon: FiTrendingUp },
              { label: 'Consult AI Copilot', desc: 'Ask about any issue', icon: FiMessageCircle },
              { label: 'View Alerts Center', desc: '2 pending notifications', icon: FiBell },
            ].map((action, i) => (
              <button 
                key={action.label} 
                className="p-5 glass border-white/5 rounded-2xl hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-secondary group-hover:text-emerald-400 transition-colors">
                     <action.icon size={20} />
                   </div>
                   <div>
                     <div className="text-sm font-bold group-hover:text-emerald-400 transition-colors">{action.label}</div>
                     <div className="text-[10px] font-medium opacity-50">{action.desc}</div>
                   </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
