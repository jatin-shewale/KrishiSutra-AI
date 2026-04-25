import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaLeaf, FaRobot, FaChartLine, FaShieldAlt, FaBolt } from 'react-icons/fa'
import BackgroundAnimation from '../../components/ui/BackgroundAnimation'

const features = [
  { icon: FaLeaf, title: 'Crop Intelligence', desc: 'AI-powered crop recommendations using ensemble ML models' },
  { icon: FaRobot, title: 'Multi-Agent System', desc: '8+ autonomous agents collaborating in parallel' },
  { icon: FaChartLine, title: 'Market Forecast', desc: 'Prophet-based price predictions & sell/hold decisions' },
  { icon: FaShieldAlt, title: 'Disease Diagnosis', desc: 'EfficientNet image analysis with treatment plans' },
  { icon: FaBolt, title: 'Real-time Alerts', desc: 'Proactive notifications for risks & opportunities' },
]

export default function Landing() {
  return (
    <div className="min-h-screen relative">
      <BackgroundAnimation />
      
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-8 border-emerald-500/20">
              <FaLeaf className="text-emerald-400 animate-pulse" />
              <span className="text-xs md:text-sm font-semibold text-emerald-400 tracking-wide uppercase">
                Next-Gen Multi-Agent Farming Intelligence
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-[1.1]">
              <span className="gradient-text">KrishiSutra</span>
              <br />
              <span className="text-current opacity-90">AI Ecosystem</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              Empowering agriculture with autonomous multi-agent intelligence. 
              From precision crop recommendations to real-time market forecasting — 
              integrated and optimized for every farmer.
            </p>

            <div className="flex flex-wrap gap-5 justify-center">
              <Link to="/register" className="btn-primary text-lg px-10 py-4">
                Start Your Journey
              </Link>
              <Link to="/how-it-works" className="btn-secondary text-lg px-10 py-4">
                See How It Works
              </Link>
            </div>
          </motion.div>

          {/* Animated agent nodes */}
          <motion.div
            className="mt-20 flex justify-center gap-6 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {['Crop AI','Disease AI','Market AI','Subsidy AI','Digital Twin','Planner'].map((name, i) => (
              <motion.div
                key={name}
                className="glass px-6 py-3 rounded-2xl text-sm font-bold text-emerald-400 border-emerald-500/10 shadow-xl"
                animate={{ 
                  y: [0, -12, 0],
                  scale: [1, 1.05, 1],
                  borderColor: ['rgba(16,185,129,0.1)', 'rgba(16,185,129,0.3)', 'rgba(16,185,129,0.1)']
                }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              >
                {name}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 max-w-7xl mx-auto px-4 relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Autonomous Intelligence Modules
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto font-medium">
            Our multi-agent system leverages Llama 3 to orchestrate specialized agents 
            that handle every aspect of modern farming.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="glass-card group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <f.icon className="text-3xl text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
              <p className="text-text-secondary leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
