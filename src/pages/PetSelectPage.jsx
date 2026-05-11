import { useState, useEffect } from 'react'
import { fetchPets, createPet as apiCreatePet, saveProfile, removePet } from '../api/client'
import { breedsData } from '../data/breeds'
import { useAuth } from '../context/AuthContext'
import { PhotoUpload, AvatarSelector } from '../components'
import { TrashIcon, PlusIcon } from '../components/icons'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''

export default function PetSelectPage({ onSelectPet }) {
  const { user, logout } = useAuth()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteCode, setInviteCode] = useState('')
  const [inviteInfo, setInviteInfo] = useState(null)
  const [acceptRole, setAcceptRole] = useState('妈妈')
  const [submitting, setSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [form, setForm] = useState({
    name: '', breedId: 'west_highland_white_terrier', role: '爸爸',
    birthday: '', photo: '', gender: ''
  })

  useEffect(() => { fetchPets().then(setPets).finally(() => setLoading(false)) }, [])

  const handleImageChange = (dataUrl) => {
    setImagePreview(dataUrl)
    setForm(prev => ({ ...prev, photo: dataUrl }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const data = await apiCreatePet({ name: form.name, breedId: form.breedId, role: form.role, birthday: form.birthday || null, photo: form.photo || null, gender: form.gender || null })
      onSelectPet(data.pet)
      await saveProfile({ name: form.name, breedId: form.breedId, birthday: form.birthday, photo: form.photo })
    } finally { setSubmitting(false) }
  }

  const handleLookupInvite = async () => {
    if (!inviteCode.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/invitations/${inviteCode.trim()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInviteInfo(data)
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
      setTimeout(() => setFeedback(null), 3000)
    } finally { setSubmitting(false) }
  }

  const handleAcceptInvite = async () => {
    if (!inviteCode.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/invitations/${inviteCode.trim()}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('puppy_token')}` },
        body: JSON.stringify({ role: inviteInfo?.is_temp ? undefined : acceptRole })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setFeedback({ type: 'success', msg: `已加入 ${data.pet.name}！` })
      const updated = await fetchPets()
      setPets(updated)
      setShowInvite(false)
      setInviteCode('')
      setInviteInfo(null)
      setTimeout(() => setFeedback(null), 3000)
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message })
      setTimeout(() => setFeedback(null), 3000)
    } finally { setSubmitting(false) }
  }

  if (loading) return <div className="page-loading"><div className="loading-spinner">🐕 加载中...</div></div>

  return (
    <div className="page pet-select-page">
      <div className="pet-select-header">
        <h2>你好，{user?.username}</h2>
        <button className="text-btn" onClick={logout}>退出登录</button>
      </div>

      {feedback && (
        <div className={`feedback-banner ${feedback.type}`}>{feedback.msg}</div>
      )}

      {pets.length > 0 && !showForm && !showInvite && (
        <>
          <p className="page-desc">选择一只毛孩</p>
          <div className="pet-list">
            {pets.map(pet => (
              <div key={pet.id} className="pet-card-row">
                <button className="pet-card" onClick={() => onSelectPet(pet)}>
                  <span className="pet-card-icon">{pet.photo ? <img src={pet.photo} alt="" /> : '🐕'}</span>
                  <div>
                    <strong>{pet.name}</strong>
                    <span className="pet-card-role">{pet.role === 'owner' ? '主人' : pet.role === 'guardian' ? '共享成员' : pet.role}</span>
                    <span className="pet-card-breed">{breedsData[pet.breed_id]?.name || ''}</span>
                  </div>
                </button>
                {pet.owner_id === JSON.parse(localStorage.getItem('puppy_user') || '{}').id && (
                <button className="pet-delete-btn" onClick={async () => {
                  if (window.confirm(`确定删除 ${pet.name} 的所有数据？此操作不可撤销。`)) {
                    try {
                      await removePet(pet.id)
                      // 如果删除的是当前选中的宠物，清除选中状态
                      const selected = localStorage.getItem('puppy_selected_pet')
                      if (selected && JSON.parse(selected).id === pet.id) {
                        localStorage.removeItem('puppy_selected_pet')
                      }
                      setPets(prev => prev.filter(p => p.id !== pet.id))
                    } catch (e) {
                      alert('删除失败：' + e.message)
                    }
                  }
                }} title="删除宠物"><TrashIcon size={16} color="var(--text-muted)" /></button>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="secondary-btn" onClick={() => setShowForm(true)}><PlusIcon size={14} color="var(--text-secondary)" /> 添加宠物</button>
            <button className="secondary-btn" onClick={() => setShowInvite(true)}>🔗 接受邀请</button>
          </div>
        </>
      )}

      {showInvite && (
        <>
          <p className="page-desc">输入邀请码加入宠物</p>
          <div className="profile-form">
            <div className="form-group">
              <label>邀请码</label>
              <input type="text" value={inviteCode} onChange={e => { setInviteCode(e.target.value); setInviteInfo(null) }} placeholder="输入8位邀请码" autoFocus />
            </div>

            {!inviteInfo ? (
              <button className="primary-btn" onClick={handleLookupInvite} disabled={submitting || !inviteCode.trim()} style={{ width: '100%' }}>
                {submitting ? '查询中...' : '查询邀请'}
              </button>
            ) : (
              <>
                <div className="invite-preview">
                  <strong>{inviteInfo.petName}</strong>
                  <span className={`tag ${inviteInfo.is_temp ? 'temp' : 'permanent'}`}>
                    {inviteInfo.is_temp ? `限时 ${inviteInfo.valid_days} 天` : '长期'}
                  </span>
                </div>

                {!inviteInfo.is_temp && (
                  <div className="form-group">
                    <label>你的身份</label>
                    <select value={acceptRole} onChange={e => setAcceptRole(e.target.value)}>
                      <option value="爸爸">爸爸</option>
                      <option value="妈妈">妈妈</option>
                      <option value="姐姐">姐姐</option>
                      <option value="哥哥">哥哥</option>
                      <option value="姥姥">姥姥</option>
                      <option value="姥爷">姥爷</option>
                      <option value="奶奶">奶奶</option>
                      <option value="爷爷">爷爷</option>
                      <option value="朋友">朋友</option>
                    </select>
                  </div>
                )}

                <button className="primary-btn" onClick={handleAcceptInvite} disabled={submitting} style={{ width: '100%' }}>
                  {submitting ? '加入中...' : `加入 ${inviteInfo.petName}`}
                </button>
              </>
            )}

            <button type="button" className="text-btn" onClick={() => { setShowInvite(false); setInviteInfo(null); setInviteCode('') }} style={{ width: '100%', marginTop: 8 }}>返回</button>
          </div>
        </>
      )}

      {(pets.length === 0 && !showForm && !showInvite) && (
        <div className="no-pet-actions" style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <button className="primary-btn" onClick={() => setShowForm(true)}><PlusIcon size={14} color="#fff" /> 登记毛孩</button>
          <button className="secondary-btn" onClick={() => setShowInvite(true)}>🔗 接受邀请</button>
        </div>
      )}

      {showForm && (
        <>
          <p className="page-desc">登记毛孩信息</p>
          <form onSubmit={handleCreate} className="profile-form">
            <PhotoUpload imagePreview={imagePreview} onImageChange={handleImageChange} onImageStatusChange={() => {}} />
            <AvatarSelector selectedAvatar={imagePreview} onSelect={handleImageChange} />
            <div className="form-group"><label>名字</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="给狗狗取个名字" required /></div>
            <div className="form-group"><label>品种</label><select value={form.breedId} onChange={e => setForm({ ...form, breedId: e.target.value })}>{Object.entries(breedsData).map(([id, b]) => <option key={id} value={id}>{b.name}</option>)}</select></div>
            <div className="form-group"><label>你的身份</label><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="爸爸">爸爸</option><option value="妈妈">妈妈</option><option value="姐姐">姐姐</option><option value="哥哥">哥哥</option><option value="主人">主人</option></select></div>
            <div className="form-group"><label>生日</label><input type="date" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} /></div>
            <div className="form-group"><label>性别</label><select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}><option value="">选择性别</option><option value="boy">男孩 ♂</option><option value="girl">女孩 ♀</option></select></div>
            <button type="submit" className="primary-btn" disabled={submitting}>{submitting ? '创建中...' : '创建宠物'}</button>
            {pets.length > 0 && <button type="button" className="text-btn" onClick={() => setShowForm(false)}>返回选择</button>}
          </form>
        </>
      )}
    </div>
  )
}
