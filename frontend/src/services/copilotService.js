import api from './api'

export const askCopilot = async (query, language = 'en') => {
  try {
    const response = await api.post('/copilot/ask-farm-copilot', { query, language })
    return response.data
  } catch (error) {
    console.error('Copilot API error:', error)
    throw error
  }
}
