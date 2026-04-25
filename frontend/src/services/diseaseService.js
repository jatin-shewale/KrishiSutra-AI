import api from './api'

export const detectDisease = async (imageFile) => {
  const formData = new FormData()
  formData.append('file', imageFile)
  
  try {
    const response = await api.post('/disease/detect-disease', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })
    return response.data
  } catch (error) {
    console.error('Disease detection error:', error)
    throw error
  }
}

export const getTreatmentRecommendation = async (disease, crop) => {
  try {
    const response = await api.post('/disease/treatment-recommendation', { disease, crop })
    return response.data
  } catch (error) {
    console.error('Treatment recommendation error:', error)
    throw error
  }
}
