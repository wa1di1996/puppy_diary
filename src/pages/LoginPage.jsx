import { useState } from 'react'
import { apiLogin, apiRegister } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const fn = isRegister ? apiRegister : apiLogin
      const data = await fn(username, password)
      login(data.token, data.user, remember)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page login-page">
      <div className="login-hero">
        <div className="login-icon">
          <img src="/favicon.svg" alt="" className="login-dog-icon" />
        </div>
        <h1>汪星日记</h1>
        <p className="login-subtitle">记录毛孩子的每一个重要时刻</p>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        {error && <div className="login-error">{error}</div>}
        <div className="form-group">
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="用户名" required autoFocus />
        </div>
        <div className="form-group">
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="密码" required />
        </div>
        <label className="checkbox-label remember-me">
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
          <span>记住我</span>
        </label>
        <button type="submit" className="primary-btn login-btn" disabled={loading}>
          {loading ? '请稍候...' : isRegister ? '注册' : '登录'}
        </button>
        <button type="button" className="text-btn login-switch" onClick={() => { setIsRegister(!isRegister); setError('') }}>
          {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
        </button>
      </form>
      <p className="login-footer">🐾 多人养宠，一起记录</p>
    </div>
  )
}
