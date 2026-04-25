import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLeaf, FaMoon, FaSignOutAlt, FaSun, FaUser } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
  FiBarChart2,
  FiBell,
  FiChevronsLeft,
  FiChevronsRight,
  FiCpu,
  FiFileText,
  FiGlobe,
  FiHelpCircle,
  FiHome,
  FiMap,
  FiMessageCircle,
  FiSettings,
  FiTrendingUp,
  FiActivity,
} from 'react-icons/fi'

const navItems = [
  { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { to: '/crop-recommendation', icon: FiMap, label: 'Crop Ai' },
  { to: '/disease-diagnosis', icon: FiActivity, label: 'Disease' },
  { to: '/market-intelligence', icon: FiTrendingUp, label: 'Market' },
  { to: '/subsidy-intelligence', icon: FiFileText, label: 'Subsidies' },
  { to: '/government-circulars', icon: FiGlobe, label: 'Circulars' },
  { to: '/digital-twin-simulator', icon: FiCpu, label: 'Simulator' },
  { to: '/ai-copilot', icon: FiMessageCircle, label: 'Ai Copilot' },
  { to: '/agent-monitor', icon: FiCpu, label: 'Agents' },
  { to: '/analytics', icon: FiBarChart2, label: 'Analytics' },
  { to: '/alerts-center', icon: FiBell, label: 'Alerts' },
  { to: '/settings', icon: FiSettings, label: 'Settings' },
  { to: '/help', icon: FiHelpCircle, label: 'Help' },
]

const SIDEBAR_STORAGE_KEY = 'krishisutra_sidebar_mode'

export default function Layout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const savedMode = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    return savedMode ? savedMode === 'full' : true
  })
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, sidebarExpanded ? 'full' : 'compact')
  }, [sidebarExpanded])

  const currentSection = navItems.find(item => window.location.pathname.includes(item.to))?.label || 'Dashboard'
  const sidebarWidth = sidebarExpanded ? 260 : 88

  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary">
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen glass border-r border-white/5 z-40 overflow-hidden shadow-2xl transition-all duration-500 ease-in-out"
      >
        <div className={`p-5 border-b border-white/5 h-20 ${sidebarExpanded ? 'flex items-center justify-between gap-3' : 'flex items-center justify-center'}`}>
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaLeaf className="text-emerald-400 text-xl" />
            </div>
            {sidebarExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="gradient-text font-extrabold text-xl whitespace-nowrap tracking-tight"
              >
                KrishiSutra
              </motion.span>
            )}
          </div>

          {sidebarExpanded && (
            <button
              onClick={() => setSidebarExpanded(prev => !prev)}
              className="w-10 h-10 rounded-xl glass bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all flex items-center justify-center text-text-secondary hover:text-emerald-400 flex-shrink-0"
              aria-label={sidebarExpanded ? 'Switch to compact sidebar' : 'Expand sidebar'}
              title={sidebarExpanded ? 'Compact sidebar' : 'Expand sidebar'}
            >
              {sidebarExpanded ? <FiChevronsLeft /> : <FiChevronsRight />}
            </button>
          )}
        </div>

        <nav className="flex-1 py-6 overflow-y-auto scrollbar-none px-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 relative group
                ${isActive
                  ? 'text-emerald-400 bg-emerald-500/10 shadow-inner'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'}`
              }
            >
              <item.icon className="flex-shrink-0 text-xl transition-transform duration-300 group-hover:scale-110" />
              {sidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
              {!sidebarExpanded && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-3">
          <button
            onClick={toggleTheme}
            className={`flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} gap-4 px-4 py-4 rounded-2xl text-sm font-bold text-text-secondary hover:bg-white/5 hover:text-emerald-400 transition-all duration-300 w-full group`}
          >
            <div className="flex-shrink-0 text-xl group-hover:rotate-12 transition-transform">
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </div>
            {sidebarExpanded && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </button>

          {sidebarExpanded && (
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary px-4 opacity-60">
              Full Sidebar Mode
            </div>
          )}
        </div>
      </motion.aside>

      <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 z-50 backdrop-blur-2xl px-2 py-3 rounded-t-[2.5rem] shadow-[0_-10px_25px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center">
          {navItems.slice(0, 5).map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `p-3 flex flex-col items-center gap-1 rounded-2xl transition-all duration-300 ${isActive ? 'text-emerald-400 bg-emerald-500/10' : 'text-text-secondary'}`
              }
            >
              <item.icon className="text-2xl" />
            </NavLink>
          ))}
        </div>
      </div>

      <main className={`flex-1 transition-all duration-500 ${sidebarExpanded ? 'md:ml-[260px]' : 'md:ml-[88px]'} p-4 md:p-10 pb-28 md:pb-10`}>
        <div className="flex items-center justify-between mb-10 h-12">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarExpanded(prev => !prev)}
              className="hidden md:flex w-10 h-10 rounded-xl glass bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all items-center justify-center text-text-secondary hover:text-emerald-400"
              aria-label={sidebarExpanded ? 'Compact sidebar' : 'Expand sidebar'}
              title={sidebarExpanded ? 'Compact sidebar' : 'Expand sidebar'}
            >
              {sidebarExpanded ? <FiChevronsLeft /> : <FiChevronsRight />}
            </button>
            <div className="w-1 h-8 bg-emerald-500 rounded-full" />
            <h2 className="text-xl font-extrabold tracking-tight opacity-50 uppercase text-sm tracking-widest">
              Platform / <span className="text-text-primary opacity-100">{currentSection}</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-1.5 glass rounded-2xl hover:bg-white/5 transition-all duration-300 border-white/5 pr-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <FaUser className="text-white text-sm" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-text-primary leading-none mb-1">{user?.name || 'Farmer Ji'}</div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Premium Plan</div>
                </div>
              </button>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 top-full mt-4 w-56 glass-card !p-2 z-50 border-white/10 shadow-2xl"
                >
                  <div className="p-4 border-b border-white/5 mb-1">
                    <div className="text-sm font-bold text-text-primary">{user?.name}</div>
                    <div className="text-xs font-medium text-text-secondary">{user?.email}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl flex items-center gap-3 transition-colors"
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <motion.div
          key={window.location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
