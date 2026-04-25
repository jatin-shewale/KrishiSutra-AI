import { motion } from 'framer-motion'
import { FaChartLine, FaTint, FaShieldAlt, FaLeaf } from 'react-icons/fa'
import { mockAnalytics } from '../../services/mockData'
import GlassCard from '../../components/ui/GlassCard'
import MetricCard from '../../components/ui/MetricCard'

const data = mockAnalytics

export default function Analytics() {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Analytics</h1>
        <p className="text-gray-400 mb-8">Farm insights, trends, and risk scoring</p>
      </motion.div>

      {/* Top Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <MetricCard icon={FaLeaf} label="Soil Health" value={data.soilHealth} color="emerald" />
        <MetricCard icon={FaChartLine} label="NDVI Index" value={data.ndvi} color="blue" />
        <MetricCard icon={FaShieldAlt} label="Risk Score" value={`${data.riskScore}/100`} color="orange" />
        <MetricCard icon={FaTint} label="Water Efficiency" value="+8%" color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Yield Trend */}
        <GlassCard>
          <h3 className="font-semibold mb-4">Yield Trend (8 Months)</h3>
          <div className="h-48 w-full flex items-end gap-2">
            {data.yieldTrend.map((y, i) => (
              <motion.div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full bg-emerald-500/70 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${y}%` }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                />
                <span className="text-xs text-gray-500">{y}q</span>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Month 1</span><span>Month 8</span>
          </div>
        </GlassCard>

        {/* Water Usage Trend */}
        <GlassCard>
          <h3 className="font-semibold mb-4">Water Usage (L/acre)</h3>
          <div className="h-48 w-full flex items-end gap-2">
            {data.waterUsage.map((w, i) => (
              <motion.div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full bg-blue-500/70 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${w}%` }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                />
                <span className="text-xs text-gray-500">{w}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Month 1</span><span>Month 8</span>
          </div>
        </GlassCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Risk Breakdown */}
        <GlassCard>
          <h3 className="font-semibold mb-4">Risk Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Pest Risk', value: 25, color: 'bg-red-500' },
              { label: 'Weather Risk', value: 35, color: 'bg-yellow-500' },
              { label: 'Market Risk', value: 20, color: 'bg-blue-500' },
              { label: 'Disease Risk', value: 15, color: 'bg-purple-500' },
            ].map(r => (
              <div key={r.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{r.label}</span>
                  <span className="text-gray-400">{r.value}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div className={`h-full ${r.color}`} initial={{width:0}} animate={{width:`${r.value}%`}} transition={{duration:1}} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Crop Performance */}
        <GlassCard>
          <h3 className="font-semibold mb-4">Crop Performance</h3>
          <div className="space-y-3">
            {[
              { crop: 'Cotton', yield: '18 qt', profit: '₹1.1L', trend: 'up' },
              { crop: 'Rice', yield: '28 qt', profit: '₹58K', trend: 'down' },
              { crop: 'Wheat', yield: '30 qt', profit: '₹70K', trend: 'up' },
            ].map(c => (
              <div key={c.crop} className="flex items-center justify-between p-3 glass rounded-xl">
                <div>
                  <div className="font-medium text-sm">{c.crop}</div>
                  <div className="text-xs text-gray-400">{c.yield} • {c.profit}</div>
                </div>
                <span className={c.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}>
                  {c.trend === 'up' ? '↑' : '↓'}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Insights */}
        <GlassCard>
          <h3 className="font-semibold mb-4">AI Insights</h3>
          <div className="space-y-3">
            {[
              'Yield increased 15% vs last season',
              'Water usage down 8L/acre with drip irrigation',
              'Pest risk low — preventive spraying recommended',
              'Cotton prices trending up — hold for 2 weeks',
            ].map((insight, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-2 text-sm text-gray-300"
                initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
              >
                <span className="text-emerald-400 mt-0.5">•</span>
                {insight}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
