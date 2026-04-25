import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaExternalLinkAlt, FaQuoteLeft, FaRegFileAlt, FaRobot, FaSearch, FaSyncAlt } from 'react-icons/fa'
import { askSchemeAgent, fetchLatestSchemes, listSubsidies, searchCirculars } from '../../services/subsidyService'
import GlassCard from '../../components/ui/GlassCard'

const formatDate = (value) => {
  if (!value) return 'Recently indexed'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString()
}

export default function GovernmentCirculars() {
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [circulars, setCirculars] = useState([])
  const [aiAnswer, setAiAnswer] = useState('')
  const [sourceCards, setSourceCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadCirculars = async () => {
    try {
      const data = await listSubsidies()
      if ((data || []).length === 0) {
        await fetchLatestSchemes()
        const refreshed = await listSubsidies()
        setCirculars(refreshed)
        return
      }
      setCirculars(data)
    } catch (error) {
      console.error('Failed to load circulars:', error)
    }
  }

  useEffect(() => {
    loadCirculars()
  }, [])

  const handleAskAI = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const [answer, searchResult] = await Promise.all([
        askSchemeAgent(query),
        searchCirculars(query),
      ])
      setAiAnswer(answer.answer || answer.response || 'No answer available yet.')
      setSourceCards(answer.sources || searchResult.source_circulars || searchResult.results || [])
    } catch (error) {
      console.error('Failed to ask circular AI:', error)
      setAiAnswer('Unable to query the circular knowledge base right now.')
      setSourceCards([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchLatestSchemes()
      await loadCirculars()
    } catch (error) {
      console.error('Failed to refresh circulars:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const filteredCirculars = circulars.filter((item) => {
    const title = item.title?.toLowerCase() || ''
    const source = item.source?.toLowerCase() || ''
    const term = search.toLowerCase()
    return title.includes(term) || source.includes(term)
  })

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Government Circulars</h1>
        <p className="text-gray-400 mb-8">Live circular intelligence backed by MongoDB and Chroma retrieval</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <FaRobot className="text-emerald-400" />
                <h3 className="font-semibold">Ask AI About Policies</h3>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-4 py-2 text-xs font-bold bg-white/5 rounded-xl border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition disabled:opacity-50 flex items-center gap-2"
              >
                <FaSyncAlt className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh Circulars'}
              </button>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g., What subsidy is available for drip irrigation?"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
              />
              <button
                onClick={handleAskAI}
                disabled={loading || !query.trim()}
                className="px-5 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition disabled:opacity-50"
              >
                {loading ? 'Thinking...' : 'Ask AI'}
              </button>
            </div>
            {aiAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 glass rounded-xl border border-emerald-500/20"
              >
                <div className="flex items-start gap-2 mb-2">
                  <FaQuoteLeft className="text-emerald-400/50 mt-1" />
                  <p className="text-sm text-gray-300 leading-relaxed">{aiAnswer}</p>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Sources used: {sourceCards.length > 0 ? sourceCards.length : 'Chroma retrieval only'}
                </div>
              </motion.div>
            )}
          </GlassCard>

          <GlassCard className="!p-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search indexed circulars..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
              />
            </div>
          </GlassCard>

          <div className="space-y-4">
            {filteredCirculars.map((c, i) => (
              <motion.div
                key={c.url || `${c.title}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard className="!p-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 glass rounded-lg">
                      <FaRegFileAlt className="text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{c.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{c.type || 'Government circular'}</p>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatDate(c.fetched_at)}</span>
                          <span>{c.source || 'Unknown source'}</span>
                        </div>
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                          >
                            <FaExternalLinkAlt /> View Source
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
            {filteredCirculars.length === 0 && (
              <div className="py-16 text-center text-sm font-bold uppercase tracking-widest text-gray-500">
                No indexed circulars found yet
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-semibold mb-4">Live Pipeline</h3>
            <div className="space-y-3">
              {[
                { step: 'Scrape', desc: 'Government portals fetched into MongoDB', status: 'active' },
                { step: 'Chunk', desc: 'Circular text split for retrieval', status: 'active' },
                { step: 'Embed', desc: 'Ollama embeddings generated locally', status: 'active' },
                { step: 'Store', desc: 'Chunks persisted in Chroma', status: 'active' },
                { step: 'Answer', desc: 'Top matches fed into the policy copilot', status: 'active' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3 p-2 glass rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.step}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-4">Recent Source Matches</h3>
            <div className="space-y-2">
              {sourceCards.length > 0 ? sourceCards.map((item, index) => (
                <div key={item.url || index} className="p-3 text-sm text-gray-300 glass rounded-lg">
                  <div className="font-medium">{item.title || item.source || `Source ${index + 1}`}</div>
                  {item.source && <div className="text-xs text-gray-500 mt-1">{item.source}</div>}
                </div>
              )) : (
                <div className="text-sm text-gray-500">Ask a question to see matched circulars here.</div>
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-4">Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Circulars Indexed</span>
                <span className="text-white font-medium">{circulars.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Live Matches</span>
                <span className="text-white font-medium">{sourceCards.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Store</span>
                <span className="text-white font-medium">Chroma</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
