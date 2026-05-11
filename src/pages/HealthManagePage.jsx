import { useState } from 'react'
import { ScaleIcon, BathIcon, GroomingIcon, ClipboardIcon } from '../components/icons'
import { DateSelector } from '../components'
import { getTodayStr, parseDateString } from '../utils/imageUtils'
import { HEALTH_TYPES, HEALTH_SUBTYPES } from '../constants'
import { breedsData } from '../data/breeds'

const healthIcons = {
  bath: BathIcon,
  grooming: GroomingIcon,
  weight: ScaleIcon,
  health: ClipboardIcon,
}

export function HealthManagePage({ profile, onSave, onBack }) {
  const [recordType, setRecordType] = useState('bath')
  const [formData, setFormData] = useState({ amount: '', notes: '', cost: '' })
  const [healthSubtype, setHealthSubtype] = useState('vaccine')
  const [healthFields, setHealthFields] = useState({})
  const [selectedDate, setSelectedDate] = useState(getTodayStr())
  const [saving, setSaving] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const info = HEALTH_TYPES[recordType]
  const isBathOrGrooming = recordType === 'bath' || recordType === 'grooming'
  const breedData = profile?.breedId ? breedsData[profile.breedId] : null
  const subtypeInfo = HEALTH_SUBTYPES.find(s => s.value === healthSubtype)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrMsg('')
    if (recordType === 'weight' && (!formData.amount || Number(formData.amount) <= 0)) {
      setErrMsg('请输入有效的体重数值'); return
    }
    const dateObj = parseDateString(selectedDate)
    const base = {
      type: recordType,
      notes: formData.notes,
      cost: formData.cost || null,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      date: dateObj.toISOString(),
    }
    if (recordType === 'health') {
      base.healthSubtype = healthSubtype
      base.healthFields = healthFields
    } else if (isBathOrGrooming) {
      // just mark done
    } else {
      base.amount = formData.amount
    }
    setSaving(true)
    try {
      await onSave(base)
      setFormData({ amount: '', notes: '', cost: '' })
      setHealthFields({})
      onBack()
    } catch {
      setErrMsg('保存失败，请重试')
    } finally { setSaving(false) }
  }

  const renderBody = () => {
    if (recordType === 'health') {
      return (
        <>
          <div className="health-subtypes">
            {HEALTH_SUBTYPES.map(sub => (
              <button key={sub.value} type="button"
                className={`health-subtype-btn ${healthSubtype === sub.value ? 'active' : ''}`}
                onClick={() => { setHealthSubtype(sub.value); setHealthFields({}) }}>
                {sub.label}
              </button>
            ))}
          </div>
          {subtypeInfo?.fields.map(f => (
            <div className="form-group" key={f.key}>
              <label>{f.label}</label>
              <input
                type={f.type === 'date' ? 'date' : 'text'}
                value={healthFields[f.key] || ''}
                onChange={e => setHealthFields(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </>
      )
    }
    if (isBathOrGrooming) {
      return (
        <>
          <div className="grooming-done-notice">
            <span className="check-badge">✓</span>
            <p>标记为已完成 — {info.label}</p>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>费用 (元, 可选)</label>
              <input type="number" step="0.01" value={formData.cost} onChange={e => setFormData({ ...formData, cost: e.target.value })} placeholder="例如: 80" />
            </div>
          </div>
        </>
      )
    }
    // weight
    return (
      <>
        {breedData && (
          <div className="breed-weight-range">
            <p>标准体重区间: <strong>{breedData.weight.min}-{breedData.weight.max} kg</strong></p>
          </div>
        )}
        <div className="form-group">
          <label>体重 (kg)</label>
          <input type="number" step="0.1" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} placeholder="例如: 7.5" required />
        </div>
      </>
    )
  }

  return (
    <div className="page health-manage-page">
      <h2>🏥 健康管理</h2>

      <div className="record-type-selector">
        {Object.entries(HEALTH_TYPES).map(([type, rtInfo]) => {
          const Icon = healthIcons[type]
          if (!Icon) return null
          return (
            <button key={type} className={recordType === type ? 'active' : ''}
              onClick={() => { setRecordType(type); setFormData({ amount: '', notes: '', cost: '' }); setHealthFields({}) }}>
              <span className="icon"><Icon size={16} color={recordType === type ? '#fff' : 'var(--primary)'} /></span>
              {rtInfo.label}
            </button>
          )
        })}
      </div>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} showQuickDates={info.showQuickDates} />

      <form onSubmit={handleSubmit} className="record-form">
        {errMsg && <div className="feedback-banner error">{errMsg}</div>}
        {renderBody()}

        <div className="form-group">
          <label>备注</label>
          <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
            placeholder={recordType === 'health' ? '例如: 狂犬疫苗、体外驱虫...' : isBathOrGrooming ? '例如: 用了新沐浴露...' : '添加备注...'}
            rows="3" />
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={onBack}>取消</button>
          <button type="submit" className="primary-btn" disabled={saving}>{saving ? '保存中...' : '保存'}</button>
        </div>
      </form>

      <button className="back-link" onClick={onBack}>← 返回</button>
    </div>
  )
}

export default HealthManagePage
