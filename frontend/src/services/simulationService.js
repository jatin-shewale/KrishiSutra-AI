import api from './api'

export const simulateFarm = async (payload) => {
  try {
    const response = await api.post('/simulation/simulate-farm', payload, { timeout: 60000 })
    return response.data
  } catch (error) {
    console.error('Simulation error:', error)
    throw error
  }
}
