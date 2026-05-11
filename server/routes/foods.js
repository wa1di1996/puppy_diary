import { Router } from 'express'

export function createFoodsRouter(db) {
  const router = Router()

  router.get('/', (req, res) => {
    const petId = req.query.petId
    const rows = petId
      ? db.prepare('SELECT id, data FROM foods WHERE pet_id = ? ORDER BY id ASC').all(petId)
      : db.prepare('SELECT id, data FROM foods ORDER BY id ASC').all()
    res.json({ foods: rows.map(r => ({ ...JSON.parse(r.data), id: r.id })) })
  })

  router.post('/', (req, res) => {
    const { id, ...data } = req.body
    if (!id) return res.status(400).json({ error: '缺少 food id' })
    db.prepare('INSERT INTO foods (id, pet_id, data) VALUES (?, ?, ?)').run(id, req.body.petId || null, JSON.stringify(data))
    res.json({ ok: true, id })
  })

  router.put('/:id', (req, res) => {
    const { id: _e, ...data } = req.body
    db.prepare('UPDATE foods SET data = ? WHERE id = ?').run(JSON.stringify(data), parseInt(req.params.id))
    res.json({ ok: true })
  })

  router.delete('/:id', (req, res) => {
    db.prepare('DELETE FROM foods WHERE id = ?').run(parseInt(req.params.id))
    res.json({ ok: true })
  })

  return router
}
