import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaUser, FaBell, FaLock, FaGlobe, FaPalette } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import GlassCard from '../../components/ui/GlassCard'

export default function Settings() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    farm: user?.farm || '',
    phone: '+91 98765 43210',
    language: 'English',
  })

  const tabs = [
    { id: 'profile', icon: FaUser, label: 'Profile' },
    { id: 'notifications', icon: FaBell, label: 'Notifications' },
    { id: 'security', icon: FaLock, label: 'Security' },
    { id: 'preferences', icon: FaPalette, label: 'Preferences' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
        <h1 className="text-3xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-gray-400 mb-8">Manage your account and preferences</p>
      </motion.div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <GlassCard className="!p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition ${
                  activeTab === tab.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                <tab.icon /> {tab.label}
              </button>
            ))}
          </GlassCard>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <GlassCard>
            {activeTab === 'profile' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                <h3 className="text-xl font-semibold mb-6">Profile Information</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text" value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Email</label>
                      <input
                        type="email" value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Farm Name</label>
                      <input
                        type="text" value={form.farm}
                        onChange={e => setForm({...form, farm: e.target.value})}
                        className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel" value={form.phone}
                        onChange={e => setForm({...form, phone: e.target.value})}
                        className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Language</label>
                    <select
                      value={form.language}
                      onChange={e => setForm({...form, language: e.target.value})}
                      className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm"
                    >
                      {['English', 'Hindi', 'Punjabi', 'Tamil', 'Telugu'].map(l => (
                        <option key={l} value={l} className="bg-gray-900">{l}</option>
                      ))}
                    </select>
                  </div>
                  <button className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition text-sm font-semibold">
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                <h3 className="text-xl font-semibold mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Crop Recommendations', desc: 'Get notified when new crop suggestions are ready', enabled: true },
                    { label: 'Disease Alerts', desc: 'Immediate alerts for disease detection', enabled: true },
                    { label: 'Market Price Updates', desc: 'Daily price changes for your crops', enabled: true },
                    { label: 'Subsidy Deadlines', desc: 'Reminders for upcoming scheme deadlines', enabled: false },
                    { label: 'Weather Alerts', desc: 'Warnings for extreme weather conditions', enabled: true },
                  ].map(n => (
                    <div key={n.label} className="flex items-center justify-between p-3 glass rounded-xl">
                      <div>
                        <div className="font-medium text-sm">{n.label}</div>
                        <div className="text-xs text-gray-500">{n.desc}</div>
                      </div>
                      <button className={`w-11 h-6 rounded-full transition ${n.enabled ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition ${n.enabled ? 'ml-6' : 'ml-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                <h3 className="text-xl font-semibold mb-6">Security</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Current Password</label>
                    <input type="password" placeholder="••••••" className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">New Password</label>
                    <input type="password" placeholder="••••••" className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                    <input type="password" placeholder="••••••" className="w-full px-4 py-3 glass rounded-xl bg-transparent border border-white/10 focus:border-emerald-500/50 outline-none text-sm" />
                  </div>
                  <button className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition text-sm font-semibold">
                    Update Password
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                <h3 className="text-xl font-semibold mb-6">Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-3">Theme</label>
                    <div className="flex gap-3">
                      <button
                        onClick={theme === 'dark' ? null : toggleTheme}
                        className={`px-4 py-2 rounded-xl text-sm ${theme === 'dark' ? 'bg-emerald-500 text-white' : 'glass hover:bg-white/5'}`}
                      >
                        Dark
                      </button>
                      <button
                        onClick={theme === 'light' ? null : toggleTheme}
                        className={`px-4 py-2 rounded-xl text-sm ${theme === 'light' ? 'bg-emerald-500 text-white' : 'glass hover:bg-white/5'}`}
                      >
                        Light
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
