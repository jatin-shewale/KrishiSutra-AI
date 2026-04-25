import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { FaPaperPlane, FaMicrophone, FaLanguage, FaRobot, FaBrain, FaBookOpen, FaUser } from 'react-icons/fa'
import { FiInfo, FiChevronRight } from 'react-icons/fi'
import { askCopilot } from '../../services/copilotService'

const quickPrompts = [
  'What crops are best for my soil?',
  'Diagnose yellowing leaves on cotton',
  'When should I sell my rice harvest?',
  'Am I eligible for PM Kisan?',
]

export default function AICopilot() {
  const [messages, setMessages] = useState([
    { role: 'agent', text: "Namaste! I am your KrishiSutra AI Copilot. I've coordinated with my agent team and I'm ready to help you optimize your farm. What's on your mind today?", agents: ['Planner Agent'] }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedLang, setSelectedLang] = useState('English')
  const [activeAgents, setActiveAgents] = useState([
    { name: 'Crop Agent', status: 'idle', icon: FaBrain },
    { name: 'Market Agent', status: 'idle', icon: FaRobot },
    { name: 'Disease Agent', status: 'idle', icon: FaBrain },
    { name: 'Policy Agent', status: 'idle', icon: FaBookOpen },
  ])
  
  const messagesEndRef = useRef(null)
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text = input) => {
    if (!text.trim()) return
    
    const userMsg = { role: 'user', text: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Simulate agent activation
    setActiveAgents(prev => prev.map(a => ({ ...a, status: 'running' })))

    try {
      const result = await askCopilot(text, selectedLang.toLowerCase())
      const responseText = result.response || result.answer || 'No response received.'
      const agentMsg = {
        role: 'agent',
        text: responseText,
        agents: ['Planner', 'Intelligence Suite'],
        confidence: 0.95,
        sources: result.sources || ['KrishiSutra Knowledge Base', 'Live Mandi Data']
      }
      
      setMessages(prev => [...prev, agentMsg])
    } catch (error) {
      const backendMessage = error?.response?.data?.detail || error?.response?.data?.response || error?.message
      setMessages(prev => [...prev, { 
        role: 'agent', 
        text: backendMessage || 'The copilot could not process that request right now.',
        isError: true 
      }])
    } finally {
      setLoading(false)
      setActiveAgents(prev => prev.map(a => ({ ...a, status: 'idle' })))
    }
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-14rem)] flex flex-col">
      <div className="flex-1 grid lg:grid-cols-4 gap-8 min-h-0">
        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col glass-card !p-0 border-white/5 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                 <FaRobot className="text-emerald-400" />
               </div>
               <div>
                 <div className="text-sm font-bold">KrishiSutra AI Copilot</div>
                 <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Llama 3 Multi-Agent Engine</div>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <select 
                 value={selectedLang}
                 onChange={e => setSelectedLang(e.target.value)}
                 className="bg-transparent text-xs font-bold border border-white/10 rounded-lg px-2 py-1 outline-none"
               >
                 {['English', 'Hindi', 'Punjabi', 'Tamil'].map(l => <option key={l} className="bg-slate-900">{l}</option>)}
               </select>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'glass border-white/10'}`}>
                      {msg.role === 'user' ? <FaUser className="text-white text-xs" /> : <FaRobot className="text-emerald-400 text-xs" />}
                    </div>
                    <div className={`p-5 rounded-3xl ${
                      msg.role === 'user'
                        ? 'bg-emerald-500 text-white rounded-tr-sm shadow-xl'
                        : 'glass-card !bg-white/5 border-white/5 rounded-tl-sm'
                    }`}>
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      
                      {msg.agents && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {msg.agents.map(a => (
                            <span key={a} className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg glass border-white/10 flex items-center justify-center">
                  <FaRobot className="text-emerald-400 text-xs animate-pulse" />
                </div>
                <div className="glass-card !bg-white/5 border-white/5 p-4 rounded-3xl rounded-tl-sm">
                   <div className="flex gap-1.5">
                      {[0,1,2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
                      ))}
                   </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-4 border-t border-white/5 flex gap-3 overflow-x-auto scrollbar-none">
            {quickPrompts.map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                className="px-4 py-2 text-xs font-bold glass rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 whitespace-nowrap flex-shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-white/5">
            <div className="relative group">
              <input
                type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask KrishiSutra anything about your farm..."
                className="w-full pl-6 pr-32 py-5 glass bg-white/5 border-white/10 focus:border-emerald-500/30 outline-none rounded-[2rem] font-medium text-sm transition-all shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="p-2.5 text-text-secondary hover:text-emerald-400 transition-colors">
                  <FaMicrophone size={18} />
                </button>
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="p-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-30 active:scale-95"
                >
                  <FaPaperPlane size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Logic Engine */}
        <div className="space-y-6 overflow-y-auto scrollbar-none">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card !p-5 border-white/5 shadow-xl">
             <h3 className="font-extrabold text-sm mb-5 flex items-center justify-between">
                <span className="flex items-center gap-2 uppercase tracking-widest"><FaBrain className="text-emerald-400" /> Multi-Agent Status</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
             </h3>
             <div className="space-y-3">
               {activeAgents.map(agent => (
                 <div key={agent.name} className="p-4 glass bg-white/5 border-white/5 rounded-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${agent.status === 'running' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                             <agent.icon size={14} className={agent.status === 'running' ? 'animate-spin' : ''} />
                          </div>
                          <span className="text-xs font-bold">{agent.name}</span>
                       </div>
                       <div className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${agent.status === 'running' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {agent.status}
                       </div>
                    </div>
                    <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                       <motion.div 
                         animate={{ x: agent.status === 'running' ? ['-100%', '100%'] : '0%' }}
                         transition={{ repeat: Infinity, duration: 1.5 }}
                         className={`w-full h-full ${agent.status === 'running' ? 'bg-yellow-400' : 'bg-emerald-400 opacity-30'}`}
                       ></motion.div>
                    </div>
                 </div>
               ))}
             </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card !p-5 border-white/5 shadow-xl">
             <h3 className="font-extrabold text-sm mb-5 flex items-center gap-2 uppercase tracking-widest">
                <FiInfo className="text-emerald-400" /> Reasoning Log
             </h3>
             <div className="space-y-4">
               {[
                 { step: 'Ingesting user query', status: 'done' },
                 { step: 'Decomposing into sub-tasks', status: 'done' },
                 { step: 'Llama 3 Brain active', status: 'running' },
                 { step: 'Synthesizing response', status: 'waiting' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                    {item.status === 'done' ? <div className="w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center"><FiChevronRight className="text-emerald-400" /></div> : <div className="w-4 h-4 rounded-full border border-white/20"></div>}
                    <span className="text-xs font-medium">{item.step}</span>
                 </div>
               ))}
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
