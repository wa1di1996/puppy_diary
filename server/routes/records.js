import { Router } from 'express'

export function createRecordsRouter(db) {
  const router = Router()

  router.get('/', (req, res) => {
    const petId = req.query.petId
    const rows = petId
      ? db.prepare('SELECT id, data FROM records WHERE pet_id = ? ORDER BY id ASC').all(petId)
      : db.prepare('SELECT id, data FROM records ORDER BY id ASC').all()
    res.json({ records: rows.map(r => ({ ...JSON.parse(r.data), id: r.id })) })
  })

  router.post('/', (req, res) => {
    const { id, ...data } = req.body
    if (!id) return res.status(400).json({ error: '缺少记录 id' })
    const petId = req.body.petId
    db.prepare('INSERT OR REPLACE INTO records (id, pet_id, data) VALUES (?, ?, ?)').run(id, petId || null, JSON.stringify(data))
    res.json({ ok: true, id })
  })

  router.delete('/:id', (req, res) => {
    db.prepare('DELETE FROM records WHERE id = ?').run(parseInt(req.params.id))
    res.json({ ok: true })
  })

  return router
}
