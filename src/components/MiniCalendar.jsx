import { useState, useMemo } from 'react'

const dotColors = {
  bath: '#5b9bd5',
  grooming: '#e88fad',
  health: 'var(--success)',
}
const dotLabels = { bath: '洗澡', grooming: '美容', health: '健康' }

export function MiniCalendar({ records, onMonthChange }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const { days, startDay } = useMemo(() => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    return { days: lastDay.getDate(), startDay: firstDay.getDay() }
  }, [year, month])

  const formatDateStr = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const recordDates = useMemo(() => {
    const dates = {}
    records.forEach(r => {
      if (!r.date) return
      const key = r.date.slice(0, 10)
      if (!dates[key]) dates[key] = new Set()
      dates[key].add(r.type)
    })
    return dates
  }, [records])

  const todayStr = formatDateStr(new Date())

  const calendarDays = []
  for (let i = 0; i < startDay; i++) { calendarDays.push({ day: '', isOtherMonth: true }) }
  for (let d = 1; d <= days; d++) {
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const types = recordDates[ds] ? [...recordDates[ds]] : []
    calendarDays.push({ day: d, isOtherMonth: false, isToday: ds === todayStr, dateStr: ds, types })
  }
  while (calendarDays.length < 42) { calendarDays.push({ day: '', isOtherMonth: true }) }

  return (
    <div className="mini-calendar">
      <div className="calendar-header">
        <span className="month">{year}年{month + 1}月</span>
        <div className="calendar-nav">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>＜</button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>＞</button>
        </div>
      </div>
      <div className="calendar-weekdays">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="calendar-days">
        {calendarDays.map((cd, i) => (
          <div key={i} className={`calendar-day ${cd.isOtherMonth ? 'other-month' : ''} ${cd.isToday ? 'today' : ''}`}>
            {cd.day}
            {cd.types && cd.types.length > 0 && (
              <div className="cal-dots">
                {cd.types.slice(0, 3).map((t, j) => (
                  <span key={j} className="cal-dot" style={{ background: dotColors[t] || 'var(--primary)' }} />
                ))}
                {cd.types.length > 3 && <span className="cal-more">+{cd.types.length - 3}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="calendar-legend">
        {Object.entries(dotColors).map(([type, color]) => (
          <span key={type} className="legend-item"><span className="legend-dot" style={{ background: color }} />{dotLabels[type]}</span>
        ))}
      </div>
    </div>
  )
}
