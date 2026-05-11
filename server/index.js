import express from 'express'
import db from './db.js'
import { createProfileRouter } from './routes/profile.js'
import { createRecordsRouter } from './routes/records.js'
import { createFoodsRouter } from './routes/foods.js'
import { createAuthRouter } from './routes/auth.js'
import { createPetsRouter } from './routes/pets.js'
import { createInvitationsRouter } from './routes/invitations.js'
import { createMembersRouter } from './routes/members.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', createAuthRouter(db))
app.use('/api/pets', createPetsRouter(db))
app.use('/api/invitations', createInvitationsRouter(db))
app.use('/api/pets', createMembersRouter(db))
app.use('/api/profile', createProfileRouter(db))
app.use('/api/records', createRecordsRouter(db))
app.use('/api/foods', createFoodsRouter(db))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
