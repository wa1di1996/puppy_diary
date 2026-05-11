import { Router } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { authRequired } from '../middleware/auth.js'

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  return hash === crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')
}

function makeToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

export function createAuthRouter(db) {
  const router = Router()

  router.post('/register', (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' })
    if (password.length < 4) return res.status(400).json({ error: '密码至少4位' })

    const exist = db.prepare('SELECT id FROM users WHERE username = ?').get(username)
    if (exist) return res.status(400).json({ error: '用户名已存在' })

    const r = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hashPassword(password))
    const user = { id: r.lastInsertRowid, username }
    res.json({ token: makeToken(user), user })
  })

  router.post('/login', (req, res) => {
    const { username, password } = req.body
    const row = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?').get(username)
    if (!row || !verifyPassword(password, row.password_hash)) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }
    const user = { id: row.id, username: row.username }
    res.json({ token: makeToken(user), user })
  })

  router.get('/me', authRequired, (req, res) => {
    const row = db.prepare('SELECT id, username FROM users WHERE id = ?').get(req.user.id)
    res.json({ user: row })
  })

  return router
}
