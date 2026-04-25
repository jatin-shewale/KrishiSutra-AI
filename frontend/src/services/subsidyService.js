import api from './api'

export const searchCirculars = async (query) => {
  try {
    const response = await api.post('/subsidy/search-circulars', { query })
    return response.data
  } catch (error) {
    console.error('Subsidy search error:', error)
    throw error
  }
}

export const listSubsidies = async () => {
  try {
    const response = await api.get('/subsidy/latest-schemes')
    return response.data
  } catch (error) {
    console.error('List subsidies error:', error)
    throw error
  }
}

export const askSchemeAgent = async (query) => {
  try {
    const response = await api.post('/subsidy/ask-scheme-agent', { query })
    return response.data
  } catch (error) {
    console.error('Scheme agent error:', error)
    throw error
  }
}

export const fetchLatestSchemes = async () => {
  try {
    const response = await api.post('/subsidy/fetch-schemes')
    return response.data
  } catch (error) {
    console.error('Fetch latest schemes error:', error)
    throw error
  }
}
