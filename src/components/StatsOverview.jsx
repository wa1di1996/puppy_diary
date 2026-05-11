import { WalkIcon, PoopIcon, ScaleIcon } from './icons'

const moodEmojis = ['', '😢', '😐', '🐶', '😊', '🤩']

export function StatsOverview({ stats }) {
  return (
    <div className="stats-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><PoopIcon size={22} color="var(--primary)" /></div>
          <span className="stat-value">{stats?.avgPoopScore ?? '-'}<small>分</small></span>
          <span className="stat-label">便便均分<span className="stat-hint">30天</span></span>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><WalkIcon size={22} color="var(--primary)" /></div>
          <span className="stat-value">{stats?.avgWalkMood ? moodEmojis[Math.round(stats.avgWalkMood)] || stats.avgWalkMood : '-'}</span>
          <span className="stat-label">遛狗心情<span className="stat-hint">30天</span></span>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><ScaleIcon size={22} color="var(--primary)" /></div>
          <span className="stat-value">{stats?.latestWeight ?? '-'}<small>kg</small></span>
          <span className="stat-label">最新体重</span>
        </div>
      </div>
    </div>
  )
}
