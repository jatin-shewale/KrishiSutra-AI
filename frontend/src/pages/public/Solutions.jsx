import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaUser, FaTractor, FaSeedling, FaLandmark, FaMoneyBillWave } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'

const solutions = [
  {
    icon: FaUser, title: 'For Farmers',
    desc: 'Get AI-powered crop recommendations, disease diagnosis, and market forecasts tailored to your farm.',
    features: ['Personalized crop recommendations', 'Instant disease diagnosis via photo', 'Real-time market price alerts', 'Subsidy eligibility checker'],
    color: 'from-emerald-500/20 to-emerald-600/5',
  },
  {
    icon: FaTractor, title: 'For Cooperatives',
    desc: 'Manage multiple farms, aggregate insights, and optimize collective decision-making with AI.',
    features: ['Multi-farm dashboard', 'Collective bargaining insights', 'Bulk subsidy applications', 'Shared resource optimization'],
    color: 'from-blue-500/20 to-blue-600/5',
  },
  {
    icon: FaLandmark, title: 'For Government',
    desc: 'Policy intelligence, scheme impact analysis, and farmer outreach optimization using RAG over circulars.',
    features: ['Circular intelligence dashboard', 'Scheme penetration analytics', 'Farmer sentiment analysis', 'Policy impact simulation'],
    color: 'from-purple-500/20 to-purple-600/5',
  },
]

export default function Solutions() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-4">Solutions</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">Tailored intelligence for every stakeholder in agriculture</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              className={`glass p-8 rounded-2xl bg-gradient-to-br ${s.color} border border-white/5 flex flex-col`}
              initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.15}}
              whileHover={{y:-5}}
            >
              <s.icon className="text-4xl text-emerald-400 mb-4" />
              <h2 className="text-2xl font-bold mb-3">{s.title}</h2>
              <p className="text-gray-400 mb-6 flex-1">{s.desc}</p>
              <ul className="space-y-3 mb-8">
                {s.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <FiCheck className="text-emerald-400 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition">
                Get Started
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
