import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaCheckCircle, FaCloudUploadAlt, FaExclamationTriangle, FaLeaf, FaShieldAlt } from 'react-icons/fa'
import { FiActivity } from 'react-icons/fi'
import { detectDisease } from '../../services/diseaseService'
import GlassCard from '../../components/ui/GlassCard'
import { useAuth } from '../../context/AuthContext'
import { loadAnalysisHistory, saveAnalysisHistory } from '../../services/analysisHistory'

const severityColor = { Low: 'text-emerald-400', Moderate: 'text-yellow-400', High: 'text-red-400', Critical: 'text-red-600', high: 'text-red-400', medium: 'text-yellow-400', low: 'text-emerald-400' }
const severityBg = { Low: 'bg-emerald-500/20', Moderate: 'bg-yellow-500/20', High: 'bg-red-500/20', Critical: 'bg-red-600/20', high: 'bg-red-500/20', medium: 'bg-yellow-500/20', low: 'bg-emerald-500/20' }

export default function DiseaseDiagnosis() {
  const { user } = useAuth()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(loadAnalysisHistory('disease', user?.email || user?.id || 'guest'))
  }, [user])

  const handleFile = (incomingFile) => {
    if (!incomingFile) return
    setFile(incomingFile)
    setPreview(URL.createObjectURL(incomingFile))
    setResult(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setAnalyzing(true)
    setError(null)
    try {
      const response = await detectDisease(file)
      if (response.error) throw new Error(response.error)
      setResult(response)
      const nextHistory = saveAnalysisHistory('disease', user?.email || user?.id || 'guest', {
        id: `${Date.now()}-${file.name}`,
        timestamp: new Date().toISOString(),
        fileName: file.name,
        disease: response.disease,
        severity: response.severity,
        confidence: response.confidence,
        riskLevel: response.riskLevel,
      })
      setHistory(nextHistory)
    } catch (err) {
      const backendMessage = err?.response?.data?.detail || err?.message || 'Failed to analyze image'
      setError(backendMessage)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Disease Diagnosis</h1>
        <p className="text-gray-400 mb-8">Vision model detection with Ollama treatment explanation and spray advice</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><FaLeaf className="text-emerald-400" /> Upload Image</h3>
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors relative ${dragActive ? 'border-emerald-400 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/30'}`}
              onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]) }}
            >
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => handleFile(e.target.files[0])} accept="image/*" />
              {preview ? (
                <div className="space-y-4">
                  <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-white/10" />
                  <button onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); setResult(null) }} className="text-sm text-red-400 hover:text-red-300 relative z-10">Remove</button>
                </div>
              ) : (
                <div className="space-y-4">
                  <FaCloudUploadAlt className="text-4xl text-gray-500 mx-auto" />
                  <div>
                    <p className="text-sm text-gray-300">Drag & drop leaf image here</p>
                    <p className="text-xs text-gray-500 mt-1">or click to browse</p>
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleAnalyze} disabled={analyzing} className="w-full mt-4 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
              {analyzing ? <><span className="animate-spin">...</span> Analyzing...</> : <><FaLeaf /> Diagnose</>}
            </button>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><FaShieldAlt className="text-emerald-400" /> Tips</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Ensure good lighting', 'Capture both sides of leaf', 'Include affected area clearly', 'Avoid blurry images'].map(tip => (
                <li key={tip} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-emerald-400" />{tip}</li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-4">Recent Disease Analyses</h3>
            <div className="space-y-3">
              {history.length > 0 ? history.map((item) => (
                <div key={item.id} className="p-3 glass bg-white/5 border border-white/5 rounded-xl">
                  <div className="text-sm font-semibold text-emerald-400">{item.disease}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.fileName}</div>
                  <div className="text-[11px] text-gray-500 mt-1">
                    {Math.round((item.confidence || 0) * 100)}% confidence, {item.severity} severity, {item.riskLevel} risk
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray-500">No disease analysis history yet. Upload a leaf image and click Diagnose to save results.</div>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {analyzing && (
            <GlassCard className="text-center py-12">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-4xl text-emerald-400 mx-auto mb-4 w-fit">
                <FiActivity />
              </motion.div>
              <p className="text-gray-300">Analyzing leaf image with EfficientNet CNN and Ollama agronomy layer...</p>
            </GlassCard>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <GlassCard>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-red-400">{result.disease}</h2>
                    <p className="text-gray-400 text-sm">Detected on {result.crop || 'leaf sample'}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${severityBg[result.severity]} ${severityColor[result.severity]}`}>
                    {result.severity} Severity
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Confidence</span>
                      <span className="text-emerald-400 font-bold">{Math.round(result.confidence * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-red-500" initial={{ width: 0 }} animate={{ width: `${result.confidence * 100}%` }} transition={{ duration: 1 }} />
                    </div>
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${result.riskLevel === 'High' ? 'bg-red-500/10 border border-red-500/20' : result.riskLevel === 'Medium' ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                  <div className="flex items-center gap-2">
                    <FaExclamationTriangle className={result.riskLevel === 'High' ? 'text-red-400' : result.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-emerald-400'} />
                    <span className="text-sm">Risk Level: <strong>{result.riskLevel}</strong></span>
                  </div>
                </div>
              </GlassCard>

              {result.ai_explanation && (
                <GlassCard>
                  <h3 className="font-semibold mb-4">Ollama Explanation</h3>
                  <div className="p-4 glass rounded-xl border border-white/5">
                    <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">{result.ai_explanation}</p>
                  </div>
                </GlassCard>
              )}

              <GlassCard>
                <h3 className="font-semibold mb-4">Treatment Plan</h3>
                <div className="p-4 glass rounded-xl border border-white/5">
                  <p className="text-sm leading-relaxed text-gray-300">{result.treatment}</p>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="font-semibold mb-4">Recommended Spray Products</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {(result.recommended_products || []).map((product) => (
                    <div key={product} className="p-4 glass bg-white/5 border border-white/5 rounded-2xl text-sm text-gray-300">
                      {product}
                    </div>
                  ))}
                </div>
                {result.spray_advice && (
                  <div className="mt-4 p-4 glass rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm text-gray-300">
                    {result.spray_advice}
                  </div>
                )}
              </GlassCard>

              <GlassCard>
                <h3 className="font-semibold mb-4">Prevention Measures</h3>
                <div className="p-4 glass rounded-xl border border-white/5">
                  <p className="text-sm leading-relaxed text-gray-300">{result.prevention}</p>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {!result && !analyzing && (
            <GlassCard className="text-center py-20">
              <FaLeaf className="text-5xl text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">Upload a leaf image to start diagnosis</p>
            </GlassCard>
          )}

          {error && (
            <GlassCard className="border border-red-500/20 bg-red-500/5">
              <p className="text-red-300 text-sm">{error}</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  )
}
