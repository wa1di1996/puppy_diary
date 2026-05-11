import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const db = new Database(path.join(__dirname, 'data.db'))

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    breed_id TEXT,
    birthday TEXT,
    photo TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS user_pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    pet_id INTEGER NOT NULL REFERENCES pets(id),
    role TEXT NOT NULL DEFAULT 'owner',
    is_temp INTEGER NOT NULL DEFAULT 0,
    valid_until TEXT,
    UNIQUE(user_id, pet_id)
  );

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY,
    pet_id INTEGER,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS foods (
    id INTEGER PRIMARY KEY,
    pet_id INTEGER,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS invitations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER NOT NULL REFERENCES pets(id),
    inviter_id INTEGER NOT NULL REFERENCES users(id),
    token TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'guardian',
    is_temp INTEGER NOT NULL DEFAULT 0,
    valid_days INTEGER,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`)

// JWT secret 持久化，避免重启后旧 token 失效
const secretPath = path.join(__dirname, '.jwt_secret')
if (process.env.JWT_SECRET) {
  // use env var
} else if (fs.existsSync(secretPath)) {
  process.env.JWT_SECRET = fs.readFileSync(secretPath, 'utf8').trim()
} else {
  process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex')
  fs.writeFileSync(secretPath, process.env.JWT_SECRET)
}

export default db
