import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaChartLine, FaPlay, FaSeedling, FaSun, FaTint, FaWind } from 'react-icons/fa'
import GlassCard from '../../components/ui/GlassCard'
import { simulateFarm } from '../../services/simulationService'

export default function DigitalTwin() {
  const [soilMoisture, setSoilMoisture] = useState(65)
  const [temperature, setTemperature] = useState(28)
  const [rainfall, setRainfall] = useState(200)
  const [fertilizer, setFertilizer] = useState(100)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const runSimulation = async () => {
    setRunning(true)
    setError('')
    try {
      const data = await simulateFarm({
        base_crop: 'cotton',
        area_acres: 1,
        scenario: { soil_moisture: soilMoisture, temperature, rainfall, new_crop: 'cotton' },
        irrigation_change_pct: soilMoisture - 50,
        fertilizer_change_pct: fertilizer - 100,
      })
      setResults(data)
    } catch (error) {
      console.error('Simulation failed:', error)
      setResults(null)
      setError(error?.response?.data?.detail || error?.message || 'Simulation failed')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Digital Twin Simulator</h1>
        <p className="text-gray-400 mb-8">Interactive farm simulation with Ollama scenario guidance</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><FaTint className="text-blue-400" /> Soil Moisture</h3>
            <input type="range" min="0" max="100" value={soilMoisture} onChange={e => setSoilMoisture(+e.target.value)} className="w-full accent-emerald-500" />
            <div className="flex justify-between text-sm text-gray-400 mt-1"><span>0%</span><span className="text-emerald-400 font-medium">{soilMoisture}%</span><span>100%</span></div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><FaSun className="text-yellow-400" /> Temperature</h3>
            <input type="range" min="15" max="45" value={temperature} onChange={e => setTemperature(+e.target.value)} className="w-full accent-emerald-500" />
            <div className="flex justify-between text-sm text-gray-400 mt-1"><span>15 C</span><span className="text-emerald-400 font-medium">{temperature} C</span><span>45 C</span></div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><FaWind className="text-blue-300" /> Rainfall</h3>
            <input type="range" min="0" max="500" value={rainfall} onChange={e => setRainfall(+e.target.value)} className="w-full accent-emerald-500" />
            <div className="flex justify-between text-sm text-gray-400 mt-1"><span>0 mm</span><span className="text-emerald-400 font-medium">{rainfall} mm</span><span>500 mm</span></div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><FaSeedling className="text-emerald-400" /> Fertilizer</h3>
            <input type="range" min="0" max="200" value={fertilizer} onChange={e => setFertilizer(+e.target.value)} className="w-full accent-emerald-500" />
            <div className="flex justify-between text-sm text-gray-400 mt-1"><span>0%</span><span className="text-emerald-400 font-medium">{fertilizer}%</span><span>200%</span></div>
          </GlassCard>

          <button onClick={runSimulation} disabled={running} className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
            {running ? <><span className="animate-spin">...</span> Simulating...</> : <><FaPlay /> Run Simulation</>}
          </button>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {running && (
            <GlassCard className="text-center py-16">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-4xl text-emerald-400 mx-auto mb-4 w-fit">
                <FaChartLine />
              </motion.div>
              <p className="text-gray-300">Running digital twin simulation...</p>
              <p className="text-sm text-gray-500 mt-2">Processing soil, weather, irrigation, and fertilizer effects</p>
            </GlassCard>
          )}

          {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: 'Yield Impact', value: `${results.yield_impact} qt`, color: 'emerald' },
                  { label: 'Projected Yield', value: `${results.projected_yield} qt`, color: 'blue' },
                  { label: 'Revenue Change', value: `Rs ${results.revenue_change.toLocaleString()}`, color: 'purple' },
                  { label: 'Risk Level', value: results.risk_level, color: results.risk_level === 'low' ? 'emerald' : results.risk_level === 'medium' ? 'orange' : 'red' },
                ].map((metric) => (
                  <GlassCard key={metric.label} className="!p-4">
                    <div className="text-xs text-gray-400 mb-1">{metric.label}</div>
                    <div className="text-xl font-bold text-emerald-400">{metric.value}</div>
                  </GlassCard>
                ))}
              </div>

              <GlassCard>
                <h3 className="font-semibold mb-4">Ollama Recommendation</h3>
                <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{results.ai_recommendation}</p>
              </GlassCard>
            </motion.div>
          )}

          {error && !running && (
            <GlassCard className="border border-red-500/20 bg-red-500/5">
              <p className="text-sm text-red-300">{error}</p>
            </GlassCard>
          )}

          {!results && !running && (
            <GlassCard className="text-center py-20">
              <FaChartLine className="text-5xl text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">Adjust parameters and run simulation</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
