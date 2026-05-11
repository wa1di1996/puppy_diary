import { useState, useEffect, useCallback, useMemo } from 'react'
import { fetchFoods, createFood as apiCreate, updateFood as apiUpdate, removeFood as apiRemove } from '../api/client'

export function useDogFood(petId) {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!petId) { setFoods([]); setLoading(false); return }
    setLoading(true)
    fetchFoods()
      .then(setFoods)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [petId])

  const addFood = useCallback(async (foodData) => {
    const newFood = { ...foodData, id: Date.now(), createdAt: new Date().toISOString() }
    try { await apiCreate(newFood); setFoods(prev => [...prev, newFood]); setError(null) }
    catch (e) { setError(e.message) }
    return newFood
  }, [])

  const updateFood = useCallback(async (id, foodData) => {
    try { await apiUpdate(id, foodData); setFoods(prev => prev.map(f => f.id === id ? { ...f, ...foodData } : f)); setError(null) }
    catch (e) { setError(e.message) }
  }, [])

  const deleteFood = useCallback(async (id) => {
    try { await apiRemove(id); setFoods(prev => prev.filter(f => f.id !== id)); setError(null) }
    catch (e) { setError(e.message) }
  }, [])

  const replaceAll = useCallback((newFoods) => { setFoods(newFoods) }, [])

  const foodsWithPrice = useMemo(() => foods.map(f => ({
    ...f, unitPrice: f.totalPrice && f.totalAmount ? (parseFloat(f.totalPrice) / parseFloat(f.totalAmount) * 1000).toFixed(2) : null
  })), [foods])

  return { foods: foodsWithPrice, loading, error, addFood, updateFood, deleteFood, replaceAll }
}
