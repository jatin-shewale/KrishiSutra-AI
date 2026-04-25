import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaSearch, FaCalendarAlt, FaCheckCircle, FaExclamationCircle, FaExternalLinkAlt, FaInfoCircle, FaRegClock } from 'react-icons/fa'
import { fetchLatestSchemes, listSubsidies, searchCirculars } from '../../services/subsidyService'
import { useEffect } from 'react'
import GlassCard from '../../components/ui/GlassCard'

const statusIcon = { open: FaCheckCircle, closing: FaExclamationCircle, closed: FaRegClock, active: FaCheckCircle }
const statusColor = { open: 'text-emerald-400', closing: 'text-yellow-400', closed: 'text-gray-400', active: 'text-emerald-400' }
const statusBg = { open: 'bg-emerald-500/20', closing: 'bg-yellow-500/20', closed: 'bg-gray-500/20', active: 'bg-emerald-500/20' }

const inferSchemeAbout = (scheme) => {
  const text = `${scheme.title || ''} ${scheme.source || ''}`.toLowerCase()
  if (text.includes('irrigation') || text.includes('pmksy')) return 'Water-saving support for irrigation infrastructure and field efficiency.'
  if (text.includes('soil')) return 'Soil testing, nutrient planning, and field health support.'
  if (text.includes('insurance') || text.includes('bima') || text.includes('pmfby')) return 'Crop risk protection and financial support after loss events.'
  if (text.includes('credit') || text.includes('kcc')) return 'Working-capital or credit access support for farm operations.'
  if (text.includes('horticulture')) return 'Support for horticulture crops, orchards, nurseries, or protected cultivation.'
  if (text.includes('export') || text.includes('apeda')) return 'Export-facing support for quality, packaging, or market access.'
  if (text.includes('mechanisation') || text.includes('machinery')) return 'Support for farm equipment, mechanisation, and productivity upgrades.'
  return 'Government agriculture scheme or circular relevant to farmers, farm support, or rural development.'
}

const inferBenefit = (scheme) => {
  const text = `${scheme.title || ''} ${scheme.source || ''}`.toLowerCase()
  if (text.includes('insurance') || text.includes('bima')) return 'Main benefit: risk cover, claim support, and reduced loss exposure.'
  if (text.includes('irrigation')) return 'Main benefit: lower water use, better irrigation control, and improved crop stability.'
  if (text.includes('soil')) return 'Main benefit: better fertilizer decisions and stronger soil management.'
  if (text.includes('credit') || text.includes('kcc')) return 'Main benefit: easier access to seasonal credit for inputs and operations.'
  if (text.includes('export')) return 'Main benefit: stronger access to quality-linked incentives and export opportunities.'
  return 'Main benefit: scheme awareness, official guidance, and access to a relevant government support channel.'
}

const inferWhereToCheck = (scheme) => {
  if (scheme.url) return new URL(scheme.url).hostname.replace(/^www\./, '')
  return scheme.source || 'official government portal'
}

const formatStamp = (value) => {
  if (!value) return 'Recently indexed'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString()
}

const normalizeScheme = (scheme) => {
  const title = scheme.title || 'Untitled Scheme'
  const source = scheme.source || 'Government Source'
  const fetchedAt = scheme.fetched_at || null
  const derivedStatus = scheme.status || (fetchedAt ? 'active' : 'open')

  return {
    ...scheme,
    title,
    source,
    status: statusIcon[derivedStatus] ? derivedStatus : 'active',
    amount: scheme.amount || 'See source for full benefit details',
    eligibility: scheme.eligibility || `Discovered from ${source}. Open the source link to verify eligibility conditions and application flow.`,
    deadline: scheme.deadline || (fetchedAt ? new Date(fetchedAt).toLocaleDateString() : 'Check source portal'),
    matchPercent: scheme.matchPercent || (derivedStatus === 'open' ? 92 : derivedStatus === 'closing' ? 78 : 65),
    about: scheme.about || inferSchemeAbout(scheme),
    benefit: scheme.benefit || inferBenefit(scheme),
    whereToCheck: scheme.whereToCheck || inferWhereToCheck(scheme),
  }
}

export default function SubsidyIntelligence() {
  const [search, setSearch] = useState('')
  const [subsidies, setSubsidies] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [ragResult, setRagResult] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const normalizedSubsidies = subsidies.map(normalizeScheme)

  const fetchSchemes = async () => {
    setLoading(true)
    try {
      const data = await listSubsidies()
      if ((data || []).length === 0) {
        await fetchLatestSchemes()
        const refreshed = await listSubsidies()
        setSubsidies(refreshed)
        return
      }
      setSubsidies(data)
    } catch (err) {
      console.error('Failed to fetch schemes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && search.trim()) {
      setLoading(true)
      try {
        const result = await searchCirculars(search)
        setRagResult(result)
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchSchemes()
  }, [])

  const handleRefreshSchemes = async () => {
    setRefreshing(true)
    try {
      await fetchLatestSchemes()
      await fetchSchemes()
    } catch (err) {
      console.error('Failed to refresh schemes:', err)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Subsidy Intelligence</h1>
        <p className="text-gray-400 mb-8">Discover government schemes you're eligible for</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <GlassCard className="!p-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Ask about any scheme or subsidy (e.g. 'PM Kisan eligibility')..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-10 pr-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
              />
            </div>
            <button
              onClick={handleRefreshSchemes}
              disabled={refreshing}
              className="mt-3 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50 transition"
            >
              {refreshing ? 'Fetching latest schemes...' : 'Get New Scheme Info'}
            </button>
            {loading && <div className="mt-2 text-[10px] font-bold text-emerald-400 animate-pulse uppercase tracking-widest px-1">AI Agent searching knowledge base...</div>}
          </GlassCard>

          {/* RAG Result */}
          {ragResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <GlassCard className="border-emerald-500/30 bg-emerald-500/5">
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                     Scheme Intelligence
                  </h3>
                  <div className="text-sm leading-relaxed font-medium text-gray-300">
                     {ragResult.rag_answer}
                  </div>
                  {ragResult.source_circulars?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                       <div className="text-[10px] font-bold text-gray-500 uppercase mb-2">Sources</div>
                       <div className="space-y-2">
                          {ragResult.source_circulars.map((s, idx) => (
                            <div key={idx} className="text-xs px-3 py-2 rounded bg-white/5 border border-white/10">
                              <div className="font-medium text-gray-200">{s.title || `Circular ${idx + 1}`}</div>
                              {s.source && <div className="text-gray-500 mt-1">{s.source}</div>}
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
               </GlassCard>
            </motion.div>
          )}

          {/* Subsidy Cards */}
          <div className="space-y-4">
            {normalizedSubsidies.length > 0 ? normalizedSubsidies.map((s, i) => (
              <motion.div
                key={s.url || s.title}
                initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
                onClick={() => setSelected(s)}
              >
                <GlassCard className="!p-5 cursor-pointer" hover={true}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">{s.title}</h3>
                      <p className="text-sm text-gray-400">{s.about}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${statusBg[s.status]} ${statusColor[s.status]}`}>
                      {(() => { const Icon = statusIcon[s.status] || FaCheckCircle; return <Icon /> })()}
                      {s.status}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="p-3 glass rounded-xl border border-white/5">
                      <div className="text-[10px] uppercase tracking-widest text-emerald-400 mb-1">Benefit</div>
                      <div className="text-gray-300">{s.benefit}</div>
                    </div>
                    <div className="p-3 glass rounded-xl border border-white/5">
                      <div className="text-[10px] uppercase tracking-widest text-emerald-400 mb-1">Where To Check</div>
                      <div className="text-gray-300">{s.whereToCheck}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-emerald-400 font-bold">{s.source}</span>
                      <span className="text-gray-500 flex items-center gap-1">
                        <FaCalendarAlt /> {formatStamp(s.fetched_at || s.deadline)}
                      </span>
                    </div>
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1">
                        <FaExternalLinkAlt /> Open Source
                      </a>
                    ) : (
                      <button className="text-xs text-emerald-400 hover:text-emerald-300 transition">
                        View Details
                      </button>
                    )}
                  </div>
                  {/* Eligibility Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Relevance Score</span>
                      <span>{s.matchPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${s.status === 'open' ? 'bg-emerald-500' : s.status === 'closing' ? 'bg-yellow-500' : 'bg-gray-500'}`}
                        initial={{width:0}} animate={{width: `${s.matchPercent}%`}}
                        transition={{duration:1, delay:0.5}}
                      />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )) : (
              <div className="py-20 text-center opacity-30 font-bold uppercase tracking-widest text-sm">No schemes found in database. Use "Get New Scheme Info" to scrape and index them.</div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-semibold mb-4">Selected Scheme Insight</h3>
            {selected ? (
              <div className="space-y-3">
                <div className="p-3 glass rounded-xl">
                  <div className="text-sm font-semibold text-emerald-400">{selected.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{selected.source}</div>
                </div>
                <div className="p-3 glass rounded-xl">
                  <div className="text-[10px] uppercase tracking-widest text-emerald-400 mb-1">About</div>
                  <p className="text-sm text-gray-300">{selected.about}</p>
                </div>
                <div className="p-3 glass rounded-xl">
                  <div className="text-[10px] uppercase tracking-widest text-emerald-400 mb-1">Benefit</div>
                  <p className="text-sm text-gray-300">{selected.benefit}</p>
                </div>
                <div className="p-3 glass rounded-xl">
                  <div className="text-[10px] uppercase tracking-widest text-emerald-400 mb-1">Eligibility / Verification</div>
                  <p className="text-sm text-gray-300">{selected.eligibility}</p>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 flex items-start gap-2">
                <FaInfoCircle className="mt-0.5 text-emerald-400" />
                Click a scheme card to see a cleaner explanation of what it is about, what the likely benefit is, and where to verify it.
              </div>
            )}
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {normalizedSubsidies.filter(s => s.status !== 'closed').slice(0, 8).map(s => (
                <div key={s.url || s.title} className="flex items-center gap-3 p-2 glass rounded-lg">
                  <FaCalendarAlt className={`${s.status === 'closing' ? 'text-yellow-400' : 'text-emerald-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.deadline}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="font-semibold mb-4">Documents Checklist</h3>
            <div className="space-y-2">
              {['Aadhar Card', 'Land Records', 'Bank Passbook', 'Soil Test Report'].map(d => (
                <div key={d} className="flex items-center gap-2 text-sm text-gray-300">
                  <FaCheckCircle className="text-emerald-400 text-xs" /> {d}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
