import api from './api'

export const simulateFarm = async (payload) => {
  try {
    const response = await api.post('/simulation/simulate-farm', payload)
    return response.data
  } catch (error) {
    console.error('Simulation error:', error)
    throw error
  }
}
