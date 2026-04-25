import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaSeedling, FaTint, FaThermometerHalf, FaChartBar, FaMoneyBillWave, FaFileAlt, FaRobot, FaExclamationTriangle } from 'react-icons/fa'

const features = [
  { icon: FaSeedling, title: 'Crop Intelligence', desc: 'RandomForest + XGBoost ensemble predictions with NPK, pH, rainfall analysis.', color: 'from-emerald-500/20 to-emerald-600/5' },
  { icon: FaTint, title: 'Irrigation Optimizer', desc: 'ML-powered water optimization with 30-day simulation modeling.', color: 'from-blue-500/20 to-blue-600/5' },
  { icon: FaThermometerHalf, title: 'Disease Diagnosis', desc: 'EfficientNet CNN leaf analysis with severity scoring & treatment.', color: 'from-red-500/20 to-red-600/5' },
  { icon: FaChartBar, title: 'Market Forecast', desc: 'Prophet time-series forecasting with sell/hold recommendations.', color: 'from-purple-500/20 to-purple-600/5' },
  { icon: FaMoneyBillWave, title: 'Subsidy Discovery', desc: 'RAG over government circulars. Llama3-powered eligibility matching.', color: 'from-yellow-500/20 to-yellow-600/5' },
  { icon: FaFileAlt, title: 'Document Intelligence', desc: 'Autonomous scraping, PDF extraction, FAISS vector indexing.', color: 'from-cyan-500/20 to-cyan-600/5' },
  { icon: FaRobot, title: 'LangGraph Orchestrator', desc: 'Master agent routing queries to 8 parallel specialized agents.', color: 'from-pink-500/20 to-pink-600/5' },
  { icon: FaExclamationTriangle, title: 'Proactive Alerts', desc: 'Autonomous monitoring for pest outbreaks, price crashes, deadlines.', color: 'from-orange-500/20 to-orange-600/5' },
]

export default function Features() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-4">Product Features</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">8 autonomous AI agents collaborating to transform farming decisions</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={`glass p-6 rounded-2xl bg-gradient-to-br ${f.color} border border-white/5 group`}
              initial={{opacity:0, y:30}}
              whileInView={{opacity:1, y:0}}
              viewport={{once:true}}
              transition={{delay: i * 0.1}}
              whileHover={{y: -5}}
            >
              <f.icon className="text-4xl text-emerald-400 mb-4 group-hover:scale-110 transition" />
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center mt-12" whileInView={{opacity:1}} viewport={{once:true}}>
          <Link to="/register" className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition">
            Start Free Trial
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
