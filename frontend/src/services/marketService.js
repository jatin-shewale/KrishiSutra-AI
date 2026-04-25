import api from './api'

export const getPriceForecast = async (crop, days = 30) => {
  try {
    const response = await api.post('/market/price-forecast', { crop, days_ahead: days })
    return response.data
  } catch (error) {
    console.error('Market forecast error:', error)
    throw error
  }
}

export const getSellOrHold = async (crop, currentPrice = null) => {
  try {
    const response = await api.post('/market/sell-or-hold', { crop, current_price: currentPrice })
    return response.data
  } catch (error) {
    console.error('Sell or hold error:', error)
    throw error
  }
}

export const getBestMarket = async (crop, location = null) => {
  try {
    const response = await api.post('/market/best-market', { crop, location })
    return response.data
  } catch (error) {
    console.error('Best market error:', error)
    throw error
  }
}
