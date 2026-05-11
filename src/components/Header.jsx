import { useState, useEffect } from 'react'
import { PAGES } from '../constants'
import { PawIcon, BackIcon, PlusIcon } from './icons'
import { fetchPets } from '../api/client'

export function Header({ currentPage, onNavigate, onLogout, selectedPet, onSelectPet, onOpenShare }) {
  const isHome = currentPage === PAGES.HOME
  const [showPetList, setShowPetList] = useState(false)
  const [pets, setPets] = useState([])

  useEffect(() => {
    if (isHome) fetchPets().then(setPets).catch(() => {})
  }, [isHome])

  return (
    <header className="app-header">
      <div className="header-brand" onClick={() => onNavigate(PAGES.HOME)}>
        <div className="header-paw"><PawIcon size={16} color="#fff" /></div>
        <h1>汪星日记</h1>
      </div>
      <div className="header-right">
        {isHome && selectedPet && (
          <div className="header-pet-area">
            <button className="header-greeting" onClick={() => setShowPetList(!showPetList)}>
              {selectedPet.name} ▼
            </button>
            {showPetList && (
              <div className="pet-switcher-dropdown">
                <div className="dropdown-title">切换宠物</div>
                {pets.map(p => (
                  <button key={p.id} className={`dropdown-item ${p.id === selectedPet.id ? 'active' : ''}`}
                    onClick={() => { onSelectPet(p); setShowPetList(false) }}>
                    <span className="pet-dot">🐕</span>
                    <span>{p.name}</span>
                    <span className="role-tag">{p.role === 'owner' ? '主人' : p.role}</span>
                    {p.id === selectedPet.id && <span className="check">✓</span>}
                  </button>
                ))}
                <button className="dropdown-item add-new" onClick={() => { setShowPetList(false); onNavigate('__new_pet') }}>
                  <PlusIcon size={14} color="var(--primary)" /> 添加新宠物
                </button>
              </div>
            )}
          </div>
        )}
        {!isHome && (
          <nav className="top-nav">
            <button onClick={() => onNavigate(PAGES.HOME)}>
              <BackIcon size={14} color="var(--text-secondary)" />
              <span>返回</span>
            </button>
          </nav>
        )}
        {onLogout && (
          <button className="text-btn logout-btn" onClick={onLogout}>退出登录</button>
        )}
      </div>
    </header>
  )
}
