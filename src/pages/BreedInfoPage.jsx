import { breedsData, calculateDailyFood } from '../data/breeds'
import { BreedIcon, FoodBowlIcon } from '../components/icons'

export function BreedInfoPage({ profile, onBack }) {
  const selectedBreed = profile?.breedId || null
  const breed = selectedBreed ? breedsData[selectedBreed] : null

  return (
    <div className="page breed-info-page">
      <h2><BreedIcon size={16} color="var(--text-secondary)" /> 品种信息</h2>

      {!profile && (
        <p className="text-secondary">请先添加狗狗档案以查看专属信息</p>
      )}

      {profile && (
        <div className="current-breed">
          <p>当前查看：<strong>{breedsData[profile.breedId]?.name}</strong></p>
        </div>
      )}

      {breed && (
        <div className="breed-details">
          <div className="breed-header">
            <h3>{breed.name}</h3>
            <p className="breed-en">{breed.nameEn}</p>
            <p className="breed-origin">起源: {breed.origin}</p>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <h4>📏 标准体重</h4>
              <p className="big-number">{breed.weight.min}-{breed.weight.max} kg</p>
              <p className="sub">标准: {breed.weight.standard} kg</p>
            </div>
            <div className="info-card">
              <h4>📏 身高</h4>
              <p className="big-number">{breed.height.min}-{breed.height.max} cm</p>
            </div>
            <div className="info-card">
              <h4>⏰ 寿命</h4>
              <p className="big-number">{breed.lifeSpan.min}-{breed.lifeSpan.max} 年</p>
            </div>
          </div>

          <div className="nutrition-section">
            <h4><FoodBowlIcon size={14} color="var(--primary)" /> 营养需求</h4>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="label">每日热量</span>
                <span className="value">{breed.nutrition.caloriesPerKg} kcal/kg</span>
              </div>
              <div className="nutrition-item">
                <span className="label">蛋白质</span>
                <span className="value">{breed.nutrition.protein}%</span>
              </div>
              <div className="nutrition-item">
                <span className="label">脂肪</span>
                <span className="value">{breed.nutrition.fat}%</span>
              </div>
              <div className="nutrition-item">
                <span className="label">喂食频率(幼犬)</span>
                <span className="value">每天 {breed.nutrition.feedingFrequency.puppy} 次</span>
              </div>
              <div className="nutrition-item">
                <span className="label">喂食频率(成犬)</span>
                <span className="value">每天 {breed.nutrition.feedingFrequency.adult} 次</span>
              </div>
            </div>
          </div>

          <div className="exercise-section">
            <h4>🏃 运动需求</h4>
            <p>每日: {breed.exercise.daily}</p>
            <p>强度: {breed.exercise.intensity}</p>
          </div>

          <div className="characteristics">
            <h4>🎭 性格特点</h4>
            <div className="tags">
              {breed.characteristics.map((c, i) => (
                <span key={i} className="tag">{c}</span>
              ))}
            </div>
          </div>

          {profile?.weight && (
            <div className="personalized-nutrition">
              <h4>📌 基于 {profile.name} 当前体重的建议</h4>
              {(() => {
                const nutrition = calculateDailyFood(parseFloat(profile.weight), profile.breedId)
                return nutrition ? (
                  <div className="nutrition-grid">
                    <div className="nutrition-item highlight">
                      <span className="label">每日热量</span>
                      <span className="value">{nutrition.calories} kcal</span>
                    </div>
                    <div className="nutrition-item highlight">
                      <span className="label">每日狗粮</span>
                      <span className="value">{nutrition.grams}g</span>
                    </div>
                    <div className="nutrition-item highlight">
                      <span className="label">约</span>
                      <span className="value">{nutrition.cups} 杯</span>
                    </div>
                  </div>
                ) : null
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BreedInfoPage
