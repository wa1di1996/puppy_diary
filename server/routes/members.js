import { Router } from 'express'
import { authRequired } from '../middleware/auth.js'

export function createMembersRouter(db) {
  const router = Router()
  router.use(authRequired)

  // GET /api/pets/:id/members — 所有共享成员
  router.get('/:id/members', (req, res) => {
    const rows = db.prepare(`
      SELECT u.id, u.username, up.role, up.is_temp, up.valid_until
      FROM user_pets up JOIN users u ON u.id = up.user_id
      WHERE up.pet_id = ?
    `).all(req.params.id)
    res.json({ members: rows })
  })

  // DELETE /api/pets/:id/members/:userId — 仅主人可移除成员
  router.delete('/:id/members/:userId', (req, res) => {
    const pet = db.prepare('SELECT owner_id FROM pets WHERE id = ?').get(req.params.id)
    if (!pet) return res.status(404).json({ error: '宠物不存在' })
    if (pet.owner_id !== req.user.id) return res.status(403).json({ error: '只有宠物主人才能管理成员' })
    db.prepare('DELETE FROM user_pets WHERE pet_id = ? AND user_id = ?').run(req.params.id, req.params.userId)
    res.json({ ok: true })
  })

  return router
}
