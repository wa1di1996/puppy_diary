import { useState, useEffect, useCallback } from 'react'
import { fetchProfile, saveProfile as apiSave, deleteProfile as apiDelete } from '../api/client'

export function useDogProfile(petId) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!petId) { setProfile(null); setLoading(false); return }
    setLoading(true)
    fetchProfile()
      .then(setProfile)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [petId])

  const save = useCallback(async (profileData) => {
    try { await apiSave(profileData); setProfile(profileData); setError(null) }
    catch (e) { setError(e.message) }
  }, [])

  const clear = useCallback(async () => {
    try { await apiDelete(); setProfile(null); setError(null) }
    catch (e) { setError(e.message) }
  }, [])

  return { profile, loading, error, saveProfile: save, clearProfile: clear, replaceProfile: setProfile, hasProfile: !!profile }
}
