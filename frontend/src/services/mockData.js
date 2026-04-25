export const mockCrops = [
  { name: 'Cotton', confidence: 92, yield: '18 qt/acre', risk: 'Low', npk: 'N:90 P:42 K:43', price: '₹6,200/quintal' },
  { name: 'Rice', confidence: 87, yield: '28 qt/acre', risk: 'Medium', npk: 'N:80 P:60 K:40', price: '₹2,080/quintal' },
  { name: 'Wheat', confidence: 81, yield: '30 qt/acre', risk: 'Low', npk: 'N:120 P:50 K:30', price: '₹2,350/quintal' },
  { name: 'Maize', confidence: 76, yield: '25 qt/acre', risk: 'Low', npk: 'N:100 P:45 K:50', price: '₹1,890/quintal' },
]

export const mockDiseaseDiagnosis = {
  disease: 'Leaf Blight',
  confidence: 94,
  severity: 'Moderate',
  crop: 'Rice',
  treatment: [
    { name: 'Carbendazim 50% WP', type: 'Fungicide', dosage: '2g/L', frequency: 'Every 7 days' },
    { name: 'Mancozeb 75% WP', type: 'Fungicide', dosage: '2.5g/L', frequency: 'Every 10 days' },
    { name: 'Copper Oxychloride', type: 'Preventive', dosage: '3g/L', frequency: 'Every 14 days' },
  ],
  prevention: ['Avoid overhead irrigation', 'Ensure proper spacing', 'Remove infected plant debris'],
  riskLevel: 'Medium',
}

export const mockMarketData = [
  { crop: 'Cotton', current: 6200, forecast: [6100, 6250, 6400, 6600, 6800, 7200], trend: 'rising', recommendation: 'Hold' },
  { crop: 'Rice', current: 2080, forecast: [2100, 2050, 2000, 1950, 1900, 1850], trend: 'falling', recommendation: 'Sell' },
  { crop: 'Wheat', current: 2350, forecast: [2350, 2400, 2420, 2380, 2450, 2500], trend: 'rising', recommendation: 'Hold' },
]

export const mockSubsidies = [
  { title: 'PM Kisan Samman Nidhi', amount: '₹6,000/year', eligibility: 'All small farmers', deadline: '2026-12-31', status: 'open' },
  { title: 'Pradhan Mantri Fasal Bima Yojana', amount: 'Up to 90% premium subsidy', eligibility: 'All farmers with crop insurance', deadline: '2026-06-30', status: 'open' },
  { title: 'Soil Health Card Scheme', amount: 'Free soil testing', eligibility: 'All farmers', deadline: '2026-09-15', status: 'open' },
  { title: 'Micro Irrigation Subsidy', amount: 'Up to 55% subsidy', eligibility: 'Farmers adopting drip/sprinkler', deadline: '2026-08-31', status: 'closing' },
]

export const mockAlerts = [
  { id: 1, type: 'pest', title: 'Locust swarm detected 40km away', severity: 'high', time: '2 hours ago' },
  { id: 2, type: 'weather', title: 'Heavy rainfall expected next 3 days', severity: 'medium', time: '5 hours ago' },
  { id: 3, type: 'subsidy', title: 'PM Kisan registration deadline approaching', severity: 'low', time: '1 day ago' },
  { id: 4, type: 'market', title: 'Cotton prices rising +12% this week', severity: 'low', time: '2 days ago' },
]

export const mockCirculars = [
  { id: 1, title: 'Guidelines for Pradhan Mantri Krishi Sinchayee Yojana', date: '2026-04-15', summary: 'New guidelines for micro irrigation subsidy applications...', source: 'Ministry of Agriculture' },
  { id: 2, title: 'Revised MSP for Kharif Crops 2026-27', date: '2026-04-10', summary: 'Government announces increased MSP for key kharif crops...', source: 'Cabinet Secretariat' },
  { id: 3, title: 'Digital Agriculture Mission Framework', date: '2026-03-28', summary: 'Framework for implementing digital technologies in agriculture...', source: 'Ministry of Electronics & IT' },
]

export const mockAgents = [
  { name: 'Planner Agent', status: 'idle', lastRun: '2 min ago', tasksCompleted: 142 },
  { name: 'Crop Agent', status: 'running', lastRun: 'Just now', tasksCompleted: 89 },
  { name: 'Disease Agent', status: 'idle', lastRun: '5 min ago', tasksCompleted: 67 },
  { name: 'Market Agent', status: 'running', lastRun: 'Just now', tasksCompleted: 112 },
  { name: 'Subsidy Agent', status: 'idle', lastRun: '10 min ago', tasksCompleted: 54 },
  { name: 'RAG Agent', status: 'running', lastRun: 'Just now', tasksCompleted: 203 },
  { name: 'Irrigation Agent', status: 'idle', lastRun: '15 min ago', tasksCompleted: 78 },
  { name: 'Alert Agent', status: 'idle', lastRun: '30 min ago', tasksCompleted: 156 },
]

export const mockFarmProfile = {
  name: 'Rajesh Kumar',
  farmName: 'Punjab Wheat Farm',
  area: '12 acres',
  location: 'Ludhiana, Punjab',
  soilType: 'Alluvial',
  irrigationType: 'Drip',
  crops: ['Wheat', 'Rice', 'Cotton'],
}

export const mockAnalytics = {
  yieldTrend: [18, 20, 22, 19, 24, 26, 23, 28],
  waterUsage: [120, 115, 110, 105, 100, 98, 95, 92],
  riskScore: 32,
  ndvi: 0.72,
  soilHealth: 'Good',
}
