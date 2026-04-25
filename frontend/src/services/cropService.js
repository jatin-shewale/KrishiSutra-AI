import api from './api'

export const predictCrop = async (features, topK = 3) => {
  try {
    const response = await api.post('/crop/predict-crop', { features, top_k: topK })
    return response.data
  } catch (error) {
    console.error('Crop prediction error:', error)
    throw error
  }
}

export const getSoilAnalysis = async () => {
  try {
    const response = await api.get('/crop/soil-status')
    return response.data
  } catch (error) {
    console.error('Soil analysis error:', error)
    throw error
  }
}
