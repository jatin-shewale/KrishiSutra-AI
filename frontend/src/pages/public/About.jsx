import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaLeaf, FaSeedling, FaChartLine, FaUsers, FaLightbulb } from 'react-icons/fa'
import BackgroundAnimation from '../../components/ui/BackgroundAnimation'

const values = [
  { icon: FaSeedling, title: 'Sustainability First', desc: 'Every recommendation prioritizes long-term soil health and environmental impact.' },
  { icon: FaChartLine, title: 'Data Driven', desc: 'Advanced ML models and real-time data for accurate predictions.' },
  { icon: FaUsers, title: 'Farmer Centric', desc: 'Built by farmers, for farmers. Every feature solves real problems.' },
  { icon: FaLightbulb, title: 'Continuous Innovation', desc: 'Self-improving agents that learn from every interaction.' },
]

export default function About() {
  return (
    <div className="min-h-screen py-24 relative overflow-hidden">
      <BackgroundAnimation />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-8 border-emerald-500/20">
            <FaLeaf className="text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400 uppercase tracking-wider">About KrishiSutra AI</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold mb-8 tracking-tight leading-tight">
            <span className="gradient-text">Revolutionizing</span>
            <br />
            <span className="text-current opacity-90">Indian Agriculture</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto font-medium leading-relaxed">
            We are building the world's first autonomous multi-agent farming intelligence platform. 
            Our mission is to empower every farmer with AI-driven insights for better yields and sustainable practices.
          </p>
        </motion.div>

        <motion.div
          className="glass-card p-12 mb-24 text-center border-emerald-500/10"
          initial={{ opacity: 0, scale: 0.95 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }}
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <FaLeaf className="text-4xl text-emerald-400" />
          </div>
          <h2 className="text-4xl font-extrabold gradient-text mb-6">Our Mission</h2>
          <p className="text-xl text-text-secondary max-w-4xl mx-auto font-medium leading-relaxed">
            To democratize agricultural intelligence by making world-class AI accessible to every farmer in India. 
            Through autonomous multi-agent systems, we are transforming how farming decisions are made, 
            ensuring prosperity and sustainability for the backbone of our nation.
          </p>
        </motion.div>

        <div>
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold gradient-text mb-4">Our Core Values</h2>
            <p className="text-text-secondary font-medium">The principles that drive our innovation</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="glass-card text-center"
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                   <v.icon className="text-3xl text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                <p className="text-text-secondary font-medium text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="text-center mt-24" 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true }}
        >
          <Link to="/register" className="btn-primary text-xl px-12 py-5">
            Join The Revolution
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
