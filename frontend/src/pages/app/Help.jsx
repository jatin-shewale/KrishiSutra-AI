import { motion } from 'framer-motion'
import { FaSearch, FaQuestionCircle, FaBook, FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa'
import { useState } from 'react'
import GlassCard from '../../components/ui/GlassCard'

const faqs = [
  { q: 'How accurate are crop recommendations?', a: 'Our ensemble model (RandomForest + XGBoost) achieves 92% accuracy on regional test data, validated against 3 years of harvest records.' },
  { q: 'How does disease diagnosis work?', a: 'We use EfficientNet CNN trained on 50,000+ leaf images. Upload a photo and get instant diagnosis with treatment recommendations.' },
  { q: 'How often is market data updated?', a: 'Market prices are fetched daily from major mandis across India. Forecasts use Prophet time-series with 87% accuracy.' },
  { q: 'What government circulars are covered?', a: 'We index circulars from Ministry of Agriculture, Cabinet Secretariat, and state govts — over 2,800 documents and growing.' },
  { q: 'Is my farm data secure?', a: 'All data is encrypted at rest and in transit. We never share your farm data with third parties without consent.' },
]

const guides = [
  { title: 'Getting Started Guide', desc: 'Learn the basics of KrishiSutra AI in 5 minutes' },
  { title: 'Crop Recommendation Tutorial', desc: 'How to get the best crop suggestions' },
  { title: 'Using AI Copilot', desc: 'Master the multi-agent assistant' },
  { title: 'Understanding Alerts', desc: 'Configure and act on farm alerts' },
]

export default function Help() {
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Help & Support</h1>
        <p className="text-gray-400 mb-8">Find answers and get support</p>
      </motion.div>

      {/* Search */}
      <GlassCard className="!p-4 mb-8">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search help articles..."
            className="w-full pl-10 pr-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
          />
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* FAQs */}
          <GlassCard>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><FaQuestionCircle className="text-emerald-400" /> Frequently Asked Questions</h3>
            <div className="space-y-2">
              {filteredFaqs.map((faq, i) => (
                <motion.div
                  key={i}
                  className="border border-white/5 rounded-xl overflow-hidden"
                  initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{faq.q}</span>
                    <span className="text-emerald-400 text-xs">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{height:0}} animate={{height:'auto'}} className="px-4 pb-3"
                    >
                      <p className="text-sm text-gray-400">{faq.a}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Guides */}
          <GlassCard>
            <h3 className="font-semibold mb-4 flex items-center gap-2"><FaBook className="text-emerald-400" /> Guides & Tutorials</h3>
            <div className="space-y-2">
              {guides.map(g => (
                <button key={g.title} className="w-full text-left p-3 glass rounded-xl hover:border-emerald-500/30 transition">
                  <div className="font-medium text-sm">{g.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{g.desc}</div>
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <GlassCard className="!p-4">
            <h3 className="font-semibold mb-3">Contact Support</h3>
            <p className="text-sm text-gray-400 mb-4">Can't find what you're looking for?</p>
            <button className="w-full py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition text-sm font-semibold flex items-center justify-center gap-2">
              <FaEnvelope /> Email Support
            </button>
          </GlassCard>

          <GlassCard className="!p-4">
            <h3 className="font-semibold mb-3">Documentation</h3>
            <div className="space-y-2">
              {[
                'API Documentation',
                'Agent Architecture',
                'Integration Guide',
                'Model Card Details',
              ].map(doc => (
                <button key={doc} className="w-full text-left text-sm text-gray-300 hover:text-emerald-400 transition flex items-center justify-between">
                  {doc} <FaExternalLinkAlt className="text-xs" />
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="!p-4">
            <h3 className="font-semibold mb-3">System Status</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-gray-300">All systems operational</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
