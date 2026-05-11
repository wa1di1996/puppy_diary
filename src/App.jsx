import { useState, useCallback, useEffect, Suspense, lazy } from 'react'
import { useAuth } from './context/AuthContext'
import { useDogProfile } from './hooks/useDogProfile'
import { useDailyRecords } from './hooks/useDailyRecords'
import { useDogFood } from './hooks/useDogFood'
import { Header, TitleBar } from './components'
import { ShareModal } from './components/ShareModal'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PAGES } from './constants'
import './App.css'

const HomePage = lazy(() => import('./pages/HomePage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const BreedInfoPage = lazy(() => import('./pages/BreedInfoPage'))
const DailyRecordPage = lazy(() => import('./pages/DailyRecordPage'))
const HealthManagePage = lazy(() => import('./pages/HealthManagePage'))
const DogFoodPage = lazy(() => import('./pages/DogFoodPage'))
const RecordsListPage = lazy(() => import('./pages/RecordsListPage'))
const CostCalcPage = lazy(() => import('./pages/CostCalcPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const PetSelectPage = lazy(() => import('./pages/PetSelectPage'))

function LoadingFallback() {
  return <div className="page-loading"><div className="loading-spinner">🐕 加载中...</div></div>
}

function App() {
  const { token, loading: authLoading, isLoggedIn, logout } = useAuth()
  const [selectedPet, setSelectedPet] = useState(null)
  const [currentPage, setCurrentPage] = useState(PAGES.HOME)
  const [showShare, setShowShare] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      const saved = localStorage.getItem('puppy_selected_pet')
      if (saved) setSelectedPet(JSON.parse(saved))
    }
  }, [isLoggedIn])

  const petId = selectedPet?.id
  const { profile, saveProfile, replaceProfile, hasProfile } = useDogProfile(petId)
  const { records, stats, addRecord, deleteRecord, replaceAll } = useDailyRecords(petId)
  const { foods, addFood, updateFood, deleteFood, replaceAll: replaceFoods } = useDogFood(petId)

  const handleNavigate = useCallback((page) => {
    if (page === '__new_pet') {
      setSelectedPet(null)
      localStorage.removeItem('puppy_selected_pet')
      return
    }
    setCurrentPage(page)
  }, [])

  const handleSelectPet = useCallback((pet) => {
    setSelectedPet(pet)
    localStorage.setItem('puppy_selected_pet', JSON.stringify(pet))
    // Also update profile with pet data so birthday/gender/role show correctly
    replaceProfile({ name: pet.name, breedId: pet.breed_id, birthday: pet.birthday, photo: pet.photo, gender: pet.gender, role: pet.role })
  }, [replaceProfile])

  const handleLogout = useCallback(() => {
    setSelectedPet(null)
    localStorage.removeItem('puppy_selected_pet')
    logout()
  }, [logout])

  if (authLoading) return <LoadingFallback />

  // 未登录
  if (!isLoggedIn) return (
    <ErrorBoundary><div className="app"><TitleBar /><main className="app-main"><Suspense fallback={<LoadingFallback />}><LoginPage /></Suspense></main></div></ErrorBoundary>
  )

  // 未选宠物
  if (!selectedPet) return (
    <ErrorBoundary><div className="app"><TitleBar /><main className="app-main"><Suspense fallback={<LoadingFallback />}><PetSelectPage onSelectPet={handleSelectPet} /></Suspense></main></div></ErrorBoundary>
  )

  // 主界面
  const renderPage = () => {
    const back = () => handleNavigate(PAGES.HOME)
    switch (currentPage) {
      case PAGES.HOME: return <HomePage profile={profile} onNavigate={handleNavigate} stats={stats} records={records} selectedPet={selectedPet} />
      case PAGES.PROFILE: return <ProfilePage profile={profile} onSave={saveProfile} onBack={back} selectedPet={selectedPet} onUpdatePet={handleSelectPet} />
      case PAGES.BREED_INFO: return <BreedInfoPage profile={profile} onBack={back} />
      case PAGES.DAILY_RECORD: return <DailyRecordPage onSave={addRecord} onBack={back} />
      case PAGES.HEALTH_MANAGE: return <HealthManagePage profile={profile} onSave={addRecord} onBack={back} />
      case PAGES.DOG_FOOD: return <DogFoodPage foods={foods} onAdd={addFood} onUpdate={updateFood} onDelete={deleteFood} onBack={back} />
      case PAGES.RECORDS_LIST: return <RecordsListPage records={records} onDelete={deleteRecord} onBack={back} />
      case PAGES.COST_CALC: return <CostCalcPage records={records} foods={foods} onBack={back} />
      default: return <HomePage profile={profile} onNavigate={handleNavigate} stats={stats} records={records} selectedPet={selectedPet} />
    }
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <TitleBar />
        <Header currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout} selectedPet={selectedPet} onSelectPet={handleSelectPet} onOpenShare={() => setShowShare(true)} />
        <main className="app-main">
          <Suspense fallback={<LoadingFallback />}>
            {renderPage()}
          </Suspense>
        </main>
      </div>

      {showShare && selectedPet && (
        <ShareModal pet={selectedPet} onClose={() => setShowShare(false)} />
      )}
    </ErrorBoundary>
  )
}

export default App
