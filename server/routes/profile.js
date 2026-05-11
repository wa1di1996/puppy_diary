import { Router } from 'express'

export function createProfileRouter(db) {
  const router = Router()

  router.get('/', (req, res) => {
    const petId = req.query.petId
    const row = petId
      ? db.prepare('SELECT data FROM profile WHERE pet_id = ? ORDER BY id DESC LIMIT 1').get(petId)
      : db.prepare('SELECT data FROM profile ORDER BY id DESC LIMIT 1').get()
    res.json({ profile: row ? JSON.parse(row.data) : null })
  })

  router.put('/', (req, res) => {
    const { profile, petId } = req.body
    if (!profile) return res.status(400).json({ error: '缺少 profile 数据' })
    const json = JSON.stringify(profile)
    const existing = petId
      ? db.prepare('SELECT id FROM profile WHERE pet_id = ? ORDER BY id DESC LIMIT 1').get(petId)
      : db.prepare('SELECT id FROM profile ORDER BY id DESC LIMIT 1').get()
    if (existing) {
      db.prepare("UPDATE profile SET data = ?, pet_id = ?, updated_at = datetime('now') WHERE id = ?").run(json, petId || null, existing.id)
    } else {
      db.prepare('INSERT INTO profile (pet_id, data) VALUES (?, ?)').run(petId || null, json)
    }
    res.json({ ok: true })
  })

  return router
}
