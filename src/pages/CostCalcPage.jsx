import { useMemo, useState } from 'react'

const CATEGORIES = ['feeding', 'supplement', 'bath', 'grooming', 'health']

const labels = {
  feeding: '狗粮', supplement: '营养品', bath: '洗澡', grooming: '美容', health: '医疗'
}

export function CostCalcPage({ records, foods, onBack }) {
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())
  const [viewYear, setViewYear] = useState(new Date().getFullYear())

  const months = useMemo(() => {
    const result = {}
    for (let m = 0; m < 12; m++) {
      const key = `${viewYear}-${String(m + 1).padStart(2, '0')}`
      result[key] = {}
      CATEGORIES.forEach(c => { result[key][c] = 0 })
    }
    // Dog food costs from food records
    foods.forEach(f => {
      if (f.totalPrice && f.createdAt) {
        const d = new Date(f.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (result[key]) result[key].feeding += parseFloat(f.totalPrice) || 0
      }
    })
    // Other costs from records
    records.forEach(r => {
      if (!r.date) return
      const d = new Date(r.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!result[key]) return
      if (r.cost && CATEGORIES.includes(r.type)) {
        result[key][r.type] += parseFloat(r.cost) || 0
      }
    })
    return result
  }, [records, foods, viewYear])

  const currentKey = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`
  const prevKey = viewMonth === 0
    ? `${viewYear - 1}-12`
    : `${viewYear}-${String(viewMonth).padStart(2, '0')}`
  const current = months[currentKey] || {}
  const prev = months[prevKey] || {}
  const totalCurrent = Object.values(current).reduce((a, b) => a + b, 0)
  const totalPrev = Object.values(prev).reduce((a, b) => a + b, 0)

  const trend = (cur, pre) => {
    if (!pre && !cur) return '—'
    if (!pre) return '↑'
    if (cur > pre) return '↑'
    if (cur < pre) return '↓'
    return '→'
  }

  return (
    <div className="page cost-calc-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button className="text-btn" onClick={() => {
          if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
          else setViewMonth(viewMonth - 1)
        }}>＜ 上月</button>
        <h2 style={{ fontSize: 16 }}>{viewYear}年{viewMonth + 1}月</h2>
        <button className="text-btn" onClick={() => {
          if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
          else setViewMonth(viewMonth + 1)
        }}>下月 ＞</button>
      </div>

      <div className="cost-table">
        <div className="cost-header">
          <span>费用类型</span><span>本月</span><span>上月</span><span>趋势</span>
        </div>
        {CATEGORIES.map(cat => (
          <div key={cat} className="cost-row">
            <span>{labels[cat]}</span>
            <span>¥{current[cat].toFixed(0)}</span>
            <span>¥{prev[cat].toFixed(0)}</span>
            <span>{trend(current[cat], prev[cat])}</span>
          </div>
        ))}
        <div className="cost-row total">
          <span>合计</span><span>¥{totalCurrent.toFixed(0)}</span><span>¥{totalPrev.toFixed(0)}</span><span>{trend(totalCurrent, totalPrev)}</span>
        </div>
      </div>

      <button className="back-link" onClick={onBack}>← 返回</button>
    </div>
  )
}

export default CostCalcPage
