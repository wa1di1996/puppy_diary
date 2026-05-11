import { Router } from 'express'
import crypto from 'crypto'
import { authRequired } from '../middleware/auth.js'

export function createPetsRouter(db) {
  const router = Router()
  router.use(authRequired)

  router.get('/', (req, res) => {
    const rows = db.prepare(`
      SELECT p.*, up.role, up.is_temp, up.valid_until
      FROM pets p JOIN user_pets up ON up.pet_id = p.id
      WHERE up.user_id = ?
    `).all(req.user.id)
    res.json({ pets: rows })
  })

  router.post('/', (req, res) => {
    const { name, breedId, birthday, photo, role, gender } = req.body
    if (!name) return res.status(400).json({ error: '宠物名不能为空' })
    const r = db.prepare('INSERT INTO pets (name, breed_id, birthday, photo, gender, owner_id) VALUES (?, ?, ?, ?, ?, ?)').run(name, breedId || null, birthday || null, photo || null, gender || null, req.user.id)
    db.prepare('INSERT INTO user_pets (user_id, pet_id, role) VALUES (?, ?, ?)').run(req.user.id, r.lastInsertRowid, role || 'owner')
    res.json({ pet: { id: r.lastInsertRowid, name, breed_id: breedId, birthday, photo, gender, role: role || 'owner', owner_id: req.user.id } })
  })

  router.get('/:id/info', (req, res) => {
    const pet = db.prepare('SELECT p.*, up.role FROM pets p JOIN user_pets up ON up.pet_id = p.id WHERE p.id = ? AND up.user_id = ?').get(req.params.id, req.user.id)
    if (!pet) return res.status(404).json({ error: '宠物不存在' })
    res.json({ pet })
  })

  router.put('/:id', (req, res) => {
    const { name, photo } = req.body
    const pet = db.prepare('SELECT owner_id FROM pets WHERE id = ?').get(req.params.id)
    if (!pet) return res.status(404).json({ error: '宠物不存在' })
    if (pet.owner_id !== req.user.id) return res.status(403).json({ error: '只有宠物主人才能修改' })
    db.prepare('UPDATE pets SET name = COALESCE(?, name), photo = COALESCE(?, photo) WHERE id = ?').run(name || null, photo || null, req.params.id)
    const updated = db.prepare('SELECT p.*, up.role FROM pets p JOIN user_pets up ON up.pet_id = p.id WHERE p.id = ?').get(req.params.id)
    res.json({ pet: updated })
  })

  // Only owner can delete pet
  router.delete('/:id', (req, res) => {
    const pet = db.prepare('SELECT owner_id FROM pets WHERE id = ?').get(req.params.id)
    if (!pet) return res.status(404).json({ error: '宠物不存在' })
    if (pet.owner_id !== req.user.id) return res.status(403).json({ error: '只有宠物主人才能删除' })
    db.prepare('DELETE FROM user_pets WHERE pet_id = ?').run(req.params.id)
    db.prepare('DELETE FROM invitations WHERE pet_id = ?').run(req.params.id)
    db.prepare('DELETE FROM profile WHERE pet_id = ?').run(req.params.id)
    db.prepare('DELETE FROM records WHERE pet_id = ?').run(req.params.id)
    db.prepare('DELETE FROM foods WHERE pet_id = ?').run(req.params.id)
    db.prepare('DELETE FROM pets WHERE id = ?').run(req.params.id)
    res.json({ ok: true })
  })

  // Only owner can generate invites
  router.post('/:id/invite', (req, res) => {
    const pet = db.prepare('SELECT owner_id FROM pets WHERE id = ?').get(req.params.id)
    if (!pet) return res.status(404).json({ error: '宠物不存在' })
    if (pet.owner_id !== req.user.id) return res.status(403).json({ error: '只有宠物主人才能分享' })
    const { isTemp, validDays } = req.body
    const token = crypto.randomBytes(4).toString('hex')
    db.prepare('INSERT INTO invitations (pet_id, inviter_id, token, role, is_temp, valid_days) VALUES (?, ?, ?, ?, ?, ?)').run(req.params.id, req.user.id, token, 'guardian', isTemp ? 1 : 0, validDays || null)
    res.json({ token })
  })

  return router
}
