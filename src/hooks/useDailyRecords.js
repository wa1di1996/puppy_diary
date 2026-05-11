import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchRecords, createRecord as apiCreate, removeRecord as apiRemove } from '../api/client'

export function useDailyRecords(petId) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!petId) { setRecords([]); setLoading(false); return }
    setLoading(true)
    fetchRecords()
      .then(setRecords)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [petId])

  const addRecord = useCallback(async (recordData) => {
    const newRecord = { ...recordData, id: Date.now(), date: recordData.date || new Date().toISOString() }
    try { await apiCreate(newRecord); setRecords(prev => [...prev, newRecord]); setError(null) }
    catch (e) { setError(e.message) }
    return newRecord
  }, [])

  const deleteRecord = useCallback(async (id) => {
    try { await apiRemove(id); setRecords(prev => prev.filter(r => r.id !== id)); setError(null) }
    catch (e) { setError(e.message) }
  }, [])

  const replaceAll = useCallback((newRecords) => { setRecords(newRecords) }, [])

  const stats = useMemo(() => {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString()
    const recent = records.filter(r => r.date && r.date >= thirtyDaysAgo)
    const poopScores = recent.filter(r => r.type === 'poop' && r.score).map(r => r.score)
    const avgPoopScore = poopScores.length > 0 ? (poopScores.reduce((a, b) => a + b, 0) / poopScores.length).toFixed(1) : null
    const walkMoods = recent.filter(r => r.type === 'walking' && r.walkMood).map(r => r.walkMood)
    const avgWalkMood = walkMoods.length > 0 ? (walkMoods.reduce((a, b) => a + b, 0) / walkMoods.length).toFixed(1) : null
    const weights = records.filter(r => r.type === 'weight' && r.amount).sort((a, b) => new Date(b.date) - new Date(a.date))
    const latestWeight = weights.length > 0 ? weights[0].amount : null
    return { total: records.length, avgPoopScore, avgWalkMood, latestWeight }
  }, [records])

  return { records, stats, loading, error, addRecord, deleteRecord, replaceAll }
}
