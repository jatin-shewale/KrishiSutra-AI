import { motion } from 'framer-motion'
import { FiCheck, FiCpu, FiMap } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { predictCrop } from '../../services/cropService'
import { useAuth } from '../../context/AuthContext'
import { loadAnalysisHistory, saveAnalysisHistory } from '../../services/analysisHistory'

export default function CropRecommendation() {
  const { user } = useAuth()
  const [features, setFeatures] = useState({
    N: 90, P: 42, K: 43, temperature: 25.5, humidity: 70, ph: 6.5, rainfall: 200,
  })
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(loadAnalysisHistory('crop', user?.email || user?.id || 'guest'))
  }, [user])

  const handlePredict = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await predictCrop(features, 5)
      setRecommendations(result.recommendations || [])
      setSummary(result.ai_summary || '')
      const nextHistory = saveAnalysisHistory('crop', user?.email || user?.id || 'guest', {
        id: result.timestamp,
        timestamp: result.timestamp,
        features,
        topCrop: result.recommendations?.[0]?.crop || 'Unknown',
        summary: result.ai_summary || '',
        recommendations: (result.recommendations || []).slice(0, 3),
      })
      setHistory(nextHistory)
    } catch (err) {
      console.error('Failed to get crop recommendations:', err)
      const backendMessage = err?.response?.data?.detail || err?.message || 'Unable to fetch crop recommendations right now.'
      setError(backendMessage)
      setRecommendations([])
      setSummary('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Crop <span className="gradient-text">Intelligence</span></h1>
        <p className="text-text-secondary font-medium">ML ranking with Ollama-based reasoning and yield guidance</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div className="glass-card border-white/5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-extrabold flex items-center gap-3">
                <FiMap className="text-emerald-400" /> Soil & Env Parameters
              </h2>
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-lg">AI + ML</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.keys(features).map((key) => (
                <div key={key} className="glass bg-white/5 border-white/5 p-4 rounded-2xl group hover:bg-emerald-500/5 hover:border-emerald-500/20 transition-all duration-300">
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-tighter mb-2">{key} Level</div>
                  <input
                    type="number"
                    value={features[key]}
                    onChange={(e) => setFeatures(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                    className="bg-transparent text-lg font-extrabold text-emerald-400 w-full outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <button onClick={handlePredict} disabled={loading} className="btn-primary py-3 px-8 text-sm disabled:opacity-50">
                {loading ? 'Analyzing...' : 'Run Prediction Engine'}
              </button>
            </div>
          </motion.div>

          {summary && (
            <motion.div className="glass-card border-emerald-500/20 bg-emerald-500/5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2 className="text-xl font-extrabold mb-4">Ollama Explanation</h2>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
            </motion.div>
          )}

          {error && (
            <motion.div className="glass-card border-red-500/20 bg-red-500/5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-xl font-extrabold mb-3 text-red-300">Prediction Error</h2>
              <p className="text-sm text-red-200 leading-relaxed">{error}</p>
            </motion.div>
          )}

          <motion.div className="glass-card border-white/5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-xl font-extrabold mb-8">Ranked Recommendations</h2>
            <div className="space-y-4">
              {loading ? (
                <div className="py-10 text-center text-gray-500 animate-pulse font-bold uppercase tracking-widest">Consulting Ensemble Models...</div>
              ) : recommendations.length > 0 ? (
                recommendations.map((crop, index) => {
                  const confidencePercent = Math.round(crop.confidence <= 1 ? crop.confidence * 100 : crop.confidence)
                  return (
                    <motion.div
                      key={crop.crop}
                      className="p-5 glass bg-white/5 border-white/5 rounded-2xl group hover:bg-white/10 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center font-extrabold text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-lg capitalize">{crop.crop}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs font-bold opacity-50 uppercase">Estimated Yield: {crop.estimated_yield_per_acre} {crop.yield_unit}</span>
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">AI Ready</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-extrabold text-emerald-400 tracking-tighter">{confidencePercent}%</div>
                          <div className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Confidence</div>
                        </div>
                      </div>
                      <div className="mt-5 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" initial={{ width: 0 }} animate={{ width: `${confidencePercent}%` }} transition={{ duration: 1.2, delay: 0.1 + (index * 0.1), ease: 'easeOut' }} />
                      </div>
                      {crop.why_selected && (
                        <div className="mt-4 p-4 rounded-2xl bg-black/10 border border-white/5">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Why This Crop</div>
                          <p className="text-sm text-gray-300 leading-relaxed">{crop.why_selected}</p>
                        </div>
                      )}
                    </motion.div>
                  )
                })
              ) : (
                <div className="py-10 text-center text-gray-500">No recommendations found</div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div className="glass-card border-white/5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="font-extrabold text-sm mb-6 uppercase tracking-widest flex items-center gap-2">
              <FiCpu className="text-emerald-400" /> Intelligence Stack
            </h3>
            <div className="space-y-4">
              {[
                { label: 'RandomForest Classifier', score: '98.2% acc' },
                { label: 'XGBoost Ensemble', score: '97.5% acc' },
                { label: 'Ollama Explanation Layer', score: 'Active' },
                { label: 'Yield Estimator', score: 'Per crop' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 glass bg-white/5 border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FiCheck className="text-emerald-400" />
                    <span className="text-xs font-bold text-text-secondary">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase">{item.score}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="glass-card border-white/5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
            <h3 className="font-extrabold text-sm mb-6 uppercase tracking-widest">Recent Crop Analyses</h3>
            <div className="space-y-3">
              {history.length > 0 ? history.map((item) => (
                <div key={item.id} className="p-3 glass bg-white/5 border-white/5 rounded-xl">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold capitalize text-emerald-400">{item.topCrop}</div>
                      <div className="text-[11px] text-text-secondary">
                        pH {item.features?.ph}, rainfall {item.features?.rainfall} mm, humidity {item.features?.humidity}%
                      </div>
                    </div>
                    <div className="text-[10px] uppercase opacity-50">{new Date(item.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray-500">No crop analysis history yet. Run the prediction engine to save your first result.</div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
