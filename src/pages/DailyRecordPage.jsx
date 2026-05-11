import { useState, useEffect } from 'react'
import { FoodBowlIcon, WalkIcon, PoopIcon, PlusIcon } from '../components/icons'
import { DateSelector } from '../components'
import { getTodayStr, parseDateString } from '../utils/imageUtils'
import { DAILY_TYPES } from '../constants'
import { fetchFoods } from '../api/client'

const recordIcons = { feeding: FoodBowlIcon, walking: WalkIcon, poop: PoopIcon, supplement: PlusIcon }

const feedTypes = [
  { value: 'kibble', label: '狗粮' },
  { value: 'treat', label: '零食' },
  { value: 'homemade', label: '自制狗饭' },
]

const walkMoods = [
  { value: 1, emoji: '😢', label: '不想走' },
  { value: 2, emoji: '😐', label: '勉强走' },
  { value: 3, emoji: '🐶', label: '正常' },
  { value: 4, emoji: '😊', label: '精力充沛' },
  { value: 5, emoji: '🤩', label: '疯跑' },
]

const walkTimes = [
  { value: 'morning', label: '早晨' },
  { value: 'am', label: '上午' },
  { value: 'pm', label: '下午' },
  { value: 'evening', label: '晚上' },
]

const poopScores = [
  { score: 1, emoji: '💥', label: '拉稀', desc: '严重腹泻' },
  { score: 2, emoji: '🍵', label: '偏软', desc: '消化不良' },
  { score: 3, emoji: '✅', label: '正常', desc: '健康状态' },
  { score: 4, emoji: '🌟', label: '很好', desc: '非常健康' },
  { score: 5, emoji: '🏆', label: '完美', desc: '完美状态' },
]

export function DailyRecordPage({ onSave, onBack }) {
  const [recordType, setRecordType] = useState('feeding')
  const [form, setForm] = useState({ amount: '', notes: '', feedType: 'kibble', linkedFood: '', supplementName: '', cost: '' })
  const [walkMood, setWalkMood] = useState(3)
  const [walkTime, setWalkTime] = useState('')
  const [poopScore, setPoopScore] = useState(null)
  const [dogFoods, setDogFoods] = useState([])
  const [selectedDate, setSelectedDate] = useState(getTodayStr())
  const [saving, setSaving] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    if (recordType === 'feeding') fetchFoods().then(setDogFoods).catch(() => {})
  }, [recordType])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrMsg('')
    if (recordType === 'feeding' && (!form.amount || Number(form.amount) <= 0)) { setErrMsg('请输入喂食量'); return }
    if (recordType === 'walking' && (!form.amount || Number(form.amount) <= 0)) { setErrMsg('请输入时长'); return }
    if (recordType === 'poop' && poopScore === null) { setErrMsg('请选择评分'); return }

    const dateObj = parseDateString(selectedDate)
    const base = { type: recordType, notes: form.notes, time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }), date: dateObj.toISOString() }

    if (recordType === 'feeding') { base.amount = form.amount; base.feedType = form.feedType; base.linkedFood = form.linkedFood || null }
    else if (recordType === 'walking') { base.amount = form.amount; base.walkMood = walkMood; base.walkTime = walkTime || null }
    else if (recordType === 'poop') { base.score = poopScore }
    else if (recordType === 'supplement') { base.supplementName = form.supplementName; base.cost = form.cost || null }

    setSaving(true)
    try {
      await onSave(base)
      setForm({ amount: '', notes: '', feedType: 'kibble', linkedFood: '', supplementName: '', cost: '' })
      setPoopScore(null); setWalkMood(3); setWalkTime('')
      onBack()
    } catch { setErrMsg('保存失败，请重试') } finally { setSaving(false) }
  }

  return (
    <div className="page daily-record-page">
      <h2>📝 记录日常</h2>

      <div className="record-type-selector">
        {Object.entries(DAILY_TYPES).map(([type, rtInfo]) => {
          const Icon = recordIcons[type]
          return (
            <button key={type} className={recordType === type ? 'active' : ''}
              onClick={() => { setRecordType(type); setForm({ amount: '', notes: '', feedType: 'kibble', linkedFood: '', supplementName: '', cost: '' }); setPoopScore(null); setWalkMood(3) }}>
              <span className="icon"><Icon size={16} color={recordType === type ? '#fff' : 'var(--primary)'} /></span>
              {rtInfo.label}
            </button>
          )
        })}
      </div>

      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} showQuickDates />

      <form onSubmit={handleSubmit} className="record-form">
        {errMsg && <div className="feedback-banner error">{errMsg}</div>}

        {recordType === 'feeding' && (
          <>
            <div className="form-group">
              <label>食物类型</label>
              <div className="chip-row">
                {feedTypes.map(ft => (
                  <button key={ft.value} type="button" className={`chip ${form.feedType === ft.value ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, feedType: ft.value })}>{ft.label}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>喂食量 (g)</label>
              <input type="number" step="1" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="例如: 100" />
            </div>
            {dogFoods.length > 0 && form.feedType === 'kibble' && (
              <div className="form-group">
                <label>关联狗粮</label>
                <select value={form.linkedFood} onChange={e => setForm({ ...form, linkedFood: e.target.value })}>
                  <option value="">不关联</option>
                  {dogFoods.map(f => <option key={f.id} value={f.id}>{f.brand} {f.name}</option>)}
                </select>
              </div>
            )}
          </>
        )}

        {recordType === 'walking' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>时长 (分钟)</label>
                <input type="number" step="1" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="例如: 30" />
              </div>
              <div className="form-group">
                <label>时段</label>
                <select value={walkTime} onChange={e => setWalkTime(e.target.value)}>
                  <option value="">选择时段</option>
                  {walkTimes.map(wt => <option key={wt.value} value={wt.value}>{wt.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>心情</label>
              <div className="mood-row">
                {walkMoods.map(m => (
                  <button key={m.value} type="button" className={`mood-btn ${walkMood === m.value ? 'active' : ''}`}
                    onClick={() => setWalkMood(m.value)} title={m.label}>
                    <span className="mood-emoji">{m.emoji}</span>
                    <span className="mood-label">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {recordType === 'poop' && (
          <div className="form-group">
            <label>评分</label>
            <div className="poop-scores-inline">
              {poopScores.map(s => (
                <button key={s.score} type="button" className={`poop-score-btn ${poopScore === s.score ? 'active' : ''}`}
                  onClick={() => setPoopScore(s.score)}>
                  <span className="poop-score-emoji">{s.emoji}</span>
                  <span>{s.label}</span>
                  <span className="score-sub">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {recordType === 'supplement' && (
          <>
            <div className="form-group"><label>营养品名称</label><input type="text" value={form.supplementName} onChange={e => setForm({ ...form, supplementName: e.target.value })} placeholder="例如: 鱼油、关节宝" /></div>
            <div className="form-group"><label>费用 (元, 可选)</label><input type="number" step="0.01" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} placeholder="例如: 128" /></div>
          </>
        )}

        <div className="form-group">
          <label>备注</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder={recordType === 'poop' ? '便便观察...' : recordType === 'walking' ? '遛狗笔记...' : '添加备注...'} rows="3" />
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={onBack}>取消</button>
          <button type="submit" className="primary-btn" disabled={saving}>{saving ? '保存中...' : '保存'}</button>
        </div>
      </form>
    </div>
  )
}

export default DailyRecordPage
