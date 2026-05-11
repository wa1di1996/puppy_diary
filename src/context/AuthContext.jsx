import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 优先从 localStorage 恢复，其次 sessionStorage
    let saved = localStorage.getItem('puppy_token')
    let savedUser = localStorage.getItem('puppy_user')
    let source = 'localStorage'
    if (!saved) {
      saved = sessionStorage.getItem('puppy_token')
      savedUser = sessionStorage.getItem('puppy_user')
      source = 'sessionStorage'
    }
    if (saved && savedUser) {
      setToken(saved)
      setUser(JSON.parse(savedUser))
      // sessionStorage 数据存到 state 后同步一份到 localStorage 方便 API client 读取
      if (source === 'sessionStorage') {
        localStorage.setItem('puppy_token', saved)
        localStorage.setItem('puppy_user', savedUser)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((newToken, newUser, remember = true) => {
    setToken(newToken)
    setUser(newUser)
    const store = remember ? localStorage : sessionStorage
    store.setItem('puppy_token', newToken)
    store.setItem('puppy_user', JSON.stringify(newUser))
    // 始终存一份到 localStorage 方便 API client 读取
    localStorage.setItem('puppy_token', newToken)
    localStorage.setItem('puppy_user', JSON.stringify(newUser))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('puppy_token')
    localStorage.removeItem('puppy_user')
    sessionStorage.removeItem('puppy_token')
    sessionStorage.removeItem('puppy_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
