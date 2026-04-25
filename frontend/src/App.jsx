import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './layouts/Layout'
import PublicLayout from './layouts/PublicLayout'
import Landing from './pages/public/Landing'
import Features from './pages/public/Features'
import HowItWorks from './pages/public/HowItWorks'
import Solutions from './pages/public/Solutions'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import ForgotPassword from './pages/public/ForgotPassword'
import Dashboard from './pages/app/Dashboard'
import FarmProfile from './pages/app/FarmProfile'
import CropRecommendation from './pages/app/CropRecommendation'
import DiseaseDiagnosis from './pages/app/DiseaseDiagnosis'
import MarketIntelligence from './pages/app/MarketIntelligence'
import SubsidyIntelligence from './pages/app/SubsidyIntelligence'
import GovernmentCirculars from './pages/app/GovernmentCirculars'
import DigitalTwin from './pages/app/DigitalTwin'
import AlertsCenter from './pages/app/AlertsCenter'
import AICopilot from './pages/app/AICopilot'
import AgentMonitor from './pages/app/AgentMonitor'
import Analytics from './pages/app/Analytics'
import Settings from './pages/app/Settings'
import Help from './pages/app/Help'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

function AnimatedRoute({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<AnimatedRoute><Landing /></AnimatedRoute>} />
          <Route path="/features" element={<AnimatedRoute><Features /></AnimatedRoute>} />
          <Route path="/how-it-works" element={<AnimatedRoute><HowItWorks /></AnimatedRoute>} />
          <Route path="/solutions" element={<AnimatedRoute><Solutions /></AnimatedRoute>} />
          <Route path="/about" element={<AnimatedRoute><About /></AnimatedRoute>} />
          <Route path="/contact" element={<AnimatedRoute><Contact /></AnimatedRoute>} />
          <Route path="/login" element={<AnimatedRoute><Login /></AnimatedRoute>} />
          <Route path="/register" element={<AnimatedRoute><Register /></AnimatedRoute>} />
          <Route path="/forgot-password" element={<AnimatedRoute><ForgotPassword /></AnimatedRoute>} />
        </Route>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<AnimatedRoute><Dashboard /></AnimatedRoute>} />
          <Route path="/farm-profile" element={<AnimatedRoute><FarmProfile /></AnimatedRoute>} />
          <Route path="/crop-recommendation" element={<AnimatedRoute><CropRecommendation /></AnimatedRoute>} />
          <Route path="/disease-diagnosis" element={<AnimatedRoute><DiseaseDiagnosis /></AnimatedRoute>} />
          <Route path="/market-intelligence" element={<AnimatedRoute><MarketIntelligence /></AnimatedRoute>} />
          <Route path="/subsidy-intelligence" element={<AnimatedRoute><SubsidyIntelligence /></AnimatedRoute>} />
          <Route path="/government-circulars" element={<AnimatedRoute><GovernmentCirculars /></AnimatedRoute>} />
          <Route path="/digital-twin-simulator" element={<AnimatedRoute><DigitalTwin /></AnimatedRoute>} />
          <Route path="/alerts-center" element={<AnimatedRoute><AlertsCenter /></AnimatedRoute>} />
          <Route path="/ai-copilot" element={<AnimatedRoute><AICopilot /></AnimatedRoute>} />
          <Route path="/agent-monitor" element={<AnimatedRoute><AgentMonitor /></AnimatedRoute>} />
          <Route path="/analytics" element={<AnimatedRoute><Analytics /></AnimatedRoute>} />
          <Route path="/settings" element={<AnimatedRoute><Settings /></AnimatedRoute>} />
          <Route path="/help" element={<AnimatedRoute><Help /></AnimatedRoute>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
