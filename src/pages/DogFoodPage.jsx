import { useState } from 'react'
import { formatDate } from '../utils/imageUtils'
import { BackIcon } from '../components/icons'

export function DogFoodPage({ foods, onAdd, onUpdate, onDelete, onBack }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [formData, setFormData] = useState({
    brand: '', name: '', totalPrice: '', totalAmount: '', startDate: '', notes: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.brand || !formData.name) return
    setSaving(true)
    try {
      if (editingId) { await onUpdate(editingId, formData) }
      else { await onAdd(formData) }
      resetForm()
    } catch {
      // parent handles error
    } finally { setSaving(false) }
  }

  const handleDelete = async (food) => {
    if (!window.confirm(`确定删除 ${food.brand} ${food.name}？`)) return
    setDeleting(food.id)
    try { await onDelete(food.id) }
    catch { /* parent handles */ }
    finally { setDeleting(null) }
  }

  const resetForm = () => {
    setFormData({ brand: '', name: '', totalPrice: '', totalAmount: '', startDate: '', notes: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (food) => {
    setFormData({
      brand: food.brand, name: food.name,
      totalPrice: food.totalPrice || '', totalAmount: food.totalAmount || '',
      startDate: food.startDate || '', notes: food.notes || ''
    })
    setEditingId(food.id)
    setShowForm(true)
  }

  const sortedFoods = [...foods].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="page dog-food-page">
      <h2>🥫 狗粮记录</h2>
      <p className="page-desc">记录狗狗各阶段食用的狗粮及购买信息</p>

      {!showForm ? (
        <>
          <button className="primary-btn" onClick={() => setShowForm(true)}>+ 添加狗粮</button>

          {sortedFoods.length === 0 ? (
            <div className="empty-state"><p>还没有狗粮记录</p><p>点击上方按钮添加狗粮信息</p></div>
          ) : (
            <div className="food-list">
              {sortedFoods.map(food => (
                <div key={food.id} className={`food-item ${deleting === food.id ? 'deleting' : ''}`}>
                  <div className="food-header">
                    <div className="food-brand">{food.brand}</div>
                    <div className="food-date">{formatDate(food.createdAt)}</div>
                  </div>
                  <div className="food-name">{food.name}</div>
                  {food.totalPrice && food.totalAmount && (
                    <div className="food-price-info">
                      <span>购买价格: ¥{food.totalPrice}</span>
                      <span>总量: {food.totalAmount}g</span>
                      <span className="unit-price">单价: ¥{food.unitPrice}/kg</span>
                    </div>
                  )}
                  {food.startDate && <div className="food-start-date">开始日期: {food.startDate}</div>}
                  {food.notes && <p className="food-notes">{food.notes}</p>}
                  <div className="food-actions">
                    <button className="text-btn" onClick={() => handleEdit(food)}>编辑</button>
                    <button className="text-btn danger" onClick={() => handleDelete(food)} disabled={deleting === food.id}>
                      {deleting === food.id ? '删除中...' : '删除'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit} className="food-form">
          <div className="form-group"><label>品牌</label><input type="text" value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} placeholder="例如: 渴望" required /></div>
          <div className="form-group"><label>产品名称</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="例如: 六种鱼成犬粮" required /></div>
          <div className="form-row">
            <div className="form-group"><label>购买价格 (元)</label><input type="number" step="0.01" value={formData.totalPrice} onChange={e => setFormData({ ...formData, totalPrice: e.target.value })} placeholder="例如: 450" /></div>
            <div className="form-group"><label>总量 (g)</label><input type="number" value={formData.totalAmount} onChange={e => setFormData({ ...formData, totalAmount: e.target.value })} placeholder="例如: 10000" /></div>
          </div>
          {formData.totalPrice && formData.totalAmount && (
            <div className="calculated-price">计算单价: <strong>¥{(parseFloat(formData.totalPrice) / parseFloat(formData.totalAmount) * 1000).toFixed(2)}/kg</strong></div>
          )}
          <div className="form-group"><label>开始日期</label><input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} /></div>
          <div className="form-group"><label>备注</label><textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="添加备注..." rows="3" /></div>
          <div className="form-actions">
            <button type="button" className="secondary-btn" onClick={resetForm}>取消</button>
            <button type="submit" className="primary-btn" disabled={saving}>{saving ? '保存中...' : editingId ? '更新' : '添加'}</button>
          </div>
        </form>
      )}

      <button className="back-link" onClick={onBack}><BackIcon size={14} color="var(--text-secondary)" /> ← 返回</button>
    </div>
  )
}

export default DogFoodPage
