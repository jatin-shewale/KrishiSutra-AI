import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaLeaf, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-xl font-bold">
            <FaLeaf className="text-emerald-400" />
            <span className="gradient-text">KrishiSutra AI</span>
          </NavLink>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {['features', 'how-it-works', 'solutions', 'about', 'contact'].map(l => (
              <NavLink key={l} to={`/${l}`} className={({ isActive }) =>
                `hover:text-emerald-400 transition-all duration-300 relative group ${isActive ? 'text-emerald-400' : 'text-gray-400'}`
              }>
                {l.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2.5 glass rounded-xl hover:bg-emerald-500/10 transition-colors border-white/5">
              {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-emerald-600" />}
            </button>
            <NavLink to="/login" className="hidden sm:block text-sm font-semibold hover:text-emerald-400 transition-colors">Login</NavLink>
            <NavLink to="/register" className="btn-primary py-2 px-5 text-sm">Sign Up</NavLink>
            <button className="md:hidden text-gray-400 hover:text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="md:hidden glass border-t border-white/5 p-6 space-y-4 absolute w-full left-0 top-16"
          >
            {['features', 'how-it-works', 'solutions', 'about', 'contact'].map(l => (
              <NavLink 
                key={l} 
                to={`/${l}`} 
                className="block text-lg font-medium text-gray-400 hover:text-emerald-400" 
                onClick={() => setMenuOpen(false)}
              >
                {l.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <NavLink to="/login" className="text-center py-3 font-medium" onClick={() => setMenuOpen(false)}>Login</NavLink>
            </div>
          </motion.div>
        )}
      </nav>
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}
