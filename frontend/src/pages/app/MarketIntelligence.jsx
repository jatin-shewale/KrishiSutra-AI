import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaArrowDown, FaArrowUp, FaChartLine } from 'react-icons/fa'
import { FiMinus, FiTrendingDown, FiTrendingUp } from 'react-icons/fi'
import { getPriceForecast, getSellOrHold } from '../../services/marketService'
import GlassCard from '../../components/ui/GlassCard'

const trendColor = { rising: 'text-emerald-400', falling: 'text-red-400', stable: 'text-gray-400', up: 'text-emerald-400', down: 'text-red-400' }
const recColor = {
  Sell: 'bg-red-500/20 text-red-400 border-red-500/30',
  Hold: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Buy: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  sell: 'bg-red-500/20 text-red-400 border-red-500/30',
  hold: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  monitor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

const CROPS = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Sugarcane', 'Potato', 'Tomato', 'Onion']

export default function MarketIntelligence() {
  const [selectedCrop, setSelectedCrop] = useState('Rice')
  const [forecast, setForecast] = useState(null)
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [fData, rData] = await Promise.all([
          getPriceForecast(selectedCrop, 30),
          getSellOrHold(selectedCrop),
        ])
        setForecast(fData)
        setRecommendation(rData)
      } catch (err) {
        console.error('Failed to fetch market data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCrop])

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Market Intelligence</h1>
        <p className="text-gray-400 mb-8">Price forecasts and sell/hold recommendations</p>
      </motion.div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {CROPS.map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
              selectedCrop === crop ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'glass hover:bg-white/5'
            }`}
          >
            {crop}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="min-h-[400px] flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400" />
              </div>
            ) : forecast ? (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-extrabold">{forecast.crop}</h2>
                    <p className="text-sm text-gray-400 font-medium">30-day Price Intelligence</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-extrabold tracking-tighter">Rs {forecast.last_price.toLocaleString()}</div>
                    <div className={`text-xs font-bold flex items-center gap-1 justify-end mt-1 uppercase ${trendColor[forecast.trend]}`}>
                      {forecast.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                      Current Mandi Rate
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center py-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent rounded-3xl" />
                  <div className="text-center relative z-10">
                    <div className={`text-6xl font-black mb-4 ${trendColor[forecast.trend]}`}>
                      Rs {forecast.forecast_price.toLocaleString()}
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Expected Price in {forecast.forecast_days} Days</p>
                    <div className="mt-8 flex items-center gap-4 justify-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Current</span>
                        <span className="text-lg font-bold">Rs {forecast.last_price}</span>
                      </div>
                      <div className="w-20 h-px bg-white/10" />
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Forecast</span>
                        <span className={`text-lg font-bold ${trendColor[forecast.trend]}`}>Rs {forecast.forecast_price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4 p-4 glass bg-white/5 border-white/5 rounded-2xl">
                  <div className={`p-3 rounded-xl ${trendColor[forecast.trend]} bg-white/5`}>
                    {forecast.trend === 'up' ? <FiTrendingUp size={24} /> : forecast.trend === 'down' ? <FiTrendingDown size={24} /> : <FiMinus size={24} />}
                  </div>
                  <div>
                    <div className="font-extrabold capitalize text-sm">{forecast.trend}ward Trend Predicted</div>
                    <div className="text-xs text-gray-400 font-medium">Confidence Score: {Math.round(forecast.confidence * 100)}% (Prophet Engine)</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">Select a crop to view forecast</div>
            )}
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-extrabold uppercase tracking-widest mb-6 flex items-center gap-2">
              <FaChartLine className="text-emerald-400" /> Market Insights
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Market Volatility', value: 'Low', sub: 'Stable demand expected' },
                { label: 'Harvest Status', value: 'Mid-Season', sub: 'Supply remains steady' },
                { label: 'Export Quality', value: 'High', sub: 'Strong international demand' },
                { label: 'Buffer Stock', value: 'Healthy', sub: 'No immediate shortage' },
              ].map((insight) => (
                <div key={insight.label} className="p-4 glass bg-white/5 border-white/5 rounded-2xl">
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">{insight.label}</div>
                  <div className="text-sm font-extrabold text-emerald-400">{insight.value}</div>
                  <div className="text-[10px] font-medium opacity-50">{insight.sub}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-2 text-[10px] font-black uppercase tracking-tighter ${recommendation ? recColor[recommendation.decision] : ''}`}>
              AI Decision
            </div>
            <h3 className="font-extrabold text-sm uppercase tracking-widest mb-6">Recommendation</h3>
            {recommendation ? (
              <div className={`p-8 rounded-3xl text-center border-2 ${recColor[recommendation.decision]} shadow-2xl`}>
                <div className="text-5xl mb-4">{recommendation.decision === 'sell' ? 'Sell' : recommendation.decision === 'hold' ? 'Hold' : 'Watch'}</div>
                <div className="text-3xl font-black uppercase tracking-tighter mb-2">{recommendation.decision}</div>
                <p className="text-xs font-bold opacity-80 leading-relaxed px-4">{recommendation.reason}</p>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center opacity-20"><div className="animate-pulse">Loading Engine...</div></div>
            )}
          </GlassCard>

          <GlassCard>
            <h3 className="font-extrabold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <FiTrendingUp className="text-emerald-400" /> Mandi Pulse
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Azadpur Mandi', price: '+Rs 120', trend: 'up' },
                { label: 'Ghazipur Mandi', price: '-Rs 30', trend: 'down' },
                { label: 'Okhla Mandi', price: '+Rs 210', trend: 'up' },
              ].map((mandi) => (
                <div key={mandi.label} className="flex items-center justify-between p-4 glass bg-white/5 border-white/5 rounded-2xl">
                  <span className="text-xs font-bold">{mandi.label}</span>
                  <span className={`text-xs font-extrabold ${trendColor[mandi.trend]}`}>{mandi.price}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
