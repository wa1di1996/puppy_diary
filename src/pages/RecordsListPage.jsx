import { useState } from 'react'
import { formatDate } from '../utils/imageUtils'
import { ListIcon, FoodBowlIcon, ScaleIcon, PoopIcon, PawIcon, WalkIcon, BathIcon, GroomingIcon, TrashIcon, ClipboardIcon, RulerIcon, PlusIcon } from '../components/icons'

const recordTypeLabels = {
  feeding: { label: '喂食', unit: 'g', Icon: FoodBowlIcon },
  walking: { label: '遛狗', unit: '分钟', Icon: WalkIcon },
  poop: { label: '便便', unit: '分', Icon: PoopIcon },
  supplement: { label: '营养品', unit: '', Icon: PlusIcon },
  bath: { label: '洗澡', unit: '', Icon: BathIcon },
  grooming: { label: '美容', unit: '', Icon: GroomingIcon },
  weight: { label: '体重', unit: 'kg', Icon: ScaleIcon },
  health: { label: '健康', unit: '', Icon: ClipboardIcon },
  measurement: { label: '尺寸', unit: 'cm', Icon: RulerIcon }
}

const filterOptions = [
  { type: null, label: '全部', Icon: ListIcon },
  { type: 'feeding', label: '喂食', Icon: FoodBowlIcon },
  { type: 'walking', label: '遛狗', Icon: WalkIcon },
  { type: 'poop', label: '便便', Icon: PoopIcon },
  { type: 'supplement', label: '营养品', Icon: PlusIcon },
  { type: 'bath', label: '洗澡', Icon: BathIcon },
  { type: 'grooming', label: '美容', Icon: GroomingIcon },
  { type: 'weight', label: '体重', Icon: ScaleIcon },
  { type: 'health', label: '健康', Icon: ClipboardIcon },
]

export function RecordsListPage({ records, onDelete, onBack }) {
  const [filterType, setFilterType] = useState(null)

  const filtered = filterType
    ? records.filter(r => r.type === filterType)
    : records

  const sortedRecords = [...filtered].reverse()

  return (
    <div className="page records-list-page">
      <h2><ListIcon size={16} color="var(--text-secondary)" /> 记录列表</h2>

      <div className="filter-tabs">
        {filterOptions.map(({ type, label, Icon }) => (
          <button
            key={type ?? 'all'}
            className={`filter-tab ${filterType === type ? 'active' : ''}`}
            onClick={() => setFilterType(type)}
          >
            <Icon size={12} color={filterType === type ? '#fff' : 'var(--text-secondary)'} />
            {label}
          </button>
        ))}
      </div>

      {sortedRecords.length === 0 ? (
        <div className="empty-state">
          <div className="icon"><PawIcon size={48} color="var(--text-muted)" /></div>
          <p>{filterType ? '该类型暂无记录' : '还没有任何记录'}</p>
          <p className="sub">快去记录狗狗的日常吧</p>
        </div>
      ) : (
        <div className="records-list">
          {sortedRecords.map((record) => {
            const typeInfo = recordTypeLabels[record.type] || { label: record.type, unit: '', Icon: PawIcon }
            const TypeIcon = typeInfo.Icon
            return (
              <div key={record.id} className="record-item">
                <div className="record-main">
                  <div className="record-header">
                    <span className="record-type"><TypeIcon size={14} color="var(--primary)" /> {typeInfo.label}</span>
                    <span className="record-date">{formatDate(record.date)}</span>
                  </div>
                  <div className="record-body">
                    {record.type === 'poop' ? (
                      <span className={`poop-score score-${record.score}`}>{record.score}分</span>
                    ) : record.type === 'health' ? (
                      <span className="record-health-note">
                        {record.healthSubtype === 'vaccine' ? '疫苗' : record.healthSubtype === 'deworm' ? '驱虫' : record.healthSubtype === 'checkup' ? '体检' : '健康'}
                        {record.notes && <span className="record-notes">{record.notes}</span>}
                      </span>
                    ) : record.type === 'measurement' ? (
                      <div className="measurement-mini">
                        {record.measurements && Object.entries(record.measurements).map(([k, v]) => {
                          const labels = { backLength: '背长', neckGirth: '脖围', chestGirth: '胸围', bodyLength: '身长' }
                          return v ? <span key={k} className="meas-item">{labels[k] || k}: {v}cm</span> : null
                        })}
                      </div>
                    ) : record.type === 'bath' || record.type === 'grooming' ? (
                      <span className="record-done-badge">已完成</span>
                    ) : (
                      record.amount && (
                        <span className="record-amount">
                          {record.amount} <small>{typeInfo.unit}</small>
                        </span>
                      )
                    )}
                    {record.time && <span className="record-time">{record.time}</span>}
                    {(record.type !== 'health') && record.notes && <p className="record-notes">{record.notes}</p>}
                  </div>
                  {record.photo && (
                    <div className="record-photo-mini">
                      <img src={record.photo} alt="记录照片" />
                    </div>
                  )}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => {
                    if (window.confirm('确定删除这条记录？')) {
                      onDelete(record.id)
                    }
                  }}
                  title="删除"
                >
                  <TrashIcon size={14} color="var(--text-muted)" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RecordsListPage
