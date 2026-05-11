import { PAGES } from '../constants'
import { ProfileIcon, BreedIcon, FoodBowlIcon, ListIcon, ClipboardIcon, MoneyIcon } from './icons'

const menuItems = [
  { page: PAGES.PROFILE, Icon: ProfileIcon, label: '狗狗档案' },
  { page: PAGES.BREED_INFO, Icon: BreedIcon, label: '品种信息' },
  { page: PAGES.DOG_FOOD, Icon: FoodBowlIcon, label: '狗粮记录' },
  { page: PAGES.HEALTH_MANAGE, Icon: ClipboardIcon, label: '健康管理' },
  { page: PAGES.COST_CALC, Icon: MoneyIcon, label: '费用计算器' },
  { page: PAGES.RECORDS_LIST, Icon: ListIcon, label: '记录列表' },
]

export function MenuGrid({ onNavigate }) {
  return (
    <div className="menu-grid">
      {menuItems.map(({ page, Icon, label }) => (
        <button key={page} className="menu-card" onClick={() => onNavigate(page)}>
          <span className="menu-icon"><Icon size={24} color="var(--primary)" /></span>
          <span className="menu-label">{label}</span>
        </button>
      ))}
    </div>
  )
}
