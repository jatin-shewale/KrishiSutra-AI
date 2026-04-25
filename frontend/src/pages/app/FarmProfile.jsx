import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaTint, FaSeedling, FaRulerCombined } from 'react-icons/fa'
import { mockFarmProfile } from '../../services/mockData'
import GlassCard from '../../components/ui/GlassCard'

const farm = mockFarmProfile

export default function FarmProfile() {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Farm Profile</h1>
        <p className="text-gray-400 mb-8">Manage your farm data and settings</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="!p-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
            <FaSeedling className="text-2xl text-emerald-400" />
          </div>
          <h2 className="font-bold text-lg">{farm.farmName}</h2>
          <p className="text-sm text-gray-400">{farm.name}</p>
        </GlassCard>

        <GlassCard className="!p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-emerald-400" />
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-sm font-medium">{farm.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaRulerCombined className="text-emerald-400" />
              <div>
                <div className="text-xs text-gray-500">Area</div>
                <div className="text-sm font-medium">{farm.area}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaTint className="text-blue-400" />
              <div>
                <div className="text-xs text-gray-500">Irrigation</div>
                <div className="text-sm font-medium">{farm.irrigationType}</div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="!p-4">
          <h3 className="text-sm text-gray-400 mb-3">Soil Type</h3>
          <div className="text-xl font-bold text-emerald-400 mb-4">{farm.soilType}</div>
          <h3 className="text-sm text-gray-400 mb-2">Active Crops</h3>
          <div className="flex flex-wrap gap-2">
            {farm.crops.map(c => (
              <span key={c} className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">{c}</span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Soil Parameters */}
      <GlassCard className="mb-6">
        <h3 className="font-semibold mb-4">Soil Parameters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Nitrogen (N)', value: '90 kg/ha', status: 'Optimal' },
            { label: 'Phosphorus (P)', value: '42 kg/ha', status: 'Medium' },
            { label: 'Potassium (K)', value: '43 kg/ha', status: 'Low' },
            { label: 'pH Level', value: '6.5', status: 'Good' },
            { label: 'Organic Carbon', value: '0.8%', status: 'Medium' },
            { label: 'Moisture', value: '65%', status: 'Good' },
            { label: 'Temperature', value: '28°C', status: 'Optimal' },
            { label: 'Rainfall', value: '200mm', status: 'Good' },
          ].map(p => (
            <motion.div
              key={p.label}
              className="p-3 glass rounded-xl"
              initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{type:'spring'}}
            >
              <div className="text-xs text-gray-500 mb-1">{p.label}</div>
              <div className="font-bold text-sm">{p.value}</div>
              <div className={`text-xs mt-1 ${p.status === 'Optimal' || p.status === 'Good' ? 'text-emerald-400' : p.status === 'Low' ? 'text-red-400' : 'text-yellow-400'}`}>
                {p.status}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Crop recommendation updated', time: '2 hours ago', icon: FaSeedling },
            { action: 'Soil test results uploaded', time: '1 day ago', icon: FaTint },
            { action: 'Irrigation schedule optimized', time: '3 days ago', icon: FaTint },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 glass rounded-xl">
              <a.icon className="text-emerald-400" />
              <div className="flex-1">
                <div className="text-sm">{a.action}</div>
                <div className="text-xs text-gray-500">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
