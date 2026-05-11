import { Router } from 'express'
import { authRequired } from '../middleware/auth.js'

export function createInvitationsRouter(db) {
  const router = Router()

  // GET /api/invitations/:token — 查看邀请详情（不登录也可）
  router.get('/:token', (req, res) => {
    const inv = db.prepare('SELECT token, pet_id, is_temp, valid_days, role, status FROM invitations WHERE token = ?').get(req.params.token)
    if (!inv || inv.status !== 'pending') return res.status(404).json({ error: '邀请码无效或已过期' })
    const pet = db.prepare('SELECT name, breed_id FROM pets WHERE id = ?').get(inv.pet_id)
    res.json({ ...inv, petName: pet?.name || '未知' })
  })

  router.post('/:token/accept', authRequired, (req, res) => {
    const inv = db.prepare('SELECT * FROM invitations WHERE token = ? AND status = ?').get(req.params.token, 'pending')
    if (!inv) return res.status(404).json({ error: '邀请码无效或已过期' })

    db.prepare("UPDATE invitations SET status = 'accepted' WHERE id = ?").run(inv.id)

    const exist = db.prepare('SELECT id FROM user_pets WHERE user_id = ? AND pet_id = ?').get(req.user.id, inv.pet_id)
    if (exist) {
      db.prepare('UPDATE user_pets SET role = ?, is_temp = ? WHERE id = ?').run(acceptRole, inv.is_temp, exist.id)
    } else {
      let validUntil = null
      if (inv.is_temp && inv.valid_days) {
        validUntil = new Date(Date.now() + inv.valid_days * 86400000).toISOString()
      }
      const acceptRole = req.body.role || inv.role || 'guardian'
    db.prepare('INSERT INTO user_pets (user_id, pet_id, role, is_temp, valid_until) VALUES (?, ?, ?, ?, ?)').run(req.user.id, inv.pet_id, acceptRole, inv.is_temp, validUntil)
    }

    res.json({ ok: true, pet: db.prepare('SELECT * FROM pets WHERE id = ?').get(inv.pet_id) })
  })

  return router
}
