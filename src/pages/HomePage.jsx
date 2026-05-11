import { breedsData, dogAgeToHuman, getBreedSize } from '../data/breeds'
import { StatsOverview, WeightChart, MiniCalendar, MenuGrid } from '../components'
import { calculateAge } from '../utils/ageUtils'
import { PAGES } from '../constants'
import { PawIcon, ClipboardIcon, FoodBowlIcon, ScaleIcon } from '../components/icons'

export function HomePage({ profile, onNavigate, stats, records, selectedPet }) {

  const latestPoop = records.filter(r => r.type === 'poop').slice(-1)[0]
  const latestFeeding = records.filter(r => r.type === 'feeding').slice(-1)[0]

  const breedData = profile?.breedId ? breedsData[profile.breedId] : null
  const bathDays = breedData?.grooming?.bathDays || 14
  const groomingDays = breedData?.grooming?.groomingDays || 42

  const latestBath = records.filter(r => r.type === 'bath').slice(-1)[0]
  const latestGrooming = records.filter(r => r.type === 'grooming').slice(-1)[0]

  const getNextDate = (lastRecord, intervalDays) => {
    if (!lastRecord) return null
    const lastDate = new Date(lastRecord.date)
    return new Date(lastDate.getTime() + intervalDays * 24 * 60 * 60 * 1000)
  }

  const getDaysUntil = (date) => {
    if (!date) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(date)
    target.setHours(0, 0, 0, 0)
    return Math.ceil((target - today) / (24 * 60 * 60 * 1000))
  }

  const nextBathDate = getNextDate(latestBath, bathDays)
  const nextGroomingDate = getNextDate(latestGrooming, groomingDays)
  const daysUntilBath = getDaysUntil(nextBathDate)
  const daysUntilGrooming = getDaysUntil(nextGroomingDate)

  const formatAge = (birthday) => {
    if (!birthday) return null
    const age = calculateAge(birthday)
    const humanAge = dogAgeToHuman(age, getBreedSize(profile.breedId))
    if (age < 1) return `${Math.round(age * 12)} 个月`
    return `${age} 岁`
  }

  return (
    <div className="page home-page">

      {/* ── Welcome Hero ── */}
      <div className="welcome-card">
        {!profile ? (
          <div className="no-dog">
            <div className="no-dog-icon">🐕</div>
            <h2>欢迎使用汪星日记</h2>
            <p>记录毛孩子的每一个重要时刻</p>
            <div className="welcome-actions">
              <button className="primary-btn" onClick={() => onNavigate(PAGES.PROFILE)}>
                <PawIcon size={14} color="#fff" /> 添加狗狗档案
              </button>
            </div>
          </div>
        ) : (
          <div className="dog-profile">
            <p className="welcome-msg">欢迎{profile.name}{selectedPet?.role === 'owner' ? '主人' : selectedPet?.role === 'guardian' ? '共享成员' : selectedPet?.role || '家人'}</p>
            <div className="dog-avatar" onClick={() => onNavigate(PAGES.PROFILE)}>
              {profile.photo ? (
                <img src={profile.photo} alt={profile.name} />
              ) : (
                <span className="avatar-placeholder"><PawIcon size={28} color="var(--text-muted)" /></span>
              )}
            </div>
            <div className="eyebrow-badge">
              <span className="dot"></span>
              {breedsData[profile.breedId]?.name || profile.breedId}
            </div>
            <h3>{profile.name} {selectedPet?.gender === 'boy' ? '♂' : selectedPet?.gender === 'girl' ? '♀' : ''}</h3>
            <p className="breed-name">{formatAge(profile.birthday)}</p>
            <div className="welcome-actions">
              <button className="primary-btn" onClick={() => onNavigate(PAGES.DAILY_RECORD)}>
                <ClipboardIcon size={14} color="#fff" /> 记录一下
              </button>
            </div>
          </div>
        )}
      </div>

      {profile && (
        <>

          {/* Stats Overview */}
          <div className="reveal">
            <StatsOverview stats={stats} />
          </div>

          {/* Grooming Reminder */}
          <div className="grooming-card card reveal">
            <h3>美容提醒</h3>
            <div className="grooming-status">
              <div className="grooming-item">
                <span className="icon"><PawIcon size={16} color="var(--primary)" /></span>
                <div className="label">下次洗澡</div>
                <div className={`value ${
                  daysUntilBath === null ? '' :
                  daysUntilBath <= 0 ? 'overdue' :
                  daysUntilBath <= 3 ? 'soon' : 'ok'
                }`}>
                  {daysUntilBath === null ? '未记录' :
                   daysUntilBath <= 0 ? '已过期' : `${daysUntilBath}天后`}
                </div>
              </div>
              <div className="grooming-item">
                <span className="icon"><PawIcon size={16} color="var(--primary)" /></span>
                <div className="label">下次美容</div>
                <div className={`value ${
                  daysUntilGrooming === null ? '' :
                  daysUntilGrooming <= 0 ? 'overdue' :
                  daysUntilGrooming <= 7 ? 'soon' : 'ok'
                }`}>
                  {daysUntilGrooming === null ? '未记录' :
                   daysUntilGrooming <= 0 ? '已过期' : `${daysUntilGrooming}天后`}
                </div>
              </div>
            </div>
            <MiniCalendar records={records} />
          </div>

          {/* Weight Trend */}
          <div className="section-card reveal">
            <h3><ScaleIcon size={16} color="var(--text-secondary)" /> 体重趋势</h3>
            <WeightChart records={records} breedData={breedsData[profile.breedId]} />
          </div>

          {/* Recent Status */}
          {latestPoop && (
            <div className="recent-status reveal">
              <div className="status-card poop-status">
                <div className="status-icon"><PawIcon size={20} color="var(--primary)" /></div>
                <div className="status-content">
                  <div className="status-title">最近粑粑</div>
                  <div className="status-value">{latestPoop.score}/5</div>
                </div>
                <div className="status-hint">
                  {latestPoop.score >= 4 ? '很健康' : latestPoop.score >= 3 ? '正常' : '需要注意'}
                </div>
              </div>
            </div>
          )}

          {latestFeeding && (
            <div className="recent-status reveal">
              <div className="status-card feeding-status">
                <div className="status-icon"><FoodBowlIcon size={20} color="var(--primary)" /></div>
                <div className="status-content">
                  <div className="status-title">最近喂食</div>
                  <div className="status-value">{latestFeeding.amount}g</div>
                </div>
                <div className="status-hint">{latestFeeding.time}</div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Menu Grid */}
      <div className="reveal">
        <MenuGrid onNavigate={onNavigate} />
      </div>

    </div>
  )
}

export default HomePage
