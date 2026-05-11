import { getTodayStr, getRelativeDate } from '../utils/imageUtils'

export function DateSelector({ selectedDate, onDateChange, showQuickDates = true }) {
  return (
    <div className="date-selector">
      {showQuickDates && (
        <div className="quick-dates">
          {[
            { label: '今天', value: getTodayStr() },
            { label: '昨天', value: getRelativeDate(1) },
            { label: '前天', value: getRelativeDate(2) }
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              className={`quick-date-btn ${selectedDate === opt.value ? 'active' : ''}`}
              onClick={() => onDateChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        max={getTodayStr()}
        className="date-input"
      />
    </div>
  )
}
