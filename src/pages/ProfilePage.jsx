import { useState } from 'react'
import { PawIcon } from '../components/icons'
import { breedsData } from '../data/breeds'
import { PhotoUpload } from '../components'
import { ImageViewer } from '../components/ImageViewer'

export function ProfilePage({ profile, onSave, onBack, selectedPet }) {
  const [formData, setFormData] = useState({ name: profile?.name || '', photo: profile?.photo || '' })
  const [imagePreview, setImagePreview] = useState(profile?.photo || null)
  const [saving, setSaving] = useState(false)
  const [showViewer, setShowViewer] = useState(false)

  const handleImageChange = (dataUrl) => {
    setImagePreview(dataUrl)
    setFormData(prev => ({ ...prev, photo: dataUrl }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    setSaving(true)
    await onSave({ ...profile, name: formData.name, photo: formData.photo })
    setSaving(false)
    onBack()
  }

  const breed = profile?.breedId ? breedsData[profile.breedId] : null

  return (
    <div className="page profile-page">
      <h2><PawIcon size={16} color="var(--text-secondary)" /> 狗狗档案</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <PhotoUpload
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onImageStatusChange={() => {}}
          onPhotoClick={() => setShowViewer(true)}
        />

        <div className="form-group">
          <label>名字</label>
          <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="给狗狗取个名字" required />
        </div>

        {profile?.breedId && (
          <div className="form-group readonly-group">
            <label>品种</label>
            <div className="readonly-value">{breed?.name || profile.breedId}</div>
          </div>
        )}
        {profile?.birthday && (
          <div className="form-group readonly-group">
            <label>生日</label>
            <div className="readonly-value">{profile.birthday}</div>
          </div>
        )}
        {selectedPet?.gender && (
          <div className="form-group readonly-group">
            <label>性别</label>
            <div className="readonly-value">{selectedPet.gender === 'boy' ? '男孩 ♂' : '女孩 ♀'}</div>
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={onBack}>取消</button>
          <button type="submit" className="primary-btn" disabled={saving}>{saving ? '保存中...' : '保存'}</button>
        </div>
      </form>

      {showViewer && imagePreview && (
        <ImageViewer src={imagePreview} alt={profile?.name || '狗狗'} onClose={() => setShowViewer(false)} />
      )}
    </div>
  )
}

export default ProfilePage
