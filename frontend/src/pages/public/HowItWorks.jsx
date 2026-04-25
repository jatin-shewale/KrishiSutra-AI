import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaBrain, FaProjectDiagram, FaRobot, FaDatabase, FaChartLine } from 'react-icons/fa'

const steps = [
  { icon: FaBrain, title: 'Query Analysis', desc: 'Master Orchestrator classifies farmer query and determines which agents to invoke', num: '01' },
  { icon: FaProjectDiagram, title: 'Parallel Execution', desc: '8+ specialized agents run in parallel — Crop, Disease, Irrigation, Market, Subsidy, RAG, Alert', num: '02' },
  { icon: FaRobot, title: 'Agent Reasoning', desc: 'Each agent uses system prompts, tools, and ML models to produce confidence-scored outputs', num: '03' },
  { icon: FaDatabase, title: 'RAG Pipeline', desc: 'Government circulars auto-scraped, chunked, embedded in FAISS, retrieved via LangGraph', num: '04' },
  { icon: FaChartLine, title: 'Aggregated Decision', desc: 'Master Orchestrator merges all agent outputs with conflict resolution and confidence weighting', num: '05' },
]

export default function HowItWorks() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-4">How It Works</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">LangGraph-powered multi-agent system with autonomous decision making</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/50 to-transparent hidden md:block" />

          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className={`relative mb-12 md:w-1/2 ${i%2===0 ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-1/2'}`}
              initial={{opacity:0, x: i%2===0 ? -30 : 30}}
              whileInView={{opacity:1, x:0}}
              viewport={{once:true}}
              transition={{delay: i*0.15}}
            >
              <div className="glass p-6 rounded-2xl hover:border-emerald-500/30 transition group">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-bold text-emerald-500/20">{s.num}</span>
                  <s.icon className="text-2xl text-emerald-400 group-hover:scale-110 transition" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="text-center mt-12" whileInView={{opacity:1}} viewport={{once:true}}>
          <Link to="/register" className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition">
            Try It Now
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
