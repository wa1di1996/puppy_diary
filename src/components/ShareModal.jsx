import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''

function getToken() { return localStorage.getItem('puppy_token') }
function getUserId() {
  const u = localStorage.getItem('puppy_user')
  return u ? JSON.parse(u).id : null
}
function isOwner(pet) {
  return pet && pet.owner_id === getUserId()
}

export function ShareModal({ pet, onClose }) {
  const owner = isOwner(pet)
  const [tab, setTab] = useState(owner ? 'invite' : 'manage')
  const [isTemp, setIsTemp] = useState(false)
  const [validDays, setValidDays] = useState(7)
  const [inviteToken, setInviteToken] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [members, setMembers] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/api/pets/${pet.id}/members`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()).then(d => setMembers(d.members || [])).catch(() => {})
  }, [pet.id])

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE}/api/pets/${pet.id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ isTemp, validDays: isTemp ? validDays : null })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInviteToken(data.token)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    const ta = document.createElement('textarea')
    ta.value = inviteToken
    ta.style.position = 'fixed'; ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    catch { setError('复制失败，手动复制: ' + inviteToken) }
    finally { document.body.removeChild(ta) }
  }

  const handleRevoke = async (userId) => {
    if (!window.confirm('确定移除该成员的访问权限？')) return
    await fetch(`${API_BASE}/api/pets/${pet.id}/members/${userId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    })
    setMembers(prev => prev.filter(m => m.id !== userId))
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-card">
        <h3>分享 {pet.name}</h3>

        <div className="modal-tabs">
          {owner && <button className={`modal-tab ${tab === 'invite' ? 'active' : ''}`} onClick={() => setTab('invite')}>邀请</button>}
          <button className={`modal-tab ${tab === 'manage' ? 'active' : ''}`} onClick={() => setTab('manage')}>成员 ({members.filter(m => m.id !== getUserId()).length})</button>
        </div>

        {tab === 'invite' && (
          <>
            {!inviteToken ? (
              <>
                <label className="checkbox-label">
                  <input type="checkbox" checked={isTemp} onChange={e => setIsTemp(e.target.checked)} />
                  <span>限时访问</span>
                </label>
                {isTemp && (
                  <div className="form-group">
                    <label>有效天数</label>
                    <input type="number" value={validDays} onChange={e => setValidDays(Number(e.target.value))} min={1} max={365} />
                  </div>
                )}
                {error && <div className="feedback-banner error">{error}</div>}
                <button className="primary-btn" onClick={handleGenerate} disabled={loading} style={{ width: '100%', marginTop: 12 }}>
                  {loading ? '生成中...' : '生成邀请码'}
                </button>
              </>
            ) : (
              <div className="invite-result">
                <p className="invite-label">邀请码（分享给好友）</p>
                <div className="invite-code-box" onClick={handleCopy}>
                  <code>{inviteToken}</code>
                  <span className="copy-hint">{copied ? '已复制 ✓' : '点击复制'}</span>
                </div>
                <p className="invite-hint">对方在「接受邀请」页面输入此码</p>
                <button className="secondary-btn" onClick={() => setInviteToken(null)} style={{ marginTop: 8 }}>重新生成</button>
              </div>
            )}
          </>
        )}

        {tab === 'manage' && (
          <div className="members-list">
            {members.filter(m => m.id !== getUserId()).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 16 }}>暂无其他成员</p>
            ) : (
              members.filter(m => m.id !== getUserId()).map(m => (
                <div key={m.id} className="member-item">
                  <div className="member-info">
                    <strong>{m.username}</strong>
                    <span className="member-tags">
                      {m.is_temp && m.valid_until ? (
                        <span className="tag temp">限时 ({m.valid_until?.slice(0, 10)})</span>
                      ) : (
                        <span className="tag permanent">长期</span>
                      )}
                    </span>
                  </div>
                  {owner && <button className="text-btn danger" onClick={() => handleRevoke(m.id)}>移除</button>}
                </div>
              ))
            )}
          </div>
        )}

        <button className="text-btn modal-close" onClick={onClose}>关闭</button>
      </div>
    </div>
  )
}
