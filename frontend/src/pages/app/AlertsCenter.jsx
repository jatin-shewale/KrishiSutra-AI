import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaBug, FaMoneyBillWave, FaCloudRain, FaBell, FaCheck, FaTrash } from 'react-icons/fa'
import { mockAlerts } from '../../services/mockData'
import GlassCard from '../../components/ui/GlassCard'

const tabs = [
  { id: 'all', label: 'All Alerts', icon: FaBell },
  { id: 'pest', label: 'Pest Alerts', icon: FaBug },
  { id: 'market', label: 'Market', icon: FaMoneyBillWave },
  { id: 'weather', label: 'Weather', icon: FaCloudRain },
  { id: 'subsidy', label: 'Subsidies', icon: FaMoneyBillWave },
]

const severityIcon = { high: '🔴', medium: '🟡', low: '🟢' }
const severityColor = { high: 'border-red-500/30 bg-red-500/5', medium: 'border-yellow-500/30 bg-yellow-500/5', low: 'border-emerald-500/30 bg-emerald-500/5' }

export default function AlertsCenter() {
  const [activeTab, setActiveTab] = useState('all')
  const [alerts, setAlerts] = useState(mockAlerts)
  const [dismissed, setDismissed] = useState([])

  const filtered = activeTab === 'all' ? alerts : alerts.filter(a => a.type === activeTab)
  const active = filtered.filter(a => !dismissed.includes(a.id))

  const dismiss = (id) => setDismissed([...dismissed, id])
  const markAllRead = () => setDismissed(alerts.map(a => a.id))

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Alerts Center</h1>
          <p className="text-gray-400">Stay informed about your farm</p>
        </div>
        <button onClick={markAllRead} className="text-sm text-emerald-400 hover:text-emerald-300 transition">
          Mark all as read
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap flex items-center gap-2 transition ${
              activeTab === tab.id ? 'bg-emerald-500 text-white' : 'glass hover:bg-white/5'
            }`}
          >
            <tab.icon /> {tab.label}
            {tab.id !== 'all' && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/10 text-xs">
                {alerts.filter(a => a.type === tab.id && !dismissed.includes(a.id)).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {active.length === 0 && (
          <GlassCard className="text-center py-12">
            <FaCheck className="text-4xl text-emerald-400/50 mx-auto mb-3" />
            <p className="text-gray-400">No active alerts</p>
          </GlassCard>
        )}
        {active.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
          >
            <GlassCard className={`!p-4 border ${severityColor[alert.severity]}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5">{severityIcon[alert.severity]}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                    <button
                      onClick={() => dismiss(alert.id)}
                      className="p-1 hover:bg-white/10 rounded transition text-gray-500 hover:text-gray-300"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
