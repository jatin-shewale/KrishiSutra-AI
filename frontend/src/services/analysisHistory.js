const MAX_HISTORY_ITEMS = 8

const buildKey = (type, userId = 'guest') => `krishisutra_${type}_history_${userId}`

export const loadAnalysisHistory = (type, userId) => {
  try {
    const raw = localStorage.getItem(buildKey(type, userId))
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export const saveAnalysisHistory = (type, userId, entry) => {
  const current = loadAnalysisHistory(type, userId)
  const next = [entry, ...current].slice(0, MAX_HISTORY_ITEMS)
  localStorage.setItem(buildKey(type, userId), JSON.stringify(next))
  return next
}
